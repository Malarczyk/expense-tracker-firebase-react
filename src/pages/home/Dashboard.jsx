import { useTransactions } from "../../hooks/useTransactions"
import { useCategories } from "../../hooks/useCategories"
import { useBudgets } from "../../hooks/useBudgets"
import React, { useState, useEffect } from 'react'
import Profile from "../../components/Profile"
import HistorySection from "./HistorySection"
import Header from "../../components/Header"
import { useNavigate } from "react-router-dom"
import './_index.scss'

const Dashboard = ({ isProfileVisible, onItemClick }) => {
  const { transactions, transactionTotal } = useTransactions()
  const { income, expenses, balance } = transactionTotal

  const { categories } = useCategories()
  const { budgets } = useBudgets()

  const navigate = useNavigate()

  const [isHeaderVisible, setHeaderVisible] = useState(true)
  const [isBalanceVisible, setBalanceVisible] = useState(() => {
    const saved = localStorage.getItem('isBalanceVisible')
    return saved === 'true'
  })

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
  useEffect(() => {
    localStorage.setItem('isBalanceVisible', isBalanceVisible);
  }, [isBalanceVisible]);
  return (
    <>
      <Header title={'Pulpit'} isVisible={isHeaderVisible} />
      <div className='dashboard'>
        {isProfileVisible &&
          <Profile isHamburger={true} />
        }

        <div className="dashboard__balance">
          <div className="dashboard__balance__item">
            <div className="balance">
              <div className="balance__header">
                <h1>Bilans</h1>
                {isBalanceVisible
                  ? <i className="icon icon--visibility-off" onClick={() => setBalanceVisible(false)}></i>
                  : <i className="icon icon--visibility" onClick={() => setBalanceVisible(true)}></i>
                }

              </div>
              <div className="balance__footer">
                <div className="iconWrap">
                  <i className="icon icon--balance"></i>
                </div>
                {isBalanceVisible
                  ? <h2>{Number(balance).toFixed(2) + ' zł'}</h2>
                  : <h2>******</h2>
                }
                
              </div>
            </div>
          </div>
          <div className="dashboard__balance__item">
            <div className="incomeExpense">
              <div className="iconWrap">
                <i className="icon icon--expenses s24"></i>
              </div>
              <h1>Przychody</h1>
              {isBalanceVisible
                ? <h2 style={{ color: '#54B471' }}>{Number(income).toFixed(2) + ' zł'}</h2>
                : <h2 style={{ color: '#54B471' }}>******</h2>
              }

            </div>
            <div className="incomeExpense">
              <div className="iconWrap">
                <i className="icon icon--incomes s24"></i>
              </div>
              <h1>Wydatki</h1>
              {isBalanceVisible
                ? <h2 style={{ color: '#E62C59' }}>{Number(expenses).toFixed(2) + ' zł'}</h2>
                : <h2 style={{ color: '#E62C59' }}>******</h2>
              }
            </div>
          </div>
        </div>

        <div className="dashboard__section">
          <div className="section__title">
            <h1>Ostatnie transkacje</h1>
            <h3 onClick={() => navigate('/transactions')}>Pokaż wszystkie</h3>
          </div>
          <HistorySection transactions={transactions} categories={categories} onItemClick={onItemClick} />
        </div>

        <div className="dashboard__section">
          <div className="section__title">
            <h1>Budżety</h1>
            <h3 onClick={() => navigate('/budgets')}>Pokaż wszystkie</h3>
          </div>
          <div className="dashboard__budgets">

            {
              budgets.length > 0 ? (
                budgets.map((budget) => {
                  const { id, name, maxAmount, actualAmount } = budget;
                  return (
                    <div className="universal__item" key={id}>
                      <div className="universal__item__body">
                        <div className="top">
                          <h2>{name}</h2>
                        </div>
                        <div className="bottom">
                          <h4>{Number(actualAmount).toFixed(2) + ' zł'}</h4>
                          <h4>{'z ' + Number(maxAmount).toFixed(2) + ' zł'}</h4>
                        </div>
                      </div>
                      <div className="universal__item__arr">
                        <i className="icon icon--arrow-right"></i>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Brak budżetów</p>
              )
            }


          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard