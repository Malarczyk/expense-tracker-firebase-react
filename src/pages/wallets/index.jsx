import UniversalSkeleton from '../../components/skeleton/UniversalSkeleton'
import UniversalEmpty from '../../components/skeleton/UniversalEmpty'
import ModalEditWallet from './modals/modalEditWallet'
import ModalAddWallet from './modals/modalAddWallet'
import { useWallets } from "../../hooks/useWallets"
import ButtonAdd from "../../components/ButtonAdd"
import TopBar from "../../components/TopBar"
import { useState } from "react"
import './_index.scss'

const Wallets = () => {
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState(null)
  const { wallets, deleteWallet, updateWallet, isWalletsLoading } = useWallets()

  const handleWalletClick = (wallet) => {
    setSelectedWallet(wallet)
    setIsModalEditOpen(true)
  }

  const handleUpdateWallet = (updatedWallet) => {
    try {
      updateWallet(updatedWallet.id, updatedWallet)
      setIsModalEditOpen(false)
      setSelectedWallet(null)
    } catch (error) {
      console.error('Error updating wallet:', error)
    }
  }

  return (<>
    <ModalAddWallet isOpen={isModalAddOpen} onClose={() => setIsModalAddOpen(false)} />
    <ModalEditWallet
      isOpen={isModalEditOpen}
      onClose={() => setIsModalEditOpen(false)}
      selectedWallet={selectedWallet}
      onUpdateWallet={handleUpdateWallet}
      onDeleteWallet={(walletId) => {
        deleteWallet(walletId)
      }} />
    <div className="wallets">
      <TopBar title={'Portfele'} />
      <div className="wallets__title">
        <h1>Twoje portfele</h1>
      </div>
      <div className="wallets__content">
        {isWalletsLoading
          ? (<UniversalSkeleton amount={4}/>)
          : (
            wallets.length > 0 ? (
              wallets.map((wallet) => {
                const { id, name, walletAmount } = wallet
                return (
                  <div className="universal__item" key={id} onClick={() => handleWalletClick(wallet)}>
                    <div className="universal__item__body">
                      <div className="top">
                        <h2>{name}</h2>
                      </div>
                      <div className="bottom">
                        <h4>{Number(walletAmount).toFixed(2) + ' zł'}</h4>
                      </div>
                    </div>
                    <div className="universal__item__arr">
                      <i className="icon icon--arrow-right"></i>
                    </div>
                  </div>
                )
              })
            ) : (
              <UniversalEmpty />
            )
          )}
      </div>

      <ButtonAdd action={() => setIsModalAddOpen(true)} />
    </div>
  </>
  )
}

export default Wallets