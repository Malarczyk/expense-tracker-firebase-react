import MyCashInput from "../../../components/forms/MyCashInput"
import { useCategories } from "../../../hooks/useCategories"
import MyInput from "../../../components/forms/MyInput"
import { useBudgets } from "../../../hooks/useBudgets"
import { useTransactions } from "../../../hooks/useTransactions" // Załóżmy, że mamy hook do pobierania transakcji
import Modal from '../../../components/Modal'
import { useState, useEffect } from 'react'

const ModalAddBudget = ({ isOpen, onClose }) => {
  const { addBudget } = useBudgets()
  const { transactions } = useTransactions() // Pobierz transakcje
  const { categories } = useCategories()
  
  const [name, setName] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [category, setCategory] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isCategoryListVisible, setCategoryListVisible] = useState(false)
  const [errors, setErrors] = useState({ name: false, category: false, maxAmount: false });

  const validateForm = () => {
    const newErrors = {}
    newErrors.name = !name
    newErrors.category = !category
    newErrors.maxAmount = !maxAmount
    setErrors(newErrors)
    return !newErrors.name && !newErrors.category && !newErrors.maxAmount
  }
  const handleCategoryInputClick = () => {
    setCategoryListVisible(true)
  }

  const handleCategorySelection = (selectedCategory) => {
    const updatedCategories = selectedCategories.includes(selectedCategory)
      ? selectedCategories.filter(category => category !== selectedCategory)
      : [...selectedCategories, selectedCategory]
    setSelectedCategories(updatedCategories)
    setCategory(updatedCategories.join(', '))
  }

  const handleCategoriesConfirm = () => {
    if (selectedCategories.length > 0) {
      setCategoryListVisible(false)
    }
  }

  const calculateActualAmount = () => {
    const currentDate = new Date();
    const currentMonthTransactions = transactions.filter(transaction => {
      const transactionDate = transaction.transactionDate.toDate();
      return transactionDate.getMonth() === currentDate.getMonth() && transactionDate.getFullYear() === currentDate.getFullYear();
    });
  
    const relevantTransactions = currentMonthTransactions.filter(transaction =>
      selectedCategories.includes(transaction.category)
    );
  
    const totalSpent = relevantTransactions.reduce((total, transaction) => {
      return total + parseFloat(transaction.transactionAmount || '0');
    }, 0);

    return totalSpent.toString();
  };

  const onSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()){
    const actualAmount = calculateActualAmount()

    const newBudget = {
      name,
      categories: selectedCategories,
      maxAmount,
      actualAmount,
    }
    
    await addBudget(newBudget)

    setName('')
    setMaxAmount('')
    setSelectedCategories([])
    setCategory('')
    onClose()}
  }

  useEffect(() => {
    setCategory(selectedCategories.join(', '))
  }, [selectedCategories])

  const modalTitle = isCategoryListVisible ? "Wybierz kategorię" : "Dodaj Budżet"
  
  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} title={modalTitle}>
      {!isCategoryListVisible &&
        <div className="modalAddBudget">
          <form onSubmit={onSubmit}>
            <MyInput
              label="Nazwa"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={'Wpisz nazwę'}
              error={errors.name && "Pole nazwa nie może być puste"}
            />
            <MyCashInput
              label="Kwota"
              placeholder="Podaj kwotę"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              error={errors.maxAmount && "Pole kwota nie może być puste"}
            />
            <MyInput
              label="Kategoria"
              placeholder={"Wybierz kategorię"}
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              click={handleCategoryInputClick}
              readonly
              error={errors.category && "Pole kategoria nie może być puste"}
            />
            <div className="btnWrap">
              <div className="btn btn--empty" onClick={() => onClose(false)}>Anuluj</div>
              <button className="btn btn--blue" type="submit">Dodaj</button>
            </div>
          </form>
        </div>}

      {isCategoryListVisible && (
        <div className="modalAddTransaction--category">
          <div className="back" onClick={() => setCategoryListVisible(false)}><i className="icon icon--arrow-left s24"></i></div>
          {categories.map((category) => {
            const { id, name, categoryType, icon, color, bgColor } = category
            return (
              categoryType === 'expense' && (
                <div 
                  key={id} 
                  className={`categories__item ${selectedCategories.includes(name) ? 'selected' : ''}`} 
                  onClick={() => handleCategorySelection(name)}
                >
                  <div className="categories__item__icon">
                    <div 
                      className={`iconWrap ${selectedCategories.includes(name) ? 'selected' : ''}`} 
                      style={{ backgroundColor: selectedCategories.includes(name) ? 'var(--success-color)' : `var(${bgColor})` }}
                    >
                      <i className={`icon icon--${icon}`} style={{ backgroundColor: `var(${color})` }}></i>
                    </div>
                  </div>
                  <div className="categories__item__name">
                    <span>{name}</span>
                  </div>
                  <div className="categories__item__action">
                    <i className="icon icon--arrow-right"></i>
                  </div>
                </div>
              )
            )
          })}
          <div className="btnWrap">
            <button className="btn btn--empty" onClick={() => setCategoryListVisible(false)}>Anuluj</button>
            <button 
              className={`btn btn--blue ${selectedCategories.length === 0 ? '--disabled' : ''}`} 
              onClick={handleCategoriesConfirm}
            >
              Wybierz
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default ModalAddBudget
