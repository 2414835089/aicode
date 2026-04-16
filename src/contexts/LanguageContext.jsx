import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' }
]

export function LanguageProvider({ children }) {
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const saved = localStorage.getItem('selectedLanguage')
    return saved || 'zh'
  })

  const [learningLanguage, setLearningLanguage] = useState(() => {
    const saved = localStorage.getItem('learningLanguage')
    return saved || 'english'
  })

  useEffect(() => {
    localStorage.setItem('selectedLanguage', selectedLanguage)
  }, [selectedLanguage])

  useEffect(() => {
    localStorage.setItem('learningLanguage', learningLanguage)
  }, [learningLanguage])

  const value = {
    languages,
    selectedLanguage,
    setSelectedLanguage,
    learningLanguage,
    setLearningLanguage
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
