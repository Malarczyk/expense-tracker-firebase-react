import { useTransactions } from "../../hooks/useTransactions"
import { useCategories } from "../../hooks/useCategories"
import { useBudgets } from "../../hooks/useBudgets"
import React, { useState, useEffect } from 'react';
import './_index.scss'
import Header from "../../components/Header"
import HistorySection from "./HistorySection";
import { useMenu } from "../../context/Menu/MenuContext"

const Dashboard = ({ isProfileVisible }) => {
  const { transactions, transactionTotal } = useTransactions()
  const { income, expenses, balance } = transactionTotal

  const { toggleMenu } = useMenu()
  const { categories } = useCategories();
  const { budgets } = useBudgets();

  const [isHeaderVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHeaderVisible(scrollPosition < 60);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
      <Header title={'Pulpit'} isVisible={isHeaderVisible} />
      <div className='dashboard'>
        {isProfileVisible &&
          <div className="dashboard__profile">

            <div className="dashboard__profile__img">
              <span></span>
            </div>
            <div className="dashboard__profile__body">
              <span>Witaj z powrotem,</span>
              <h2>Piotr Kowalski!</h2>
            </div>
            <div className="dashboard__profile__hamburger" onClick={toggleMenu}>
              <i className="icon icon--hamburger"></i>
            </div>

          </div>}

        <div className="dashboard__balance">
          <div className="dashboard__balance__item">
            <div className="balance">
              <div className="balance__header">
                <h1>Bilans</h1>
                <i className="icon icon--visibility-off"></i>
              </div>
              <div className="balance__footer">
                <div className="iconWrap">
                  <i className="icon icon--balance"></i>
                </div>
                <h2>{Number(balance).toFixed(2) + ' zł'}</h2>
              </div>
            </div>
          </div>
          <div className="dashboard__balance__item">
            <div className="incomeExpense">
              <div className="iconWrap">
                <i className="icon icon--expenses s24"></i>
              </div>
              <h1>Przychody</h1>
              <h2 style={{ color: '#54B471' }}>{Number(income).toFixed(2) + ' zł'}</h2>
            </div>
            <div className="incomeExpense">
              <div className="iconWrap">
                <i className="icon icon--incomes s24"></i>
              </div>
              <h1>Wydatki</h1>
              <h2 style={{ color: '#E62C59' }}>{Number(expenses).toFixed(2) + ' zł'}</h2>
            </div>
          </div>
        </div>

        <div className="dashboard__section">
          <div className="section__title">
            <h1>Ostatnie transkacje</h1>
            <h3>Pokaż wszystkie</h3>
          </div>
          <HistorySection transactions={transactions} categories={categories} />
        </div>

        <div className="dashboard__section">
          <div className="section__title">
            <h1>Budżety</h1>
            <h3>Pokaż wszystkie</h3>
          </div>
          <div className="dashboard__budgets">

            {budgets ? (
              budgets.map((budget) => {
                const {id, name, maxAmount, actualAmount} = budget
                return(
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
              ):(
                <p>Brak budzetów</p>
              )}


          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard