import { query, collection, where, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "../config/firebase-config"
import { useEffect, useState } from "react"
import { useGetUserInfo } from "./useGetUserInfo"

export const useGetTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [transactionTotal, setTransactionsTotal] = useState([])
  const transactionCollectionRef = collection(db, 'transactions')
  const { userID } = useGetUserInfo()

  const getTransactions = async () => {
    let unsubscribe

    try {

      const queryTransactions = query(
        transactionCollectionRef,
        where("userID", "==", userID),
        orderBy("createdAt")
      )

      unsubscribe = onSnapshot(queryTransactions, (snapshot) => {
        let docs = [];
        let totalIncome = 0;
        let totalExpenses = 0;


        snapshot.forEach((doc) => {
          const data = doc.data()
          const id = doc.id

          docs.push({ ...data, id })

          if (data.transactionType === "expense") {
            totalExpenses += Number(data.transactionAmount)
          } else {
            totalIncome += Number(data.transactionAmount)
          }
        })

        setTransactions(docs)

        let balance = totalIncome - totalExpenses
        setTransactionsTotal({
          balance,
          expenses: totalExpenses,
          income: totalIncome,
        })
      })
    } catch (err) {
      console.error(err)
    }

    return () => unsubscribe()
  }

  useEffect(() => {
    getTransactions()
  }, [])

  return { transactions, transactionTotal }
}