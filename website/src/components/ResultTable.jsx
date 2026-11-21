const MAX_ROWS = 200;

export default function ResultTable({ result }) {
  if (!result) return null;
  const { fields, rows } = result;
  if (fields.length === 0) return <p className="muted">query ran, no columns returned.</p>;

  return (
    <div className="result-table-wrap">
      <table className="result-table">
        <thead>
          <tr>
            {fields.map((f, i) => (
              <th key={i}>{f.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, MAX_ROWS).map((row, r) => (
            <tr key={r}>
              {fields.map((f, i) => {
                const v = row[f.name];
                return (
                  <td key={i}>
                    {v === null || v === undefined ? (
                      <span className="null">NULL</span>
                    ) : typeof v === 'object' ? (
                      JSON.stringify(v)
                    ) : (
                      String(v)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > MAX_ROWS && <p className="muted">showing {MAX_ROWS} of {rows.length} rows</p>}
    </div>
  );
}
