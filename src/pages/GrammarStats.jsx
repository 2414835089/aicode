import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGrammarProgress } from '../hooks'

function GrammarStats() {
  const { getStats, getMistakes, removeMistake, clearMistakes } = useGrammarProgress()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const stats = getStats()
  const mistakes = getMistakes()

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Link
            to="/grammar"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回练习
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <span className="text-4xl mr-3">📊</span>
            语法练习统计
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-gray-600 text-sm mb-1">总题目数</p>
              <p className="text-3xl font-bold text-indigo-600">{stats.totalExercises}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-gray-600 text-sm mb-1">已掌握</p>
              <p className="text-3xl font-bold text-green-600">{stats.masteredCount}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-gray-600 text-sm mb-1">正确率</p>
              <p className="text-3xl font-bold text-purple-600">{stats.accuracy}%</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
              <div className="text-4xl mb-3">❌</div>
              <p className="text-gray-600 text-sm mb-1">错题数</p>
              <p className="text-3xl font-bold text-orange-600">{stats.mistakeCount}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="text-2xl mr-2">📈</span>
                练习详情
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4">
                <p className="text-gray-600 text-sm">总练习次数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAttempts}</p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <p className="text-gray-600 text-sm">正确次数</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalCorrect}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="text-2xl mr-2">📚</span>
                错题回顾
              </h2>
              {mistakes.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  清空错题
                </button>
              )}
            </div>

            {mistakes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-xl text-gray-600">太棒了！没有错题记录</p>
                <p className="text-gray-500 mt-2">继续保持！</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mistakes.map((mistake) => (
                  <div key={mistake.id} className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="inline-block px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium mb-2">
                          {mistake.exercise.type === 'multiple_choice' ? '单选题' :
                           mistake.exercise.type === 'multiple_select' ? '多选题' :
                           mistake.exercise.type === 'word_fill' ? '单词填空' :
                           mistake.exercise.type === 'sentence_fill' ? '句子填空' :
                           mistake.exercise.type === 'true_false' ? '判断题' :
                           '排序题'}
                        </span>
                        <p className="text-sm text-gray-500">{formatDate(mistake.attemptedAt)}</p>
                      </div>
                      <button
                        onClick={() => removeMistake(mistake.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {mistake.exercise.question}
                    </h3>

                    {mistake.exercise.type === 'multiple_choice' && mistake.exercise.options && (
                      <div className="mb-4">
                        <div className="grid gap-2">
                          {mistake.exercise.options.map((option, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg ${
                                idx === mistake.exercise.correctAnswer
                                  ? 'bg-green-100 border-2 border-green-400 text-green-800'
                                  : idx === mistake.userAnswer
                                  ? 'bg-red-100 border-2 border-red-400 text-red-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              <span className="mr-2 font-bold">{String.fromCharCode(65 + idx)}.</span>
                              {option}
                              {idx === mistake.exercise.correctAnswer && <span className="ml-2">✓ 正确答案</span>}
                              {idx === mistake.userAnswer && idx !== mistake.exercise.correctAnswer && (
                                <span className="ml-2">✗ 你的答案</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {mistake.exercise.explanation && (
                      <div className="bg-white rounded-xl p-4">
                        <p className="text-gray-700 font-medium mb-1">解析：</p>
                        <p className="text-gray-600">{mistake.exercise.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">确认清空错题？</h3>
              <p className="text-gray-600 mb-6">此操作将清空所有错题记录，不可恢复。</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    clearMistakes()
                    setShowClearConfirm(false)
                  }}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  确认清空
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GrammarStats
