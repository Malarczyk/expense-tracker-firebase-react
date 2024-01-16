import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from "../config/firebase-config"
import { useGetUserInfo } from './useGetUserInfo'

export const useAddTransactions = () => {
  const transactionCollectionRef = collection(db, 'transactions')
  const {userID} = useGetUserInfo()

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
      await addDoc(transactionCollectionRef, {
        userID,
        name,
        description,
        transactionAmount,
        transactionType,
        transactionDate: '',
        wallet: '',
        category,
        photoUrl: '',
        createdAt: serverTimestamp(),
      })
      console.log('Transaction added successfully.')
    } catch (error) {
      console.error('Error adding transaction:', error)
    }
  }
  return{ addTransaction }

  
}