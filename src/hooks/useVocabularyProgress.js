import { useState, useEffect } from 'react';
import { vocabularyProgressRepo, vocabularyRepo } from '../lib/mockDatabase';
import { getInitialCardState, calculateNextReview } from '../utils/spacedRepetition';

export const useVocabularyProgress = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    try {
      setLoading(true);
      const data = vocabularyProgressRepo.getAll();
      setProgress(data);
    } catch (err) {
      console.error('Error loading vocabulary progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProgressForWord = (vocabularyId) => {
    return progress.find(p => p.vocabularyId === vocabularyId) || null;
  };

  const updateWordProgress = (vocabularyId, quality) => {
    let currentProgress = getProgressForWord(vocabularyId);
    
    if (!currentProgress) {
      currentProgress = vocabularyProgressRepo.create(getInitialCardState(vocabularyId));
    }

    const newState = calculateNextReview(
      currentProgress.interval,
      currentProgress.easeFactor,
      quality
    );

    let status = 'reviewing';
    if (newState.repetitions >= 3 && newState.interval > 7) {
      status = 'mastered';
    } else if (newState.repetitions === 0) {
      status = 'new';
    }

    const updatedProgress = vocabularyProgressRepo.update(currentProgress.id, {
      ...newState,
      status
    });

    setProgress(prev => 
      prev.map(p => p.id === updatedProgress.id ? updatedProgress : p)
    );

    return updatedProgress;
  };

  const getAllWordsWithProgress = () => {
    const vocabulary = vocabularyRepo.getAll();
    return vocabulary.map(word => {
      const wordProgress = getProgressForWord(word.id);
      return {
        ...word,
        progress: wordProgress || null
      };
    });
  };

  const getWordsToReview = () => {
    const allWords = getAllWordsWithProgress();
    const now = new Date().toISOString();
    return allWords.filter(word => {
      if (!word.progress) return true;
      return word.progress.nextReview <= now;
    });
  };

  return {
    progress,
    loading,
    getProgressForWord,
    updateWordProgress,
    getAllWordsWithProgress,
    getWordsToReview,
    refresh: loadProgress
  };
};
