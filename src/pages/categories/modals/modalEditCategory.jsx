import MyRadioInput from '../../../components/forms/MyRadioInput'
import MyInputColor from '../../../components/forms/MyInputColor'
import DeletePopup from '../../../components/DeletePopup'
import MyInput from '../../../components/forms/MyInput'
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

    onUpdateCategory(updatedCategory)
    onClose()
  }

  const handleDeleteClick = () => {
    setIsDeletePopupOpen(true) // Pokaż popup
  }
  const modalTitle = isIconListVisible
    ? "Wybierz ikonę"
    : "Dodaj Kategorię"
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

            <MyInputColor setColor={setColor} setBgColor={setBgColor} />

            <MyInput
              label="Ikona"
              placeholder={'Wybierz ikonę'}
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              click={handleIconInputClick}
            />
            <div className="btnWrap">
              <button className="btn btn--empty">Anuluj</button>
              <button className="btn btn--blue" type="submit">Dodaj</button>
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
        onDeleteConfirm={() => {
          onDeleteCategory(selectedCategory.id)
          setIsDeletePopupOpen(false) // Zamknij popup po usunięciu
        }}
        onClose={() => setIsDeletePopupOpen(false)}
      />
    </>
  )
}

export default ModalEditCategory