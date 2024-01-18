import { useAddWallets } from "../../../hooks/useAddWallets"
import { useState } from 'react'
import Modal from '../../../components/Modal'

const ModalAddWallet = ({ isOpen, onClose }) => {
  const { addWallet } = useAddWallets()

  const [name, setName] = useState("")
  const [walletAmount, setWalletAmount] = useState("")

  const onSubmit = (e) => {
    e.preventDefault()
    addWallet({
      name,
      walletAmount
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} title="Dodaj Kategorię">

      <div className="modalAddWallet">

        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)} />

          <input
            type="text"
            placeholder="hajs"
            value={walletAmount}
            onChange={(e) => setWalletAmount(e.target.value)} />

          <button type="submit">Add</button>
        </form>

      </div>

    </Modal>
  )
}

export default ModalAddWallet