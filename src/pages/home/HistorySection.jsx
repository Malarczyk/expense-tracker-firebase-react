import React from 'react'
import { Timestamp } from 'firebase/firestore';

const HistorySection = ({
  transactions,
  categories,
  onItemClick,
  limit = 6, // Limit transakcji do wyświetlenia, domyślnie 6 dla strony Home
  showAll = false // Jeśli true, wyświetla wszystkie transakcje (dla strony Transactions)
}) => {
  const groupTransactionsByDate = () => {
    const groupedTransactions = {};

    transactions.forEach((transaction) => {
      const transactionDate = transaction.transactionDate
        ? (transaction.transactionDate instanceof Timestamp
          ? transaction.transactionDate.toDate()
          : new Date(transaction.transactionDate))
        : null;

      if (transactionDate && !isNaN(transactionDate.getTime())) {
        const formattedDate = formatDate(transactionDate);

        if (!groupedTransactions[formattedDate]) {
          groupedTransactions[formattedDate] = {
            date: transactionDate,
            transactions: []
          };
        }

        groupedTransactions[formattedDate].transactions.push(transaction);
      } else {
        console.error('Invalid transactionDate:', transaction.transactionDate);
      }
    });

    return groupedTransactions;
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('pl-PL', options);
  };

  const renderHistorySection = () => {
    const groupedTransactions = groupTransactionsByDate();

    const sortedDates = Object.values(groupedTransactions).sort((a, b) => {
      const dateA = a.date;
      const dateB = b.date;
      return dateB.getTime() - dateA.getTime(); // Sortowanie od najnowszej do najstarszej
    });

    let renderedItemsCount = 0;

    return sortedDates.map((group) => {
      const formattedDate = formatDate(group.date);
      if (!showAll && renderedItemsCount >= limit) {
        return null; // Przerwij proces renderowania, jeśli osiągnięto limit i tryb showAll jest wyłączony
      }

      const transactionsForDate = group.transactions;

      const isToday = isDateToday(transactionsForDate[0].transactionDate);
      const isYesterday = isDateYesterday(transactionsForDate[0].transactionDate);

      const renderedDate = (
        <div key={formattedDate} className="history-section">
          <div className="day">
            <span>{isToday ? 'Dzisiaj' : isYesterday ? 'Wczoraj' : formattedDate}</span>
          </div>
          {transactionsForDate.map((transaction) => {
            if (!showAll && renderedItemsCount >= limit) {
              return null; // Jeżeli osiągnięto limit i tryb showAll jest wyłączony, zwróć null
            }

            const selectedCategory = categories.find((cat) => cat.name === transaction.category);
            const amountStyle = {
              color: transaction.transactionType === 'income' ? 'var(--success-color)' : 'var(--text-color)',
            };
            const formattedAmount = (transaction.transactionType === 'expense' ? '-' : '+') +
                                    Number(transaction.transactionAmount).toFixed(2) + ' zł';
            renderedItemsCount++;

            return (
              <div key={transaction.id} className="dashboard__history__item" onClick={() => onItemClick(transaction)}>
                <div className="dashboard__history__item__icon">
                  <div className="iconWrap" style={{ backgroundColor: `var(${selectedCategory?.bgColor})` }}>
                    <i className={`icon icon--${selectedCategory?.icon}`} style={{ backgroundColor: `var(${selectedCategory?.color})` }}></i>
                  </div>
                </div>
                <div className="dashboard__history__item__content">
                  <h2>{transaction.name}</h2>
                  <h4>{transaction.category}</h4>
                  <h2 className="amount" style={amountStyle}>{formattedAmount}</h2>
                </div>
              </div>
            );
          })}
        </div>
      );

      return renderedDate;
    });
  };

  const isDateToday = (date) => {
    const today = new Date();
    const transactionDate = new Date(date);
    return today.getDate() === transactionDate.getDate() &&
           today.getMonth() === transactionDate.getMonth() &&
           today.getFullYear() === transactionDate.getFullYear();
  };

  const isDateYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const transactionDate = new Date(date);
    return yesterday.getDate() === transactionDate.getDate() &&
           yesterday.getMonth() === transactionDate.getMonth() &&
           yesterday.getFullYear() === transactionDate.getFullYear();
  };

  return (
    <div className="dashboard__history">
      {renderHistorySection()}
    </div>
  );
};

export default HistorySection;
