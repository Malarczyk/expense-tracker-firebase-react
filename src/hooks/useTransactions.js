import { AlertContext } from '../context/Alert/AlertContext'
import { useState, useEffect, useContext } from "react"
import { useGetUserInfo } from "./useGetUserInfo"
import { db } from "../config/firebase-config"
import { 
  addDoc, 
  collection, 
  serverTimestamp, 
  updateDoc, 
  deleteDoc,
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore"
import { startOfMonth, endOfMonth, getYear, getMonth } from 'date-fns'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [transactionTotal, setTransactionTotal] = useState({})
  const [isTransactionLoading, setTransactionLoading] = useState(true)

  const transactionsCollectionRef = collection(db, 'transactions')
  const { userID } = useGetUserInfo()
  const { showAlert } = useContext(AlertContext)

  // Dodawanie transakcji
  const addTransaction = async ({
    name,
    description, 
    transactionAmount, 
    transactionType,
    transactionDate,
    wallet,
    category,
    photoUrl
  }) => {
    try {
      await addDoc(transactionsCollectionRef, {
        userID,
        name,
        description,
        transactionAmount,
        transactionType,
        transactionDate,
        wallet,
        category,
        photoUrl: photoUrl || '',
        createdAt: serverTimestamp(),
      })
      showAlert('Transakcja dodana pomyślnie!', 'success')
    } catch (error) {
      showAlert('Wystąpił błąd', 'error')
      console.error('Error adding transaction:', error)
    }
  }

  // Aktualizacja transakcji
  const updateTransaction = async (transactionId, updatedData) => {
    const transactionDocRef = doc(db, 'transactions', transactionId)

    try {
      await updateDoc(transactionDocRef, updatedData)
      showAlert('Transakcja edytowana pomyślnie!', 'success')
    } catch (error) {
      showAlert('Wystąpił błąd', 'error')
      console.error('Error updating transaction:', error)
    }
  }

  // Usuwanie kategorii
  const deleteTransaction = async (transactionId) => {
    const transactionDocRef = doc(db, 'transactions', transactionId)

    try {
      await deleteDoc(transactionDocRef)
      showAlert('Usunięto transakcję', 'default')
    } catch (error) {
      showAlert('Wystąpił błąd', 'error')
      console.error('Błąd przy usuwaniu transakcji:', error)
    }
  }

  // Pobieranie transakcji tylko dla bieżącego miesiąca
  useEffect(() => {
    let unsubscribe
    setTransactionLoading(true)

    try {
      const currentYear = getYear(new Date())
      const currentMonth = getMonth(new Date())
      const startOfCurrentMonth = startOfMonth(new Date(currentYear, currentMonth))
      const endOfCurrentMonth = endOfMonth(new Date(currentYear, currentMonth))

      const queryTransactions = query(
        transactionsCollectionRef,
        where("userID", "==", userID),
        where("transactionDate", ">=", startOfCurrentMonth),
        where("transactionDate", "<=", endOfCurrentMonth),
        orderBy("transactionDate") // Zmienione pole sortowania na transactionDate
      )
      

      unsubscribe = onSnapshot(queryTransactions, (snapshot) => {
        let docs = []
        let totalIncome = 0
        let totalExpenses = 0

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
        setTransactionTotal({
          balance,
          expenses: totalExpenses,
          income: totalIncome,
        })
        setTransactionLoading(false)
      })
    } catch (err) {
      console.error(err)
      setTransactionLoading(false)
    }

    return () => unsubscribe && unsubscribe()
  }, [userID])

  return { isTransactionLoading, transactions, transactionTotal, addTransaction, updateTransaction, deleteTransaction }
}
