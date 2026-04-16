import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

function Achievements() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('badges')

  const achievements = [
    {
      id: 1,
      name: '初学者',
      description: '完成第一个课时',
      icon: '🏆',
      unlocked: true,
      unlockedAt: '2024-01-15',
      rarity: '普通'
    },
    {
      id: 2,
      name: '学习达人',
      description: '完成10个课时',
      icon: '🌟',
      unlocked: true,
      unlockedAt: '2024-01-20',
      rarity: '稀有'
    },
    {
      id: 3,
      name: '连续7天',
      description: '连续学习7天',
      icon: '🔥',
      unlocked: true,
      unlockedAt: '2024-01-25',
      rarity: '稀有'
    },
    {
      id: 4,
      name: '词汇大师',
      description: '学习100个单词',
      icon: '📚',
      unlocked: false,
      progress: 45,
      rarity: '史诗'
    },
    {
      id: 5,
      name: '语法达人',
      description: '完成50道语法题',
      icon: '✍️',
      unlocked: false,
      progress: 20,
      rarity: '史诗'
    },
    {
      id: 6,
      name: '语言大师',
      description: '完成一门语言的所有课程',
      icon: '👑',
      unlocked: false,
      progress: 10,
      rarity: '传说'
    },
    {
      id: 7,
      name: '听力高手',
      description: '完成20个听力练习',
      icon: '🎧',
      unlocked: false,
      progress: 5,
      rarity: '稀有'
    },
    {
      id: 8,
      name: '口语新星',
      description: '完成10个口语练习',
      icon: '🎤',
      unlocked: false,
      progress: 3,
      rarity: '稀有'
    },
  ]

  const leaderboard = [
    { rank: 1, name: '小明', avatar: '明', score: 2580, courses: 12, streak: 30 },
    { rank: 2, name: '小红', avatar: '红', score: 2350, courses: 10, streak: 25 },
    { rank: 3, name: '小华', avatar: '华', score: 2100, courses: 9, streak: 20 },
    { rank: 4, name: user?.user_metadata?.name || '你', avatar: user?.user_metadata?.name?.charAt(0) || '用', score: 1200, courses: 5, streak: 7, isCurrentUser: true },
    { rank: 5, name: '小李', avatar: '李', score: 1100, courses: 4, streak: 15 },
  ]

  const rarityColors = {
    '普通': 'bg-gray-100 text-gray-700 border-gray-300',
    '稀有': 'bg-blue-100 text-blue-700 border-blue-300',
    '史诗': 'bg-purple-100 text-purple-700 border-purple-300',
    '传说': 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-300'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">成就系统</h1>
          <p className="text-gray-600 mt-2">收集徽章，攀登排行榜！</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('badges')}
              className={`flex-1 px-8 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'badges'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              我的徽章
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 px-8 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'leaderboard'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              排行榜
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'badges' && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-gray-900">{achievements.filter(a => a.unlocked).length}</p>
                    <p className="text-sm text-gray-600">已解锁</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-blue-700">{achievements.length}</p>
                    <p className="text-sm text-blue-600">总徽章</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-yellow-700">7</p>
                    <p className="text-sm text-yellow-600">连续天数</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-orange-700">#4</p>
                    <p className="text-sm text-orange-600">当前排名</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`rounded-2xl border-2 p-6 transition-all ${
                        achievement.unlocked
                          ? `${rarityColors[achievement.rarity]} border-opacity-100`
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl ${
                          achievement.unlocked ? 'bg-white shadow-md' : 'bg-gray-200'
                        }`}>
                          {achievement.icon}
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          achievement.rarity === '传说' 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                            : rarityColors[achievement.rarity]
                        }`}>
                          {achievement.rarity}
                        </span>
                      </div>

                      <h3 className={`text-lg font-bold mb-2 ${
                        achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </h3>

                      <p className={`text-sm mb-4 ${
                        achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>

                      {achievement.unlocked ? (
                        <div className="flex items-center text-green-600 text-sm font-medium">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          已解锁 {achievement.unlockedAt}
                        </div>
                      ) : (
                        <div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full"
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500">{achievement.progress}% 完成</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div>
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">排行榜说明</h3>
                  <p className="text-gray-700">根据学习积分、完成课程数和连续学习天数综合排名。每周更新一次！</p>
                </div>

                <div className="space-y-4">
                  {leaderboard.map((userData) => (
                    <div
                      key={userData.rank}
                      className={`flex items-center p-4 rounded-xl transition-all ${
                        userData.isCurrentUser
                          ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4 ${
                        userData.rank === 1
                          ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white'
                          : userData.rank === 2
                          ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                          : userData.rank === 3
                          ? 'bg-gradient-to-br from-orange-400 to-amber-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {userData.rank <= 3 ? ['🥇', '🥈', '🥉'][userData.rank - 1] : userData.rank}
                      </div>

                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                        {userData.avatar}
                      </div>

                      <div className="flex-1">
                        <h4 className={`font-bold ${userData.isCurrentUser ? 'text-orange-700' : 'text-gray-900'}`}>
                          {userData.name}
                          {userData.isCurrentUser && <span className="ml-2 text-orange-600 text-sm font-normal">(你)</span>}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>📚 {userData.courses} 课程</span>
                          <span>🔥 {userData.streak} 天</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{userData.score}</p>
                        <p className="text-xs text-gray-500">积分</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Achievements
