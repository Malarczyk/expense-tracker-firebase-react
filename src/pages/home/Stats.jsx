import React, { useState, useEffect } from 'react'
import { BarSummary } from './charts/BarSummary'
import Profile from '../../components/Profile'
import Header from "../../components/Header"
import PieChart from './charts/PieChart'
import './_index.scss'


const Stats = ({ isProfileVisible }) => {
  const [isHeaderVisible, setHeaderVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setHeaderVisible(scrollPosition < 60)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <>
      <Header title={'Statystyki'} isVisible={isHeaderVisible} />

      <div className="stats">
        {isProfileVisible &&
          <Profile isHamburger={true} />
        }

        <div className="stats__section">
          <BarSummary />
        </div>

        <div className="stats__section">
          <PieChart chartType={'expense'} />
        </div>


        <div className="stats__section">
          <PieChart chartType={'income'} />
        </div>

      </div>
    </>
  )
}

export default Stats