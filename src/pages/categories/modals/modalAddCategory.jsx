import MyInputColor from "../../../components/forms/MyInputColor"
import MyRadioInput from "../../../components/forms/MyRadioInput"
import { useCategories } from "../../../hooks/useCategories"
import MyInput from "../../../components/forms/MyInput"
import Modal from '../../../components/Modal'
import icons from './icons.json'
import { useState } from 'react'


const ModalAddCategory = ({ isOpen, onClose }) => {
  const { addCategory } = useCategories()

  const [name, setName] = useState("")
  const [icon, setIcon] = useState("")
  const [color, setColor] = useState("")
  const [bgColor, setBgColor] = useState("")
  const [categoryType, setCategoryType] = useState("expense")
  const [isIconListVisible, setIconListVisible] = useState(false)

  const handleIconInputClick = () => {
    setIconListVisible(true)
  }

  const handleIconSelection = (selectedIcon) => {
    setIcon(selectedIcon)
    setIconListVisible(false)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    addCategory({
      name,
      icon,
      color,
      bgColor,
      categoryType,
    })
    setName('')
    setIcon('')
    setColor('')
    setBgColor('')
    onClose()
  }

  const modalTitle = isIconListVisible
    ? "Wybierz ikonę"
    : "Dodaj Kategorię"

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} title={modalTitle}>

      {!isIconListVisible && <div className="modalAddCategory">

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
            isIcon={true}
          />
          <div className="btnWrap">
            <div className="btn btn--empty" onClick={() => onClose(false)}>Anuluj</div>
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
  )
}

export default ModalAddCategory