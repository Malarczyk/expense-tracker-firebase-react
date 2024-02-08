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

export const useMonthlyStats = () => {
  const [monthlyStats, setMonthlyStats] = useState([])
  const monthlyStatsCollectionRef = collection(db, 'monthlyStats')
  const [isMonthlyStatsLoading, setMonthlyStatsLoading] = useState(true)


  const { userID } = useGetUserInfo()
  const { showAlert } = useContext(AlertContext)

  // Dodawanie montlyStats
  const addMonthlyStats = async ({
    name,
    totalIncome,
    totalExpense,
  }) => {
    try {
      await addDoc(monthlyStatsCollectionRef, {
        userID,
        name,
        totalIncome,
        totalExpense,
        createdAt: serverTimestamp(),
      })
      showAlert('MontlyStats dodany pomyślnie!', 'success')
    } catch (error) {
      showAlert('Wystąpił błąd', 'error')
      console.error('Error adding monthlyStats:', error)
    }
  }

  // Aktualizacja montlyStats
  const updateMonthlyStats = async (monthlyStatsId, updatedData) => {
    const monthlyStatsDocRef = doc(db, 'monthlyStats', monthlyStatsId)

    try {
      await updateDoc(monthlyStatsDocRef, updatedData)
      showAlert('MontlyStats edytowany pomyślnie!', 'success')
    } catch (error) {
      showAlert('Wystąpił błąd', 'error')
      console.error('Error updating monthlyStats:', error)
    }
  }

  // Usuwanie montlyStats
  const deleteMonthlyStats = async (monthlyStatsId) => {
    const monthlyStatsDocRef = doc(db, 'monthlyStats', monthlyStatsId);

    try {
      await deleteDoc(monthlyStatsDocRef);
      showAlert('Usunięto MontlyStats', 'default')
    } catch (error) {
      showAlert('Wystąpił błąd', 'error')
      console.error('Error deleting monthlyStats:', error);
    }
  };

  // Pobieranie MontlyStatsów
  useEffect(() => {
    let unsubscribe
    setMonthlyStatsLoading(true)
    if (!userID) {
      return;
    }
    try {
      const queryMonthlyStats = query(
        monthlyStatsCollectionRef,
        where("userID", "==", userID),
        orderBy("createdAt")
      )

      unsubscribe = onSnapshot(queryMonthlyStats, (snapshot) => {
        let docs = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          const id = doc.id
          docs.push({ ...data, id })
        })
        setMonthlyStats(docs)
      })
      setMonthlyStatsLoading(false)
    } catch (err) {
      console.error(err)
      setMonthlyStatsLoading(false)
    }
    return () => unsubscribe && unsubscribe()
  }, [userID])

  return {  isMonthlyStatsLoading, monthlyStats, addMonthlyStats, updateMonthlyStats, deleteMonthlyStats }
}
