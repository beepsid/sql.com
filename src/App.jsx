import { useState } from 'react'
import { useDuckDB } from './useDuckDB'
import { Lesson } from './Lesson'
import { lessons } from './lessons'
import './App.css'

function App() {
  const { db, loading, error: dbError, executeQuery } = useDuckDB()
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)

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

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <h2>Loading SQL Playground...</h2>
          <p>Setting up your in-memory database</p>
        </div>
      </div>
    )
  }

  const currentLesson = lessons[currentLessonIndex]

  return (
    <Lesson
      lesson={currentLesson}
      db={db}
      executeQuery={executeQuery}
      lessons={lessons}
      currentLessonIndex={currentLessonIndex}
      onLessonChange={setCurrentLessonIndex}
    />
  )
}

export default App
