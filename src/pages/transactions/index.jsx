import ModalEdit from '../../components/Modal/ModalEditTransaction'
import ModalAddTransaction from '../../components/Modal/ModalAddTransaction'
import { AlertContext } from '../../context/Alert/AlertContext'
import { useTransactions } from '../../hooks/useTransactions'
import { useCategories } from '../../hooks/useCategories'
import TransactionDesktop from './TransactionDesktop'
import TransactionMobile from './TransactionMobile'
import { useWallets } from '../../hooks/useWallets'
import ButtonAdd from '../../components/ButtonAdd'
import TopBar from "../../components/TopBar"
import { useState, useEffect, useContext } from "react"
import ModalFilter from './ModalFilter'
import './_index.scss'

const Transactions = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false)

  const { showAlert } = useContext(AlertContext)
  const { transactions, updateTransaction, deleteTransaction, isTransactionLoading } = useTransactions()
  const { categories } = useCategories()
  const { wallets } = useWallets()

  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [filters, setFilters] = useState({
    minAmount: '',
    maxAmount: '',
    fromDate: '',
    toDate: '',
    transactionType: '',
    selectedWallet: '',
    selectedCategories: []
  })

  const handleCloseModal = () => {
    setIsModalAddOpen(false)
  }

  const applyFilters = (filters) => {
    let newFilteredTransactions = transactions.filter(t => {
      const transactionAmount = parseFloat(t.transactionAmount)
      const transactionDate = t.transactionDate?.seconds ? new Date(t.transactionDate?.seconds * 1000) : undefined // Zakładając, że transactionDate jest już konwertowane do formatu Date w danych transakcji
      let isValid = true

      if (!filters) return true
      if (filters.minAmount && transactionAmount < parseFloat(filters.minAmount)) {
        isValid = false
      }
      if (filters.maxAmount && transactionAmount > parseFloat(filters.maxAmount)) {
        isValid = false
      }
      if (filters.fromDate && transactionDate && transactionDate < new Date(filters.fromDate)) {
        isValid = false
      }
      if (filters.toDate && transactionDate && transactionDate > new Date(filters.toDate)) {
        isValid = false
      }
      if (filters.selectedWallet && t.wallet !== filters.selectedWallet) {
        isValid = false
      }
      if (filters.transactionType && t.transactionType !== filters.transactionType) {
        isValid = false
      }
      if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(t.category)) {
        isValid = false
      }
      showAlert('Przefiltrowano transakcje', 'success')
      return isValid
  
    })

    setFilteredTransactions(newFilteredTransactions)
  }

  useEffect(() => {
    applyFilters()
  }, [transactions, filters])

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
        wallets={wallets}
        categories={categories}
        applyFilters={applyFilters}
      />

      <ModalAddTransaction isOpen={isModalAddOpen} onClose={handleCloseModal} />

      <div className="transactions">

        {screenWidth > 1099 ? (
          <>
            <TransactionDesktop filterClick={() => setIsModalFilterOpen(true)} addClick={() => setIsModalAddOpen(true)} onItemClick={handleTransactionClick} transactions={filteredTransactions} isTransactionsLoading={isTransactionLoading} />
            <ButtonAdd action={() => setIsModalAddOpen(true)} />
          </>
        ) : (
          <>
            <TopBar title={'Transakcje'} />
            <TransactionMobile filterClick={() => setIsModalFilterOpen(true)} onItemClick={handleTransactionClick} transactions={filteredTransactions} isTransactionsLoading={isTransactionLoading} categories={categories} />
          </>
        )}
      </div>
    </>
  )

}

export default Transactions

