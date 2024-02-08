import MyRadioInput from '../../../components/forms/MyRadioInput'
import MyInputColor from '../../../components/forms/MyInputColor'
import { useTransactions } from "../../../hooks/useTransactions"
import DeletePopup from '../../../components/DeletePopup'
import MyInput from '../../../components/forms/MyInput'
import { useBudgets } from "../../../hooks/useBudgets"
import Modal from '../../../components/Modal'
import { useState, useEffect } from 'react'
import icons from './icons.json'

const ModalEditCategory = ({ isOpen, onClose, selectedCategory, onUpdateCategory, onDeleteCategory }) => {

  const [name, setName] = useState("")
  const [icon, setIcon] = useState("")
  const [color, setColor] = useState("")
  const [bgColor, setBgColor] = useState("")
  const [categoryType, setCategoryType] = useState("expense")

  const [isIconListVisible, setIconListVisible] = useState(false)
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)

  const { transactions, updateTransaction } = useTransactions()
  const { budgets, deleteBudget } = useBudgets()

  const handleIconInputClick = () => {
    setIconListVisible(true)
  }

  const handleIconSelection = (selectedIcon) => {
    setIcon(selectedIcon)
    setIconListVisible(false)
  }

  // Efekt do aktualizacji stanu po otrzymaniu selectedCategory
  useEffect(() => {
    if (selectedCategory) {
      setName(selectedCategory.name || '')
      setIcon(selectedCategory.icon || '')
      setColor(selectedCategory.color || '')
      setBgColor(selectedCategory.bgColor || '')
      setCategoryType(selectedCategory.categoryType || 'expense')
    }
  }, [selectedCategory])

  const onSubmit = (e) => {
    e.preventDefault()

    const updatedCategory = {
      id: selectedCategory.id,
      name,
      icon,
      color,
      bgColor,
      categoryType,
    }

    // Aktualizuj nazwę kategorii w transakcjach
    transactions.forEach((transaction) => {
      if (transaction.category === selectedCategory.name) {
        updateTransaction(transaction.id, { ...transaction, category: name })
      }
    })

    onUpdateCategory(updatedCategory)
    onClose()
  }
  const handleDeleteCategory = () => {
    transactions.forEach((transaction) => {
      if (transaction.category === selectedCategory.name) {
        updateTransaction(transaction.id, { ...transaction, category: "Brak kategorii" })
      }
    })

    budgets.forEach((budget) => {
      if (budget.categories.includes(selectedCategory.name)) {
        deleteBudget(budget.id)
      }
    })

    onDeleteCategory(selectedCategory.id)
    setIsDeletePopupOpen(false)
  }

  const handleDeleteClick = () => {
    setIsDeletePopupOpen(true) // Pokaż popup
  }
  const modalTitle = isIconListVisible
    ? "Wybierz ikonę"
    : "Edytuj Kategorię"
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => onClose(false)} title={modalTitle}>
        {!isIconListVisible && <div className="modalAddCategory">
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
            <MyRadioInput
              name="transactionType"
              value1="expense"
              label1="Wydatek"
              checked1={categoryType === 'expense'}
              onChange1={(e) => setCategoryType(e.target.value)}
              value2="income"
              label2="Przychód"
              checked2={categoryType === 'income'}
              onChange2={(e) => setCategoryType(e.target.value)}
            />



            <MyInputColor
              setColor={setColor}
              setBgColor={setBgColor}
            />


            <MyInput
              label="Ikona"
              placeholder={'Wybierz ikonę'}
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              click={handleIconInputClick}
              isIcon={true}
            />
            <div className="btnWrap">
              <div className="btn btn--empty" onClick={() => onClose(false)}>Anuluj</div>
              <button className="btn btn--blue" type="submit">Aktualizuj</button>
            </div>
          </form>

        </div>}

        {isIconListVisible && (
          <div className="modalAddCategory--icon">
            <div className="back" onClick={() => setIconListVisible(false)}><i className="icon icon--arrow-left"></i></div>

            {icons.map((icon) => (
              <div key={icon.id} className="iconWrap" onClick={() => handleIconSelection(icon.id)}>
                <i className={`icon ${icon.className}`}></i>
              </div>
            ))}

          </div>)}

      </Modal>

      <DeletePopup
        isOpen={isDeletePopupOpen}
        onDeleteConfirm={handleDeleteCategory}
        onClose={() => setIsDeletePopupOpen(false)}
        message="Czy na pewno chcesz usunąć kategorię? Spowoduje to również usunięcie budżetu, który miał ją przypisaną. Możesz wejść w budżety i edytować je, a następnie usunąć tę kategorię."
      />


    </>
  )
}

export default ModalEditCategory