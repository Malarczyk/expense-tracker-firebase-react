import React from 'react';

const HistorySection = ({ transactions, categories }) => {
  const groupTransactionsByDate = () => {
    const groupedTransactions = {};

    transactions.forEach((transaction) => {
      const transactionDate =
        transaction.transactionDate && transaction.transactionDate.toDate
          ? transaction.transactionDate.toDate()
          : null;

      if (transactionDate && !isNaN(transactionDate.getTime())) {
        const formattedDate = formatDate(transactionDate);

        if (!groupedTransactions[formattedDate]) {
          groupedTransactions[formattedDate] = [];
        }

        groupedTransactions[formattedDate].push(transaction);
      } else {
        console.error('Invalid transactionDate:', transaction.transactionDate);
      }
    });
  console.log('groupedTransactions:', groupedTransactions); // Dodaj ten log
    return groupedTransactions;
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('pl-PL', options);
  };

  const renderHistorySection = () => {
    const groupedTransactions = groupTransactionsByDate();

    const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB.getTime() - dateA.getTime(); // Sortowanie od najnowszej do najstarszej
    });

    let renderedItemsCount = 0;
    let renderedDatesCount = 0;

    return sortedDates.map((formattedDate) => {
      if (renderedItemsCount >= 6 || renderedDatesCount >= 6) {
        return null; // Przerwij proces renderowania, jeśli osiągnięto limit 6 elementów
      }

      const transactionsForDate = groupedTransactions[formattedDate];

      const isToday = isDateToday(transactionsForDate[0].transactionDate);
      const isYesterday = isDateYesterday(transactionsForDate[0].transactionDate);

      const renderedDate = (
        <div key={formattedDate} className="history-section">
          <div className="day">
            <span>{isToday ? 'Dzisiaj' : isYesterday ? 'Wczoraj' : formattedDate}</span>
          </div>
          {transactionsForDate.map((transaction) => {
            if (renderedItemsCount < 6) {
              const selectedCategory = categories.find((cat) => cat.name === transaction.category);

              const amountStyle = {
                color: transaction.transactionType === 'income' ? 'var(--success-color)' : 'inherit',
              };
              const formattedAmount =
                (transaction.transactionType === 'expense' ? '-' : '+') +
                Number(transaction.transactionAmount).toFixed(2) +
                ' zł';

              renderedItemsCount++;

              return (
                <div key={transaction.id} className="dashboard__history__item">
                  <div className="dashboard__history__item__icon">
                    <div
                      className="iconWrap"
                      style={{ backgroundColor: `var(${selectedCategory?.bgColor})` }}
                    >
                      <i
                        className={`icon icon--${selectedCategory?.icon}`}
                        style={{ backgroundColor: `var(${selectedCategory?.color})` }}
                      ></i>
                    </div>
                  </div>
                  <div className="dashboard__history__item__content">
                    <h2>{transaction.name}</h2>
                    <h4>{transaction.category}</h4>
                    <h2 className="amount" style={amountStyle}>
                      {formattedAmount}
                    </h2>
                  </div>
                </div>
              );
            } else {
              return null; // Jeżeli osiągnięto limit 6 elementów, zwróć null
            }
          })}
        </div>
      );

      renderedDatesCount++;
      return renderedDate;
    });
  };

  const isDateToday = (date) => {
    const today = new Date();
    const transactionDate = new Date(date);
    return (
      today.getDate() === transactionDate.getDate() &&
      today.getMonth() === transactionDate.getMonth() &&
      today.getFullYear() === transactionDate.getFullYear()
    );
  };

  const isDateYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const transactionDate = new Date(date);
    return (
      yesterday.getDate() === transactionDate.getDate() &&
      yesterday.getMonth() === transactionDate.getMonth() &&
      yesterday.getFullYear() === transactionDate.getFullYear()
    );
  };

  return (
    <div className="dashboard__history">
      {transactions ? (
        renderHistorySection()
      ) : (
        <p>Brak</p>
      )}
    </div>
  );
};

export default HistorySection;