import { LEVELS, getTopics, getFunctionsPage } from '../lib/contentLoader';
import { getProblemSets } from '../lib/problems';
import { SITE_URL } from '../lib/site';

export const dynamic = 'force-static';

// lastModified is the real last edit of the content, so google only recrawls pages that actually changed
export default function sitemap() {
  const url = (path, priority, lastModified) => ({
    url: `${SITE_URL}${path}`,
    priority,
    ...(lastModified ? { lastModified } : {}),
  });
  const newest = (dates) => dates.reduce((a, b) => (a > b ? a : b), new Date(0));

  const levels = LEVELS.map((l) => ({ ...l, topics: getTopics(l.slug) }));
  const functions = getFunctionsPage();
  const everything = newest([functions.updated, ...levels.flatMap((l) => l.topics.map((t) => t.updated))]);

  return [
    url('/', 1, everything),
    url('/problems/', 0.9),
    url('/sql-functions/', 0.8, functions.updated),
    url('/sample-data/', 0.5),
    url('/glossary/', 0.6),
    ...levels.flatMap((l) => [
      url(`/${l.slug}/`, 0.8, newest(l.topics.map((t) => t.updated))),
      ...l.topics.map((t) => url(`/${l.slug}/${t.slug}/`, 0.7, t.updated)),
    ]),
    ...getProblemSets().flatMap((s) => s.questions.map((q) => url(`/problems/${s.slug}/${q.slug}/`, 0.6))),
  ];
}
