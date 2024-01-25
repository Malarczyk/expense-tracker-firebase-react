import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { register } from './config/serviceWorkerRegistration'
import MenuDesktop from './components/MenuDesktop/_index'
import Verification from './pages/auth/Verification'
import { useMenu } from './context/Menu/MenuContext'
import React, { useState, useEffect } from 'react'
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
      console.log('beforeinstallprompt event was fired'); 
      // Zapisz zdarzenie, aby mogło zostać wywołane później
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
            <Route path="/" exact element={<Auth installEvent={installEvent} setInstallEvent={setInstallEvent}/>} />
            <Route path="/verification" exact element={<Verification />} />
            <Route path="/home/*" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
      </div>
      {isMenuOpen && <Menu changeTheme={toggleTheme}/>}
      {screenWidth > 1099 ? <MenuDesktop /> : undefined}
    </div>
    </Router>
  )
}

export default App
