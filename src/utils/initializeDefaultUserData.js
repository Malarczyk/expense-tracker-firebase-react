// initializeDefaultUserData.js
import { db } from '../config/firebase-config'
import { collection, addDoc } from 'firebase/firestore'

const initializeDefaultUserData = async (userId) => {
  // Dodaj domyślne kategorie
  const defaultCategories = [
    { name: "Brak kategorii", icon: "question", color: "--black-color", bgColor: "--black-bg-color", categoryType: "", createdAt: "" },
    // ... (inne domyślne kategorie)
  ]
  const categoryRef = collection(db, 'categories') // Dostosuj do swojej struktury bazy danych
  for (const category of defaultCategories) {
    await addDoc(categoryRef, {
      ...category,
      userId: userId
    })
  }

  // Dodaj domyślną transakcję
  // ...

  // Dodaj domyślny budżet
  // ...

  // Dodaj domyślny portfel
  // ...
}

export default initializeDefaultUserData
