import { Link } from 'react-router-dom'

function Footer() {
  const quickLinks = [
    { name: '首页', path: '/' },
    { name: '课程', path: '/courses' },
    { name: '学习', path: '/learning' },
    { name: '社区', path: '/community' },
    { name: '关于我们', path: '/about' }
  ]

  const supportLinks = [
    { name: '帮助中心', path: '/help' },
    { name: '联系我们', path: '/contact' },
    { name: '隐私政策', path: '/privacy' },
    { name: '服务条款', path: '/terms' },
    { name: '常见问题', path: '/faq' }
  ]

  const socialLinks = [
    { name: '微信', icon: '💬', url: '#' },
    { name: '微博', icon: '🌐', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <span className="text-xl font-bold">LangLearn</span>
            </div>
            <p className="text-gray-400 mb-6">
              开启您的多语言学习之旅，随时随地轻松学习英语、日语、韩语。
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  aria-label={social.name}
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">支持与帮助</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">订阅更新</h3>
            <p className="text-gray-400 mb-4">
              获取最新的学习资源和课程更新
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="输入您的邮箱"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-r-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium">
                订阅
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 LangLearn. 保留所有权利。
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
                隐私政策
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
                服务条款
              </Link>
              <Link to="/cookies" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
                Cookie 政策
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
