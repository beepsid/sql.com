import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LEVELS, getTopics } from '../../lib/contentLoader';
import { clip } from '../../lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return LEVELS.map((l) => ({ difficulty: l.slug }));
}

export function generateMetadata({ params }) {
  const level = LEVELS.find((l) => l.slug === params.difficulty);
  if (!level) return {};
  const topics = getTopics(level.slug).map((t) => t.title).join(', ');
  return {
    title: `${level.name} SQL notes`,
    description: clip(`${level.name} SQL notes with examples and practice: ${topics}.`),
    alternates: { canonical: `/${level.slug}/` },
  };
}

export default function LevelPage({ params }) {
  const level = LEVELS.find((l) => l.slug === params.difficulty);
  if (!level) notFound();
  const topics = getTopics(level.slug);

  return (
    <div className="page">
      <Link href="/" className="crumb">
        ← all levels
      </Link>
      <div className="level-head big">
        <h1 className={`level-name ${level.slug}`}>{level.name}</h1>
        <p>{level.blurb}</p>
      </div>
      <ol className="topic-list">
        {topics.map((t) => (
          <li key={t.slug}>
            <Link href={`/${t.level}/${t.slug}`}>
              <span className="topic-num">{String(t.number).padStart(2, '0')}</span>
              <span className="topic-text">
                <span className="topic-title">{t.title}</span>
                <span className="topic-intro">{t.intro}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
