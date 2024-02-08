import React, { useState, useEffect } from 'react';
import { useMonthlyStats } from '../../../hooks/useMonthlyStats';
import { useTransactions } from '../../../hooks/useTransactions';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      beginAtZero: true,
      grid: { color: '#D4D4D4' },
      ticks: { callback: function(value) { return value + ' zł'; } }
    },
  },
  elements: { bar: { borderRadius: 3 } },
};

const getCurrentMonthLabel = () => new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' });

const calculateCurrentMonthData = (transactions) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

  const filteredTransactions = transactions.filter(transaction => transaction.transactionDate.toMillis() >= startOfMonth && transaction.transactionDate.toMillis() <= endOfMonth);

  return {
    totalIncome: filteredTransactions.filter(t => t.transactionType === 'income').reduce((acc, t) => acc + parseFloat(t.transactionAmount), 0),
    totalExpense: filteredTransactions.filter(t => t.transactionType === 'expense').reduce((acc, t) => acc + parseFloat(t.transactionAmount), 0),
  };
};

const monthNameToDate = (monthName) => {
  const [month, year] = monthName.split(' ');
  const monthIndex = {
    "styczeń": "Sty",
    "luty": "Lut",
    "marzec": "Mar",
    "kwiecień": "Kwi",
    "maj": "Maj",
    "czerwiec": "Cze",
    "lipiec": "Lip",
    "sierpień": "Sie",
    "wrzesień": "Wrz",
    "październik": "Paź",
    "listopad": "Lis",
    "grudzień": "Gru"
  }[month.toLowerCase()];
  
  const shortYear = year.slice(-2); // Pobranie ostatnich dwóch cyfr roku
  
  return `${monthIndex} '${shortYear}`;
};

const BarSummary = () => {
  const { monthlyStats } = useMonthlyStats();
  const { transactions } = useTransactions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const visibleCount = window.innerWidth < 1099 ? 4 : 6;
    const currentMonthLabel = getCurrentMonthLabel();
    const currentMonthData = calculateCurrentMonthData(transactions);
  
    let allData = monthlyStats.map(stat => ({
      monthLabel: stat.name,
      totalIncome: parseFloat(stat.totalIncome),
      totalExpense: parseFloat(stat.totalExpense),
    }));
  
    if (!allData.find(data => data.monthLabel === currentMonthLabel)) {
      allData = [...allData, { monthLabel: currentMonthLabel, ...currentMonthData }];
    }
  
    allData.sort((a, b) => {
      const aDate = monthNameToDate(a.monthLabel);
      const bDate = monthNameToDate(b.monthLabel);
      return aDate - bDate; // Sortowanie rosnąco
    });
  
    const dataToShow = allData.slice(currentIndex, currentIndex + visibleCount);
    setChartData({
      labels: dataToShow.map(data => {
        const [month, year] = data.monthLabel.split(' ');
        const monthIndex = {
          "styczeń": "Sty",
          "luty": "Lut",
          "marzec": "Mar",
          "kwiecień": "Kwi",
          "maj": "Maj",
          "czerwiec": "Cze",
          "lipiec": "Lip",
          "sierpień": "Sie",
          "wrzesień": "Wrz",
          "październik": "Paź",
          "listopad": "Lis",
          "grudzień": "Gru"
        }[month.toLowerCase()];
        const shortYear = year.slice(-2);
        return `${monthIndex} '${shortYear}`;
      }),
      datasets: [
        {
          label: 'Przychody',
          data: dataToShow.map(data => data.totalIncome),
          backgroundColor: '#54B471',
        },
        {
          label: 'Wydatki',
          data: dataToShow.map(data => data.totalExpense),
          backgroundColor: '#E62C59',
        },
      ],
    });
  }, [monthlyStats, transactions, currentIndex]);
  

  const shiftMonths = (direction) => {
    const visibleCount = window.innerWidth < 1099 ? 4 : 6;
    setCurrentIndex(prevIndex => {
      if (direction === 'left') return Math.max(0, prevIndex - 1);
      else if (direction === 'right') return Math.min(monthlyStats.length - visibleCount, prevIndex + 1);
      return prevIndex;
    });
  };
  
  return (
    <>
      <div className="section__title">
        <h1>Podsumowanie finansowe</h1>
        <div>
          <div className="imgWrap" onClick={() => shiftMonths('left')} disabled={currentIndex === 0}>
            <i className="icon icon--arrow-left">{"<"}</i>
          </div>
          <div className="imgWrap" onClick={() => shiftMonths('right')} disabled={currentIndex >= monthlyStats.length - (window.innerWidth < 1099 ? 4 : 6)}>
            <i className="icon icon--arrow-right">{">"}</i>
          </div>
        </div>
      </div>
      <div className="stats__chart">
        <Bar options={options} data={chartData} />
      </div>
    </>
  );
};


export default BarSummary;
