import UniversalSkeleton from "../../components/skeleton/UniversalSkeleton"
import UniversalEmpty from "../../components/skeleton/UniversalEmpty"
import React, { useState, useEffect, useRef, Fragment } from 'react'
import { useTransactions } from "../../hooks/useTransactions"
import { useCategories } from "../../hooks/useCategories"
import { useBudgets } from "../../hooks/useBudgets"
import { displayPrice } from "../../utils/strings"
import Profile from "../../components/Profile"
import { useNavigate } from "react-router-dom"
import HistorySection from "./HistorySection"
import Header from "../../components/Header"
import './_index.scss'


const Dashboard = ({ isProfileVisible, onItemClick }) => {
  const { transactions, transactionTotal, isTransactionLoading } = useTransactions()
  const { income, expenses, balance } = transactionTotal


  const { categories } = useCategories()
  const { budgets, isBudgetsLoading } = useBudgets()

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
    localStorage.setItem('isBalanceVisible', isBalanceVisible)
  }, [isBalanceVisible])

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
                {isTransactionLoading
                  ? (<h4>Ładowanie</h4>)
                  : (isBalanceVisible
                    ? <h2>{displayPrice(balance)}</h2>
                    : <h2>******</h2>
                  )}

              </div>
            </div>
          </div>
          <div className="dashboard__balance__item">
            <div className="incomeExpense">
              <div className="iconWrap">
                <i className="icon icon--expenses s24"></i>
              </div>
              <h1>Przychody</h1>
              {isTransactionLoading
                ? (<h4>Ładowanie</h4>)
                : (isBalanceVisible
                  ? <h2 style={{ color: '#54B471' }}>{displayPrice(income)}</h2>
                  : <h2 style={{ color: '#54B471' }}>******</h2>
                )}

            </div>
            <div className="incomeExpense">
              <div className="iconWrap">
                <i className="icon icon--incomes s24"></i>
              </div>
              <h1>Wydatki</h1>
              {isTransactionLoading
                ? (<h4>Ładowanie</h4>)
                : (isBalanceVisible
                  ? <h2 style={{ color: '#E62C59' }}>{displayPrice(expenses)}</h2>
                  : <h2 style={{ color: '#E62C59' }}>******</h2>
                )}
            </div>
          </div>
        </div>

        {budgets?.map((budget) => {
            const { id, name, maxAmount, actualAmount } = budget
            const isBudgetOver = Number(actualAmount) > Number(maxAmount)
            const isBudgetCloseToLimit = Number(actualAmount) > 0.9 * Number(maxAmount) && !isBudgetOver
            return (
              <Fragment key={id}>
                {isBudgetOver && (
                  <div className="dashboard__section --timeout">
                    <div className="section__title">
                      <h1>Przekroczono ustalony limit</h1>
                    </div>
                    <div className="dashboard__budgets">
                      <div className="universal__item --limit --limit-error">
                        <div className="universal__item__body">
                          <div className="top">
                            <h2>{name}</h2>
                          </div>
                          <div className="bottom">
                            <h4>{displayPrice(actualAmount)}</h4>
                            <h4>{'z ' + displayPrice(maxAmount)}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {isBudgetCloseToLimit && (
                  <div className="dashboard__section --timeout">
                    <div className="section__title">
                      <h1>Hej! Zaraz przekroczysz ustalony limit</h1>
                    </div>
                    <div className="dashboard__budgets">
                      <div className="universal__item --limit">
                        <div className="universal__item__body">
                          <div className="top">
                            <h2>{name}</h2>
                          </div>
                          <div className="bottom">
                            <h4>{displayPrice(actualAmount)}</h4>
                            <h4>{'z ' + displayPrice(maxAmount)}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </Fragment>)
          })
        }

        <div className="dashboard__section">
          <div className="section__title">
            <h1>Ostatnie transkacje</h1>
            <h3 onClick={() => navigate('/transactions')}>Pokaż wszystkie</h3>
          </div>
          {isTransactionLoading ? (
            <UniversalSkeleton amount={7} extraPadding={true} />
          ) : transactions.length > 0 ? (
            <HistorySection transactions={transactions} categories={categories} onItemClick={onItemClick} />
          ) : (
            <UniversalEmpty />
          )}
        </div>

        <div className="dashboard__section">
          <div className="section__title">
            <h1>Budżety</h1>
            <h3 onClick={() => navigate('/budgets')}>Pokaż wszystkie</h3>
          </div>
          <div className="dashboard__budgets">

            {isBudgetsLoading
              ? (<UniversalSkeleton amount={3} extraPadding={false} />)
              : (budgets.length > 0 ? (
                budgets.map((budget) => {
                  const { id, name, maxAmount, actualAmount } = budget
                  return (
                    <div className="universal__item" key={id}>
                      <div className="universal__item__body">
                        <div className="top">
                          <h2>{name}</h2>
                        </div>
                        <div className="bottom">
                          <h4>{displayPrice(actualAmount)}</h4>
                          <h4>{'z ' + displayPrice(maxAmount)}</h4>
                        </div>
                      </div>
                      <div className="universal__item__arr">

                      </div>
                    </div>
                  )
                })
              ) : (
                <UniversalEmpty />
              ))}


          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard