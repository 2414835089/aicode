import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGrammarProgress } from '../hooks'

function Grammar() {
  const { getAllExercisesWithProgress, recordAttempt } = useGrammarProgress()
  
  const [exercises, setExercises] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [userAnswer, setUserAnswer] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState([])
  const [fillAnswer, setFillAnswer] = useState('')
  const [orderedWords, setOrderedWords] = useState([])
  const [availableWords, setAvailableWords] = useState([])

  useEffect(() => {
    const data = getAllExercisesWithProgress()
    setExercises(data)
  }, [])

  const startQuiz = () => {
    if (exercises.length > 0) {
      setQuizStarted(true)
      resetCurrentExercise()
    }
  }

  const resetCurrentExercise = () => {
    setUserAnswer(null)
    setIsAnswered(false)
    setIsCorrect(null)
    setSelectedOptions([])
    setFillAnswer('')
    
    const currentExercise = exercises[currentIndex]
    if (currentExercise?.type === 'sentence_order') {
      const shuffled = [...currentExercise.options].sort(() => Math.random() - 0.5)
      setAvailableWords(shuffled.map((word, idx) => ({ id: idx, word })))
      setOrderedWords([])
    }
  }

  const checkAnswer = () => {
    const currentExercise = exercises[currentIndex]
    let correct = false
    let answerToRecord = userAnswer

    switch (currentExercise.type) {
      case 'multiple_choice':
        correct = userAnswer === currentExercise.correctAnswer
        answerToRecord = userAnswer
        break
      case 'multiple_select':
        correct = selectedOptions.length === currentExercise.correctAnswer.length &&
                  selectedOptions.every(opt => currentExercise.correctAnswer.includes(opt))
        answerToRecord = selectedOptions
        break
      case 'word_fill':
      case 'sentence_fill':
        correct = fillAnswer.toLowerCase().trim() === currentExercise.correctAnswer.toLowerCase().trim()
        answerToRecord = fillAnswer
        break
      case 'true_false':
        correct = userAnswer === currentExercise.correctAnswer
        answerToRecord = userAnswer
        break
      case 'sentence_order':
        const userOrder = orderedWords.map(w => currentExercise.options.indexOf(w.word))
        correct = JSON.stringify(userOrder) === JSON.stringify(currentExercise.correctAnswer)
        answerToRecord = userOrder
        break
    }

    setIsCorrect(correct)
    setIsAnswered(true)
    
    if (correct) {
      setScore(prev => prev + 1)
    }

    recordAttempt(currentExercise.id, correct, answerToRecord)
  }

  const nextQuestion = () => {
    if (currentIndex < exercises.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      resetCurrentExercise()
    } else {
      setIsCompleted(true)
    }
  }

  const restartQuiz = () => {
    setCurrentIndex(0)
    setScore(0)
    setIsCompleted(false)
    setQuizStarted(false)
    resetCurrentExercise()
  }

  const handleMultipleChoice = (optionIndex) => {
    if (isAnswered) return
    setUserAnswer(optionIndex)
  }

  const handleMultipleSelect = (optionIndex) => {
    if (isAnswered) return
    setSelectedOptions(prev => 
      prev.includes(optionIndex)
        ? prev.filter(i => i !== optionIndex)
        : [...prev, optionIndex]
    )
  }

  const handleTrueFalse = (value) => {
    if (isAnswered) return
    setUserAnswer(value)
  }

  const handleFillSubmit = (e) => {
    e.preventDefault()
    if (isAnswered || !fillAnswer.trim()) return
    checkAnswer()
  }

  const addToOrdered = (wordObj) => {
    if (isAnswered) return
    setOrderedWords(prev => [...prev, wordObj])
    setAvailableWords(prev => prev.filter(w => w.id !== wordObj.id))
  }

  const removeFromOrdered = (wordObj) => {
    if (isAnswered) return
    setAvailableWords(prev => [...prev, wordObj])
    setOrderedWords(prev => prev.filter(w => w.id !== wordObj.id))
  }

  const currentExercise = exercises[currentIndex]
  const progressPercentage = quizStarted ? ((currentIndex + 1) / exercises.length) * 100 : 0

  const renderQuestion = () => {
    if (!currentExercise) return null

    switch (currentExercise.type) {
      case 'multiple_choice':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {currentExercise.question}
            </h2>
            <div className="grid gap-4">
              {currentExercise.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleMultipleChoice(index)}
                  disabled={isAnswered}
                  className={`p-6 rounded-xl text-left font-medium transition-all ${
                    isAnswered
                      ? index === currentExercise.correctAnswer
                        ? 'bg-green-100 border-2 border-green-500 text-green-800'
                        : userAnswer === index
                        ? 'bg-red-100 border-2 border-red-500 text-red-800'
                        : 'bg-gray-50 border-2 border-gray-200 text-gray-500'
                      : userAnswer === index
                      ? 'bg-purple-100 border-2 border-purple-500 text-purple-800'
                      : 'bg-gray-50 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-500 text-gray-700'
                  }`}
                >
                  <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 'multiple_select':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {currentExercise.question}
            </h2>
            <p className="text-gray-600 mb-8 text-center">（可多选）</p>
            <div className="grid gap-4">
              {currentExercise.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleMultipleSelect(index)}
                  disabled={isAnswered}
                  className={`p-6 rounded-xl text-left font-medium transition-all ${
                    isAnswered
                      ? currentExercise.correctAnswer.includes(index)
                        ? 'bg-green-100 border-2 border-green-500 text-green-800'
                        : selectedOptions.includes(index)
                        ? 'bg-red-100 border-2 border-red-500 text-red-800'
                        : 'bg-gray-50 border-2 border-gray-200 text-gray-500'
                      : selectedOptions.includes(index)
                      ? 'bg-purple-100 border-2 border-purple-500 text-purple-800'
                      : 'bg-gray-50 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-500 text-gray-700'
                  }`}
                >
                  <span className="mr-3">
                    {isAnswered 
                      ? currentExercise.correctAnswer.includes(index) ? '✓' : selectedOptions.includes(index) ? '✗' : ''
                      : selectedOptions.includes(index) ? '◉' : '○'
                    }
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 'word_fill':
      case 'sentence_fill':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {currentExercise.question}
            </h2>
            <form onSubmit={handleFillSubmit} className="max-w-md mx-auto">
              <input
                type="text"
                value={fillAnswer}
                onChange={(e) => setFillAnswer(e.target.value)}
                disabled={isAnswered}
                placeholder="输入答案..."
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
                正确答案: <span className="font-bold text-green-600">{currentExercise.correctAnswer}</span>
              </p>
            )}
          </div>
        )

      case 'true_false':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {currentExercise.question}
            </h2>
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              <button
                onClick={() => handleTrueFalse(true)}
                disabled={isAnswered}
                className={`p-8 rounded-xl font-bold text-xl transition-all ${
                  isAnswered
                    ? currentExercise.correctAnswer === true
                      ? 'bg-green-100 border-2 border-green-500 text-green-800'
                      : userAnswer === true
                      ? 'bg-red-100 border-2 border-red-500 text-red-800'
                      : 'bg-gray-50 border-2 border-gray-200 text-gray-500'
                    : userAnswer === true
                    ? 'bg-purple-100 border-2 border-purple-500 text-purple-800'
                    : 'bg-gray-50 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-500 text-gray-700'
                }`}
              >
                ✓ 正确
              </button>
              <button
                onClick={() => handleTrueFalse(false)}
                disabled={isAnswered}
                className={`p-8 rounded-xl font-bold text-xl transition-all ${
                  isAnswered
                    ? currentExercise.correctAnswer === false
                      ? 'bg-green-100 border-2 border-green-500 text-green-800'
                      : userAnswer === false
                      ? 'bg-red-100 border-2 border-red-500 text-red-800'
                      : 'bg-gray-50 border-2 border-gray-200 text-gray-500'
                    : userAnswer === false
                    ? 'bg-purple-100 border-2 border-purple-500 text-purple-800'
                    : 'bg-gray-50 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-500 text-gray-700'
                }`}
              >
                ✗ 错误
              </button>
            </div>
          </div>
        )

      case 'sentence_order':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              {currentExercise.question}
            </h2>
            <p className="text-gray-600 mb-8 text-center">点击词语来排序</p>
            
            <div className="min-h-24 bg-gray-50 rounded-xl p-4 mb-6 border-2 border-dashed border-gray-300">
              <div className="flex flex-wrap gap-2 justify-center">
                {orderedWords.map((wordObj) => (
                  <button
                    key={wordObj.id}
                    onClick={() => removeFromOrdered(wordObj)}
                    disabled={isAnswered}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      isAnswered
                        ? 'bg-purple-200 text-purple-800'
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    {wordObj.word}
                  </button>
                ))}
                {orderedWords.length === 0 && !isAnswered && (
                  <span className="text-gray-400">点击下方词语添加到这里</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {availableWords.map((wordObj) => (
                <button
                  key={wordObj.id}
                  onClick={() => addToOrdered(wordObj)}
                  disabled={isAnswered}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isAnswered
                      ? 'bg-gray-200 text-gray-500'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-purple-500 hover:bg-purple-50'
                  }`}
                >
                  {wordObj.word}
                </button>
              ))}
            </div>

            {isAnswered && !isCorrect && (
              <p className="mt-4 text-center text-lg text-gray-600">
                正确答案: <span className="font-bold text-green-600">
                  {currentExercise.correctAnswer.map(idx => currentExercise.options[idx]).join(' ')}
                </span>
              </p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-6xl">📝</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">语法练习</h1>
            <p className="text-xl text-gray-600 mb-2">测试和巩固你的语法知识</p>
            <p className="text-lg text-gray-500 mb-8">本次练习共有 {exercises.length} 道题目</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startQuiz}
                disabled={exercises.length === 0}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                开始练习
              </button>
              <Link
                to="/grammar/stats"
                className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all"
              >
                查看统计
              </Link>
            </div>
            
            {exercises.length === 0 && (
              <p className="mt-4 text-red-500">暂无语法练习题</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    const percentage = Math.round((score / exercises.length) * 100)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 ${percentage >= 80 ? 'bg-gradient-to-br from-green-400 to-emerald-500' : percentage >= 60 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-red-400 to-pink-500'}`}>
              <span className="text-6xl">
                {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">练习完成！</h1>
            <div className="mb-8">
              <p className="text-6xl font-bold text-indigo-600 mb-2">{score}/{exercises.length}</p>
              <p className="text-2xl text-gray-600">{percentage}% 正确</p>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              {percentage >= 80 ? '太棒了！你对语法掌握得很好！' : percentage >= 60 ? '不错！继续加油！' : '还需要多练习哦！'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={restartQuiz}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                重新练习
              </button>
              <Link
                to="/grammar/stats"
                className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all"
              >
                查看统计
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
              题目: {currentIndex + 1} / {exercises.length}
            </span>
            <span className="text-lg font-semibold text-indigo-600">
              得分: {score}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          {renderQuestion()}

          {!isAnswered && userAnswer !== null && currentExercise?.type !== 'word_fill' && currentExercise?.type !== 'sentence_fill' && (
            <div className="mt-8 text-center">
              <button
                onClick={checkAnswer}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
              >
                检查答案
              </button>
            </div>
          )}

          {!isAnswered && currentExercise?.type === 'sentence_order' && orderedWords.length === currentExercise?.options.length && (
            <div className="mt-8 text-center">
              <button
                onClick={checkAnswer}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
              >
                检查答案
              </button>
            </div>
          )}

          {isAnswered && (
            <div className="mt-8">
              <div className={`p-6 rounded-xl ${isCorrect ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'}`}>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl mr-3">{isCorrect ? '✅' : '❌'}</span>
                  <span className={`text-2xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? '回答正确！' : '回答错误'}
                  </span>
                </div>
                {currentExercise?.explanation && (
                  <div className="text-center">
                    <p className="text-gray-700 font-medium mb-2">解析：</p>
                    <p className="text-gray-600">{currentExercise.explanation}</p>
                  </div>
                )}
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={nextQuestion}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  {currentIndex < exercises.length - 1 ? '下一题' : '查看结果'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Grammar
