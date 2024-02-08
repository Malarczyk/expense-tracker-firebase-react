import { AlertContext } from '../context/Alert/AlertContext'
import { useEffect, useState, useContext } from "react"
import { useGetUserInfo } from "./useGetUserInfo"
import { db } from "../config/firebase-config"
import {
  addDoc,
  doc,
  collection,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore"

export const useBudgets = () => {
  const [budgets, setBudgets] = useState([])
  const budgetsCollectionRef = collection(db, 'budgets')
  const [isBudgetsLoading, setBudgetsLoading] = useState(true)

  const { userID } = useGetUserInfo()
  const { showAlert } = useContext(AlertContext)

  // Dodawanie budżetu
  const addBudget = async ({
    name,
    categories,
    maxAmount,
    actualAmount,
  }) => {
    try {
      await addDoc(budgetsCollectionRef, {
        userID,
        name,
        categories,
        maxAmount,
        actualAmount,
        createdAt: serverTimestamp(),
      })
      showAlert('Budżet dodany pomyślnie!', 'success')
    } catch (error) {
      showAlert('Wystąpił błąd', 'error')
      console.error('Error adding budget:', error)
    }
  }

  // Aktualizacja budżetu
  const updateBudget = async (budgetId, updatedData) => {
    const budgetDocRef = doc(db, 'budgets', budgetId)

    try {
      await updateDoc(budgetDocRef, updatedData)
      console.log('Budżet edytowany pomyślnie!')
    } catch (error) {
      showAlert('Wystąpił błąd', 'error')
      console.error('Error updating budget:', error)
    }
  }

  // Usuwanie budżetu
  const deleteBudget = async (budgetId) => {
    const budgetDocRef = doc(db, 'budgets', budgetId);

    try {
      await deleteDoc(budgetDocRef);
      showAlert('Usunięto budżet', 'default')
    } catch (error) {
      showAlert('Wystąpił błąd', 'error')
      console.error('Error deleting budget:', error);
    }
  };

  // Pobieranie budżetów
  useEffect(() => {
    let unsubscribe
    setBudgetsLoading(true)

    if (!userID) {
      return;
    }
    try {
      const queryBudgets = query(
        budgetsCollectionRef,
        where("userID", "==", userID),
        orderBy("createdAt")
      )

      unsubscribe = onSnapshot(queryBudgets, (snapshot) => {
        let docs = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          const id = doc.id
          docs.push({ ...data, id })
        })

        setBudgets(docs)
      })
      setBudgetsLoading(false)
    } catch (err) {
      console.error(err)
      setBudgetsLoading(false)
    }

    return () => unsubscribe && unsubscribe()
  }, [userID])

  return { isBudgetsLoading, budgets, addBudget, updateBudget, deleteBudget }
}
