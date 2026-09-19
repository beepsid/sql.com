import { useState, useRef, useEffect } from 'react'
import { compareResults, detectMistake } from './grader'
import './Lesson.css'

export function Lesson({ lesson, db, executeQuery, lessons, currentLessonIndex, onLessonChange, progress }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [columns, setColumns] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [error, setError] = useState(null)
  const [executing, setExecuting] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  // Guard against undefined progress
  if (!progress || !progress.loaded) {
    return <div className="lesson-container"><div style={{textAlign: 'center', padding: '40px'}}>Loading...</div></div>
  }

  // Reset state when lesson changes
  useEffect(() => {
    setQuery('')
    setResults([])
    setColumns([])
    setFeedback(null)
    setError(null)
    setShowHint(false)
    setShowExplanation(false)
  }, [lesson.id])

  const handleRun = async () => {
    if (!query?.trim()) {
      setError('Please enter a SQL query')
      return
    }

    const currentQuery = query.trim()

    setError(null)
    setFeedback(null)
    setResults([])
    setColumns([])
    setExecuting(true)

    try {
      const result = await executeQuery(currentQuery)

      if (result && result.length > 0) {
        const cols = Object.keys(result[0])
        setColumns(cols)
        setResults(result)

        // Grade the result
        const gradeResult = compareResults(result, lesson.expectedResult)

        // Detect specific mistakes for better feedback
        const mistakeType = detectMistake(currentQuery, lesson.expectedQuery)

        setFeedback({
          correct: gradeResult.correct,
          message: gradeResult.reason,
          mistakeType
        })

        // Mark lesson complete if correct
        if (gradeResult.correct) {
          progress.markLessonComplete(lesson.id)
        } else {
          progress.recordAttempt(lesson.id)
        }
      } else {
        setResults([])
        setColumns([])
        setFeedback({
          correct: false,
          message: "Your query returned no rows, but we expected some. Check your WHERE clause."
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

  const isCorrect = feedback?.correct
  const nextDisabled = currentLessonIndex >= lessons.length - 1
  const prevDisabled = currentLessonIndex <= 0

  return (
    <div className="lesson-container">
      <div className="lesson-header">
        <div className="lesson-meta">
          <span className={`difficulty-badge ${lesson.difficulty.toLowerCase()}`}>
            {lesson.difficulty}
          </span>
          <h1>{lesson.title}</h1>
          <p className="lesson-description">{lesson.description}</p>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress.getProgressStats(lessons.length).percentage}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {progress.getProgressStats(lessons.length).completed} of {lessons.length} complete
          </p>
        </div>

        <div className="lesson-nav">
          <button
            onClick={() => onLessonChange(null)}
            className="nav-button"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={() => onLessonChange(currentLessonIndex - 1)}
            disabled={prevDisabled}
            className="nav-button"
          >
            ← Previous
          </button>
          <span className="lesson-count">
            Lesson {currentLessonIndex + 1} of {lessons.length}
          </span>
          <button
            onClick={() => onLessonChange(currentLessonIndex + 1)}
            disabled={nextDisabled}
            className="nav-button"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="lesson-content">
        <div className="prompt-section">
          <h2>Your Task</h2>
          <p className="prompt-text">{lesson.prompt}</p>

          {showHint && (
            <div className="hint-box">
              <strong>💡 Hint:</strong> {lesson.hint}
            </div>
          )}

          {!showHint && (
            <button onClick={() => setShowHint(true)} className="hint-button">
              Show Hint
            </button>
          )}
        </div>

        <div className="editor-section">
          <div className="section-header">
            <h2>SQL Query</h2>
            <button
              onClick={handleRun}
              disabled={executing}
              className={`btn-primary ${isCorrect ? 'correct' : ''}`}
            >
              {executing ? 'Running...' : isCorrect ? '✓ Correct!' : 'Run Query'}
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
                  <span className="feedback-title">Not quite right</span>
                </>
              )}
            </div>
            <p className="feedback-message">{feedback.message}</p>

            {!feedback.correct && lesson.wrongExplanations && feedback.mistakeType && lesson.wrongExplanations[feedback.mistakeType] && (
              <p className="mistake-explanation">
                <strong>Common mistake:</strong> {lesson.wrongExplanations[feedback.mistakeType]}
              </p>
            )}

            {feedback.correct && (
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="explanation-button"
              >
                {showExplanation ? 'Hide' : 'Show'} Deep Dive
              </button>
            )}
          </div>
        )}

        {results.length > 0 && (
          <div className="results-section">
            <h2>Your Results ({results.length} rows)</h2>
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

        {feedback?.correct && showExplanation && (
          <div className="explanation-section">
            <h3>Why This Matters</h3>
            <p className="explanation-text">{lesson.explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}
