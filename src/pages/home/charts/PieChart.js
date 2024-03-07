import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import Image from "../../../assets/images/nodata-pie.svg"
import { useTransactions } from '../../../hooks/useTransactions';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, PointElement, LineController, LinearScale, CategoryScale, Title } from 'chart.js';
import PieChartSkeleton from '../../../components/skeleton/PieChartSkeleton'
ChartJS.register(ArcElement, Tooltip, Legend, PointElement, LineController, LinearScale, CategoryScale, Title);

const PieExpenses = ({ chartType }) => {
  const { transactions, isTransactionLoading } = useTransactions();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const getFilteredTransactions = () => {
    return transactions.filter(
      (transaction) =>
        transaction.transactionType === chartType &&
        new Date(transaction.transactionDate.toDate()).getMonth() === selectedMonth &&
        new Date(transaction.transactionDate.toDate()).getFullYear() === selectedYear
    );
  };

  const groupTransactionsByCategory = (filteredTransactions) => {
    const groupedCategories = {};
    filteredTransactions.forEach((transaction) => {
      const category = transaction.category || 'Inne';
      groupedCategories[category] = (groupedCategories[category] || 0) + Number(transaction.transactionAmount);
    });

    const sortedCategories = Object.keys(groupedCategories).sort(
      (a, b) => groupedCategories[b] - groupedCategories[a]
    );

    const selectedCategories = sortedCategories.slice(0, 4);
    selectedCategories.push('Inne');

    const otherCategoryTotal = sortedCategories.slice(4).reduce(
      (total, category) => total + groupedCategories[category],
      0
    );

    const data = {
      labels: selectedCategories,
      datasets: [
        {
          data: selectedCategories.map((category) =>
            category === 'Inne' ? otherCategoryTotal : groupedCategories[category]
          ),
          backgroundColor: [
            '#6563FF',
            '#F2B347',
            '#CB3A8D',
            '#1A5A20',
            '#1F2938',
          ],
          borderWidth: 0,
        },
      ],
    };

    return data;
  };

  const options = {
    responsive: true,
    // animation: {
    //   duration: 0,
    // },
    plugins: {
      legend: {
        display: false,
      },
      labels: {
        render: 'percentage',
        fontColor: ['green', 'white', 'red'],
        precision: 2,
      },
    },
  };

  useEffect(() => {
    // Sprawdź, czy kontener istnieje przed manipulacją jego zawartością
    const chartContainer = document.getElementById('pie-chart-container');
    if (chartContainer) {
      // Zniszcz poprzedni wykres przed utworzeniem nowego
      while (chartContainer.firstChild) {
        chartContainer.firstChild.remove();
      }
    }
  }, [selectedMonth, selectedYear, chartType]);

  const handlePrevMonth = () => {
    setSelectedMonth((prevMonth) => (prevMonth - 1 + 12) % 12);
    if (selectedMonth === 0) {
      setSelectedYear((prevYear) => prevYear - 1);
    }
  };

  const handleNextMonth = () => {
    setSelectedMonth((prevMonth) => (prevMonth + 1) % 12);
    if (selectedMonth === 11) {
      setSelectedYear((prevYear) => prevYear + 1);
    }
  };

  return (
    <>
      <div className="section__title">
        <h1>{chartType === 'expense' ? 'Wydatki' : 'Przychody'}</h1>
        <div>
          <div className="imgWrap" onClick={handlePrevMonth}>
            <i className="icon icon--arrow-left"></i>
          </div>
          <div className="imgWrap" onClick={handleNextMonth}>
            <i className="icon icon--arrow-right"></i>
          </div>
        </div>
      </div>
      {isTransactionLoading
        ? <PieChartSkeleton />
        : (<>
          <div className="stats__chart">
            <div className='stats__chart__title'>
              <h2>{new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            </div>

            {getFilteredTransactions().length > 0 ? (
              <>
                <div className='stats__chart__content'>
                  <Pie data={groupTransactionsByCategory(getFilteredTransactions())} options={options} />
                </div>

                <div className='stats__chart__labels'>
                  {groupTransactionsByCategory(getFilteredTransactions()).labels.map((label, index) => (
                    // Sprawdź, czy wartość "Inne" nie wynosi 0, jeśli tak, pomiń renderowanie
                    label !== 'Inne' || groupTransactionsByCategory(getFilteredTransactions()).datasets[0].data[index] !== 0 ? (
                      <div className='labelItem' key={index}>
                        <div className='box' style={{ backgroundColor: groupTransactionsByCategory(getFilteredTransactions()).datasets[0].backgroundColor[index] }}></div>
                        <span>{label}</span>
                        <span>{groupTransactionsByCategory(getFilteredTransactions()).datasets[0].data[index].toFixed(2)} zł</span>
                      </div>
                    ) : null
                  ))}
                </div>
              </>) : (
              <div className="stats__chart--empty">
                <div className="nodata__chart">
                  <img src={Image} alt="" />
                </div>
              </div>
            )}
          </div>
        </>)}
    </>)

}

export default PieExpenses;
