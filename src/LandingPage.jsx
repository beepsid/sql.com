import './LandingPage.css'

export function LandingPage({ onGetStarted, progress, totalLessons }) {
  const stats = progress.getProgressStats(totalLessons)

  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-content">
          <h1>Master Advanced SQL</h1>
          <p>Go beyond the basics. Learn in-depth SQL concepts, query optimization, and production patterns.</p>
          <button className="cta-button" onClick={onGetStarted}>
            Start Learning →
          </button>
        </div>
      </section>

      <section className="features">
        <div className="features-container">
          <div className="feature">
            <div className="feature-icon">🎯</div>
            <h3>In-Depth Curriculum</h3>
            <p>Structured learning from fundamentals through advanced optimization techniques.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h3>Hands-On Practice</h3>
            <p>Write real SQL queries and get detailed feedback on correctness and performance.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔍</div>
            <h3>Real-World Challenges</h3>
            <p>Solve practical problems based on actual database scenarios and edge cases.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💡</div>
            <h3>Understand the Why</h3>
            <p>Learn not just HOW to write SQL, but WHY certain approaches are better.</p>
          </div>
        </div>
      </section>

      {stats.completed > 0 && (
        <section className="progress-section">
          <div className="progress-container">
            <h2>Your Progress</h2>
            <div className="progress-stats">
              <div className="stat">
                <div className="stat-value">{stats.completed}</div>
                <div className="stat-label">Lessons Complete</div>
              </div>
              <div className="stat">
                <div className="stat-value">{stats.percentage}%</div>
                <div className="stat-label">Progress</div>
              </div>
              <div className="stat">
                <div className="stat-value">{stats.remaining}</div>
                <div className="stat-label">Remaining</div>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${stats.percentage}%` }}></div>
            </div>
          </div>
        </section>
      )}

      <section className="curriculum">
        <h2>What You'll Learn</h2>
        <div className="curriculum-grid">
          <div className="curriculum-item">
            <h4>Fundamentals</h4>
            <ul>
              <li>SELECT, WHERE, ORDER BY</li>
              <li>Logical operators & precedence</li>
              <li>NULL handling</li>
              <li>DISTINCT & aggregation</li>
            </ul>
          </div>
          <div className="curriculum-item">
            <h4>Joins & Relationships</h4>
            <ul>
              <li>INNER, LEFT, RIGHT, OUTER</li>
              <li>Self-joins & cross joins</li>
              <li>Join fan-out problems</li>
              <li>Non-equi joins</li>
            </ul>
          </div>
          <div className="curriculum-item">
            <h4>Advanced Queries</h4>
            <ul>
              <li>Subqueries & CTEs</li>
              <li>Window functions</li>
              <li>Recursive queries</li>
              <li>Query composition</li>
            </ul>
          </div>
          <div className="curriculum-item">
            <h4>Performance & Design</h4>
            <ul>
              <li>Indexing strategies</li>
              <li>Query optimization</li>
              <li>Database design (3NF)</li>
              <li>Execution plans</li>
            </ul>
          </div>
          <div className="curriculum-item">
            <h4>Transactions & Data Integrity</h4>
            <ul>
              <li>ACID properties</li>
              <li>Isolation levels</li>
              <li>Transaction anomalies</li>
              <li>Locking mechanisms</li>
            </ul>
          </div>
          <div className="curriculum-item">
            <h4>Security & Best Practices</h4>
            <ul>
              <li>SQL injection prevention</li>
              <li>Parameterized queries</li>
              <li>Access control</li>
              <li>Data protection</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
