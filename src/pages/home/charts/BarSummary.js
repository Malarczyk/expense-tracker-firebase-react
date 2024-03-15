import Image from '../../../assets/images/nodata-bar.svg'
import { useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useTransactions } from '../../../hooks/useTransactions'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const BarSummary = () => {
  const { transactions, isTransactionLoading } = useTransactions()
  const [offset, setOffset] = useState(0)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const timestampToDate = (timestamp) => {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
  }

  const generateLastMonths = (monthsCount) => {
    let months = []
    for (let i = 0; i < monthsCount; i++) {
      let d = new Date()
      d.setMonth(d.getMonth() - i - offset)
      months.unshift({ month: d.getMonth(), year: d.getFullYear() })
    }
    return months
  }

  const generateLast5Months = () => {
    return generateLastMonths(screenWidth > 1099 ? 5 : 3)
  }

  const sumTransactionsByType = (transactionType, month, year) => {
    return transactions
      .filter(
        transaction =>
          transaction.transactionType === transactionType &&
          timestampToDate(transaction.transactionDate).getMonth() === month &&
          timestampToDate(transaction.transactionDate).getFullYear() === year
      )
      .reduce((acc, transaction) => acc + parseFloat(transaction.transactionAmount), 0)
  }

  const last5Months = generateLast5Months()
  const labels = last5Months.map(date => new Date(date.year, date.month).toLocaleString('default', { month: 'short', year: 'numeric' }))

  const formatLabel = (label) => {
    const parts = label.split(' ')
    if (parts.length !== 2) return label
    
    const month = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
    const year = "'" + parts[1].slice(2)
    
    return `${month} ${year}`
  };
  
  const transformedLabels = labels.map(label => formatLabel(label))

  const incomeData = last5Months.map(({ month, year }) => sumTransactionsByType('income', month, year))
  const expenseData = last5Months.map(({ month, year }) => sumTransactionsByType('expense', month, year))

  function getThemeColors() {
    const storedTheme = localStorage.getItem('theme') || 'light'

    const colors = {
      light: {
        borderColor: '#f6f6f7',
        fontColor: '#000000'
      },
      dark: {
        borderColor: '#1c2349',
        fontColor: '#B4B8C2' 
      }
    }
    return colors[storedTheme]
  }

  const { borderColor, fontColor } = getThemeColors() 

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { 
        grid: { display: false },
        ticks: {
          color: fontColor,
          textTransform: 'uppercase'
        }
      },
      y: {
        beginAtZero: true,
        grid: { color: borderColor },
        ticks: { 
          callback: function (value) { return value + ' zł' },
          color: fontColor,
        },
      },
    },
    elements: { bar: { borderRadius: 3 } },
  }

  const data = {
    labels: transformedLabels,
    datasets: [
      {
        label: 'Suma przychodów',
        data: incomeData,
        backgroundColor: '#54B471',
      },
      {
        label: 'Suma wydatków',
        data: expenseData,
        backgroundColor: '#E62C59',
      },
    ],
  }

    const moveLeft = () => {
      setOffset(offset + 1)
    }
  
    const moveRight = () => {
      setOffset(offset - 1)
    }

  return (
    <>
      <div className="section__title">
        <h1>Podsumowanie finansowe</h1>
        <div>
          <div className="imgWrap" onClick={moveLeft}>
            <i className="icon icon--arrow-left">{"<"}</i>
          </div>
          <div className="imgWrap" onClick={moveRight}>
            <i className="icon icon--arrow-right">{">"}</i>
          </div>
        </div>
      </div>
      <div className="stats__chart --fake">
        {isTransactionLoading
          ? <img src={Image} alt="" />
          : <Bar options={options} data={data} />}
      </div>
    </>
  )
}

export default BarSummary
