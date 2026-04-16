import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useVocabularyProgress } from '../hooks'

function VocabularyQuiz() {
  const { getAllWordsWithProgress } = useVocabularyProgress()
  
  const [quizWords, setQuizWords] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [quizType, setQuizType] = useState('multiple')
  const [options, setOptions] = useState([])
  const [userAnswer, setUserAnswer] = useState('')
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)

  const generateQuiz = () => {
    const allWords = getAllWordsWithProgress()
    if (allWords.length === 0) return []
    
    const shuffled = [...allWords].sort(() => Math.random() - 0.5)
    const quizCount = Math.min(10, shuffled.length)
    return shuffled.slice(0, quizCount)
  }

  const generateOptions = (correctWord) => {
    const allWords = getAllWordsWithProgress()
    const otherWords = allWords.filter(w => w.id !== correctWord.id)
    const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5)
    const selectedOthers = shuffledOthers.slice(0, 3)
    const allOptions = [correctWord, ...selectedOthers]
    return allOptions.sort(() => Math.random() - 0.5)
  }

  const startQuiz = () => {
    const words = generateQuiz()
    if (words.length > 0) {
      setQuizWords(words)
      setQuizType(Math.random() > 0.5 ? 'multiple' : 'spelling')
      setOptions(generateOptions(words[0]))
      setQuizStarted(true)
    }
  }

  const handleMultipleChoice = (selectedOption) => {
    if (isAnswered) return
    
    setUserAnswer(selectedOption.meaning)
    const correct = selectedOption.id === quizWords[currentIndex].id
    setIsCorrect(correct)
    setIsAnswered(true)
    
    if (correct) {
      setScore(prev => prev + 1)
    }
  }

  const handleSpellingSubmit = (e) => {
    e.preventDefault()
    if (isAnswered) return
    
    const correct = userAnswer.toLowerCase().trim() === quizWords[currentIndex].word.toLowerCase()
    setIsCorrect(correct)
    setIsAnswered(true)
    
    if (correct) {
      setScore(prev => prev + 1)
    }
  }

  const nextQuestion = () => {
    if (currentIndex < quizWords.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setQuizType(Math.random() > 0.5 ? 'multiple' : 'spelling')
      setOptions(generateOptions(quizWords[nextIndex]))
      setUserAnswer('')
      setIsAnswered(false)
      setIsCorrect(null)
    } else {
      setIsCompleted(true)
    }
  }

  const restartQuiz = () => {
    setCurrentIndex(0)
    setScore(0)
    setUserAnswer('')
    setIsAnswered(false)
    setIsCorrect(null)
    setIsCompleted(false)
    setQuizStarted(false)
    const words = generateQuiz()
    if (words.length > 0) {
      setQuizWords(words)
      setOptions(generateOptions(words[0]))
    }
  }

  const currentWord = quizWords[currentIndex]
  const progressPercentage = quizStarted ? ((currentIndex + 1) / quizWords.length) * 100 : 0

  if (!quizStarted) {
    const allWords = getAllWordsWithProgress()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-6xl">🎯</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">单词测试</h1>
            <p className="text-xl text-gray-600 mb-2">测试你对单词的掌握程度</p>
            <p className="text-lg text-gray-500 mb-8">本次测试共有 {Math.min(10, allWords.length)} 道题目</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startQuiz}
                disabled={allWords.length === 0}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                开始测试
              </button>
              <Link
                to="/vocabulary"
                className="px-8 py-4 bg-white border-2 border-purple-600 text-purple-600 rounded-full font-semibold text-lg hover:bg-purple-50 transition-all"
              >
                返回学习
              </Link>
            </div>
            
            {allWords.length === 0 && (
              <p className="mt-4 text-red-500">暂无单词可测试，请先添加单词</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    const percentage = Math.round((score / quizWords.length) * 100)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 ${percentage >= 80 ? 'bg-gradient-to-br from-green-400 to-emerald-500' : percentage >= 60 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-red-400 to-pink-500'}`}>
              <span className="text-6xl">
                {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">测试完成！</h1>
            <div className="mb-8">
              <p className="text-6xl font-bold text-indigo-600 mb-2">{score}/{quizWords.length}</p>
              <p className="text-2xl text-gray-600">{percentage}% 正确</p>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              {percentage >= 80 ? '太棒了！你对单词掌握得很好！' : percentage >= 60 ? '不错！继续加油！' : '还需要多练习哦！'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={restartQuiz}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
              >
                重新测试
              </button>
              <Link
                to="/vocabulary"
                className="px-8 py-4 bg-white border-2 border-purple-600 text-purple-600 rounded-full font-semibold text-lg hover:bg-purple-50 transition-all"
              >
                继续学习
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
              题目: {currentIndex + 1} / {quizWords.length}
            </span>
            <span className="text-lg font-semibold text-indigo-600">
              得分: {score}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          {quizType === 'multiple' ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                选择 "{currentWord.word}" 的正确释义
              </h2>
              <div className="grid gap-4">
                {options.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => handleMultipleChoice(option)}
                    disabled={isAnswered}
                    className={`p-6 rounded-xl text-left font-medium transition-all ${
                      isAnswered
                        ? option.id === currentWord.id
                          ? 'bg-green-100 border-2 border-green-500 text-green-800'
                          : userAnswer === option.meaning
                          ? 'bg-red-100 border-2 border-red-500 text-red-800'
                          : 'bg-gray-50 border-2 border-gray-200 text-gray-500'
                        : 'bg-gray-50 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-500 text-gray-700'
                    }`}
                  >
                    <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                    {option.meaning}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                拼写这个单词
              </h2>
              <p className="text-xl text-gray-600 mb-8 text-center">
                "{currentWord.meaning}"
              </p>
              <form onSubmit={handleSpellingSubmit} className="max-w-md mx-auto">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={isAnswered}
                  placeholder="输入单词..."
                  className={`w-full px-6 py-4 text-xl rounded-xl border-2 text-center ${
                    isAnswered
                      ? isCorrect
                        ? 'bg-green-50 border-green-500 text-green-800'
                        : 'bg-red-50 border-red-500 text-red-800'
                      : 'bg-white border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                  }`}
                />
                {!isAnswered && (
                  <button
                    type="submit"
                    className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    提交
                  </button>
                )}
              </form>
              {isAnswered && !isCorrect && (
                <p className="mt-4 text-center text-lg text-gray-600">
                  正确答案: <span className="font-bold text-green-600">{currentWord.word}</span>
                </p>
              )}
            </div>
          )}

          {isAnswered && (
            <div className="mt-8 text-center">
              <button
                onClick={nextQuestion}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                {currentIndex < quizWords.length - 1 ? '下一题' : '查看结果'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VocabularyQuiz
