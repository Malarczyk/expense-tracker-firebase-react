import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { register } from './config/serviceWorkerRegistration'
import MenuDesktop from './components/MenuDesktop/_index'
import ProtectedRoute from './utils/ProtectedRoute'
import Verification from './pages/auth/Verification'
import { useMenu } from './context/Menu/MenuContext'
import React, { useState, useEffect } from 'react'
import { changeTheme } from "./utils/nativeApp"
import Transactions from './pages/transactions'
import Categories from './pages/categories'
import { Auth } from './pages/auth/index'
import Alert from './components/Alert'
import Wallets from './pages/wallets'
import Budgets from './pages/budgets'
import Menu from './components/Menu'
import Home from './pages/home'
import './App.scss'



function App() {
  const { isMenuOpen, toggleMenu } = useMenu()
  const storedTheme = localStorage.getItem('theme')
  const [theme, setTheme] = useState(storedTheme || 'light')
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [installEvent, setInstallEvent] = useState(null)

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    changeTheme(theme === 'light')
    localStorage.setItem('theme', newTheme)
  }

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  }
  useEffect(() => {
    register()
    document.body.setAttribute('theme', theme)
  }, [theme])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      setInstallEvent(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const onTouch = (e) => {
    const width = window.innerWidth
    const initialX = e.touches[0].clientX

    const touchMove = (e) => {
      const currentX = e.touches[0].clientX
      if (
        (initialX - currentX > 60 && !isMenuOpen) ||
        (currentX - initialX > 60 && isMenuOpen)
      ) {
        toggleMenu()
        touchEnd()
      }
    }

    const touchEnd = () => {
      document.removeEventListener('touchend', touchEnd, false)
      document.removeEventListener('touchmove', touchMove, false)
    }

    if ((width - initialX < 30 && !isMenuOpen) || isMenuOpen) {
      document.addEventListener('touchend', touchEnd, false)
      document.addEventListener('touchmove', touchMove, false)
    }
  }

  return (
    <Router>
      <Alert />
      <div className="app__container">
        <div
          className={`app__main${isMenuOpen ? ' --small' : ''}`}
          onClick={() => isMenuOpen && toggleMenu()}
          onTouchStart={onTouch}
        >

          <Routes>
            <Route path="/" exact element={<Auth installEvent={installEvent} setInstallEvent={setInstallEvent} />} />
            <Route path="/verification" exact element={<Verification />} />
            <Route path="/home/*" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
            <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
            <Route path="/wallets" element={<ProtectedRoute><Wallets /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          </Routes>
        </div>
        {isMenuOpen && <Menu changeTheme={toggleTheme} />}
        {screenWidth > 1099 ? <MenuDesktop changeTheme={toggleTheme} /> : undefined}
      </div>
    </Router>
  )
}

export default App
