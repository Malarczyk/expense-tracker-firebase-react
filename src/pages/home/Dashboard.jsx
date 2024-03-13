import { useTransactions } from "../../hooks/useTransactions"
import React, { useState, useEffect, useRef } from 'react'
import { useCategories } from "../../hooks/useCategories"
import { useBudgets } from "../../hooks/useBudgets"
import Profile from "../../components/Profile"
import { useNavigate } from "react-router-dom"
import HistorySection from "./HistorySection"
import UniversalEmpty from "../../components/skeleton/UniversalEmpty"
import Header from "../../components/Header"
import './_index.scss'
import UniversalSkeleton from "../../components/skeleton/UniversalSkeleton"

const Dashboard = ({ isProfileVisible, onItemClick }) => {
  const { transactions, transactionTotal, isTransactionLoading } = useTransactions()
  const { income, expenses, balance } = transactionTotal


  const { categories } = useCategories()
  const { budgets, isBudgetsLoading } = useBudgets()

  const navigate = useNavigate()

  const [isHeaderVisible, setHeaderVisible] = useState(true)
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [isBalanceVisible, setBalanceVisible] = useState(() => {
    const saved = localStorage.getItem('isBalanceVisible')
    return saved === 'true'
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      const isAnyBudgetCloseToLimit = budgets.some(budget => budget.actualAmount > 0.9 * budget.maxAmount);
      setShowLimitAlert(isAnyBudgetCloseToLimit);
    }, 1000); // Ustaw opóźnienie na 1 sekundę

    return () => clearTimeout(timer); // Wyczyść timeout przy odmontowywaniu komponentu
  }, [budgets]); // Zależności efektu


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


  // const addSampleMonthlyStats = async () => {
  //   const sampleData = [
  //     { name: 'wrzesień 2023', totalIncome: '4890', totalExpense: '3000' },
  //     { name: 'sierpień 2023', totalIncome: '5290', totalExpense: '3689' },
  //     { name: 'lipiec 2023', totalIncome: '6192', totalExpense: '3044' },
  //     { name: 'październik 2023', totalIncome: '8942', totalExpense: '3000' },
  //     { name: 'listopad 2023', totalIncome: '6402', totalExpense: '3689' },
  //     { name: 'grudzień 2023', totalIncome: '4555', totalExpense: '4054' },
  //   ];

  //   try {
  //     for (const data of sampleData) {
  //       await addMonthlyStats({
  //         name: data.name,
  //         totalIncome: data.totalIncome,
  //         totalExpense: data.totalExpense,
  //       });
  //     }
  //     console.log("Dodano")
  //   } catch (error) {
  //     console.error('Error adding sample monthlyStats:', error);
  //   }
  // };

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
                    ? <h2>{Number(balance).toFixed(2) + ' zł'}</h2>
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
                  ? <h2 style={{ color: '#54B471' }}>{Number(income).toFixed(2) + ' zł'}</h2>
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
                  ? <h2 style={{ color: '#E62C59' }}>{Number(expenses).toFixed(2) + ' zł'}</h2>
                  : <h2 style={{ color: '#E62C59' }}>******</h2>
                )}
            </div>
          </div>
        </div>

        {showLimitAlert && budgets?.map((budget) => {
          const { id, name, maxAmount, actualAmount } = budget
          return (
            actualAmount > maxAmount
              ? (
                <div className="dashboard__section --timeout">
                  <div className="section__title">
                    <h1>Przekroczono ustalony limit</h1>
                  </div>
                  <div className="dashboard__budgets">
                    <div className="universal__item --limit --limit-error" key={id}>
                      <div className="universal__item__body">
                        <div className="top">
                          <h2>{name}</h2>
                        </div>
                        <div className="bottom">
                          <h4>{Number(actualAmount).toFixed(2) + ' zł'}</h4>
                          <h4>{'z ' + Number(maxAmount).toFixed(2) + ' zł'}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)
              : actualAmount > 0.9 * maxAmount
                ? (<div className="dashboard__section --timeout">
                  <div className="section__title">
                    <h1>Hej! Zaraz przekroczysz ustalony limit</h1>
                  </div>
                  <div className="dashboard__budgets">
                    <div className="universal__item --limit" key={id}>
                      <div className="universal__item__body">
                        <div className="top">
                          <h2>{name}</h2>
                        </div>
                        <div className="bottom">
                          <h4>{Number(actualAmount).toFixed(2) + ' zł'}</h4>
                          <h4>{'z ' + Number(maxAmount).toFixed(2) + ' zł'}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )
                : (<></>)
          )
        })}

        <div className="dashboard__section">
          {/* <span onClick={addSampleMonthlyStats}>Dodaj zmyślone dane dla zeszłych miesięcy</span> */}
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
                          <h4>{Number(actualAmount).toFixed(2) + ' zł'}</h4>
                          <h4>{'z ' + Number(maxAmount).toFixed(2) + ' zł'}</h4>
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