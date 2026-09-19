import { useState, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import { useDuckDB } from './useDuckDB'
import './App.css'

function App() {
  const { db, loading, error: dbError, executeQuery } = useDuckDB()
  const [query, setQuery] = useState('SELECT * FROM users LIMIT 5;')
  const [results, setResults] = useState([])
  const [columns, setColumns] = useState([])
  const [error, setError] = useState(null)
  const [executing, setExecuting] = useState(false)

  const handleRun = async () => {
    if (!query.trim()) {
      setError('Please enter a SQL query')
      return
    }

    setError(null)
    setResults([])
    setColumns([])
    setExecuting(true)

    try {
      const result = await executeQuery(query)

      if (result && result.length > 0) {
        const cols = Object.keys(result[0])
        setColumns(cols)
        setResults(result)
      } else {
        setResults([])
        setColumns([])
      }
    } catch (err) {
      setError(err.message)
      setResults([])
      setColumns([])
    } finally {
      setExecuting(false)
    }
  }

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleRun()
    }
  }

  if (dbError) {
    return (
      <div className="container">
        <div className="error-box">
          <h2>Database Error</h2>
          <p>{dbError}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>SQL Playground</h1>
          <p>Learn SQL by running real queries</p>
        </div>
        {loading && <span className="loading-indicator">Loading database...</span>}
      </header>

      <div className="container">
        <div className="editor-section">
          <div className="section-header">
            <h2>SQL Query</h2>
            <button
              onClick={handleRun}
              disabled={loading || executing}
              className="btn-primary"
            >
              {executing ? 'Running...' : 'Run Query'}
            </button>
          </div>

          <CodeMirror
            value={query}
            height="300px"
            extensions={[sql()]}
            onChange={(val) => setQuery(val)}
            onKeyDown={handleKeyDown}
            className="code-editor"
            theme="light"
          />

          <div className="hint">
            💡 Tip: Use Ctrl+Enter to run the query
          </div>
        </div>

        {error && (
          <div className="error-box">
            <strong>Error:</strong> {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="results-section">
            <h2>Results ({results.length} rows)</h2>
            <div className="table-wrapper">
              <table className="results-table">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, idx) => (
                    <tr key={idx}>
                      {columns.map((col) => (
                        <td key={`${idx}-${col}`}>
                          {row[col] === null ? (
                            <span className="null-value">NULL</span>
                          ) : (
                            String(row[col])
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!results.length && !error && !loading && (
          <div className="placeholder">
            <p>Run a query to see results here</p>
          </div>
        )}
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="db-info">
            <p><strong>Available Tables:</strong> users, orders, discounts</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
