// Builds the list of datasets a question is graded on. Shared by the build
// script and the browser so both generate exactly the same data.

export const DEFAULTS = { random: 5, small: 40, large: 20000, timeout: 10 };

export function renderGenerator(template, params) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (!(k in params)) throw new Error(`generator uses {{${k}}} but no value was given`);
    return String(params[k]);
  });
}

// set: { slug, schema, sample, cases: [{id, name, for, data}], generator, options }
export function testsFor(set, questionSlug) {
  const opts = { ...DEFAULTS, ...set.options };
  const tests = [{ id: 'sample', name: 'sample data', kind: 'sample', data: set.sample }];

  for (const c of set.cases) {
    if (c.for.length === 0 || c.for.includes(questionSlug)) {
      tests.push({ id: c.id, name: c.name, kind: 'case', data: c.data });
    }
  }

  if (set.generator) {
    for (let seed = 1; seed <= opts.random; seed++) {
      tests.push({
        id: `random-${seed}`,
        name: `random data #${seed}`,
        kind: 'random',
        data: renderGenerator(set.generator, { seed, n: opts.small }),
      });
    }
    tests.push({
      id: 'large',
      name: `large data`,
      kind: 'large',
      data: renderGenerator(set.generator, { seed: 0, n: opts.large }),
    });
  }

  return tests.map((t) => ({ ...t, key: `${set.slug}__${t.id}` }));
}

export function timeoutFor(set, test) {
  const opts = { ...DEFAULTS, ...set.options };
  return (test.kind === 'large' ? opts.timeout : Math.max(5, opts.timeout / 2)) * 1000;
}
