import TableSkeleton from "../../components/skeleton/TableSkeleton";
import Pagination from "./Pagination";
import { useState } from "react";

const TransactionDesktop = ({ filterClick, onItemClick, transactions, isTransactionsLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 18;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Funkcja do formatowania daty, bierze pod uwagę różne formaty danych
  const formatDate = (date) => {
    if (!date) return "";
    // Jeśli data jest instancją Timestamp
    if (date.toDate) {
      return date.toDate().toLocaleDateString();
    }
    // Jeśli data jest już obiektem Date lub stringiem
    return new Date(date).toLocaleDateString();
  };

  // Sortuj transakcje na podstawie daty utworzenia od najnowszej do najstarszej
  const sortedTransactions = transactions.sort((a, b) => {
    // Przekształć daty na obiekty Date, jeśli są instancjami Timestamp
    const dateA = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
    const dateB = b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
    return dateB - dateA; // Sortuj od najnowszych do najstarszych
  });


  return (<>
    <div className="transactions__title">
      <h1>Twoje transakcje</h1>
    </div>
    <div className='transactions__filter'>
      <span className="btn btn--blue" onClick={filterClick}>Filtruj</span>
    </div>
    {isTransactionsLoading
      ? (<TableSkeleton />)
      : (
        transactions.length > 0
          ? (
            <div className="transactions__desktop">
              <div className="table">
                <div className="table__head">
                  <div><span>Nazwa</span></div>
                  <div><span>Opis</span></div>
                  <div><span>Portfel</span></div>
                  <div><span>Data transakcji</span></div>
                  <div><span>Data dodania</span></div>
                  <div><span>Zdjęcie</span></div>
                  <div><span>Kategoria</span></div>
                  <div><span>Typ</span></div>
                  <div><span>Kwota</span></div>
                  <div><span>Edycja</span></div>
                </div>
                {
                  sortedTransactions
                    .slice((currentPage - 1) * transactionsPerPage, currentPage * transactionsPerPage)
                    .map(transaction => (
                      <div className="table__row" key={transaction.id}>
                        <div><span>{transaction.name}</span></div>
                        <div><span>{transaction.description ? transaction.description : 'brak'}</span></div>
                        <div><span>{transaction.wallet}</span></div>
                        <div><span>{formatDate(transaction.transactionDate)}</span></div>
                        <div><span>{formatDate(transaction.createdAt)}</span></div>
                        <div>
                          <div className="img">
                            {
                              transaction.photoUrl && transaction.photoUrl.trim().length > 0
                                ? <i className="icon icon--img-show"></i>
                                : <i className="icon icon--img-empty"></i>
                            }
                          </div>
                        </div>
                        <div><span>{transaction.category}</span></div>
                        <div><span>{transaction.transactionType}</span></div>
                        <div><span>{transaction.transactionAmount}</span></div>
                        <div className="edit" onClick={() => onItemClick(transaction)}>
                          <div className="iconWrap">
                            <i className="icon icon--edit"></i>
                          </div>
                        </div>
                      </div>
                    ))
                }
              </div>
            </div>
          )
          : <div className="table__empty">Brak Transakcji</div>)}
    <Pagination
      transactionsPerPage={transactionsPerPage}
      totalTransactions={transactions.length}
      paginate={paginate}
    />


  </>)
}

export default TransactionDesktop;
