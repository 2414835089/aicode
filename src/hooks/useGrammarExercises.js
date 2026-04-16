import { useState, useEffect } from 'react';
import { grammarExercisesRepo } from '../lib/mockDatabase';

/**
 * 获取语法练习题列表的钩子
 * @param {string} lessonId - 课时ID
 * @returns {Object}
 */
export const useGrammarExercises = (lessonId) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lessonId) {
      setExercises([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = grammarExercisesRepo.find({ lessonId });
      data.sort((a, b) => a.orderIndex - b.orderIndex);
      setExercises(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  return { exercises, loading, error };
};
