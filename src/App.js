import './App.scss';
import { useMenu } from './context/Menu/MenuContext'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth } from './pages/auth/index';
import { ExpenseTracker } from './pages/expense-tracker/index';
import Home from './pages/home';
import Wallets from './pages/wallets';
import Transactions from './pages/transactions';
import Budgets from './pages/budgets';
import Categories from './pages/categories';
import Menu from './components/Menu';
import React, { useState, useEffect } from 'react';
import MenuDesktop from './components/MenuDesktop/_index';


function App() {
  const { isMenuOpen, toggleMenu } = useMenu()
  const storedTheme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(storedTheme || 'light');
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  }

  useEffect(() => {
    document.body.setAttribute('theme', theme);
  }, [theme]);

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
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
    <div className="app__container">
      <div
        className={`app__main${isMenuOpen ? ' --small' : ''}`}
        onClick={() => isMenuOpen && toggleMenu()}
        onTouchStart={onTouch}
      >
        
          <Routes>
            <Route path="/" exact element={<Auth />} />
            <Route path="/home/*" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/expense-tracker" element={<ExpenseTracker />} />
          </Routes>
      </div>
      {isMenuOpen && <Menu changeTheme={toggleTheme}/>}
      {screenWidth > 1024 ? <MenuDesktop /> : undefined}
    </div>
    </Router>
  );
}

export default App;
