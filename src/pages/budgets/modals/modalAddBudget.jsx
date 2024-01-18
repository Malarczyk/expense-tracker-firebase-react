import { useAddBudgets } from "../../../hooks/useAddBudgets"
import { useState } from 'react'
import Modal from '../../../components/Modal'

const ModalAddBudget = ({ isOpen, onClose }) => {
  const { addBudget } = useAddBudgets()

  const [name, setName] = useState("")
  const [maxAmount, setMaxAmount] = useState("")

  const onSubmit = (e) => {
    e.preventDefault()
    addBudget({
      name,
      categories: ['Jedzenie', 'Sport'],
      maxAmount,
      actualAmount: '0',
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} title="Dodaj Budzet">

      <div className="modalAddBudget">

        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)} />

          <input
            type="text"
            placeholder="Max kwota"
            required
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)} />

          <button type="submit">Add</button>
        </form>

      </div>

    </Modal>
  )
}

export default ModalAddBudget