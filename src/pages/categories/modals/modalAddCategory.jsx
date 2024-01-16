import { useAddCategories } from "../../../hooks/useAddCategories"
import { useState } from 'react'
import Modal from '../../../components/Modal'

const ModalAddCategory = ({ isOpen, onClose }) => {
  const { addCategory } = useAddCategories()

  const [name, setName] = useState("")
  const [icon, setIcon] = useState("")
  const [color, setColor] = useState("")
  const [bgColor, setBgColor] = useState("")
  const [categoryType, setcategoryType] = useState("expense")

  const onSubmit = (e) => {
    e.preventDefault()
    addCategory({
      name,
      icon,
      color,
      bgColor,
      categoryType,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} title="Dodaj Kategorię">

      <div className="modalAddCategory">

        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)} />

          <input
            type="text"
            placeholder="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)} />

          <input
            type="text"
            placeholder="bgColor"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)} />

          <input
            type="text"
            placeholder="Icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)} />

          <input
            type="radio"
            id="expense"
            value="expense"
            checked={categoryType === "expense"}
            onChange={(e) => setcategoryType(e.target.value)} />

          <label htmlFor="expense">Expense</label>

          <input
            type="radio"
            id="income"
            value="income"
            checked={categoryType === "income"}
            onChange={(e) => setcategoryType(e.target.value)} />

          <label htmlFor="income">Income</label>

          <button type="submit">Add</button>
        </form>

      </div>

    </Modal>
  )
}

export default ModalAddCategory