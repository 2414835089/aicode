import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { languages, selectedLanguage, setSelectedLanguage } = useLanguage()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setIsMenuOpen(false)
    setIsUserDropdownOpen(false)
  }

  const currentLang = languages.find(l => l.code === selectedLanguage)

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <span className="text-white text-xl font-bold">LangLearn</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-blue-200 transition-colors font-medium">首页</Link>
            <Link to="/courses" className="text-white hover:text-blue-200 transition-colors font-medium">课程</Link>
            <Link to="/vocabulary" className="text-white hover:text-blue-200 transition-colors font-medium">词汇</Link>
            <Link to="/grammar" className="text-white hover:text-blue-200 transition-colors font-medium">语法</Link>
            <Link to="/listening" className="text-white hover:text-blue-200 transition-colors font-medium">听力</Link>
            <Link to="/speaking" className="text-white hover:text-blue-200 transition-colors font-medium">口语</Link>
            <Link to="/community" className="text-white hover:text-blue-200 transition-colors font-medium">社区</Link>
            <Link to="/achievements" className="text-white hover:text-blue-200 transition-colors font-medium">成就</Link>
            <Link to="/dashboard" className="text-white hover:text-blue-200 transition-colors font-medium">仪表盘</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <span className="text-xl">{currentLang?.flag}</span>
                <span className="font-medium">{currentLang?.name}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code)
                        setIsLanguageDropdownOpen(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 transition-colors ${selectedLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                      {selectedLanguage === lang.code && (
                        <svg className="w-5 h-5 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user.user_metadata?.name ? user.user_metadata.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.user_metadata?.name || '用户'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>个人中心</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>退出登录</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white hover:text-blue-200 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 hover:bg-blue-50 transition-colors font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
                >
                  注册
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 rounded-lg hover:bg-white/10"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-indigo-700 to-purple-700 border-t border-white/20">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg font-medium"
            >
              首页
            </Link>
            <Link
              to="/courses"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg font-medium"
            >
              课程
            </Link>
            <Link
              to="/vocabulary"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg font-medium"
            >
              词汇
            </Link>
            <Link
              to="/grammar"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg font-medium"
            >
              语法
            </Link>
            <Link
              to="/listening"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg font-medium"
            >
              听力
            </Link>
            <Link
              to="/speaking"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg font-medium"
            >
              口语
            </Link>
            <Link
              to="/community"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg font-medium"
            >
              社区
            </Link>
            <Link
              to="/achievements"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg font-medium"
            >
              成就
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg font-medium"
            >
              仪表盘
            </Link>
          </div>
          <div className="px-4 py-4 border-t border-white/20">
            <div className="mb-4">
              <p className="text-white/80 text-sm mb-2 px-4">选择语言</p>
              <div className="grid grid-cols-4 gap-2 px-4">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${selectedLanguage === lang.code ? 'bg-white text-indigo-600' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    <span className="text-2xl mb-1">{lang.flag}</span>
                    <span className="text-xs font-medium">{lang.name.slice(0, 2)}</span>
                  </button>
                ))}
              </div>
            </div>
            {user ? (
              <div className="px-4 space-y-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {user.user_metadata?.name ? user.user_metadata.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.user_metadata?.name || '用户'}</p>
                    <p className="text-white/70 text-sm">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  退出登录
                </button>
              </div>
            ) : (
              <div className="px-4 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-white hover:bg-blue-50 text-indigo-600 font-medium py-3 px-4 rounded-lg text-center transition-colors"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
