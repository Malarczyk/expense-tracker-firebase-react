import TopBar from "../../components/TopBar"
import { useState } from "react"
import { useBudgets } from "../../hooks/useBudgets"
import ModalAddBudget from './modals/modalAddBudget'
import ModalEditBudget from './modals/modalEditBudget'
import './_index.scss'
import ButtonAdd from "../../components/ButtonAdd"



const Budgets = () => {
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  
  const [selectedBudget, setSelectedBudget] = useState(null)
  const { budgets, updateBudget, deleteBudget } = useBudgets()


  const handleBudgetClick = (budget) => {
    setSelectedBudget(budget);
    setIsModalEditOpen(true);
  }

  const handleUpdateBudget = (updatedBudget) => {
    try {
      updateBudget(updatedBudget.id, updatedBudget)
      setIsModalEditOpen(false)
      setSelectedBudget(null)
    } catch (error) {
      console.error('Error updating budget:', error)
    }
  }

  return (<>
    <ModalAddBudget isOpen={isModalAddOpen} onClose={() => setIsModalAddOpen(false)} />
    <ModalEditBudget
        isOpen={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        selectedBudget={selectedBudget}
        onUpdateBudget={handleUpdateBudget}
        onDeleteBudget={(budgetId) => {
          deleteBudget(budgetId)
        }} />
    <div className="budgets">
      <TopBar title={'Budżety'} />
      <div className="budgets__title">
        <h1>Twoje budżety</h1>
      </div>
      <div className="budgets__content">
        

        {budgets ? (
          budgets.map((budget) => {
            const { id, name, maxAmount, actualAmount} = budget
            return (
              <div className="universal__item" key={id} onClick={() => handleBudgetClick(budget)}>
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