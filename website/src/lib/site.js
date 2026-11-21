export const SITE_NAME = 'sql.notes';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sqlnote.pages.dev').replace(/\/$/, '');
export const SITE_DESCRIPTION =
  'Free SQL notes and practice. Learn SQL topic by topic, from SELECT to window functions, with clear explanations, runnable examples, and interview style SQL problems you can solve in the browser.';

export function clip(text, max = 155) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, clean.lastIndexOf(' ', max - 1)).replace(/[,.;:]$/, '') + '…';
}
