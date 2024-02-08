import { useTransactions } from "../../hooks/useTransactions"
import { useMonthlyStats } from "../../hooks/useMonthlyStats"
import React, { useState, useEffect, useRef } from 'react'
import { useCategories } from "../../hooks/useCategories"
import { useBudgets } from "../../hooks/useBudgets"
import Profile from "../../components/Profile"
import { useNavigate } from "react-router-dom"
import HistorySection from "./HistorySection"
import Header from "../../components/Header"
import './_index.scss'

const Dashboard = ({ isProfileVisible, onItemClick }) => {
  const { transactions, transactionTotal, isTransactionLoading } = useTransactions()
  const { monthlyStats, addMonthlyStats, isMonthlyStatsLoading } = useMonthlyStats()
  const [isDataInitialized, setIsDataInitialized] = useState(false)
  const { income, expenses, balance } = transactionTotal


  const { categories } = useCategories()
  const { budgets, updateBudget } = useBudgets()

  const navigate = useNavigate()

  const [isHeaderVisible, setHeaderVisible] = useState(true)
  const [isBalanceVisible, setBalanceVisible] = useState(() => {
    const saved = localStorage.getItem('isBalanceVisible')
    return saved === 'true'
  })

  useEffect(() => {
    if (!isTransactionLoading && !isMonthlyStatsLoading) {
      setIsDataInitialized(true);
    }
  }, [isTransactionLoading, isMonthlyStatsLoading]);

  const checkAndAddMonthlyStatsExecuted = useRef(false);

  useEffect(() => {
    const checkAndAddMonthlyStats = async () => {
      if (isDataInitialized && !checkAndAddMonthlyStatsExecuted.current) {
        const currentDate = new Date();
        const previousMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const previousMonthName = previousMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        const previousMonthStatsExists = monthlyStats.some(stat => {
          return stat.name === previousMonthName;
        });

        if (!previousMonthStatsExists) {
          const totalIncome = transactions
            .filter(transaction => transaction.type === 'income' && new Date(transaction.date).getMonth() === previousMonthDate.getMonth())
            .reduce((acc, transaction) => acc + transaction.amount, 0);

          const totalExpense = transactions
            .filter(transaction => transaction.type === 'expense' && new Date(transaction.date).getMonth() === previousMonthDate.getMonth())
            .reduce((acc, transaction) => acc + transaction.amount, 0);

          await addMonthlyStats({
            name: previousMonthName,
            totalIncome,
            totalExpense,
          });

          await resetBudgetsForNewMonth();
        }
      } else {
        console.log("Dane nie są jeszcze zainicjalizowane");
      }
    };

    if (isDataInitialized) {
      checkAndAddMonthlyStats();
    }
  }, [isDataInitialized]);

  const resetBudgetsForNewMonth = async () => {
    for (const budget of budgets) {
      await updateBudget(budget.id, { actualAmount: 0 });
    }
  };

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
  //     { name: 'lipiec 2023', totalIncome: '4000', totalExpense: '3044' },
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
          {/* <span onClick={addSampleMonthlyStats}>Dodaj zmyślone dane dla zeszłych miesięcy</span> */}
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
                        <i className="icon icon--arrow-right"></i>
                      </div>
                    </div>
                  )
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