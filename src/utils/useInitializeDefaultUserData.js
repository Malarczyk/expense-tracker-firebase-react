import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { AlertContext } from '../context/Alert/AlertContext'
import { db } from "../config/firebase-config"
import { useContext } from 'react'

function useInitializeDefaultUserData() {
  const { showAlert } = useContext(AlertContext)

  const initializeDefaultUserData = async (userId) => {
    console.log('Hook, przed ifem -> ' + userId)
    if (!userId) return
    console.log('Hook po if -> ' + userId)
    const categoriesCollectionRef = collection(db, 'categories')
    const walletsCollectionRef = collection(db, 'wallets')

    const defaultCategories = [
      { userID: userId, name: "Brak kategorii", icon: "question", color: "--black-color", bgColor: "--black-bg-color", categoryType: "expense", createdAt: serverTimestamp() },
      { userID: userId, name: "Zakupy", icon: "shop", color: "--secondary-color", bgColor: "--secondary-bg-color", categoryType: "expense", createdAt: serverTimestamp() },
      { userID: userId, name: "Mieszkanie", icon: "dashboard2", color: "--dark-green-color", bgColor: "--dark-green-bg-color", categoryType: "expense", createdAt: serverTimestamp() },
      { userID: userId, name: "Edukacja", icon: "brain", color: "--dark-purple-color", bgColor: "--dark-purple-bg-color", categoryType: "expense", createdAt: serverTimestamp() },
      { userID: userId, name: "Osobiste", icon: "personal", color: "--light-blue-color", bgColor: "--light-blue-bg-color", categoryType: "expense", createdAt: serverTimestamp() },
      { userID: userId, name: "Samochód", icon: "fuel", color: "--black-color", bgColor: "--black-bg-color", categoryType: "expense", createdAt: serverTimestamp() },
      { userID: userId, name: "Subskrypcje", icon: "subscription", color: "--pink-color", bgColor: "--pink-bg-color", categoryType: "expense", createdAt: serverTimestamp() },
      { userID: userId, name: "Rozrywka", icon: "energy", color: "--warning-color", bgColor: "--warning-bg-color", categoryType: "expense", createdAt: serverTimestamp() },
      { userID: userId, name: "Zdrowie", icon: "health", color: "--dark-blue-color", bgColor: "--dark-blue-bg-color", categoryType: "expense", createdAt: serverTimestamp() },
      { userID: userId, name: "Wakacje", icon: "love", color: "--light-purple-color", bgColor: "--light-purple-bg-color", categoryType: "expense", createdAt: serverTimestamp() },
      { userID: userId, name: "Etat", icon: "arrows", color: "--success-color", bgColor: "--success-bg-color", categoryType: "income", createdAt: serverTimestamp() },
      { userID: userId, name: "Inne przychody", icon: "question", color: "--black-color", bgColor: "--black-bg-color", categoryType: "income", createdAt: serverTimestamp() },
    ]

    const defaultWallets = [
      { userID: userId, name: "Gotówka", icon: "question", walletAmount: "0", createdAt: serverTimestamp() },
    ]

    const addCategories = defaultCategories.map(category =>
      addDoc(categoriesCollectionRef, category)
    )

    const addWallets = defaultWallets.map(wallet =>
      addDoc(walletsCollectionRef, wallet)
    )

    try {
      await Promise.all([...addCategories, ...addWallets])
      showAlert('Zainicjalizowano podstawowe kategorie i portfele', 'success')
    } catch (error) {
      showAlert('Wystąpił błąd podczas inicjalizacji danych', 'error')
      console.error('Błąd inicjalizacji danych:', error)
    }
  }

  return initializeDefaultUserData
}

export default useInitializeDefaultUserData