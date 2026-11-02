import { parse, serialize } from 'parse5';

export const normalizeText = (value) => value.replace(/\s+/gu, ' ').trim();
const textAttributes = new Set([
  'alt',
  'title',
  'aria-label',
  'placeholder',
  'data-title',
  'data-alt',
]);
const metaNames = new Set([
  'description',
  'og:title',
  'og:description',
  'twitter:title',
  'twitter:description',
]);
const skipTags = new Set(['script', 'style', 'code', 'pre', 'svg', 'time']);
const attr = (node, name) => node.attrs?.find((a) => a.name === name)?.value;
const setAttr = (node, name, value) => {
  const a = node.attrs?.find((a) => a.name === name);
  if (a) a.value = value;
  else node.attrs?.push({ name, value });
};
function walk(node, callback, docs = false) {
  if (node.tagName && (skipTags.has(node.tagName) || attr(node, 'data-no-translate') !== undefined))
    return;
  const classes = (attr(node, 'class') || '').split(' ');
  const inDocs = docs || classes.includes('docs-article');
  if (inDocs && classes.includes('prose')) return;
  callback(node);
  for (const child of node.childNodes || []) walk(child, callback, inDocs);
}
function visitText(node, fn) {
  if (node.nodeName === '#text') node.value = fn(node.value);
  for (const a of node.attrs || []) {
    if (textAttributes.has(a.name)) a.value = fn(a.value);
    if (
      node.tagName === 'meta' &&
      a.name === 'content' &&
      metaNames.has(attr(node, 'name') || attr(node, 'property'))
    )
      a.value = fn(a.value);
  }
}
export function collectMessages(html) {
  const messages = new Set();
  walk(parse(html, { scriptingEnabled: false }), (node) =>
    visitText(node, (value) => {
      const text = normalizeText(value);
      if (/\p{L}/u.test(text)) messages.add(text);
      return value;
    }),
  );
  return [...messages];
}
export function translateText(value, catalog) {
  const key = normalizeText(value);
  const translation = catalog[key];
  if (translation === undefined || !key) return value;
  const start = value.match(/^\s*/u)?.[0] || '';
  const end = value.match(/\s*$/u)?.[0] || '';
  return start + translation + end;
}
export function localizeHtml(html, locale, catalog, localizePath) {
  const document = parse(html, { scriptingEnabled: false });
  walk(document, (node) => visitText(node, (value) => translateText(value, catalog)));
  const allNodes = [];
  function structural(node) {
    allNodes.push(node);
    if (node.tagName === 'a' && attr(node, 'data-locale-link') === undefined) {
      const href = attr(node, 'href');
      if (href?.startsWith('/')) setAttr(node, 'href', localizePath(href, locale));
    }
    if (node.tagName === 'script' && attr(node, 'id') === 'ui-messages') {
      const child = node.childNodes?.[0];
      if (child?.nodeName === '#text') {
        const messages = JSON.parse(child.value);
        for (const key of Object.keys(messages))
          messages[key] = translateText(messages[key], catalog);
        child.value = JSON.stringify(messages).replace(/</g, '\\u003c');
      }
    }
    for (const child of node.childNodes || []) structural(child);
  }
  structural(document);
  function textContent(node) {
    return node.nodeName === '#text'
      ? node.value
      : (node.childNodes || []).map(textContent).join(' ');
  }
  for (const node of allNodes) {
    if (attr(node, 'data-update') !== undefined)
      setAttr(node, 'data-search', normalizeText(textContent(node)));
  }
  return serialize(document);
}
