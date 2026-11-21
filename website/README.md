# website

Next.js site for sql.notes. It reads everything from `../content` at build time, so there's nothing to edit in here when you add or change topics.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # every page is pre-rendered as static html
```

- `src/lib/contentLoader.js`, reads the topic folders, turns README.md into html, highlights sql
- `src/app/page.jsx`, home page
- `src/app/[difficulty]/page.jsx`, list of topics for one level
- `src/app/[difficulty]/[topic]/page.jsx`, a topic: sidebar, explanation, practice, prev/next
- `src/app/sample-data/page.jsx`, the sample data with a copy button
- `src/components/`, navbar, search, sidebar, copy buttons

`npm run deploy` builds and uploads it to cloudflare (run `npx wrangler login` once first). Config is in `wrangler.jsonc`.
