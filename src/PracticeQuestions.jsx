import { useState } from 'react'
import './PracticeQuestions.css'
import { sqlChallenges } from './sqlChallenges'

export function PracticeQuestions({ questionIndex, onBack, progress, executeQuery, onSelectQuestion }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [columns, setColumns] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [error, setError] = useState(null)
  const [executing, setExecuting] = useState(false)

  if (questionIndex !== null && questionIndex !== undefined) {
    // Single challenge view
    const challenge = sqlChallenges[questionIndex]

    const handleRun = async () => {
      if (!query.trim()) {
        setError('Please enter a SQL query')
        return
      }

      setError(null)
      setFeedback(null)
      setResults([])
      setColumns([])
      setExecuting(true)

      try {
        const result = await executeQuery(query.trim())

        if (result && result.length > 0) {
          const cols = Object.keys(result[0])
          setColumns(cols)
          setResults(result)
          setFeedback({
            correct: true,
            message: '✓ Query executed successfully! Your approach looks correct.'
          })
          setAnswered(true)
        } else {
          setResults([])
          setColumns([])
          setFeedback({
            correct: false,
            message: 'Your query returned no results. Check your WHERE clause or JOIN conditions.'
          })
        }
      } catch (err) {
        setError(err.message)
        setFeedback({
          correct: false,
          message: `Query error: ${err.message}`
        })
      } finally {
        setExecuting(false)
      }
    }

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleRun()
      }
    }

    return (
      <div className="challenge-detail">
        <button className="back-button" onClick={onBack}>
          ← Back to All Challenges
        </button>

        <div className="challenge-header">
          <div className="challenge-meta">
            <span className={`difficulty-badge ${challenge.difficulty.toLowerCase()}`}>
              {challenge.difficulty}
            </span>
            <span className="challenge-number">Q{challenge.id}</span>
          </div>
          <h1>{challenge.title}</h1>
          <p className="challenge-description">{challenge.description}</p>
        </div>

        <div className="challenge-content">
          <div className="prompt-section">
            <h2>Your Task</h2>
            <p>{challenge.prompt}</p>
            {challenge.hint && (
              <div className="hint-box">
                <strong>💡 Hint:</strong> {challenge.hint}
              </div>
            )}
          </div>

          <div className="editor-section">
            <div className="section-header">
              <h2>Write Your Query</h2>
              <button
                onClick={handleRun}
                disabled={executing}
                className="btn-primary"
              >
                {executing ? 'Executing...' : 'Run Query'}
              </button>
            </div>

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="sql-editor"
              placeholder="Enter your SQL query here..."
              spellCheck="false"
            />

            <div className="hint-text">
              💡 Tip: Use Ctrl+Enter to run the query
            </div>
          </div>

          {error && (
            <div className="error-box">
              <strong>Error:</strong> {error}
            </div>
          )}

          {feedback && (
            <div className={`feedback-box ${feedback.correct ? 'correct' : 'incorrect'}`}>
              <div className="feedback-header">
                {feedback.correct ? (
                  <>
                    <span className="feedback-icon">✓</span>
                    <span className="feedback-title">Perfect!</span>
                  </>
                ) : (
                  <>
                    <span className="feedback-icon">✗</span>
                    <span className="feedback-title">Try Again</span>
                  </>
                )}
              </div>
              <p className="feedback-message">{feedback.message}</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="results-section">
              <h2>Query Results ({results.length} rows)</h2>
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
                    {results.slice(0, 20).map((row, idx) => (
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
                {results.length > 20 && <p className="more-rows">... and {results.length - 20} more rows</p>}
              </div>
            </div>
          )}

          {answered && (
            <div className="explanation-section">
              <button
                className="explanation-toggle"
                onClick={() => setShowExplanation(!showExplanation)}
              >
                {showExplanation ? '▼' : '▶'} Learn Why
              </button>
              {showExplanation && (
                <div className="explanation-text">
                  <h3>Key Concept</h3>
                  <p>{challenge.explanation}</p>
                  <h3>Sample Solution</h3>
                  <div className="sample-query">
                    <code>{challenge.expectedQuery}</code>
                  </div>
                  <h3>What to Look For</h3>
                  <ul>
                    {challenge.expectedColumns && (
                      <li><strong>Expected columns:</strong> {challenge.expectedColumns.join(', ')}</li>
                    )}
                    {challenge.expectedRowCount && (
                      <li><strong>Expected row count:</strong> {challenge.expectedRowCount}</li>
                    )}
                    <li><strong>Tags:</strong> {challenge.tags.join(', ')}</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // All challenges list view
  return (
    <div className="practice-questions">
      <div className="practice-header">
        <h1>SQL Interview Challenges</h1>
        <p>Write real SQL queries and execute them. {sqlChallenges.length} coding challenges from Beginner to Advanced</p>
      </div>

      <div className="questions-container">
        <div className="questions-list">
          {sqlChallenges.map((challenge, idx) => (
            <div key={challenge.id} className={`question-item difficulty-${challenge.difficulty.toLowerCase()}`}>
              <div className="question-summary">
                <div className="question-header-list">
                  <div className="question-badges">
                    <span className={`difficulty-badge ${challenge.difficulty.toLowerCase()}`}>
                      {challenge.difficulty}
                    </span>
                    {challenge.tags && challenge.tags.length > 0 && (
                      <span className="tags-badge">{challenge.tags[0]}</span>
                    )}
                  </div>
                  <span className="question-number">Q{challenge.id}</span>
                </div>
                <h3>{challenge.title}</h3>
                <p className="question-desc-small">{challenge.description}</p>
              </div>
              <button className="question-button" onClick={() => onSelectQuestion ? onSelectQuestion(idx) : null}>
                Solve Challenge →
              </button>
            </div>
          ))}
        </div>

        <div className="practice-sidebar">
          <div className="difficulty-breakdown">
            <h3>Challenge Breakdown</h3>
            <div className="breakdown-item">
              <span className="breakdown-label">Beginner</span>
              <span className="breakdown-count">
                {sqlChallenges.filter(c => c.difficulty === 'BEGINNER').length}
              </span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Intermediate</span>
              <span className="breakdown-count">
                {sqlChallenges.filter(c => c.difficulty === 'INTERMEDIATE').length}
              </span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Advanced</span>
              <span className="breakdown-count">
                {sqlChallenges.filter(c => c.difficulty === 'ADVANCED').length}
              </span>
            </div>
          </div>

          <div className="practice-tips">
            <h3>Interview Tips</h3>
            <ul>
              <li>Read requirements carefully</li>
              <li>Plan your joins before writing</li>
              <li>Consider edge cases (NULLs, duplicates)</li>
              <li>Test with sample data</li>
              <li>Optimize for readability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
