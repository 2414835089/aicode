import { useState, useEffect } from 'react';
import { userProgressRepo } from '../lib/mockDatabase';

/**
 * 获取用户学习进度的钩子
 * @param {string} userId - 用户ID
 * @param {Object} options - 过滤选项
 * @param {string} [options.courseId] - 课程ID过滤
 * @returns {Object}
 */
export const useUserProgress = (userId, options = {}) => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setProgress([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let data = userProgressRepo.find({ userId });
      
      if (options.courseId) {
        data = data.filter(item => item.courseId === options.courseId);
      }
      
      setProgress(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId, options.courseId]);

  return { progress, loading, error };
};
