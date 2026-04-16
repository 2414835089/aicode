import { useState, useEffect } from 'react';
import { coursesRepo } from '../lib/mockDatabase';

/**
 * 获取课程列表的钩子
 * @param {Object} options - 过滤选项
 * @param {string} [options.language] - 语言过滤
 * @param {string} [options.level] - 级别过滤
 * @returns {Object}
 */
export const useCourses = (options = {}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      let data = coursesRepo.getAll();
      
      if (options.language) {
        data = data.filter(course => course.language === options.language);
      }
      
      if (options.level) {
        data = data.filter(course => course.level === options.level);
      }
      
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [options.language, options.level]);

  return { courses, loading, error };
};
