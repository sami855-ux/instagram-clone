import { createContext, useContext, useState } from "react"

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en") // default to English

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
