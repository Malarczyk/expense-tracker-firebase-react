import { addDoc, doc, collection, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from "../config/firebase-config"
import { useGetUserInfo } from './useGetUserInfo'

export const useAddWallets = () => {
  const walletsCollectionRef = collection(db, 'wallets')
  const {userID} = useGetUserInfo()

  const addWallet = async ({
    name,
    walletAmount
  }) => {
    try {
      await addDoc(walletsCollectionRef, {
        userID,
        name,
        walletAmount,
        createdAt: serverTimestamp(),
      })
      console.log('Wallet added successfully.')
    } catch (error) {
      console.error('Error adding Wallet:', error)
    }
  }

  const updateWallet = async (walletId, updatedData) => {
    const walletsDocRef = doc(db, 'wallets', walletId);

    try {
      await updateDoc(walletsDocRef, updatedData);
      console.log('Category updated successfully.');
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return{ addWallet, updateWallet }

  
}