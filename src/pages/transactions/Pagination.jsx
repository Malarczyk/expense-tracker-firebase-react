import React, { useState } from 'react';

const Pagination = ({ transactionsPerPage, totalTransactions, paginate }) => {
  const [currentPage, setCurrentPage] = useState(1); 
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalTransactions / transactionsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers.length === 1) {
    return null; 
  }

  return (
    <div className='pagination'>
      <div className='pagination__wrapper'>
        {pageNumbers.map(number => (
          <div key={number} className={`page-item ${currentPage === number ? 'active' : ''}`} onClick={() => {
            setCurrentPage(number); 
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
