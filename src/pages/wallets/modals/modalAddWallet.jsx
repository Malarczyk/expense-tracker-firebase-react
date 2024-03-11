import MyCashInput from "../../../components/forms/MyCashInput"
import MyInput from "../../../components/forms/MyInput"
import { useWallets } from "../../../hooks/useWallets"
import Modal from '../../../components/Modal'
import { useState } from 'react'

const ModalAddWallet = ({ isOpen, onClose}) => {
  const { addWallet } = useWallets()

  const [name, setName] = useState("")
  const [walletAmount, setWalletAmount] = useState("")
  const [errors, setErrors] = useState({ name: false, walletAmount: false });

  const validateForm = () => {
    const newErrors = {}
    newErrors.name = !name
    newErrors.walletAmount = !walletAmount
    setErrors(newErrors)
    return !newErrors.name && !newErrors.walletAmount
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      addWallet({
        name,
        walletAmount
      });
      setName('');
      setWalletAmount('');
      onClose();
    }
  };

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
            error={errors.name && "Pole nazwa nie może być puste"}
          />

          <MyCashInput
            label="Kwota"
            placeholder="Podaj kwotę"
            value={walletAmount}
            onChange={(e) => setWalletAmount(e.target.value)}
            error={errors.name && "Pole kwota nie może być puste"}
          />

          <div className="btnWrap">
            <div className="btn btn--empty" onClick={() => onClose(false)}>Anuluj</div>
            <button className="btn btn--blue" type="submit">Dodaj</button>

          </div>
        </form>

      </div>

    </Modal>
  )
}

export default ModalAddWallet