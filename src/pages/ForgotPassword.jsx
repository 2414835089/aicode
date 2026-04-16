import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { resetPasswordForEmail } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!email) {
      setError('请填写邮箱')
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('请输入有效的邮箱地址')
      setLoading(false)
      return
    }

    try {
      const { error: authError } = await resetPasswordForEmail(email)
      if (authError) {
        setError(authError.message || '密码重置请求失败，请重试')
      } else {
        setSuccess('密码重置链接已发送到您的邮箱！')
      }
    } catch (err) {
      setError('密码重置请求失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">重置密码</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="请输入注册邮箱"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '发送中...' : '发送重置链接'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          想起密码了？{' '}
          <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium">
            返回登录
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
