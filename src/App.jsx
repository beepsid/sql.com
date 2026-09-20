import { useState } from 'react'
import { useDuckDB } from './useDuckDB'
import { useProgress } from './useProgress'
import { Navigation } from './Navigation'
import { LandingPage } from './LandingPage'
import { LearnSQL } from './LearnSQL'
import { PracticeQuestions } from './PracticeQuestions.jsx'
import { Lesson } from './Lesson'
import { lessons } from './lessons'
import './App.css'

function App() {
  const { db, loading, error: dbError, executeQuery } = useDuckDB()
  const progress = useProgress()
  const [currentPage, setCurrentPage] = useState('home')
  const [currentLessonIndex, setCurrentLessonIndex] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null)

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

  if (loading || !progress.loaded) {
    return (
      <div className="app">
        <div className="loading-screen">
          <h2>Loading Advanced SQL Platform...</h2>
          <p>Setting up your learning environment</p>
        </div>
      </div>
    )
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
    setCurrentLessonIndex(null)
    setCurrentQuestionIndex(null)
  }

  const handleSelectLesson = (index) => {
    setCurrentLessonIndex(index)
    setCurrentPage('lesson')
  }

  const handleSelectQuestion = (index) => {
    setCurrentQuestionIndex(index)
    setCurrentPage('question')
  }

  const handleBackToPage = (page) => {
    setCurrentPage(page)
    setCurrentLessonIndex(null)
    setCurrentQuestionIndex(null)
  }

  // Render based on current page
  if (currentPage === 'lesson' && currentLessonIndex !== null) {
    const currentLesson = lessons[currentLessonIndex]
    return (
      <>
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
        <Lesson
          lesson={currentLesson}
          db={db}
          executeQuery={executeQuery}
          lessons={lessons}
          currentLessonIndex={currentLessonIndex}
          onLessonChange={handleSelectLesson}
          onBack={() => handleBackToPage('learn')}
          progress={progress}
        />
      </>
    )
  }

  if (currentPage === 'question' && currentQuestionIndex !== null) {
    return (
      <>
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
        <PracticeQuestions
          questionIndex={currentQuestionIndex}
          onBack={() => handleBackToPage('practice')}
          progress={progress}
          executeQuery={executeQuery}
        />
      </>
    )
  }

  return (
    <>
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      {currentPage === 'home' && (
        <LandingPage
          onGetStarted={() => handleNavigate('learn')}
          progress={progress}
          totalLessons={lessons.length}
        />
      )}
      {currentPage === 'learn' && (
        <LearnSQL onSelectLesson={handleSelectLesson} progress={progress} />
      )}
      {currentPage === 'practice' && (
        <PracticeQuestions
          onSelectQuestion={handleSelectQuestion}
          progress={progress}
          executeQuery={executeQuery}
        />
      )}
    </>
  )
}

export default App
