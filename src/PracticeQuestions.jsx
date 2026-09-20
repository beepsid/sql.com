import { useState } from 'react'
import './PracticeQuestions.css'
import { practiceQuestions } from './practiceQuestions.js'

export function PracticeQuestions({ questionIndex, onBack, progress }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answered, setAnswered] = useState(false)

  if (questionIndex !== null && questionIndex !== undefined) {
    // Single question view
    const q = practiceQuestions[questionIndex]
    const isCorrect = selectedAnswer === q.correctAnswer

    return (
      <div className="question-detail">
        <button className="back-button" onClick={onBack}>
          ← Back to All Questions
        </button>

        <div className="question-header">
          <div className="question-meta">
            <span className={`difficulty-badge ${q.difficulty.toLowerCase()}`}>
              {q.difficulty}
            </span>
            <span className="topic-badge">{q.topic}</span>
            <span className="question-number">Q{q.number}</span>
          </div>
        </div>

        <div className="question-content">
          <h1>{q.question}</h1>

          <div className="options">
            {q.options.map((option) => (
              <label
                key={option.value}
                className={`option ${
                  selectedAnswer === option.value ? 'selected' : ''
                } ${
                  answered && option.value === q.correctAnswer
                    ? 'correct'
                    : ''
                } ${answered && option.value === selectedAnswer && !isCorrect ? 'incorrect' : ''}`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option.value}
                  checked={selectedAnswer === option.value}
                  onChange={(e) => {
                    if (!answered) {
                      setSelectedAnswer(e.target.value)
                    }
                  }}
                />
                <span className="option-text">{option.text}</span>
              </label>
            ))}
          </div>

          {!answered && selectedAnswer && (
            <button
              className="submit-button"
              onClick={() => setAnswered(true)}
            >
              Check Answer
            </button>
          )}

          {answered && (
            <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="feedback-icon">
                {isCorrect ? '✓' : '✗'}
              </div>
              <div className="feedback-text">
                <strong>{isCorrect ? 'Correct!' : 'Incorrect'}</strong>
                <p>
                  The correct answer is <strong>{q.correctAnswer}</strong>
                </p>
              </div>
            </div>
          )}

          {answered && (
            <div className="explanation-section">
              <button
                className="explanation-toggle"
                onClick={() => setShowExplanation(!showExplanation)}
              >
                {showExplanation ? '▼' : '▶'} Why This Matters
              </button>
              {showExplanation && (
                <div className="explanation-text">
                  {q.explanation}
                </div>
              )}
            </div>
          )}

          {answered && (
            <button
              className="next-button"
              onClick={onBack}
            >
              Back to Questions
            </button>
          )}
        </div>
      </div>
    )
  }

  // All questions list view
  return (
    <div className="practice-questions">
      <div className="practice-header">
        <h1>Practice Questions</h1>
        <p>Test your knowledge with {practiceQuestions.length} questions covering all difficulty levels</p>
      </div>

      <div className="questions-container">
        <div className="questions-list">
          {practiceQuestions.map((q, idx) => (
            <div key={q.id} className={`question-item difficulty-${q.difficulty.toLowerCase()}`}>
              <div className="question-summary">
                <div className="question-header-list">
                  <div className="question-badges">
                    <span className={`difficulty-badge ${q.difficulty.toLowerCase()}`}>
                      {q.difficulty}
                    </span>
                    <span className="topic-badge">{q.topic}</span>
                  </div>
                  <span className="question-number">Q{q.number}</span>
                </div>
                <h3>{q.question}</h3>
              </div>
              <button className="question-button" onClick={() => {}}>
                Practice Question →
              </button>
            </div>
          ))}
        </div>

        <div className="practice-sidebar">
          <div className="difficulty-breakdown">
            <h3>Question Breakdown</h3>
            <div className="breakdown-item">
              <span className="breakdown-label">Easy</span>
              <span className="breakdown-count">
                {practiceQuestions.filter(q => q.difficulty === 'EASY').length}
              </span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Medium</span>
              <span className="breakdown-count">
                {practiceQuestions.filter(q => q.difficulty === 'MEDIUM').length}
              </span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Hard</span>
              <span className="breakdown-count">
                {practiceQuestions.filter(q => q.difficulty === 'HARD').length}
              </span>
            </div>
          </div>

          <div className="practice-tips">
            <h3>Tips for Success</h3>
            <ul>
              <li>Read questions carefully</li>
              <li>Think about edge cases</li>
              <li>Review explanations for wrong answers</li>
              <li>Understand the WHY, not just the WHAT</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
