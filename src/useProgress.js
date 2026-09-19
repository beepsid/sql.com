import { useState, useEffect } from 'react'

const STORAGE_KEY = 'sql-learning-progress'

export function useProgress() {
  const [progress, setProgress] = useState({})
  const [loaded, setLoaded] = useState(false)

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setProgress(JSON.parse(stored))
      }
    } catch (err) {
      console.error('Failed to load progress:', err)
    }
    setLoaded(true)
  }, [])

  const markLessonComplete = (lessonId) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        [lessonId]: {
          completed: true,
          completedAt: new Date().toISOString(),
          attempts: (prev[lessonId]?.attempts || 0) + 1
        }
      }

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (err) {
        console.error('Failed to save progress:', err)
      }

      return updated
    })
  }

  const recordAttempt = (lessonId) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        [lessonId]: {
          ...prev[lessonId],
          attempts: (prev[lessonId]?.attempts || 0) + 1,
          lastAttempt: new Date().toISOString()
        }
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (err) {
        console.error('Failed to save progress:', err)
      }

      return updated
    })
  }

  const isLessonComplete = (lessonId) => {
    return progress[lessonId]?.completed === true
  }

  const getLessonAttempts = (lessonId) => {
    return progress[lessonId]?.attempts || 0
  }

  const getProgressStats = (totalLessons) => {
    const completed = Object.values(progress).filter(p => p.completed).length
    const percentage = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0

    return {
      completed,
      total: totalLessons,
      percentage,
      remaining: totalLessons - completed
    }
  }

  const resetProgress = () => {
    setProgress({})
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (err) {
      console.error('Failed to reset progress:', err)
    }
  }

  return {
    progress,
    loaded,
    markLessonComplete,
    recordAttempt,
    isLessonComplete,
    getLessonAttempts,
    getProgressStats,
    resetProgress
  }
}
