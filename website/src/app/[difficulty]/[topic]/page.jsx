import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LEVELS, getTopics, getTopic, getSampleData } from '../../../lib/contentLoader';
import { getProblemsForTopic } from '../../../lib/problems';
import Doc from '../../../components/Doc';
import CodeBlock from '../../../components/CodeBlock';
import Practice from '../../../components/Practice';
import Sidebar from '../../../components/Sidebar';
import { MarkDone } from '../../../components/Progress';
import { clip } from '../../../lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return LEVELS.flatMap((l) => getTopics(l.slug).map((t) => ({ difficulty: l.slug, topic: t.slug })));
}

export function generateMetadata({ params }) {
  const topic = getTopic(params.difficulty, params.topic);
  if (!topic) return {};
  const title = /\bsql\b/i.test(topic.title) ? `${topic.title}, explained with examples` : `${topic.title} in SQL, explained with examples`;
  return {
    title,
    description: clip(topic.intro),
    alternates: { canonical: `/${topic.level}/${topic.slug}/` },
    openGraph: { type: 'article', title, description: clip(topic.intro), url: `/${topic.level}/${topic.slug}/` },
  };
}

export default function TopicPage({ params }) {
  const topic = getTopic(params.difficulty, params.topic);
  if (!topic) notFound();

  const level = LEVELS.find((l) => l.slug === topic.level);
  const levels = LEVELS.map((l) => ({ ...l, topics: getTopics(l.slug) }));
  const dataset = { key: 'sample', schema: getSampleData().sql, data: '' };
  const problems = getProblemsForTopic(topic.level, topic.slug);

  return (
    <div className="topic-layout">
      <aside className="topic-aside">
        <Sidebar levels={levels} current={topic} />
      </aside>

      <article className="topic-main">
        <details className="mobile-topics">
          <summary>all topics</summary>
          <Sidebar levels={levels} current={topic} />
        </details>

        <Link href={`/${topic.level}`} className={`crumb level-name ${topic.level}`}>
          {level.name}
        </Link>
        <h1 className="topic-h1">{topic.title}</h1>

        <p className="run-note">
          ▶ Every example below runs right here on the <Link href="/sample-data">sample data</Link>. Hit{' '}
          <strong>run</strong> to see the result, or <strong>edit &amp; try your own</strong> to change it first.
          Nothing to install, and you can't break anything, every run is undone.
        </p>

        <Doc html={topic.html} dataset={dataset} />

        {topic.practice?.questions.length > 0 ? (
          <section id="practice" className="practice">
            <h2>Practice</h2>
            <Practice
              practice={topic.practice}
              topic={`${topic.level}/${topic.slug}`}
              dataset={dataset}
              fullFile={topic.queries}
            />
          </section>
        ) : (
          topic.queries && (
            <section id="practice" className="practice">
              <h2>Practice</h2>
              <CodeBlock code={topic.queries} html={topic.queriesHtml} filename="queries.sql" />
            </section>
          )
        )}

        {problems.length > 0 && (
          <section className="related-problems">
            <h2>Practice it like an interview</h2>
            <p className="muted small">problems that use this topic, graded on hidden test cases.</p>
            <ul>
              {problems.map((p) => (
                <li key={p.href}>
                  <Link href={p.href}>
                    <span>{p.title}</span>
                    <span className={`diff ${p.difficulty}`}>{p.difficulty}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="topic-done">
          <MarkDone level={topic.level} slug={topic.slug} title={topic.title} />
        </div>

        <nav className="pager">
          {topic.prev ? (
            <Link href={`/${topic.prev.level}/${topic.prev.slug}`} className="pager-link">
              <span>← previous</span>
              {topic.prev.title}
            </Link>
          ) : (
            <span />
          )}
          {topic.next ? (
            <Link href={`/${topic.next.level}/${topic.next.slug}`} className="pager-link next">
              <span>next →</span>
              {topic.next.title}
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </div>
  );
}
