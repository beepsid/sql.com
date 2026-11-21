// Static export: `npm run build` writes plain files to out/, which any static
// host can serve (Cloudflare Pages, GitHub Pages, Netlify...).
// Set NEXT_PUBLIC_BASE_PATH when the site lives in a sub folder, e.g. "/sql.com"
// for https://<user>.github.io/sql.com/. Leave it empty for a root domain.
const { PHASE_PRODUCTION_BUILD } = require('next/constants');

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

module.exports = (phase) => ({
  reactStrictMode: true,
  // only for the real build, next 14's dev server misreports dynamic routes under export
  output: phase === PHASE_PRODUCTION_BUILD ? 'export' : undefined,
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
});
