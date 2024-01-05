import { useAddTransactions } from "../../hooks/useAddTransaction"
import { useGetTransactions } from "../../hooks/useGetTransactions"
import { useGetUserInfo } from "../../hooks/useGetUserInfo"
import { useState } from "react"
import { signOut } from "firebase/auth"
import { auth } from "../../config/firebase-config"
import { useNavigate } from "react-router-dom"

export const ExpenseTracker = () => {
  const { addTransaction } = useAddTransactions()
  const { transactions, transactionTotal } = useGetTransactions()
  const { name, profilePhoto } = useGetUserInfo()

  const navigate = useNavigate()

  const [description, setDescription] = useState("")
  const [transactionAmount, setTransactionAmount] = useState(0)
  const [transactionType, setTransactionType] = useState("expense")
  const {income, expenses, balance} = transactionTotal
  const onSubmit = (e) => {
    e.preventDefault()
    addTransaction({
      description,
      transactionAmount,
      transactionType,
    })
  }

  const signUserOut = async () => {
    try {
      await signOut(auth)
      localStorage.clear()
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <div className="expense-tracker">
        <h1>Hi {name}</h1>
        <h1>Balance</h1>
        <h1>${balance}</h1>
        <h1>Income</h1>
        <h1>${income}</h1>
        <h1>Expanses</h1>
        <h1>${expenses}</h1>

        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Descriptions"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)} />

          <input
            type="number"
            placeholder="Amout"
            required
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)} />

          <input
            type="radio"
            id="expense"
            value="expense"
            checked={transactionType === "expense"}
            onChange={(e) => setTransactionType(e.target.value)} />

          <label htmlFor="expense">Expense</label>

          <input
            type="radio"
            id="income"
            value="income"
            checked={transactionType === "income"}
            onChange={(e) => setTransactionType(e.target.value)} />

          <label htmlFor="income">Income</label>

          <button type="submit">Add</button>
        </form>

      </div>

      {profilePhoto && (
        <div className="profile">
          <img src={profilePhoto} alt="" />
          <button onClick={() => signUserOut()}>Wyloguj sie</button>
        </div>
      )}

      <div className="transactions">
        <h1>transactions</h1>
        <ul>
          {transactions ? (
            transactions.map((transaction) => {
              const { id, description, transactionAmount, transactionType } = transaction;
              return (
                <li key={id}>
                  <h4>{description}</h4>
                  <p>${transactionAmount} - <label>{transactionType}</label></p>
                </li>
              );
            })
          ) : (
            <p>No transactions available.</p>
          )}
        </ul>
      </div>
    </>
  )
}