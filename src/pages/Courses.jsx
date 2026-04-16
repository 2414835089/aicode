import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCourses } from '../hooks/useCourses'

function Courses() {
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')

  const filterOptions = {}
  if (selectedLanguage !== 'all') {
    filterOptions.language = selectedLanguage
  }
  if (selectedLevel !== 'all') {
    filterOptions.level = selectedLevel
  }

  const { courses, loading } = useCourses(filterOptions)

  const languages = [
    { code: 'all', name: '全部语言' },
    { code: 'english', name: '英语' },
    { code: 'japanese', name: '日语' },
    { code: 'korean', name: '韩语' }
  ]

  const levels = [
    { code: 'all', name: '全部级别' },
    { code: 'beginner', name: '入门' },
    { code: 'elementary', name: '初级' },
    { code: 'intermediate', name: '中级' },
    { code: 'advanced', name: '高级' }
  ]

  const getLanguageFlag = (lang) => {
    switch (lang) {
      case 'english':
        return '🇺🇸'
      case 'japanese':
        return '🇯🇵'
      case 'korean':
        return '🇰🇷'
      default:
        return '📚'
    }
  }

  const getLanguageName = (lang) => {
    switch (lang) {
      case 'english':
        return '英语'
      case 'japanese':
        return '日语'
      case 'korean':
        return '韩语'
      default:
        return lang
    }
  }

  const getLevelName = (level) => {
    switch (level) {
      case 'beginner':
        return '入门'
      case 'elementary':
        return '初级'
      case 'intermediate':
        return '中级'
      case 'advanced':
        return '高级'
      default:
        return level
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            探索课程
          </h1>
          <p className="text-xl text-gray-600">
            找到适合您的语言学习课程
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择语言
              </label>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedLanguage === lang.code
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择级别
              </label>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level.code}
                    onClick={() => setSelectedLevel(level.code)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedLevel === level.code
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              暂无课程
            </h3>
            <p className="text-gray-600">
              请尝试调整筛选条件
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                找到 <span className="font-bold text-gray-900">{courses.length}</span> 门课程
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-6xl">
                      {getLanguageFlag(course.language)}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {getLanguageName(course.language)}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                        {getLevelName(course.level)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {course.totalLessons} 节课
                      </span>
                      <Link
                        to={`/courses/${course.id}`}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center"
                      >
                        查看详情
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Courses
