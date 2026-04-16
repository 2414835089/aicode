import { useState, useRef } from 'react'

function Speaking() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const audioRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const phrases = [
    { 
      id: 0, 
      text: 'Hello, how are you?', 
      translation: '你好，你好吗？',
      difficulty: '简单'
    },
    { 
      id: 1, 
      text: 'Nice to meet you!', 
      translation: '很高兴认识你！',
      difficulty: '简单'
    },
    { 
      id: 2, 
      text: 'How was your day?', 
      translation: '你今天过得怎么样？',
      difficulty: '中等'
    },
    { 
      id: 3, 
      text: 'I would like to order some food.', 
      translation: '我想点一些食物。',
      difficulty: '中等'
    },
    { 
      id: 4, 
      text: 'Could you please repeat that?', 
      translation: '你能再说一遍吗？',
      difficulty: '中等'
    },
  ]

  const currentPhraseData = phrases[currentPhrase]

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setRecordedBlob(blob)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (err) {
      alert('无法访问麦克风，请确保已授权麦克风权限。')
      console.error(err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  const playRecorded = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob)
      audioRef.current = new Audio(url)
      audioRef.current.onended = () => setIsPlaying(false)
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
      setIsPlaying(false)
    }
  }

  const getFeedback = () => {
    setFeedback({
      score: 85,
      accuracy: '优秀',
      comments: [
        '发音清晰准确',
        '语调自然流畅',
        '整体表现非常好！'
      ]
    })
  }

  const nextPhrase = () => {
    if (currentPhrase < phrases.length - 1) {
      setCurrentPhrase(currentPhrase + 1)
      setRecordedBlob(null)
      setFeedback(null)
    }
  }

  const prevPhrase = () => {
    if (currentPhrase > 0) {
      setCurrentPhrase(currentPhrase - 1)
      setRecordedBlob(null)
      setFeedback(null)
    }
  }

  const playExample = () => {
    alert('示例发音播放中...')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">口语练习</h1>
          <p className="text-gray-600 mt-2">跟读练习，提升你的口语发音</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">跟读练习</h2>
                <p className="text-purple-200 mt-1">短语 {currentPhrase + 1} / {phrases.length}</p>
              </div>
              <span className={`bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium ${
                currentPhraseData.difficulty === '简单' ? 'bg-green-500/30' : 'bg-yellow-500/30'
              }`}>
                {currentPhraseData.difficulty}
              </span>
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-6">
                <p className="text-3xl font-bold text-gray-900 mb-4">
                  {currentPhraseData.text}
                </p>
                <p className="text-lg text-gray-600">
                  {currentPhraseData.translation}
                </p>
              </div>

              <button
                onClick={playExample}
                className="inline-flex items-center px-6 py-3 bg-purple-100 text-purple-700 rounded-xl font-semibold hover:bg-purple-200 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                听示例发音
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">你的录音</h3>
              
              <div className="flex items-center justify-center space-x-6 mb-6">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="p-6 bg-gradient-to-r from-red-500 to-pink-600 rounded-full hover:from-red-600 hover:to-pink-700 transition-all shadow-lg animate-pulse"
                  >
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="8" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="p-6 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg"
                  >
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  </button>
                )}

                {recordedBlob && (
                  <>
                    {!isPlaying ? (
                      <button
                        onClick={playRecorded}
                        className="p-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg"
                      >
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={stopPlaying}
                        className="p-6 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg"
                      >
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </div>

              {isRecording && (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-8 bg-red-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                  <p className="text-red-600 font-medium">录音中...</p>
                </div>
              )}

              {recordedBlob && (
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-green-600 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    已录音
                  </span>
                </div>
              )}
            </div>

            {recordedBlob && !feedback && (
              <div className="text-center mb-8">
                <button
                  onClick={getFeedback}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                >
                  获取发音评分
                </button>
              </div>
            )}

            {feedback && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4">
                    <span className="text-4xl font-bold text-white">{feedback.score}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">发音评分</h3>
                  <p className="text-lg text-purple-600 font-medium">{feedback.accuracy}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">反馈建议：</h4>
                  {feedback.comments.map((comment, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-700">{comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={prevPhrase}
                disabled={currentPhrase === 0}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一个
              </button>
              <button
                onClick={nextPhrase}
                disabled={currentPhrase === phrases.length - 1}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一个
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Speaking
