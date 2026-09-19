import { useState } from 'react'
import { useDuckDB } from './useDuckDB'
import { useProgress } from './useProgress'
import { Dashboard } from './Dashboard'
import { Lesson } from './Lesson'
import { lessons } from './lessons'
import './App.css'

function App() {
  const { db, loading, error: dbError, executeQuery } = useDuckDB()
  const progress = useProgress()
  const [currentLessonIndex, setCurrentLessonIndex] = useState(null)

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

  if (!progress.loaded) {
    return (
      <div className="app">
        <div className="loading-screen">
          <h2>Loading...</h2>
        </div>
      </div>
    )
  }

  // Show dashboard if no lesson selected, otherwise show lesson
  if (currentLessonIndex === null) {
    return (
      <Dashboard
        lessons={lessons}
        progress={progress}
        onSelectLesson={setCurrentLessonIndex}
      />
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
      progress={progress}
    />
  )
}

export default App
