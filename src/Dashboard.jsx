import './Dashboard.css'

export function Dashboard({ lessons, progress, onSelectLesson }) {
  const stats = progress.getProgressStats(lessons.length)

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>SQL Learning Platform</h1>
          <p>Master SQL through hands-on lessons and real feedback</p>
        </div>
      </header>

      <div className="dashboard-container">
        <div className="progress-section">
          <h2>Your Progress</h2>
          <div className="progress-stats">
            <div className="stat-box">
              <div className="stat-number">{stats.completed}</div>
              <div className="stat-label">Lessons Complete</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{stats.percentage}%</div>
              <div className="stat-label">Progress</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{stats.remaining}</div>
              <div className="stat-label">Remaining</div>
            </div>
          </div>
          <div className="progress-bar-full">
            <div
              className="progress-fill-full"
              style={{ width: `${stats.percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="lessons-section">
          <h2>Available Lessons</h2>
          <div className="lessons-grid">
            {lessons.map((lesson, idx) => {
              const isComplete = progress.isLessonComplete(lesson.id)
              const attempts = progress.getLessonAttempts(lesson.id)

              return (
                <div
                  key={lesson.id}
                  className={`lesson-card ${isComplete ? 'completed' : ''}`}
                  onClick={() => onSelectLesson(idx)}
                >
                  <div className="lesson-card-header">
                    <div className="lesson-number">Lesson {idx + 1}</div>
                    {isComplete && <div className="completion-badge">✓ Complete</div>}
                  </div>

                  <h3>{lesson.title}</h3>
                  <p className="lesson-desc">{lesson.description}</p>

                  <div className="lesson-meta">
                    <span className={`difficulty ${lesson.difficulty.toLowerCase()}`}>
                      {lesson.difficulty}
                    </span>
                    {attempts > 0 && (
                      <span className="attempts">
                        {attempts} {attempts === 1 ? 'attempt' : 'attempts'}
                      </span>
                    )}
                  </div>

                  <button className="start-button">
                    {isComplete ? 'Review' : 'Start'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="about-section">
          <h2>What You'll Learn</h2>
          <div className="about-content">
            <div className="about-item">
              <h4>Real SQL, Real Feedback</h4>
              <p>Run actual SQL queries and get instant feedback on correctness, not just right/wrong.</p>
            </div>
            <div className="about-item">
              <h4>Understand the Why</h4>
              <p>Learn not just HOW to write SQL, but WHY it works that way - and why common mistakes are tempting.</p>
            </div>
            <div className="about-item">
              <h4>Track Your Progress</h4>
              <p>See what you've mastered and what's next. Progress saves automatically in your browser.</p>
            </div>
            <div className="about-item">
              <h4>No Signup Required</h4>
              <p>Everything runs in your browser. No accounts, no tracking, just learning.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
