import MyCashInput from "../../../components/forms/MyCashInput"
import { useCategories } from "../../../hooks/useCategories"
import DeletePopup from '../../../components/DeletePopup'
import MyInput from "../../../components/forms/MyInput"
import Modal from '../../../components/Modal'
import { useState, useEffect } from 'react'


const ModalEditBudget = ({ isOpen, onClose, selectedBudget, onUpdateBudget, onDeleteBudget }) => {
  const { categories } = useCategories()

  const [name, setName] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [actualAmount, setActualAmount] = useState("")
  const [category, setCategory] = useState([])

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isCategoryListVisible, setCategoryListVisible] = useState(false)

  useEffect(() => {
    if (selectedBudget) {
      setName(selectedBudget.name || '')
      setMaxAmount(selectedBudget.maxAmount || '')
      setActualAmount(selectedBudget.actualAmount || '')
      const categoriesArray = Array.isArray(selectedBudget.categories) ? selectedBudget.categories : []
      setSelectedCategories(categoriesArray)
      setCategory(categoriesArray.join(', '))
    }
  }, [selectedBudget])

  const handleCategoryInputClick = () => {
    setCategoryListVisible(true)
  }

  const handleCategorySelection = (selectedCategory) => {
    let updatedSelectedCategories;
    if (selectedCategories.includes(selectedCategory)) {
      updatedSelectedCategories = selectedCategories.filter(category => category !== selectedCategory)
    } else {
      updatedSelectedCategories = [...selectedCategories, selectedCategory]
    }
    setSelectedCategories(updatedSelectedCategories)
    setCategory(updatedSelectedCategories.join(', ')) 
  }

  const handleCategoriesConfirm = () => {
    if (selectedCategories.length > 0) {
      setCategoryListVisible(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const updatedBudget = {
      id: selectedBudget.id,
      name,
      categories: selectedCategories,
      maxAmount,
      actualAmount,
    }
    onUpdateBudget(updatedBudget)
    onClose()
  }

  useEffect(() => {
    setCategory(selectedCategories.join(', '))
  }, [selectedCategories])

  const handleDeleteClick = () => {
    setIsDeletePopupOpen(true)
  }

  const modalTitle = isCategoryListVisible ? "Wybierz kategorię" : "Edytuj Budżet"

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => onClose(false)} title={modalTitle}>

        {!isCategoryListVisible &&
          <div className="modalAddBudget">
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
              <MyCashInput
                label="Limit"
                placeholder="Podaj kwotę"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                required
              />
              <MyCashInput
                label="Aktualny stan"
                placeholder="Podaj kwotę"
                value={actualAmount}
                canZero={true}
                onChange={(e) => setActualAmount(e.target.value)}
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
              <div className="btnWrap">
                <div className="btn btn--empty" onClick={() => onClose(false)}>Anuluj</div>
                <button className="btn btn--blue" type="submit">Aktualizuj</button>
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
      <DeletePopup
        isOpen={isDeletePopupOpen}
        onDeleteConfirm={() => {
          onDeleteBudget(selectedBudget.id)
          setIsDeletePopupOpen(false)
        }}
        onClose={() => setIsDeletePopupOpen(false)}
        text={'Klikając: "Tak", usuniesz ten budzet nieodwracalnie.'}
      />
    </>
  )
}

export default ModalEditBudget
