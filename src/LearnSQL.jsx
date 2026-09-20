import './LearnSQL.css'
import { sqlTopics } from './sqlTopics'

export function LearnSQL({ onSelectLesson, progress }) {
  const topicsByDifficulty = {
    beginner: sqlTopics.filter(t => t.difficulty === 'Beginner'),
    intermediate: sqlTopics.filter(t => t.difficulty === 'Intermediate'),
    advanced: sqlTopics.filter(t => t.difficulty === 'Advanced')
  }

  const renderTopicCards = (topics, difficulty) => {
    return (
      <div key={difficulty} className={`topic-section topic-${difficulty}`}>
        <div className="section-header">
          <h2 className={`section-title section-title-${difficulty}`}>
            {difficulty === 'beginner' && '🎓 Beginner Fundamentals'}
            {difficulty === 'intermediate' && '📈 Intermediate Concepts'}
            {difficulty === 'advanced' && '🚀 Advanced Techniques'}
          </h2>
          <p className="section-subtitle">
            {difficulty === 'beginner' && 'Master the core building blocks of SQL'}
            {difficulty === 'intermediate' && 'Deep dive into practical SQL patterns'}
            {difficulty === 'advanced' && 'Expert-level optimization and edge cases'}
          </p>
        </div>
        <div className="topics-grid">
          {topics.map((topic, idx) => (
            <div key={idx} className={`topic-card topic-card-${difficulty}`}>
              <div className="topic-header">
                <div className="topic-icon">{topic.icon}</div>
                <span className={`topic-badge badge-${difficulty}`}>{difficulty}</span>
              </div>
              <h3>{topic.title}</h3>
              <p className="topic-description">{topic.description}</p>
              <ul className="topic-subtopics">
                {topic.subtopics.slice(0, 3).map((sub, i) => (
                  <li key={i}>{sub}</li>
                ))}
                {topic.subtopics.length > 3 && <li className="more">+{topic.subtopics.length - 3} more</li>}
              </ul>
              <button className="learn-button" onClick={() => onSelectLesson(idx)}>
                Learn {topic.lessons || 1} Lesson{(topic.lessons || 1) > 1 ? 's' : ''}
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="learn-sql">
      <div className="learn-header">
        <h1>Learn Advanced SQL</h1>
        <p>Choose your learning path and master SQL at your own pace</p>
      </div>

      <div className="topics-container">
        {renderTopicCards(topicsByDifficulty.beginner, 'beginner')}
        {renderTopicCards(topicsByDifficulty.intermediate, 'intermediate')}
        {renderTopicCards(topicsByDifficulty.advanced, 'advanced')}
      </div>
    </div>
  )
}
