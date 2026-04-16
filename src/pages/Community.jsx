import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

function Community() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('posts')
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')

  const languages = [
    { code: 'all', name: '全部' },
    { code: 'english', name: '英语', flag: '🇺🇸' },
    { code: 'japanese', name: '日语', flag: '🇯🇵' },
    { code: 'korean', name: '韩语', flag: '🇰🇷' },
  ]

  const posts = [
    {
      id: 1,
      author: '小明',
      avatar: '明',
      title: '分享一个高效背单词的方法！',
      content: '大家好！我最近用了闪卡法背单词，效果特别好。每天花15分钟复习旧单词，学习新单词。坚持一个月已经背了500多个单词了！',
      language: 'english',
      languageFlag: '🇺🇸',
      likes: 42,
      comments: 18,
      createdAt: '2小时前',
      liked: false,
    },
    {
      id: 2,
      author: '樱花',
      avatar: '樱',
      title: '日语N2备考经验分享',
      content: '上个月刚通过N2考试，分享一下我的备考经验。听力每天坚持听NHK新闻，语法用红蓝宝书，阅读多做真题。',
      language: 'japanese',
      languageFlag: '🇯🇵',
      likes: 89,
      comments: 35,
      createdAt: '1天前',
      liked: true,
    },
    {
      id: 3,
      author: '韩流爱好者',
      avatar: '韩',
      title: '求推荐韩语韩剧！',
      content: '最近在学韩语，想通过看韩剧提升听力和口语。大家有什么好看的韩剧推荐吗？最好是日常对话比较多的。',
      language: 'korean',
      languageFlag: '🇰🇷',
      likes: 28,
      comments: 45,
      createdAt: '3天前',
      liked: false,
    },
    {
      id: 4,
      author: '语法达人',
      avatar: '语',
      title: '英语时态总结笔记',
      content: '整理了一份英语16种时态的总结笔记，包含用法和例句。希望对大家有帮助！',
      language: 'english',
      languageFlag: '🇺🇸',
      likes: 156,
      comments: 23,
      createdAt: '1周前',
      liked: true,
    },
  ]

  const [postsState, setPostsState] = useState(posts)

  const handleLike = (postId) => {
    setPostsState(postsState.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        }
      }
      return post
    }))
  }

  const handleSubmitPost = (e) => {
    e.preventDefault()
    if (newPostTitle && newPostContent) {
      alert('发布成功！')
      setNewPostTitle('')
      setNewPostContent('')
    }
  }

  const filteredPosts = selectedLanguage === 'all' 
    ? postsState 
    : postsState.filter(post => post.language === selectedLanguage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">学习社区</h1>
          <p className="text-gray-600 mt-2">与其他学习者交流，分享学习心得！</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">发布新话题</h2>
          <form onSubmit={handleSubmitPost}>
            <input
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="标题"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="分享你的学习心得..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="flex items-center justify-between">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag && `${lang.flag} `}{lang.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={!newPostTitle || !newPostContent}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                发布
              </button>
            </div>
          </form>
        </div>

        <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedLanguage === lang.code
                  ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {lang.flag && `${lang.flag} `}{lang.name}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {post.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{post.author}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{post.languageFlag} {post.language === 'english' ? '英语' : post.language === 'japanese' ? '日语' : '韩语'}</span>
                      <span>•</span>
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
              <p className="text-gray-700 mb-4">{post.content}</p>

              <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 transition-colors ${
                    post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <svg className="w-5 h-5" fill={post.liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="font-medium">{post.likes}</span>
                </button>

                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="font-medium">{post.comments}</span>
                </button>

                <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors ml-auto">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="font-medium">分享</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg text-gray-500">暂无相关话题</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Community
