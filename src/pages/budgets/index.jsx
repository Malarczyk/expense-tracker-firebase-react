import TopBar from "../../components/TopBar"
import { useState } from "react"
import { useGetBudgets } from "../../hooks/useGetBudgets"
import ModalAddBudget from './modals/modalAddBudget'
import './_index.scss'
import ButtonAdd from "../../components/ButtonAdd"

const Budgets = () => {
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState(null)
  const { budgets } = useGetBudgets()

  const handleBudgetClick = (wallet) => {
    setSelectedBudget(wallet);
    setIsModalEditOpen(true);
  }

  return (<>
    <ModalAddBudget isOpen={isModalAddOpen} onClose={() => setIsModalAddOpen(false)} />
    <div className="budgets">
      <TopBar title={'Budżety'} />

      <div className="budgets__content">

        {budgets ? (
          budgets.map((budget) => {
            const { id, name, maxAmount, actualAmount} = budget
            return (
              <div className="universal__item" key={id} onClick={() => handleBudgetClick()}>
                <div className="universal__item__body">
                  <div className="top">
                    <h2>{name}</h2>
                  </div>
                  <div className="bottom">
                    <h4>{Number(actualAmount).toFixed(2) + ' zł'}</h4>
                    <h4>{'z ' + Number(maxAmount).toFixed(2) + ' zł'}</h4>
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
      <ButtonAdd action={()=>setIsModalAddOpen(true)} />
    </div>
  </>
  )
}

export default Budgets