import { useGetTransactions } from "../../hooks/useGetTransactions"
import { useGetCategories } from "../../hooks/useGetCategories"
import './_index.scss'

const Dashboard = () => {
  const { transactions, transactionTotal } = useGetTransactions()
  const { income, expenses, balance } = transactionTotal

  const { categories } = useGetCategories();
  return (
    <div className='dashboard'>

      <div className="dashboard__balance">
        <div className="dashboard__balance__item">
          <div className="balance">
            <div className="balance__header">
              <h1>Bilans</h1>
              <i className="icon icon--visibility"></i>
            </div>
            <div className="balance__footer">
              <i className="icon icon--balance"></i>
              <h1>{balance}</h1>
            </div>
          </div>
        </div>
        <div className="dashboard__balance__item">
          <div className="incomeExpense">
            <i className="icon icon--expenses"></i>
            <h1>Przychody</h1>
            <h1>{income}</h1>
          </div>
          <div className="incomeExpense">
            <i className="icon icon--incomes"></i>
            <h1>Wydatki</h1>
            <h1>{expenses}</h1>
          </div>
        </div>
      </div>

      <div className="dashboard__section">
        <div className="section__title">
          <h1>Ostatnie transkacje</h1>
          <h3>Pokaż wszystkie</h3>
        </div>
        <div className="dashboard__history">
          {transactions ? (
            transactions.map((transaction) => {
              const { id, name, transactionAmount, category } = transaction;

              // Znajdź odpowiednią kategorię na podstawie nazwy
              const selectedCategory = categories.find(cat => cat.name === category);

              return (
                <div key={id} className="dashboard__history__item">
                  <div className="dashboard__history__item__icon">
                    <div className="iconWrap" style={{ backgroundColor: `var(${selectedCategory?.bgColor})` }}>
                      <i className={`icon icon--${selectedCategory?.icon}`} style={{ backgroundColor: `var(${selectedCategory?.color})` }}></i>
                    </div>
                  </div>
                  <div className="dashboard__history__item__content">
                    <h2>{name}</h2>
                    <h4>{category}</h4>
                    <h2 className="amount">{transactionAmount}</h2>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Brak</p>
          )}
        </div>
      </div>

      <div className="dashboard__section">
        <div className="section__title">
          <h1>Budżety</h1>
          <h3>Pokaż wszystkie</h3>
        </div>
        <div className="dashboard__history">
          <div className="dashboard__history__item">
            <h3>name</h3>
            <h4>actualAmount</h4>
            <span>maxAmount</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard