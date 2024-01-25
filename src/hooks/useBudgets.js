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
      showAlert('Budżet edytowany pomyślnie!', 'success')
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
    } catch (err) {
      console.error(err)
    }

    return () => unsubscribe && unsubscribe()
  }, [userID])

  return { budgets, addBudget, updateBudget, deleteBudget }
}
