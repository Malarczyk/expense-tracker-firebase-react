import ModalEdit from '../../components/Modal/ModalEditTransaction'
import { useTransactions } from '../../hooks/useTransactions'
import { useCategories } from '../../hooks/useCategories'
import TransactionDesktop from './TransactionDesktop'
import TransactionMobile from './TransactionMobile'
import { useWallets } from '../../hooks/useWallets'
import TopBar from "../../components/TopBar"
import { useState, useEffect } from "react"
import ModalFilter from './ModalFilter'
import './_index.scss'

const Transactions = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false)
  const { transactions, updateTransaction, deleteTransaction } = useTransactions()
  const { categories } = useCategories();
  const { wallets } = useWallets();

  // Add state for filtered transactions and filters
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filters, setFilters] = useState({
    minAmount: '',
    maxAmount: '',
    fromDate: '',
    toDate: '',
    transactionType: '',
    selectedWallet: '',
    selectedCategories: []
  });

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log(`Filter changed: ${name} = ${value}`); // Dodaj logowanie, aby sprawdzić, czy filtr się zmienia
    setFilters({ ...filters, [name]: value });
  };

// index.jsx (w komponencie Transactions)
const applyFilters = () => {
  console.log('Applying filters with current filters:', filters);

  let newFilteredTransactions = transactions.map(t => ({
    ...t,
    transactionAmount: parseFloat(t.transactionAmount), // Konwersja string na number
    transactionDate: t.transactionDate.toDate(), // Konwersja Firestore Timestamp na obiekt Date JavaScript
  }));

  console.log('Transactions after initial processing:', newFilteredTransactions);

  // Filtrowanie po minimalnej kwocie
  if (filters.minAmount) {
    console.log('Applying minAmount filter with value:', filters.minAmount);
    newFilteredTransactions = newFilteredTransactions.filter(transaction =>
      transaction.transactionAmount >= parseFloat(filters.minAmount)
    );
  }

  console.log('After filtering by minAmount:', newFilteredTransactions);

  // Filtrowanie po maksymalnej kwocie
  if (filters.maxAmount) {
    newFilteredTransactions = newFilteredTransactions.filter(transaction =>
      transaction.transactionAmount <= parseFloat(filters.maxAmount)
    );
  }

  console.log('After filtering by maxAmount:', newFilteredTransactions);

  // Filtrowanie po dacie (od)
  if (filters.fromDate) {
    const fromDate = new Date(filters.fromDate);
    newFilteredTransactions = newFilteredTransactions.filter(transaction =>
      transaction.transactionDate >= fromDate
    );
  }

  // Filtrowanie po dacie (do)
  if (filters.toDate) {
    const toDate = new Date(filters.toDate);
    newFilteredTransactions = newFilteredTransactions.filter(transaction =>
      transaction.transactionDate <= toDate
    );
  }

  // Filtrowanie po typie transakcji
  if (filters.transactionType) {
    newFilteredTransactions = newFilteredTransactions.filter(transaction =>
      transaction.transactionType === filters.transactionType
    );
  }

  // Filtrowanie po wybranym portfelu
  if (filters.selectedWallet) {
    newFilteredTransactions = newFilteredTransactions.filter(transaction =>
      transaction.wallet === filters.selectedWallet
    );
  }

  // Filtrowanie po wybranych kategoriach
  if (filters.selectedCategories && filters.selectedCategories.length > 0) {
    newFilteredTransactions = newFilteredTransactions.filter(transaction =>
      filters.selectedCategories.includes(transaction.category)
    );
  }

  setFilteredTransactions(newFilteredTransactions);
  console.log('Filtered transactions set:', newFilteredTransactions);
};


  // useEffect to re-apply filters when transactions or filters state changes
  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  }

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction)
    setIsModalEditOpen(true)
  }

  const handleUpdateTransaction = (updatedTransaction) => {
    try {
      updateTransaction(updatedTransaction.id, updatedTransaction)
      setIsModalEditOpen(false)
      setSelectedTransaction(null)
    } catch (error) {
      console.error('Error updating transaction:', error)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <ModalEdit
        isOpen={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        selectedTransaction={selectedTransaction}
        onUpdateTransaction={handleUpdateTransaction}
        onDeleteTransaction={(transactionId) => {
          deleteTransaction(transactionId)
        }} />

      <ModalFilter
        isOpen={isModalFilterOpen}
        onClose={() => setIsModalFilterOpen(false)}
        filters={filters}
        wallets={wallets}
        categories={categories}
        onFilterChange={handleFilterChange}
        onApplyFilters={applyFilters}
        onClearFilters={() => setFilters({})}
      />

      <div className="transactions">

        {screenWidth > 1099 ? (
          <TransactionDesktop filterClick={() => setIsModalFilterOpen(true)} onItemClick={handleTransactionClick} transactions={filteredTransactions} />
        ) : (
          <>
            <TopBar title={'transakcje'} />
            <TransactionMobile filterClick={() => setIsModalFilterOpen(true)} onItemClick={handleTransactionClick} transactions={filteredTransactions} categories={categories}/>
          </>
        )}
      </div>
    </>
  )

}

export default Transactions

