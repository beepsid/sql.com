// Grading logic for comparing learner results to expected results

export function compareResults(learnerResult, expectedResult) {
  // Normalize both results
  const learner = normalizeResult(learnerResult)
  const expected = normalizeResult(expectedResult)

  // Check if they're the same
  if (learner.length !== expected.length) {
    return {
      correct: false,
      reason: `You got ${learner.length} rows, but the expected answer has ${expected.length} rows.`
    }
  }

  // Check each row
  for (let i = 0; i < learner.length; i++) {
    if (!rowsEqual(learner[i], expected[i])) {
      return {
        correct: false,
        reason: `Row ${i + 1} doesn't match. Check your results carefully.`
      }
    }
  }

  // Check column order and names
  if (learner.length > 0 && expected.length > 0) {
    const learnerCols = Object.keys(learner[0])
    const expectedCols = Object.keys(expected[0])

    if (!columnsMatch(learnerCols, expectedCols)) {
      return {
        correct: false,
        reason: `Your columns don't match exactly. You have: ${learnerCols.join(", ")} but expected: ${expectedCols.join(", ")}`
      }
    }
  }

  return {
    correct: true,
    reason: "Perfect! Your query returned the correct result."
  }
}

function normalizeResult(result) {
  if (!Array.isArray(result)) {
    return []
  }

  return result.map(row => {
    const normalized = {}
    Object.keys(row).forEach(key => {
      const value = row[key]
      // Normalize strings and handle NULL
      if (value === null || value === undefined) {
        normalized[key] = null
      } else if (typeof value === 'string') {
        normalized[key] = value.trim()
      } else {
        normalized[key] = value
      }
    })
    return normalized
  })
}

function rowsEqual(row1, row2) {
  const keys1 = Object.keys(row1)
  const keys2 = Object.keys(row2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (let key of keys1) {
    if (!(key in row2)) {
      return false
    }

    const val1 = row1[key]
    const val2 = row2[key]

    // Handle NULL
    if ((val1 === null || val1 === undefined) && (val2 === null || val2 === undefined)) {
      continue
    }

    // Handle numbers (compare as numbers to avoid type issues)
    if (typeof val1 === 'number' && typeof val2 === 'number') {
      if (Math.abs(val1 - val2) > 0.0001) {
        return false
      }
      continue
    }

    // Handle strings
    if (typeof val1 === 'string' && typeof val2 === 'string') {
      if (val1.trim() !== val2.trim()) {
        return false
      }
      continue
    }

    // Direct comparison for other types
    if (val1 !== val2) {
      return false
    }
  }

  return true
}

function columnsMatch(cols1, cols2) {
  if (cols1.length !== cols2.length) {
    return false
  }

  for (let i = 0; i < cols1.length; i++) {
    if (cols1[i] !== cols2[i]) {
      return false
    }
  }

  return true
}

// Detect common mistakes
export function detectMistake(learnerQuery, expectedQuery) {
  const learnerUpper = learnerQuery.toUpperCase()
  const expectedUpper = expectedQuery.toUpperCase()

  // Check for = NULL
  if (learnerUpper.includes("= NULL") && expectedUpper.includes("IS NULL")) {
    return "nullEquals"
  }

  // Check if they selected * when they shouldn't
  if (learnerUpper.includes("SELECT *") && !expectedUpper.includes("SELECT *")) {
    return "allColumns"
  }

  return null
}
