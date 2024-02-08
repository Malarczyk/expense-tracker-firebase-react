import MyCashInput from "../../../components/forms/MyCashInput"
import DeletePopup from '../../../components/DeletePopup'
import MyInput from "../../../components/forms/MyInput"
import Modal from '../../../components/Modal'
import { useState, useEffect } from 'react'

const ModalEditWallet = ({ isOpen, onClose, selectedWallet, onUpdateWallet, onDeleteWallet }) => {
  const [name, setName] = useState("")
  const [walletAmount, setWalletAmount] = useState("")
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)

  useEffect(() => {
    if (selectedWallet) {
      setName(selectedWallet.name || '')
      setWalletAmount(selectedWallet.walletAmount || '')
    }
  }, [selectedWallet])

  const onSubmit = (e) => {
    e.preventDefault()

    const updatedWallet = {
      id: selectedWallet.id,
      name,
      walletAmount
    }
    onUpdateWallet(updatedWallet)
    onClose()
  }

  const handleDeleteClick = () => {
    setIsDeletePopupOpen(true)
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => onClose(false)} title="Edytuj Portfel">

        <div className="modalAddWallet">
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
              label="Kwota"
              placeholder="Podaj kwotę"
              value={walletAmount}
              onChange={(e) => setWalletAmount(e.target.value)}
              required
            />

            <div className="btnWrap">
              <div className="btn btn--empty" onClick={() => onClose(false)}>Anuluj</div>
              <button className="btn btn--blue" type="submit">Aktualizuj</button>
            </div>
          </form>

        </div>

      </Modal>

      <DeletePopup
        isOpen={isDeletePopupOpen}
        onDeleteConfirm={() => {
          onDeleteWallet(selectedWallet.id)
          setIsDeletePopupOpen(false) // Zamknij popup po usunięciu
        }}
        onClose={() => setIsDeletePopupOpen(false)}
      />
    </>
  )
}

export default ModalEditWallet