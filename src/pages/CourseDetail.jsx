import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCourses } from '../hooks/useCourses'
import { useLessons } from '../hooks/useLessons'
import { useUserProgress } from '../hooks/useUserProgress'
import { useAuth } from '../contexts/AuthContext'

function CourseDetail() {
  const { id } = useParams()
  const { courses } = useCourses()
  const { lessons } = useLessons()
  const { progress: userProgress } = useUserProgress()
  const { user } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)
  const [notes, setNotes] = useState('')

  const course = courses.find(c => c.id === id)
  const courseLessons = lessons.filter(l => l.courseId === id).sort((a, b) => a.orderIndex - b.orderIndex)
  
  const userProgressForCourse = userProgress.filter(p => p.courseId === id)
  const completedLessons = userProgressForCourse.filter(p => p.isCompleted).length
  const progressPercentage = courseLessons.length > 0 
    ? Math.round((completedLessons / courseLessons.length) * 100) 
    : 0

  useEffect(() => {
    const savedNotes = localStorage.getItem(`course_notes_${id}`)
    if (savedNotes) setNotes(savedNotes)
    
    const savedFavorites = JSON.parse(localStorage.getItem('favorite_courses') || '[]')
    setIsFavorited(savedFavorites.includes(id))
  }, [id])

  const handleSaveNotes = () => {
    localStorage.setItem(`course_notes_${id}`, notes)
    alert('笔记已保存！')
  }

  const toggleFavorite = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorite_courses') || '[]')
    let newFavorites
    if (isFavorited) {
      newFavorites = savedFavorites.filter(fid => fid !== id)
    } else {
      newFavorites = [...savedFavorites, id]
    }
    localStorage.setItem('favorite_courses', JSON.stringify(newFavorites))
    setIsFavorited(!isFavorited)
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700">课程未找到</h1>
          <Link to="/courses" className="text-blue-600 hover:underline mt-4 inline-block">
            返回课程列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/courses" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回课程列表
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img 
                src={course.thumbnailUrl} 
                alt={course.title} 
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 p-8">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {course.level === 'beginner' ? '入门级' : 
                     course.level === 'elementary' ? '初级' : 
                     course.level === 'intermediate' ? '中级' : '高级'}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{course.title}</h1>
                  <p className="text-gray-600 mb-6">{course.description}</p>
                </div>
                <button
                  onClick={toggleFavorite}
                  className={`p-3 rounded-full transition-colors ${
                    isFavorited ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-6 h-6" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>学习进度</span>
                  <span>{progressPercentage}% ({completedLessons}/{courseLessons.length} 课时)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {courseLessons.length > 0 && (
                  <Link
                    to={`/courses/${id}/lessons/${courseLessons[0].id}`}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    开始学习
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">课程内容</h2>
              <div className="space-y-4">
                {courseLessons.map((lesson, index) => {
                  const progress = userProgressForCourse.find(p => p.lessonId === lesson.id)
                  const isCompleted = progress?.isCompleted
                  
                  return (
                    <Link
                      key={lesson.id}
                      to={`/courses/${id}/lessons/${lesson.id}`}
                      className="block p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                            isCompleted 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {isCompleted ? (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                            <p className="text-sm text-gray-500">{lesson.description}</p>
                          </div>
                        </div>
                        {lesson.duration && (
                          <span className="text-sm text-gray-500">{lesson.duration} 分钟</span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">课程笔记</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="在这里记录你的学习笔记..."
                className="w-full h-64 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSaveNotes}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                保存笔记
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
