import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useVocabularyProgress } from '../hooks'
import { QUALITY } from '../utils/spacedRepetition'

function Vocabulary() {
  const { getWordsToReview, updateWordProgress } = useVocabularyProgress()
  const navigate = useNavigate()
  
  const [words, setWords] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const reviewWords = getWordsToReview()
    if (reviewWords.length === 0) {
      setIsCompleted(true)
    } else {
      setWords(reviewWords)
    }
  }, [])

  const playAudio = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'en-US'
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }
  }

  const handleCardClick = () => {
    setIsFlipped(!isFlipped)
  }

  const handleUserResponse = (quality) => {
    if (words.length === 0) return
    
    const currentWord = words[currentIndex]
    updateWordProgress(currentWord.id, quality)
    
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setIsFlipped(false)
    } else {
      setIsCompleted(true)
    }
  }

  const currentWord = words[currentIndex]
  const progressPercentage = words.length > 0 ? ((currentIndex) / words.length) * 100 : 0

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-6xl">🎉</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">太棒了！</h1>
            <p className="text-xl text-gray-600 mb-8">你已经完成了今天的单词学习任务</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/vocabulary/list"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                查看单词库
              </Link>
              <Link
                to="/vocabulary/quiz"
                className="px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 rounded-full font-semibold text-lg hover:bg-indigo-50 transition-all"
              >
                开始测试
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-6xl">📚</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">没有需要复习的单词</h1>
            <p className="text-xl text-gray-600 mb-8">你已经掌握了所有单词！</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/vocabulary/list"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                查看单词库
              </Link>
              <Link
                to="/"
                className="px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 rounded-full font-semibold text-lg hover:bg-indigo-50 transition-all"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-700">
              进度: {currentIndex + 1} / {words.length}
            </span>
            <div className="flex gap-2">
              <Link
                to="/vocabulary/list"
                className="px-4 py-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
              >
                单词库
              </Link>
              <Link
                to="/vocabulary/quiz"
                className="px-4 py-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
              >
                测试
              </Link>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div
            className="w-full max-w-md h-80 perspective-1000 cursor-pointer"
            onClick={handleCardClick}
          >
            <div
              className={`relative w-full h-full transition-transform duration-600 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
            >
              <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-8">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    playAudio(currentWord.word)
                  }}
                  className="absolute top-4 right-4 w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">{currentWord.word}</h2>
                {currentWord.pronunciation && (
                  <p className="text-xl text-gray-500">{currentWord.pronunciation}</p>
                )}
                <p className="text-sm text-gray-400 mt-8">点击卡片查看释义</p>
              </div>

              <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 text-white rotate-y-180">
                <h3 className="text-2xl font-bold mb-4">{currentWord.meaning}</h3>
                {currentWord.exampleSentence && (
                  <p className="text-lg text-blue-100 text-center italic">
                    "{currentWord.exampleSentence}"
                  </p>
                )}
                <p className="text-sm text-blue-200 mt-8">点击卡片返回</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => handleUserResponse(QUALITY.AGAIN)}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors shadow-lg transform hover:scale-105"
          >
            不认识
          </button>
          <button
            onClick={() => handleUserResponse(QUALITY.HARD)}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold transition-colors shadow-lg transform hover:scale-105"
          >
            有点印象
          </button>
          <button
            onClick={() => handleUserResponse(QUALITY.GOOD)}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors shadow-lg transform hover:scale-105"
          >
            认识
          </button>
          <button
            onClick={() => handleUserResponse(QUALITY.EASY)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors shadow-lg transform hover:scale-105"
          >
            非常熟悉
          </button>
        </div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}

export default Vocabulary
