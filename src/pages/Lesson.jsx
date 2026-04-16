import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useCourses } from '../hooks/useCourses'
import { useLessons } from '../hooks/useLessons'
import { useVocabulary } from '../hooks/useVocabulary'
import { useUserProgress } from '../hooks/useUserProgress'
import { useAuth } from '../contexts/AuthContext'

function Lesson() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { courses } = useCourses()
  const { lessons } = useLessons()
  const { vocabulary } = useVocabulary()
  const { userProgress, updateProgress, createProgress } = useUserProgress()
  const { user } = useAuth()
  
  const [isCompleted, setIsCompleted] = useState(false)
  const [notes, setNotes] = useState('')
  const [activeTab, setActiveTab] = useState('content')

  const course = courses.find(c => c.id === courseId)
  const lesson = lessons.find(l => l.id === lessonId)
  const courseLessons = lessons.filter(l => l.courseId === courseId).sort((a, b) => a.orderIndex - b.orderIndex)
  const lessonVocabulary = vocabulary.filter(v => v.lessonId === lessonId).sort((a, b) => a.orderIndex - b.orderIndex)
  
  const currentIndex = courseLessons.findIndex(l => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null

  useEffect(() => {
    if (user && lesson) {
      const progress = userProgress.find(p => p.lessonId === lessonId && p.userId === user.id)
      if (progress) {
        setIsCompleted(progress.isCompleted)
      }
    }
    
    const savedNotes = localStorage.getItem(`lesson_notes_${lessonId}`)
    if (savedNotes) setNotes(savedNotes)
  }, [user, lesson, userProgress, lessonId])

  const handleSaveNotes = () => {
    localStorage.setItem(`lesson_notes_${lessonId}`, notes)
    alert('笔记已保存！')
  }

  const handleCompleteLesson = () => {
    if (!user) {
      alert('请先登录')
      return
    }

    const progress = userProgress.find(p => p.lessonId === lessonId && p.userId === user.id)
    
    if (progress) {
      updateProgress(progress.id, {
        isCompleted: true,
        progressPercentage: 100,
        completedAt: new Date().toISOString()
      })
    } else {
      createProgress({
        userId: user.id,
        courseId: courseId,
        lessonId: lessonId,
        isCompleted: true,
        progressPercentage: 100,
        lastAccessed: new Date().toISOString(),
        completedAt: new Date().toISOString()
      })
    }
    
    setIsCompleted(true)
    alert('恭喜完成本节课！')
  }

  if (!course || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700">页面未找到</h1>
          <Link to="/courses" className="text-blue-600 hover:underline mt-4 inline-block">
            返回课程列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to={`/courses/${courseId}`} className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回课程
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
              <p className="text-gray-600">{lesson.description}</p>
              {lesson.duration && (
                <span className="inline-block mt-2 text-sm text-gray-500">
                  预计学习时间：{lesson.duration} 分钟
                </span>
              )}
            </div>
            {isCompleted && (
              <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                已完成
              </span>
            )}
          </div>

          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'content'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              学习内容
            </button>
            <button
              onClick={() => setActiveTab('vocabulary')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'vocabulary'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              单词 {lessonVocabulary.length > 0 && `(${lessonVocabulary.length})`}
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              笔记
            </button>
          </div>

          <div className="min-h-96">
            {activeTab === 'content' && (
              <div className="prose max-w-none">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">课程学习</h2>
                  <p className="text-gray-700 mb-4">
                    欢迎来到本节课的学习！这里将展示课程的主要内容，包括语法讲解、例句分析和文化背景知识。
                  </p>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">核心知识点</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        掌握基本语法结构和用法
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        学习常用词汇和固定搭配
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        理解文化背景和使用场景
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        完成相关练习巩固所学
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Link
                    to="/listening"
                    className="block bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-6 hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center mb-3">
                      <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                      <h3 className="text-xl font-bold">听力训练</h3>
                    </div>
                    <p>练习听力理解能力</p>
                  </Link>

                  <Link
                    to="/speaking"
                    className="block bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl p-6 hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center mb-3">
                      <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      <h3 className="text-xl font-bold">口语练习</h3>
                    </div>
                    <p>提升口语表达能力</p>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'vocabulary' && (
              <div>
                {lessonVocabulary.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {lessonVocabulary.map((word) => (
                      <div key={word.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{word.word}</h3>
                            {word.pronunciation && (
                              <p className="text-sm text-gray-500 mt-1">{word.pronunciation}</p>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{word.meaning}</p>
                        {word.exampleSentence && (
                          <div className="bg-white rounded-lg p-3 text-sm text-gray-600 italic">
                            "{word.exampleSentence}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-lg">本节课暂无单词</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="在这里记录你的学习笔记..."
                  className="w-full h-96 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSaveNotes}
                  className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  保存笔记
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {prevLesson && (
              <Link
                to={`/courses/${courseId}/lessons/${prevLesson.id}`}
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                上一课
              </Link>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {!isCompleted && (
              <button
                onClick={handleCompleteLesson}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
              >
                完成本课
              </button>
            )}
            {nextLesson && (
              <Link
                to={`/courses/${courseId}/lessons/${nextLesson.id}`}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                下一课
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lesson
