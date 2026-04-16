import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

function Profile() {
  const { user, signOut } = useAuth()
  const { languages, selectedLanguage, setSelectedLanguage } = useLanguage()
  const [activeTab, setActiveTab] = useState('profile')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  const handleSaveProfile = (e) => {
    e.preventDefault()
    alert('个人信息已保存！')
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('两次输入的新密码不一致')
      return
    }
    alert('密码修改成功！')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">请先登录</h1>
          <Link to="/login" className="text-blue-600 hover:underline">
            前往登录页面
          </Link>
        </div>
      </div>
    )
  }

  const currentLang = languages.find(l => l.code === selectedLanguage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">个人中心</h1>
          <p className="text-gray-600 mt-2">管理你的个人信息和学习设置</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-4xl">
                  {user.user_metadata?.name ? user.user_metadata.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{user.user_metadata?.name || '用户'}</h2>
                <p className="text-blue-200">{user.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xl">{currentLang?.flag}</span>
                  <span className="text-blue-200">正在学习 {currentLang?.name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-8 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'profile'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                个人信息
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-8 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'settings'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                学习设置
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`px-8 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'password'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                密码设置
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">昵称</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入昵称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">个人简介</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="介绍一下你自己..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  保存修改
                </button>
              </form>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">学习语言</label>
                  <div className="grid grid-cols-3 gap-4">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang.code)}
                        className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all ${
                          selectedLanguage === lang.code
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-4xl mb-2">{lang.flag}</span>
                        <span className="font-medium text-gray-900">{lang.name}</span>
                        {selectedLanguage === lang.code && (
                          <span className="text-xs text-blue-600 mt-1">当前选择</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">学习偏好</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">每日学习提醒</p>
                        <p className="text-sm text-gray-500">每天固定时间提醒学习</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">自动播放音频</p>
                        <p className="text-sm text-gray-500">打开单词页面时自动播放发音</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">学习记录公开</p>
                        <p className="text-sm text-gray-500">允许其他用户查看你的学习进度</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入当前密码"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入新密码"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请再次输入新密码"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  修改密码
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={signOut}
            className="inline-flex items-center px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            退出登录
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
