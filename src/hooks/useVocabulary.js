import { useState, useEffect } from 'react';
import { vocabularyRepo } from '../lib/mockDatabase';

/**
 * 获取单词列表的钩子
 * @param {string} lessonId - 课时ID
 * @returns {Object}
 */
export const useVocabulary = (lessonId) => {
  const [vocabulary, setVocabulary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lessonId) {
      setVocabulary([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = vocabularyRepo.find({ lessonId });
      data.sort((a, b) => a.orderIndex - b.orderIndex);
      setVocabulary(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  return { vocabulary, loading, error };
};
