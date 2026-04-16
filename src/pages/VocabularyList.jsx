import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useVocabularyProgress } from '../hooks'

function VocabularyList() {
  const { getAllWordsWithProgress } = useVocabularyProgress()
  
  const [words, setWords] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadWords()
  }, [])

  const loadWords = () => {
    setIsLoading(true)
    const allWords = getAllWordsWithProgress()
    setWords(allWords)
    setIsLoading(false)
  }

  const filteredWords = words.filter(word => {
    const matchesSearch = 
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'mastered' && word.progress?.status === 'mastered') ||
      (filter === 'reviewing' && word.progress?.status === 'reviewing') ||
      (filter === 'new' && (!word.progress || word.progress?.status === 'new'))
    
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'mastered':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            已掌握
          </span>
        )
      case 'reviewing':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            复习中
          </span>
        )
      default:
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            新单词
          </span>
        )
    }
  }

  const getStats = () => {
    const mastered = words.filter(w => w.progress?.status === 'mastered').length
    const reviewing = words.filter(w => w.progress?.status === 'reviewing').length
    const newWords = words.filter(w => !w.progress || w.progress?.status === 'new').length
    return { mastered, reviewing, newWords }
  }

  const stats = getStats()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">单词库</h1>
              <p className="text-gray-600">管理和查看所有单词</p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/vocabulary"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                开始学习
              </Link>
              <Link
                to="/vocabulary/quiz"
                className="px-6 py-2 bg-white border-2 border-indigo-600 text-indigo-600 rounded-full font-medium hover:bg-indigo-50 transition-all"
              >
                开始测试
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">已掌握</p>
                  <p className="text-3xl font-bold text-green-600">{stats.mastered}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">复习中</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.reviewing}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">新单词</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.newWords}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="搜索单词或释义..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'new', 'reviewing', 'mastered'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      filter === f
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {f === 'all' ? '全部' : f === 'new' ? '新单词' : f === 'reviewing' ? '复习中' : '已掌握'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {filteredWords.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📖</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? '未找到匹配的单词' : '暂无单词'}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? '尝试使用其他关键词搜索' : '单词库中还没有单词'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWords.map((word) => (
              <div
                key={word.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{word.word}</h3>
                      {word.pronunciation && (
                        <p className="text-gray-500">{word.pronunciation}</p>
                      )}
                    </div>
                    {getStatusBadge(word.progress?.status)}
                  </div>
                  
                  <p className="text-lg text-gray-700 mb-3">{word.meaning}</p>
                  
                  {word.exampleSentence && (
                    <p className="text-sm text-gray-500 italic border-l-4 border-indigo-300 pl-3">
                      "{word.exampleSentence}"
                    </p>
                  )}
                  
                  {word.progress && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>复习间隔: {word.progress.interval} 天</span>
                        <span>重复次数: {word.progress.repetitions}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default VocabularyList
