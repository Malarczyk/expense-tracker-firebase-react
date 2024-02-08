import React, { useState } from 'react';

const Pagination = ({ transactionsPerPage, totalTransactions, paginate }) => {
  const [currentPage, setCurrentPage] = useState(1); // Stan przechowujący aktualnie wybraną stronę
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalTransactions / transactionsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers.length === 1) {
    return null; // Jeśli jest tylko jedna strona, nie renderuj nic
  }

  return (
    <div className='pagination'>
      <div className='pagination__wrapper'>
        {pageNumbers.map(number => (
          <div key={number} className={`page-item ${currentPage === number ? 'active' : ''}`} onClick={() => {
            setCurrentPage(number); // Ustawienie aktualnej strony po kliknięciu
            paginate(number);
          }}>
            <span className='page-link'>
              {number}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
