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

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [transactionTotal, setTransactionTotal] = useState({})
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

  // Pobieranie transakcji
  useEffect(() => {
    let unsubscribe

    try {
      const queryTransactions = query(
        transactionsCollectionRef,
        where("userID", "==", userID),
        orderBy("createdAt")
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
      })
    } catch (err) {
      console.error(err)
    }

    return () => unsubscribe && unsubscribe()
  }, [userID])

  return { transactions, transactionTotal, addTransaction, updateTransaction, deleteTransaction }
}
