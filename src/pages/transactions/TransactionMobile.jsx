import UniversalSkeleton from "../../components/skeleton/UniversalSkeleton";
import UniversalEmpty from "../../components/skeleton/UniversalEmpty";
import HistorySection from "../home/HistorySection"
import Pagination from "./Pagination";
import { useState } from "react"
const TransactionMobile = ({ filterClick, onItemClick, transactions, categories, isTransactionsLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 50;

  // Get current transactions
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className='transactions__filter'>
        <span className="btn btn--blue" onClick={filterClick}>Filtruj</span>
      </div>
      <div className="transactions__mobile">
        {isTransactionsLoading
          ? (<UniversalSkeleton amount={12} extraPadding={true}/>)
          : (
            transactions.length > 0
              ? (<>
                <HistorySection
                  transactions={currentTransactions}
                  categories={categories}
                  onItemClick={onItemClick}
                  showAll={true} />
                <Pagination
                  transactionsPerPage={transactionsPerPage}
                  totalTransactions={transactions.length}
                  paginate={paginate} />
              </>) : <UniversalEmpty />)}
      </div>
    </>
  )
}

export default TransactionMobile