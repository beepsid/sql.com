import data from '../generated/problems.json';

export function getProblemSets() {
  return data.sets;
}

export function getProblemSet(slug) {
  return data.sets.find((s) => s.slug === slug) ?? null;
}

const RANK = { easy: 0, medium: 1, hard: 2 };

// problems whose "learn" links point at this topic, easiest first
export function getProblemsForTopic(level, slug, limit = 5) {
  const id = `${level}/${slug}`;
  return data.sets
    .flatMap((s) =>
      s.questions
        .filter((q) => q.learn?.some((l) => l.id === id))
        .map((q) => ({ href: `/problems/${s.slug}/${q.slug}/`, title: q.title, difficulty: q.difficulty }))
    )
    .sort((a, b) => RANK[a.difficulty] - RANK[b.difficulty])
    .slice(0, limit);
}
