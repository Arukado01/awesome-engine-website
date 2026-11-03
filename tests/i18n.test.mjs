import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'parse5';
import GithubSlugger from 'github-slugger';
import { localizeHtml, collectMessages } from '../src/i18n/html.mjs';
import { locales, localizedPath } from '../src/i18n/locales.ts';

const read = (path) =>
  readFileSync(path, 'utf8')
    .replace(/^\uFEFF/, '')
    .replaceAll('\r\n', '\n');
const json = (path) => JSON.parse(read(path));
const placeholders = (value) => [...value.matchAll(/\{\w+\}/g)].map(([match]) => match).sort();

test('los siete catálogos cubren los textos estáticos y dinámicos sin perder placeholders', () => {
  assert.deepEqual([...locales], ['es', 'en', 'pt', 'fr', 'de', 'ja', 'zh']);
  const source = json('src/i18n/catalogs/es.json');
  const keys = Object.keys(source).sort();
  const uiMessages = json('src/i18n/ui-messages.json');
  for (const message of Object.values(uiMessages)) {
    assert.ok(Object.hasOwn(source, message), `Texto dinámico sin catálogo: ${message}`);
  }
  for (const locale of locales) {
    const catalog = json(`src/i18n/catalogs/${locale}.json`);
    assert.deepEqual(Object.keys(catalog).sort(), keys, `${locale}: faltan o sobran claves`);
    for (const key of keys) {
      const value = catalog[key];
      assert.equal(typeof value, 'string', `${locale}: ${key}`);
      assert.ok(value.trim().length > 0, `${locale}: traducción vacía de ${key}`);
      assert.deepEqual(placeholders(value), placeholders(key), `${locale}: ${key}`);
      assert.doesNotMatch(value, /<\/?[a-z][^>]*>/i, `${locale}: HTML en texto de interfaz`);
    }
  }
});

test('las 54 guías traducidas conservan código, fuentes, enlaces y anclas de las nueve originales', () => {
  const names = readdirSync('src/content/docs')
    .filter((name) => name.endsWith('.md'))
    .sort();
  assert.equal(names.length, 9);
  const blocks = (text) =>
    [...text.matchAll(/```([^\n]*)\n([\s\S]*?)```/g)].map((match) => ({
      language: match[1].trim(),
      body: match[2],
    }));
  // Diagram labels are prose; these names identify actual engine types, fields, APIs, or render targets.
  const diagramIdentifiers = [
    'Engine',
    'sf::RenderWindow',
    'EngineContext',
    'renderer',
    'resources',
    'particles',
    'animations',
    'collisions',
    'input',
    'cursor',
    'gui',
    'audio',
    'time',
    'random',
    'scenes',
    'save',
    'screenshot',
    'clipboard',
    'SceneFactory::Scenes',
    'unique_ptr<Scene>',
    'currentScene',
    'Scene',
    'Overlay',
    'TGUI',
    'Scene::Render',
    'RenderManager',
    'RenderTexture',
    'Bloom',
    'Monitor',
    'GUI',
    'Cursor',
    'display',
    'ChangeScene',
    'ProcessEvent',
    'OnCleanup',
    'Start',
    'Downsample',
    'Blur',
    'A',
    'B',
  ];
  const occurrences = (text, value) =>
    (text.match(/[A-Za-z_]\w*(?:::\w+)*(?:<\w+>)?/g) || []).filter(
      (identifier) => identifier === value,
    ).length;
  const sources = (text) => [...text.matchAll(/\]\((https?:[^)]+)\)/g)].map((m) => m[1]).sort();
  const links = (text) => [...text.matchAll(/\]\((\/[^)]+)\)/g)].map((m) => m[1]).sort();
  const headings = (text) => [...text.matchAll(/^#{2,3} (.+)$/gm)].map((m) => m[1]);
  const headingIds = (text) => {
    const slugger = new GithubSlugger();
    return headings(text).map((heading) => slugger.slug(heading));
  };
  for (const locale of locales.filter((code) => code !== 'es')) {
    const folder = `src/content/docs-localized/${locale}`;
    assert.deepEqual(
      readdirSync(folder)
        .filter((name) => name.endsWith('.md'))
        .sort(),
      names,
      locale,
    );
    for (const name of names) {
      const source = read(`src/content/docs/${name}`);
      const translated = read(`${folder}/${name}`);
      const context = `${locale}/${name}`;
      for (const field of ['title', 'description', 'category', 'order']) {
        assert.match(translated, new RegExp(`^${field}:\\s*\\S.*$`, 'm'), `${context}: ${field}`);
      }
      assert.equal(
        translated.match(/^order:\s*(\d+)/m)?.[1],
        source.match(/^order:\s*(\d+)/m)?.[1],
        context,
      );
      const sourceBlocks = blocks(source);
      const translatedBlocks = blocks(translated);
      assert.deepEqual(
        translatedBlocks.map((block) => block.language),
        sourceBlocks.map((block) => block.language),
        `${context}: número o tipos de bloques alterados`,
      );
      sourceBlocks.forEach((block, index) => {
        const translatedBlock = translatedBlocks[index];
        if (block.language !== 'text') {
          assert.equal(
            translatedBlock.body,
            block.body,
            `${context}: código alterado en bloque ${index}`,
          );
          return;
        }
        for (const identifier of diagramIdentifiers) {
          const count = occurrences(block.body, identifier);
          if (count)
            assert.equal(
              occurrences(translatedBlock.body, identifier),
              count,
              `${context}: identificador ${identifier} alterado en diagrama`,
            );
        }
        const paths = (value) =>
          [...value.matchAll(/(?:[A-Za-z_][\w.-]*\/)+[\w.-]+/g)].map(([path]) => path).sort();
        assert.deepEqual(
          paths(translatedBlock.body),
          paths(block.body),
          `${context}: rutas alteradas en diagrama`,
        );
      });
      assert.deepEqual(sources(translated), sources(source), `${context}: fuentes alteradas`);
      assert.deepEqual(
        links(translated),
        links(source).map((href) => `/${locale}${href}`),
        `${context}: enlaces internos`,
      );
      assert.equal(
        headings(translated).length,
        headings(source).length,
        `${context}: secciones incompletas`,
      );
      const ids = new Set([
        ...headingIds(translated),
        ...[...translated.matchAll(/<span id="([^"]+)" aria-hidden="true"><\/span>/g)].map(
          (m) => m[1],
        ),
      ]);
      for (const id of headingIds(source))
        assert.ok(ids.has(id), `${context}: ancla perdida #${id}`);
    }
  }
});

test('la localización HTML traduce interfaz y búsquedas sin modificar código, datos ni destinos externos', () => {
  const html = `<!doctype html><html><head>
    <title>Documentación</title><meta name="description" content="Documentación">
    <link rel="canonical" href="https://example.com/en/docs/">
    <style>.label::after { content: "Copiar"; }</style>
    </head><body>
    <h1>  Documentación <span>Copiar</span> </h1>
    <a id="internal" href="/docs/recursos/?q=uno#fuentes" aria-label="Documentación">Documentación</a>
    <a id="external" href="https://github.com/SFML/SFML">Copiar</a>
    <a id="cdn" href="//cdn.example.com/archivo">Copiar</a>
    <a id="file" href="/media/showcase/runner/videos/gameplay.mp4">Copiar</a>
    <a id="language" data-locale-link="es" href="/docs/">Español</a>
    <a id="fragment" href="#fuentes">Fuentes</a>
    <input id="field" name="mensaje" value="Copiar" placeholder="Copiar" aria-label="Documentación">
    <img id="picture" src="/images/og-cover.png" alt="Documentación" title="Copiar">
    <video id="video" src="/media/demo.mp4" poster="/images/poster.png"></video>
    <noscript id="noscript"><p>Copiar</p></noscript>
    <pre id="pre"><code>Copiar &lt;Documentación&gt;</code></pre>
    <code id="code">Copiar</code><svg id="svg"><text>Copiar</text></svg>
    <time id="date" datetime="2026-11-01">Copiar</time>
    <span id="native" data-no-translate>Español</span>
    <article class="docs-article"><div class="prose" id="prose">Documentación</div></article>
    <article id="entry" data-update data-category="Gráficos" data-search="original"><h2>Gráficos</h2><p>Copiar</p></article>
    <script id="executable">window.example = "Copiar";</script>
    <script type="application/json" id="ui-messages">{"copy":"Copiar","count":"{count} guías encontradas"}</script>
    </body></html>`;
  const catalog = {
    Documentación: 'Documentation',
    Copiar: 'Copy',
    Español: 'Spanish',
    Fuentes: 'Sources',
    Gráficos: 'Graphics',
    '{count} guías encontradas': '{count} guides found',
  };
  const document = parse(localizeHtml(html, 'en', catalog, localizedPath), {
    scriptingEnabled: false,
  });
  function find(node, predicate) {
    if (predicate(node)) return node;
    for (const child of node.childNodes || []) {
      const result = find(child, predicate);
      if (result) return result;
    }
  }
  const attribute = (node, name) => node?.attrs?.find((item) => item.name === name)?.value;
  const id = (value) => find(document, (node) => attribute(node, 'id') === value);
  const text = (node) =>
    node?.nodeName === '#text' ? node.value : (node?.childNodes || []).map(text).join('');
  assert.equal(text(find(document, (node) => node.tagName === 'title')), 'Documentation');
  assert.equal(
    attribute(
      find(document, (node) => node.tagName === 'meta'),
      'content',
    ),
    'Documentation',
  );
  assert.equal(text(find(document, (node) => node.tagName === 'h1')), '  Documentation Copy ');
  assert.equal(attribute(id('internal'), 'href'), '/en/docs/recursos/?q=uno#fuentes');
  assert.equal(attribute(id('internal'), 'aria-label'), 'Documentation');
  for (const [name, href] of [
    ['external', 'https://github.com/SFML/SFML'],
    ['cdn', '//cdn.example.com/archivo'],
    ['file', '/media/showcase/runner/videos/gameplay.mp4'],
    ['language', '/docs/'],
    ['fragment', '#fuentes'],
  ])
    assert.equal(attribute(id(name), 'href'), href, name);
  assert.equal(attribute(id('field'), 'placeholder'), 'Copy');
  assert.equal(attribute(id('field'), 'name'), 'mensaje');
  assert.equal(attribute(id('field'), 'value'), 'Copiar');
  assert.equal(attribute(id('picture'), 'alt'), 'Documentation');
  assert.equal(attribute(id('picture'), 'title'), 'Copy');
  assert.equal(attribute(id('picture'), 'src'), '/images/og-cover.png');
  assert.equal(attribute(id('video'), 'src'), '/media/demo.mp4');
  assert.equal(attribute(id('video'), 'poster'), '/images/poster.png');
  assert.equal(text(id('noscript')), 'Copy');
  assert.equal(text(id('pre')), 'Copiar <Documentación>');
  for (const name of ['code', 'svg', 'date']) assert.equal(text(id(name)), 'Copiar', name);
  assert.equal(text(id('native')), 'Español');
  assert.equal(text(id('prose')), 'Documentación');
  assert.equal(text(id('executable')), 'window.example = "Copiar";');
  assert.equal(
    text(find(document, (node) => node.tagName === 'style')),
    '.label::after { content: "Copiar"; }',
  );
  assert.equal(attribute(id('entry'), 'data-category'), 'Gráficos');
  assert.equal(attribute(id('entry'), 'data-search'), 'Graphics Copy');
  assert.deepEqual(JSON.parse(text(id('ui-messages'))), {
    copy: 'Copy',
    count: '{count} guides found',
  });
  assert.ok(collectMessages(html).includes('Documentación'));
  assert.ok(!collectMessages(html).some((message) => message.startsWith('<p>')));
});
