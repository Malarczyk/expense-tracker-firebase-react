import { AlertContext } from '../context/Alert/AlertContext'
import { useEffect, useState, useContext } from "react"
import { useGetUserInfo } from "./useGetUserInfo"
import { db } from "../config/firebase-config"
import { 
  addDoc, 
  doc, 
  collection, 
  serverTimestamp, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore"


export const useCategories = () => {
  const [categories, setCategories] = useState([])
  const categoriesCollectionRef = collection(db, 'categories')
  const { userID } = useGetUserInfo()
  const { showAlert } = useContext(AlertContext)

  // Dodawanie kategorii
  const addCategory = async ({ name, categoryType, icon, color, bgColor }) => {
    try {
      await addDoc(categoriesCollectionRef, {
        userID,
        name,
        categoryType,
        icon,
        color,
        bgColor,
        createdAt: serverTimestamp(),
      })
      showAlert('Kategoria dodana pomyślnie!', 'success')
    } catch (error) {
      showAlert('Wystąpił błąd', 'error')
      console.error('Error adding transaction:', error)
    }
  }

  // Aktualizacja kategorii
  const updateCategory = async (categoryId, updatedData) => {
    const categoryDocRef = doc(db, 'categories', categoryId)

    try {
      await updateDoc(categoryDocRef, updatedData)
      showAlert('Kategoria edytowana pomyślnie!', 'success')
    } catch (error) {
      showAlert('Wystąpił błąd', 'error')
      console.error('Error updating category:', error)
    }
  }

  // Usuwanie kategorii
  const deleteCategory = async (categoryId) => {
    const categoryDocRef = doc(db, 'categories', categoryId)

    try {
      await deleteDoc(categoryDocRef)
      showAlert('Usunięto kategorię', 'default')
    } catch (error) {
      showAlert('Wystąpił błąd', 'error')
      console.error('Błąd przy usuwaniu kategorii:', error)
    }
  }

  // Pobieranie kategorii
  useEffect(() => {
    let unsubscribe

    try {
      const queryCategories = query(
        categoriesCollectionRef,
        where("userID", "==", userID),
        orderBy("createdAt")
      )

      unsubscribe = onSnapshot(queryCategories, (snapshot) => {
        let docs = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          const id = doc.id
          docs.push({ ...data, id })
        })

        setCategories(docs)
      })
    } catch (err) {
      console.error(err)
    }

    return () => unsubscribe && unsubscribe()
  }, [userID])
  return { categories, addCategory, updateCategory, deleteCategory }
}
