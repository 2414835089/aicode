import { useState, useEffect } from 'react';
import { grammarProgressRepo, grammarMistakesRepo, grammarExercisesV2Repo } from '../lib/mockDatabase';

export const useGrammarProgress = (userId = 'anonymous') => {
  const [progress, setProgress] = useState([]);
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = () => {
    try {
      setLoading(true);
      const progressData = grammarProgressRepo.find({ userId });
      const mistakesData = grammarMistakesRepo.find({ userId });
      setProgress(progressData);
      setMistakes(mistakesData);
    } catch (err) {
      console.error('Error loading grammar progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProgressForExercise = (exerciseId) => {
    return progress.find(p => p.exerciseId === exerciseId) || null;
  };

  const recordAttempt = (exerciseId, isCorrect, userAnswer) => {
    let currentProgress = getProgressForExercise(exerciseId);
    
    if (!currentProgress) {
      currentProgress = grammarProgressRepo.create({
        userId,
        exerciseId,
        attempts: 0,
        correctAttempts: 0,
        isMastered: false,
        lastAttemptedAt: new Date().toISOString(),
      });
    }

    const updatedProgress = grammarProgressRepo.update(currentProgress.id, {
      attempts: currentProgress.attempts + 1,
      correctAttempts: currentProgress.correctAttempts + (isCorrect ? 1 : 0),
      isMastered: currentProgress.correctAttempts + (isCorrect ? 1 : 0) >= 3,
      lastAttemptedAt: new Date().toISOString(),
    });

    if (!isCorrect) {
      grammarMistakesRepo.create({
        userId,
        exerciseId,
        userAnswer,
        attemptedAt: new Date().toISOString(),
      });
    }

    setProgress(prev => 
      prev.map(p => p.id === updatedProgress.id ? updatedProgress : p)
    );

    if (!isCorrect) {
      loadData();
    }

    return updatedProgress;
  };

  const getAllExercisesWithProgress = () => {
    const exercises = grammarExercisesV2Repo.getAll();
    return exercises.map(exercise => {
      const exerciseProgress = getProgressForExercise(exercise.id);
      return {
        ...exercise,
        progress: exerciseProgress || null,
      };
    });
  };

  const getMistakes = () => {
    const exercises = grammarExercisesV2Repo.getAll();
    return mistakes.map(mistake => {
      const exercise = exercises.find(e => e.id === mistake.exerciseId);
      return {
        ...mistake,
        exercise,
      };
    }).filter(m => m.exercise);
  };

  const getStats = () => {
    const totalExercises = grammarExercisesV2Repo.getAll().length;
    const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0);
    const totalCorrect = progress.reduce((sum, p) => sum + p.correctAttempts, 0);
    const masteredCount = progress.filter(p => p.isMastered).length;
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    return {
      totalExercises,
      totalAttempts,
      totalCorrect,
      masteredCount,
      accuracy,
      mistakeCount: mistakes.length,
    };
  };

  const removeMistake = (mistakeId) => {
    grammarMistakesRepo.delete(mistakeId);
    loadData();
  };

  const clearMistakes = () => {
    mistakes.forEach(mistake => {
      grammarMistakesRepo.delete(mistake.id);
    });
    loadData();
  };

  return {
    progress,
    mistakes,
    loading,
    getProgressForExercise,
    recordAttempt,
    getAllExercisesWithProgress,
    getMistakes,
    getStats,
    removeMistake,
    clearMistakes,
    refresh: loadData,
  };
};
