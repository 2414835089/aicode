import { useState, useRef } from 'react'

function Listening() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSubtitles, setShowSubtitles] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [fillAnswer, setFillAnswer] = useState('')
  const [fillAnswerChecked, setFillAnswerChecked] = useState(false)
  const audioRef = useRef(null)

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2]

  const subtitles = [
    { time: 0, text: 'Hello, how are you today?' },
    { time: 5, text: 'I am doing great, thank you!' },
    { time: 10, text: 'Would you like to grab some coffee?' },
    { time: 15, text: 'That sounds wonderful!' },
  ]

  const currentSubtitle = subtitles.find((s, i) => 
    currentTime >= s.time && (!subtitles[i + 1] || currentTime < subtitles[i + 1].time)
  )

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleProgressChange = (e) => {
    setCurrentTime(parseFloat(e.target.value))
  }

  const handleCheckChoice = () => {
    setIsAnswerChecked(true)
  }

  const handleCheckFill = () => {
    setFillAnswerChecked(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">听力训练</h1>
          <p className="text-gray-600 mt-2">提升你的听力理解能力</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">日常对话练习</h2>
                <p className="text-green-200 mt-1">难度：初级</p>
              </div>
              <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                3分钟
              </span>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <button 
                  className="p-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                  </svg>
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                >
                  {isPlaying ? (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <button 
                  className="p-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleProgressChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-gray-600 mr-2">速度：</span>
                {playbackRates.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setPlaybackRate(rate)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      playbackRate === rate
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {showSubtitles && (
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <p className="text-xl text-gray-800">
                  {currentSubtitle?.text || '准备开始...'}
                </p>
              </div>
            )}

            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowSubtitles(!showSubtitles)}
                className="text-green-600 hover:text-green-700 font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {showSubtitles ? '隐藏字幕' : '显示字幕'}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">选择题</h3>
            <p className="text-gray-700 mb-4">根据听到的对话，选择正确的答案：</p>
            
            <p className="font-medium text-gray-900 mb-4">他们打算做什么？</p>
            
            <div className="space-y-3 mb-6">
              {[
                { id: 0, text: '去看电影' },
                { id: 1, text: '去喝咖啡' },
                { id: 2, text: '去购物' },
                { id: 3, text: '去吃饭' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => !isAnswerChecked && setSelectedAnswer(option.id)}
                  disabled={isAnswerChecked}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    isAnswerChecked
                      ? option.id === 1
                        ? 'border-green-500 bg-green-50'
                        : selectedAnswer === option.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200'
                      : selectedAnswer === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 border-2 ${
                      isAnswerChecked
                        ? option.id === 1
                          ? 'bg-green-500 border-green-500'
                          : selectedAnswer === option.id
                          ? 'bg-red-500 border-red-500'
                          : 'border-gray-300'
                        : selectedAnswer === option.id
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {(isAnswerChecked && option.id === 1) || selectedAnswer === option.id ? (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : null}
                    </div>
                    <span>{option.text}</span>
                    {isAnswerChecked && option.id === 1 && (
                      <span className="ml-auto text-green-600 font-medium">正确！</span>
                    )}
                    {isAnswerChecked && selectedAnswer === option.id && option.id !== 1 && (
                      <span className="ml-auto text-red-600 font-medium">错误</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {!isAnswerChecked ? (
              <button
                onClick={handleCheckChoice}
                disabled={selectedAnswer === null}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                检查答案
              </button>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-800 font-medium">太棒了！正确答案是 "去喝咖啡"。</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">填空题</h3>
            <p className="text-gray-700 mb-4">根据听到的内容，补全句子：</p>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="text-lg text-gray-800">
                Would you like to 
                <input
                  type="text"
                  value={fillAnswer}
                  onChange={(e) => setFillAnswer(e.target.value)}
                  disabled={fillAnswerChecked}
                  placeholder="_______"
                  className={`mx-2 px-3 py-1 border-b-2 text-center focus:outline-none ${
                    fillAnswerChecked
                      ? fillAnswer.toLowerCase() === 'grab'
                        ? 'border-green-500 text-green-700 bg-green-50'
                        : 'border-red-500 text-red-700 bg-red-50'
                      : 'border-gray-400 focus:border-blue-500'
                  }`}
                />
                some coffee?
              </p>
            </div>

            {!fillAnswerChecked ? (
              <button
                onClick={handleCheckFill}
                disabled={!fillAnswer}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                检查答案
              </button>
            ) : (
              <div className={`rounded-xl p-4 ${
                fillAnswer.toLowerCase() === 'grab'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}>
                {fillAnswer.toLowerCase() === 'grab' ? (
                  <p className="text-green-800 font-medium">完美！正确答案是 "grab"。</p>
                ) : (
                  <p className="text-yellow-800 font-medium">正确答案是 "grab"。继续加油！</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Listening
