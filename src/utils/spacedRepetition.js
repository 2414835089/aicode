export const calculateNextReview = (currentInterval, easeFactor, quality) => {
  let newInterval
  let newEaseFactor = easeFactor

  newEaseFactor = newEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3
  }

  if (quality < 3) {
    newInterval = 1
  } else {
    if (currentInterval === 0) {
      newInterval = 1
    } else if (currentInterval === 1) {
      newInterval = 6
    } else {
      newInterval = Math.round(currentInterval * newEaseFactor)
    }
  }

  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval)

  return {
    interval: newInterval,
    easeFactor: newEaseFactor,
    nextReview: nextReviewDate.toISOString(),
    repetitions: quality < 3 ? 0 : quality
  }
}

export const getInitialCardState = (vocabularyId) => ({
  vocabularyId,
  interval: 0,
  easeFactor: 2.5,
  repetitions: 0,
  nextReview: new Date().toISOString(),
  status: 'new',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

export const QUALITY = {
  AGAIN: 0,
  HARD: 2,
  GOOD: 3,
  EASY: 5
}
