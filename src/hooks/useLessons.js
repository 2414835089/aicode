import { useState, useEffect } from 'react';
import { lessonsRepo } from '../lib/mockDatabase';

/**
 * 获取课时列表的钩子
 * @param {string} courseId - 课程ID
 * @returns {Object}
 */
export const useLessons = (courseId) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) {
      setLessons([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = lessonsRepo.find({ courseId });
      data.sort((a, b) => a.orderIndex - b.orderIndex);
      setLessons(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  return { lessons, loading, error };
};
