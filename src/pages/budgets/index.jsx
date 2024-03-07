import UniversalSkeleton from '../../components/skeleton/UniversalSkeleton'
import UniversalEmpty from '../../components/skeleton/UniversalEmpty'
import ModalEditBudget from './modals/modalEditBudget'
import ModalAddBudget from './modals/modalAddBudget'
import { useBudgets } from "../../hooks/useBudgets"
import ButtonAdd from "../../components/ButtonAdd"
import TopBar from "../../components/TopBar"
import { useState } from "react"
import './_index.scss'


const Budgets = () => {
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)

  const [selectedBudget, setSelectedBudget] = useState(null)
  const { budgets, isBudgetsLoading, updateBudget, deleteBudget } = useBudgets()


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
        {isBudgetsLoading
          ? <UniversalSkeleton amount={3}/>
          : (
            budgets.length > 0 ? (
              budgets.map((budget) => {
                const { id, name, maxAmount, actualAmount } = budget
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
              <UniversalEmpty />
            )
          )}

      </div>
      <ButtonAdd action={() => setIsModalAddOpen(true)} />
    </div>
  </>
  )
}

export default Budgets