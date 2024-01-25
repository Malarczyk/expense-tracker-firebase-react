import MyCashInput from "../../../components/forms/MyCashInput"
import { useCategories } from "../../../hooks/useCategories"
import MyInput from "../../../components/forms/MyInput"
import { useBudgets } from "../../../hooks/useBudgets"
import Modal from '../../../components/Modal'
import { useState, useEffect } from 'react'


const ModalAddBudget = ({ isOpen, onClose }) => {
  const { addBudget } = useBudgets()
  const { categories } = useCategories()
  const [name, setName] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [category, setCategory] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isCategoryListVisible, setCategoryListVisible] = useState(false)


  const handleCategoryInputClick = () => {
    setCategoryListVisible(true)
  }

  const handleCategorySelection = (selectedCategory) => {
    if (selectedCategories.includes(selectedCategory)) {
      setSelectedCategories(selectedCategories.filter(category => category !== selectedCategory))
    } else {
      setSelectedCategories([...selectedCategories, selectedCategory])
    }
  }

  const handleCategoriesConfirm = () => {
    if (selectedCategories.length > 0) {
      setCategoryListVisible(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    console.log(selectedCategories)
    addBudget({
      name,
      categories: selectedCategories,
      maxAmount,
      actualAmount: '0',
    })
    // Reset stanu po dodaniu budżetu
    setName('')
    setMaxAmount('')
    setSelectedCategories([])
    setCategory('')
    onClose()
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
              required
              focus
            />
            <MyCashInput
              label="Kwota"
              placeholder="Podaj kwotę"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              required
            />
            <MyInput
              label="Kategoria"
              placeholder={"Wybierz kategorię"}
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              click={handleCategoryInputClick}
              readonly
              required
            />
            <div className="btnWrap">
              <button className="btn btn--empty" onClick={() => onClose(false)}>Anuluj</button>
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
