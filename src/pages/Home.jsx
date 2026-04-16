import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useCourses } from '../hooks/useCourses'

function Home() {
  const { setLearningLanguage } = useLanguage()
  const { courses, loading } = useCourses()
  const navigate = useNavigate()

  const learningLanguages = [
    { code: 'english', name: '英语', flag: '🇺🇸', color: 'from-blue-500 to-blue-600' },
    { code: 'japanese', name: '日语', flag: '🇯🇵', color: 'from-red-500 to-red-600' },
    { code: 'korean', name: '韩语', flag: '🇰🇷', color: 'from-green-500 to-green-600' }
  ]

  const features = [
    {
      icon: '📝',
      title: '单词记忆',
      description: '智能记忆曲线算法，帮助您高效记忆单词，学习事半功倍。'
    },
    {
      icon: '📖',
      title: '语法练习',
      description: '循序渐进的语法讲解和互动练习，让语法学习变得简单有趣。'
    },
    {
      icon: '🎧',
      title: '听力训练',
      description: '丰富的听力材料，多种难度选择，全面提升您的听力水平。'
    },
    {
      icon: '🎤',
      title: '口语跟读',
      description: 'AI语音识别技术，实时纠正发音，练就地道口语。'
    }
  ]

  const testimonials = [
    {
      name: '张明',
      avatar: '张',
      language: '英语',
      text: '使用LangLearn学习英语三个月，我的口语水平提升了很多！AI语音纠正功能真的很棒。',
      rating: 5
    },
    {
      name: '李华',
      avatar: '李',
      language: '日语',
      text: '从五十音图开始学习，现在已经能进行简单的日常对话了。课程设计非常合理！',
      rating: 5
    },
    {
      name: '王芳',
      avatar: '王',
      language: '韩语',
      text: '单词记忆功能太好用了，按照记忆曲线复习，记得牢又不费力。强烈推荐！',
      rating: 5
    }
  ]

  const handleLanguageSelect = (langCode) => {
    setLearningLanguage(langCode)
    navigate('/courses')
  }

  const featuredCourses = courses.slice(0, 6)

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              开启您的多语言学习之旅
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
              随时随地轻松学习英语、日语、韩语。AI驱动的个性化学习，让语言学习更高效、更有趣。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
              >
                开始学习
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
              >
                了解更多
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              选择您想学习的语言
            </h2>
            <p className="text-xl text-gray-600">
              点击下方卡片，开启您的语言学习旅程
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {learningLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`bg-gradient-to-br ${lang.color} rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer`}
              >
                <div className="text-center">
                  <span className="text-7xl mb-4 block">{lang.flag}</span>
                  <h3 className="text-2xl font-bold mb-2">{lang.name}</h3>
                  <p className="text-white/80">点击开始学习</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              精选课程
            </h2>
            <p className="text-xl text-gray-600">
              为您推荐最受欢迎的课程
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-6xl">
                      {course.language === 'english' && '🇺🇸'}
                      {course.language === 'japanese' && '🇯🇵'}
                      {course.language === 'korean' && '🇰🇷'}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {course.language === 'english' && '英语'}
                        {course.language === 'japanese' && '日语'}
                        {course.language === 'korean' && '韩语'}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                        {course.level === 'beginner' && '入门'}
                        {course.level === 'elementary' && '初级'}
                        {course.level === 'intermediate' && '中级'}
                        {course.level === 'advanced' && '高级'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {course.totalLessons} 节课
                      </span>
                      <Link
                        to={`/courses/${course.id}`}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors"
                      >
                        查看详情
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              to="/courses"
              className="inline-flex items-center px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-full font-semibold hover:bg-indigo-600 hover:text-white transition-all"
            >
              查看全部课程
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              强大的学习功能
            </h2>
            <p className="text-xl text-gray-600">
              全方位提升您的语言能力
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              用户评价
            </h2>
            <p className="text-xl text-gray-600">
              听听学员们怎么说
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">学习 {testimonial.language}</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            准备好开始学习了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            加入成千上万的学习者，开启您的多语言学习之旅！
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-10 py-5 bg-white text-indigo-600 rounded-full font-bold text-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
          >
            免费注册
            <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
