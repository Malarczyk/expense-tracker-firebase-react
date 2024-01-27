import { useTransactions } from "../../hooks/useTransactions"
import { useCategories } from "../../hooks/useCategories"
import DeletePopup from '../../components/DeletePopup'
import { useBudgets } from "../../hooks/useBudgets"
import { useWallets } from "../../hooks/useWallets"
import MyRadioInput from "../forms/MyRadioInput"
import MyCashInput from "../forms/MyCashInput"
import { useState, useEffect } from 'react'
import DateInput from "../forms/DateInput"
import MyInput from "../forms/MyInput"
import Modal from './index.jsx'
import './_index.scss'

const ModalEditTransaction = ({ isOpen, onClose, selectedTransaction, onUpdateTransaction, onDeleteTransaction }) => {
  const { categories } = useCategories()
  const { wallets, updateWallet } = useWallets()
  const { budgets, updateBudget } = useBudgets()
  const { deleteTransaction } = useTransactions();

  const [name, setName] = useState("")
  const [wallet, setWallet] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
  const [transactionDate, setTransactionDate] = useState(new Date())
  const [transactionAmount, setTransactionAmount] = useState("")
  const [transactionType, setTransactionType] = useState("expense")

  



  const [isCategoryListVisible, setCategoryListVisible] = useState(false)
  const [isWalletListVisible, setWalletListVisible] = useState(false)

  useEffect(() => {
    if (selectedTransaction) {
      setName(selectedTransaction.name || '')
      setWallet(selectedTransaction.wallet || '')
      setCategory(selectedTransaction.category || '')
      setDescription(selectedTransaction.description || '')
      setTransactionAmount(selectedTransaction.transactionAmount || '')
      setTransactionType(selectedTransaction.transactionType || 'expense')

      const dateValue = selectedTransaction.transactionDate

      if (dateValue) {
        const parsedDate = dateValue.toDate ? dateValue.toDate() : new Date(dateValue)

        if (!isNaN(parsedDate.getTime())) {
          setTransactionDate(parsedDate)
        } else {
          console.error('Invalid transaction date:', dateValue)
        }
      } else {
        setTransactionDate(new Date())
      }
    }
  }, [selectedTransaction])

  const onSubmit = (e) => {
    e.preventDefault()
    const updatedTransaction = {
      id: selectedTransaction.id,
      name,
      wallet,
      category,
      description,
      transactionAmount,
      transactionType,
      transactionDate: new Date(transactionDate),
    }
    onUpdateTransaction(updatedTransaction)


    // Aktualizacja budżetów
    budgets.forEach((budget) => {
      if (budget.categories.includes(category)) {
        const currentAmount = parseFloat(budget.actualAmount || '0');
        const transactionAmountNum = parseFloat(transactionAmount || '0');
        const oldTransactionAmountNum = parseFloat(selectedTransaction.transactionAmount || '0');

        const updatedAmount = transactionType === 'expense'
          ? currentAmount - oldTransactionAmountNum + transactionAmountNum
          : currentAmount + oldTransactionAmountNum - transactionAmountNum;

        updateBudget(budget.id, { actualAmount: updatedAmount.toString() });
      }
    });


    // Aktualizacja portfela
    const selectedWallet = wallets.find(w => w.name === wallet);
    if (selectedWallet) {
      const currentWalletAmount = parseFloat(selectedWallet.walletAmount || '0');
      const transactionAmountNum = parseFloat(transactionAmount || '0');
      const oldTransactionAmountNum = parseFloat(selectedTransaction.transactionAmount || '0');

      const updatedWalletAmount = transactionType === 'expense'
        ? currentWalletAmount + oldTransactionAmountNum - transactionAmountNum
        : currentWalletAmount - oldTransactionAmountNum + transactionAmountNum;

      updateWallet(selectedWallet.id, { walletAmount: updatedWalletAmount.toString() });
    }
    onClose()
  }

  const onDeleteConfirm = async () => {
    try {
      if (selectedTransaction) {
        const transactionAmountNum = parseFloat(selectedTransaction.transactionAmount || '0');

        // Aktualizacja portfela
        const selectedWallet = wallets.find(w => w.name === selectedTransaction.wallet);
        if (selectedWallet) {
          const currentWalletAmount = parseFloat(selectedWallet.walletAmount || '0');
          const updatedWalletAmount = selectedTransaction.transactionType === 'expense'
            ? currentWalletAmount + transactionAmountNum
            : currentWalletAmount - transactionAmountNum;

          await updateWallet(selectedWallet.id, { walletAmount: updatedWalletAmount.toString() });
        }

        // Aktualizacja budżetów
        budgets.forEach(async (budget) => {
          if (budget.categories.includes(selectedTransaction.category)) {
            const currentAmount = parseFloat(budget.actualAmount || '0');
            const updatedAmount = selectedTransaction.transactionType === 'expense'
              ? currentAmount - transactionAmountNum
              : currentAmount + transactionAmountNum;

            await updateBudget(budget.id, { actualAmount: updatedAmount.toString() });
          }
        });

        // Usuwanie transakcji
        await deleteTransaction(selectedTransaction.id);
        setIsDeletePopupOpen(false);  // Zamknięcie popupa po usunięciu
        onClose(); // Zamknięcie modala edycji
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleWalletInputClick = () => {
    setWalletListVisible(true)
    setCategoryListVisible(false) // Ukryj listę kategorii
  }

  const handleWalletSelection = (selectedWallet) => {
    setWallet(selectedWallet)
    setWalletListVisible(false)
  }

  const handleCategoryInputClick = () => {
    setCategoryListVisible(true)
    setWalletListVisible(false) // Ukryj listę portfeli
  }

  const handleCategorySelection = (selectedCategory) => {
    setCategory(selectedCategory)
    setCategoryListVisible(false)
  }

  const handleDeleteClick = () => {
    setIsDeletePopupOpen(true)
  }


  const modalTitle = isCategoryListVisible
    ? "Wybierz kategorię"
    : isWalletListVisible
      ? "Wybierz portfel"
      : "Edytuj Transakcję"

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => onClose(false)} title={modalTitle}>

        {(isCategoryListVisible || isWalletListVisible) ? null : (
          <div className="modalAddTransaction">
            <div className="delete" onClick={handleDeleteClick}>
              Usuń
            </div>
            <form onSubmit={onSubmit}>

              <MyInput
                label="Nazwa"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={'Wpisz nazwę'}
                required
                focus
              />

              <DateInput
                transactionDate={transactionDate}
                setTransactionDate={setTransactionDate}
              />

              <MyRadioInput
                name="transactionType"
                value1="expense"
                label1="Wydatek"
                checked1={transactionType === 'expense'}
                onChange1={(e) => setTransactionType(e.target.value)}
                value2="income"
                label2="Przychód"
                checked2={transactionType === 'income'}
                onChange2={(e) => setTransactionType(e.target.value)}
              />


              <MyInput
                label="Portfel"
                placeholder={"Wybierz portfel"}
                type="text"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                click={handleWalletInputClick}
                required
              />

              <MyInput
                label="Kategoria"
                placeholder={"Wybierz kategorię"}
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                click={handleCategoryInputClick}
                required
              />

              <MyCashInput
                label="Kwota"
                placeholder="Podaj kwotę"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                required
              />

              <MyInput
                label="Opis"
                type="text"
                value={description}
                placeholder={'Wpisz opis'}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="btnWrap">
                <button className="btn btn--empty">Anuluj</button>
                <button className="btn btn--blue" type="submit">Dodaj</button>
              </div>

            </form>

          </div>)}

        {isCategoryListVisible && (
          <div className="modalAddTransaction--category">
            <div className="back" onClick={() => setCategoryListVisible(false)}><i className="icon icon--arrow-left s24"></i></div>
            {categories.map((category) => {
              const { id, name, categoryType, icon, color, bgColor } = category
              return (
                categoryType === transactionType && (
                  <div key={id} className="categories__item" onClick={() => handleCategorySelection(name)}>
                    <div className="categories__item__icon">
                      <div className="iconWrap" style={{ backgroundColor: `var(${bgColor})` }}>
                        <i className={`icon icon--${icon}`} style={{ backgroundColor: `var(${color})` }}></i>
                      </div>
                    </div>
                    <div className="categories__item__name">
                      <span>{name}</span>
                    </div>
                    <div className="categories__item__action">
                      <i className="icon icon--arrow-right"></i>
                    </div>
                  </div>)
              )
            })}
          </div>
        )}

        {isWalletListVisible && (
          <div className="modalAddTransaction--wallets">
            <div className="back" onClick={() => setWalletListVisible(false)}><i className="icon icon--arrow-left s24"></i></div>
            {wallets.map((wallet) => {
              const { id, name, walletAmount } = wallet
              return (
                <>
                  <div className="universal__item" key={id} onClick={() => handleWalletSelection(name)}>
                    <div className="universal__item__body">
                      <div className="top">
                        <h2>{name}</h2>
                      </div>
                      <div className="bottom">
                        <h4>{Number(walletAmount).toFixed(2) + ' zł'}</h4>
                      </div>
                    </div>
                    <div className="universal__item__arr">
                      <i className="icon icon--arrow-right"></i>
                    </div>
                  </div>
                </>
              )
            })}
          </div>
        )}
      </Modal>
      <DeletePopup
        isOpen={isDeletePopupOpen}
        onDeleteConfirm={onDeleteConfirm}
        onClose={() => setIsDeletePopupOpen(false)}
      />
    </>)
}

export default ModalEditTransaction
