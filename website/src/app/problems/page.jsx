import { getProblemSets } from '../../lib/problems';
import ProblemList from '../../components/ProblemList';

export const metadata = {
  title: 'SQL practice problems and interview questions',
  description: 'Free SQL interview style problems you solve in the browser in PostgreSQL, MySQL or SQL Server. Graded on edge cases, random data and a large dataset: top N per group, retention, sessions, funnels and more.',
  alternates: { canonical: '/problems/' },
};

export default function ProblemsPage() {
  const sets = getProblemSets().map(({ slug, title, tags, introHtml, questions }) => ({
    slug,
    title,
    tags,
    introHtml,
    questions: questions.map(({ slug, title, difficulty, tags }) => ({ slug, title, difficulty, tags })),
  }));

  return (
    <div className="page">
      <section className="hero">
        <h1>Problems</h1>
        <p>
          SQL interview style questions, from easy warmups to the stuff that actually trips people up in interviews.
          Write the query, run it on the sample data, compare with the expected output, then submit. Every submission
          is graded on named edge cases, random data and a large dataset, so it has to actually be right, and fast
          enough. Stuck? every question has hints, and once you solve it you get the explanation of the trick behind
          it. Pick PostgreSQL, MySQL or SQL Server, the output has to be the same either way.
        </p>
        <p className="muted small">
          New to SQL? Do the <a href="#warmup">warmup</a> first, it only needs the beginner topics. Heads up, each set
          has its own little database (open "about this dataset" or the tables tab), separate from the sample data the
          topics use.
        </p>
      </section>
      <ProblemList sets={sets} />
    </div>
  );
}
