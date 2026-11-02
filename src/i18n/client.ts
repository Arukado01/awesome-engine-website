import type source from './ui-messages.json';
let messages: Record<string, string> | undefined;
export function ui(key: keyof typeof source, values: Record<string, string | number> = {}) {
  if (!messages) {
    try {
      messages = JSON.parse(document.querySelector('#ui-messages')?.textContent || '{}');
    } catch {
      messages = {};
    }
  }
  return (messages?.[key] || String(key)).replace(/\{(\w+)\}/g, (_, name: string) =>
    String(values[name] ?? '{' + name + '}'),
  );
}
export function plural(one: keyof typeof source, other: keyof typeof source, count: number) {
  const category = new Intl.PluralRules(document.documentElement.lang || 'es').select(count);
  return ui(category === 'one' ? one : other, { count });
}
