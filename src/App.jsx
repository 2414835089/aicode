import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Lesson from './pages/Lesson'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Vocabulary from './pages/Vocabulary'
import VocabularyQuiz from './pages/VocabularyQuiz'
import VocabularyList from './pages/VocabularyList'
import Grammar from './pages/Grammar'
import GrammarStats from './pages/GrammarStats'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Listening from './pages/Listening'
import Speaking from './pages/Speaking'
import Community from './pages/Community'
import Achievements from './pages/Achievements'
import { initializeDatabase } from './lib/mockDatabase'

function App() {
  useEffect(() => {
    initializeDatabase()
  }, [])

  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/courses/:courseId/lessons/:lessonId" element={<Lesson />} />
              <Route path="/vocabulary" element={<Vocabulary />} />
              <Route path="/vocabulary/quiz" element={<VocabularyQuiz />} />
              <Route path="/vocabulary/list" element={<VocabularyList />} />
              <Route path="/grammar" element={<Grammar />} />
              <Route path="/grammar/stats" element={<GrammarStats />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/listening" element={<Listening />} />
              <Route path="/speaking" element={<Speaking />} />
              <Route path="/community" element={<Community />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl font-bold">页面未找到</h1></div>} />
            </Routes>
          </Layout>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App
