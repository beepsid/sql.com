import { notFound } from 'next/navigation';
import { getProblemSets, getProblemSet } from '../../../../lib/problems';
import Workspace from '../../../../components/Workspace';
import { clip } from '../../../../lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return getProblemSets().flatMap((s) => s.questions.map((q) => ({ set: s.slug, question: q.slug })));
}

export function generateMetadata({ params }) {
  const q = getProblemSet(params.set)?.questions.find((x) => x.slug === params.question);
  if (!q) return {};
  const text = q.html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ');
  return {
    title: `${q.title}: SQL interview question (${q.difficulty})`,
    description: clip(`SQL practice problem: ${text}`),
    alternates: { canonical: `/problems/${params.set}/${params.question}/` },
  };
}

export default function ProblemPage({ params }) {
  const set = getProblemSet(params.set);
  const i = set?.questions.findIndex((q) => q.slug === params.question) ?? -1;
  if (!set || i === -1) notFound();

  const { questions, ...setData } = set;
  const summary = (q) => (q ? { slug: q.slug, number: q.number, title: q.title } : null);

  return (
    <Workspace
      key={`${set.slug}/${params.question}`}
      set={setData}
      question={questions[i]}
      prev={summary(questions[i - 1])}
      next={summary(questions[i + 1])}
    />
  );
}
