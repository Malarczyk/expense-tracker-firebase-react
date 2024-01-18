import TopBar from "../../components/TopBar"
import { useState } from "react"
import { useGetWallets } from "../../hooks/useGetWallets"
import ModalAddWallet from './modals/modalAddWallet'
import './_index.scss'
import ButtonAdd from "../../components/ButtonAdd"

const Wallets = () => {
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState(null)
  const { wallets } = useGetWallets()

  const handleWalletClick = (wallet) => {
    setSelectedWallet(wallet);
    setIsModalEditOpen(true);
  }

  return (<>
    <ModalAddWallet isOpen={isModalAddOpen} onClose={() => setIsModalAddOpen(false)} />
    <div className="wallets">
      <TopBar title={'Portfele'}/>

      <div className="wallets__content">

        {wallets ? (
          wallets.map((wallet) => {
            const { id, name, walletAmount } = wallet
            return (
              <div className="universal__item" key={id} onClick={() => handleWalletClick()}>
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
          <p>Brak kategorii</p>
        )}
      </div>

      <ButtonAdd action={()=>setIsModalAddOpen(true)}/>
    </div>
  </>
  )
}

export default Wallets