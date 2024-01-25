import MyCashInput from "../../../components/forms/MyCashInput"
import MyInput from "../../../components/forms/MyInput"
import { useWallets } from "../../../hooks/useWallets"
import Modal from '../../../components/Modal'
import { useState } from 'react'

const ModalAddWallet = ({ isOpen, onClose}) => {
  const { addWallet } = useWallets()

  const [name, setName] = useState("")
  const [walletAmount, setWalletAmount] = useState("")

  const onSubmit = (e) => {
    e.preventDefault()
    addWallet({
      name,
      walletAmount
    })
    setName('')
    setWalletAmount('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} title="Dodaj Portfel">

      <div className="modalAddWallet">


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
            value={walletAmount}
            onChange={(e) => setWalletAmount(e.target.value)}
            required
          />

          <div className="btnWrap">
            <button className="btn btn--empty">Anuluj</button>
            <button className="btn btn--blue" type="submit">Dodaj</button>
          </div>
        </form>

      </div>

    </Modal>
  )
}

export default ModalAddWallet