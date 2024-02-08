import ModalEdit from '../../components/Modal/ModalEditTransaction'
import ModalAdd from '../../components/Modal/ModalAddTransaction'
import { useTransactions } from '../../hooks/useTransactions'
import ButtonAdd from '../../components/ButtonAdd'
import React, { useState, useEffect } from 'react'
import BottomBar from '../../components/BottomBar'
import Loader from '../../components/Loader'
import Dashboard from './Dashboard'
import Stats from './Stats'
import './_index.scss'

const Home = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [selectedComponent, setSelectedComponent] = useState('dashboard')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const { updateTransaction, deleteTransaction, isTransactionLoading } = useTransactions()
  
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  }

  const handleButtonClick = (component) => {
    setSelectedComponent(component)
  }

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction)
    setIsModalEditOpen(true)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleUpdateTransaction = (updatedTransaction) => {
    try {
      updateTransaction(updatedTransaction.id, updatedTransaction)
      setIsModalEditOpen(false)
      setSelectedTransaction(null)
    } catch (error) {
      console.error('Error updating transaction:', error)
    }
  }

  return (
    <>
      <ModalAdd isOpen={isModalOpen} onClose={handleCloseModal} />
      <ModalEdit
        isOpen={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        selectedTransaction={selectedTransaction}
        onUpdateTransaction={handleUpdateTransaction}
        onDeleteTransaction={(transactionId) => {
          deleteTransaction(transactionId)
        }} />

      <div className='home'>
        {screenWidth > 1099 ? (
          <>
            {false
              ? <Loader />
              : (
                <>
                  <Dashboard isProfileVisible={false} onItemClick={handleTransactionClick} />
                  <Stats isProfileVisible={false} />
                  <ButtonAdd action={() => setIsModalOpen(true)} />
                </>
              )}
          </>
        ) : (
          <>
            {selectedComponent === 'dashboard' && <Dashboard isProfileVisible={true} onItemClick={handleTransactionClick} />}
            {selectedComponent === 'stats' && <Stats isProfileVisible={true} />}
            <BottomBar onButtonClick={handleButtonClick} onOpenModal={() => setIsModalOpen(true)} activeBtn={selectedComponent} />
          </>
        )}
      </div>
    </>
  )
}

export default Home
