import { useState } from 'react'
import Modal from '../../../components/Modal'
import { useEffect } from 'react'
const ModalEditCategory = ({ isOpen, onClose, selectedCategory, onUpdateCategory }) => {

  const [name, setName] = useState("")
  const [icon, setIcon] = useState("")
  const [color, setColor] = useState("")
  const [bgColor, setBgColor] = useState("")
  const [categoryType, setCategoryType] = useState("expense")

  // Efekt do aktualizacji stanu po otrzymaniu selectedCategory
  useEffect(() => {
    if (selectedCategory) {
      setName(selectedCategory.name || '');
      setIcon(selectedCategory.icon || '');
      setColor(selectedCategory.color || '');
      setBgColor(selectedCategory.bgColor || '');
      setCategoryType(selectedCategory.categoryType || 'expense');
    }
  }, [selectedCategory]);

  const onSubmit = (e) => {
    e.preventDefault();

    const updatedCategory = {
      id: selectedCategory.id,
      name,
      icon,
      color,
      bgColor,
      categoryType,
    };

    onUpdateCategory(updatedCategory)
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} title="Edytuj Kategorię">

      <div className="modalEditCategory">

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
            placeholder="Color"
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
            onChange={(e) => setCategoryType(e.target.value)} />

          <label htmlFor="expense">Expense</label>

          <input
            type="radio"
            id="income"
            value="income"
            checked={categoryType === "income"}
            onChange={(e) => setCategoryType(e.target.value)} />

          <label htmlFor="income">Income</label>

          <button type="submit">Add</button>
        </form>

      </div>

    </Modal>
  )
}

export default ModalEditCategory