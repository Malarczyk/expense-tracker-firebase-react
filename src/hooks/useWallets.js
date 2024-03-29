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

export const useWallets = () => {
  const [wallets, setWallets] = useState([])
  const walletsCollectionRef = collection(db, 'wallets')
  const [isWalletsLoading, setWalletsLoading] = useState(true)

  const { userID } = useGetUserInfo()
  const { showAlert } = useContext(AlertContext)

  // Dodawanie portfela
  const addWallet = async ({
    name,
    walletAmount,
  }) => {
    if (!userID) {
      showAlert('Błąd: brak ID użytkownika.', 'error');
      return;
    }
    try {
      await addDoc(walletsCollectionRef, {
        userID,
        name,
        walletAmount,
        createdAt: serverTimestamp(),
      })
      showAlert('Portfel dodany pomyślnie!', 'success')
    } catch (error) {
      showAlert('Wystąpił błąd', 'error')
      console.error('Error adding wallet:', error)
    }
  }

  // Aktualizacja portfela
  const updateWallet = async (walletId, updatedData) => {
    const walletDocRef = doc(db, 'wallets', walletId)

    try {
      await updateDoc(walletDocRef, updatedData)
      showAlert('Portfel edytowany pomyślnie!', 'success')
      
    } catch (error) {
      showAlert('Wystąpił błąd', 'error')
      console.error('Error updating wallet:', error)
    }
  }

    // Usuwanie portfela
    const deleteWallet = async (walletsId) => {
      const walletsDocRef = doc(db, 'wallets', walletsId)
  
      try {
        await deleteDoc(walletsDocRef)
        showAlert('Usunięto portfel', 'default')
      } catch (error) {
        showAlert('Wystąpił błąd', 'error')
        console.error('Błąd przy usuwaniu portfela:', error)
      }
    }

  // Pobieranie portfeli
  useEffect(() => {
    if (!userID) {
      console.error('Błąd: brak ID użytkownika.', 'error');
      return;
    }
    let unsubscribe
    setWalletsLoading(true)
    try {
      const queryWallets = query(
        walletsCollectionRef,
        where("userID", "==", userID),
        orderBy("createdAt")
      )

      unsubscribe = onSnapshot(queryWallets, (snapshot) => {
        let docs = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          const id = doc.id
          docs.push({ ...data, id })
        })

        setWallets(docs)
        setWalletsLoading(false)
      })
      
    } catch (err) {
      console.error(err)
      setWalletsLoading(false)
    }

    return () => unsubscribe && unsubscribe()
  }, [userID])

  return { isWalletsLoading, wallets, addWallet, updateWallet, deleteWallet }
}
