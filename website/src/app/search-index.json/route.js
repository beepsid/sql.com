import { getSearchIndex } from '../../lib/contentLoader';

// built once at export time into out/search-index.json, the search box fetches it on first use
export const dynamic = 'force-static';

export function GET() {
  return Response.json(getSearchIndex());
}
