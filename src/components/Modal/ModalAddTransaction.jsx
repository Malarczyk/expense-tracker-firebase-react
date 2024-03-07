import { useTransactions } from "../../hooks/useTransactions.js"
import { useCategories } from "../../hooks/useCategories"
import { useBudgets } from "../../hooks/useBudgets"
import { useWallets } from "../../hooks/useWallets"
import MyRadioInput from "../forms/MyRadioInput"
import MyCashInput from "../forms/MyCashInput"
import DateInput from "../forms/DateInput"
import MyInput from "../forms/MyInput"
import { useState } from 'react'
import Modal from './index.jsx'
import './_index.scss'

const ModalAddTransaction = ({ isOpen, onClose }) => {
  const { addTransaction } = useTransactions()
  const { categories } = useCategories()
  const { wallets } = useWallets()

  const [name, setName] = useState("")
  const [wallet, setWallet] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [transactionDate, setTransactionDate] = useState(new Date())
  const [transactionAmount, setTransactionAmount] = useState("")
  const [transactionType, setTransactionType] = useState("expense")

  const { updateWallet } = useWallets()
  const { budgets, updateBudget } = useBudgets()

  const [isCategoryListVisible, setCategoryListVisible] = useState(false)
  const [isWalletListVisible, setWalletListVisible] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    const transactionAmountNum = parseFloat(transactionAmount || '0')
    addTransaction({
      name: name || "Brak nazwy",
      wallet,
      category: category || "Brak kategorii",
      description,
      transactionAmount: transactionAmountNum.toString(),
      transactionType,
      transactionDate: new Date(transactionDate),
    })
    // Aktualizacja budżetów
    budgets.forEach((budget) => {
      if (budget.categories.includes(category)) {
        const currentAmount = parseFloat(budget.actualAmount || '0')
        const updatedAmount = transactionType === 'expense'
          ? currentAmount + transactionAmountNum
          : currentAmount - transactionAmountNum

        updateBudget(budget.id, { actualAmount: updatedAmount.toString() })
      }
    })


    // Aktualizacja portfela
    const selectedWallet = wallets.find(w => w.name === wallet)
    if (selectedWallet) {
      const currentWalletAmount = parseFloat(selectedWallet.walletAmount || '0')
      const updatedWalletAmount = transactionType === 'expense'
        ? currentWalletAmount - transactionAmountNum
        : currentWalletAmount + transactionAmountNum

      updateWallet(selectedWallet.id, { walletAmount: updatedWalletAmount.toString() })
    }


    setName('')
    setWallet('')
    setCategory('')
    setDescription('')
    setTransactionAmount('')
    onClose()
  }

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


  const modalTitle = isCategoryListVisible
    ? "Wybierz kategorię"
    : isWalletListVisible
      ? "Wybierz portfel"
      : "Dodaj Transakcję"

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} title={modalTitle}>

      {(isCategoryListVisible || isWalletListVisible) ? null : (
        <div className="modalAddTransaction">
          <form onSubmit={onSubmit}>

            <MyInput
              label="Nazwa"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={'Wpisz nazwę'}            
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
              <div className="btn btn--empty" onClick={() => onClose(false)}>Anuluj</div>
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
  )
}

export default ModalAddTransaction
