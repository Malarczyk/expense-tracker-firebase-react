import { addDoc, doc, collection, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from "../config/firebase-config"
import { useGetUserInfo } from './useGetUserInfo'

export const useAddBudgets = () => {
  const budgetsCollectionRef = collection(db, 'budgets')
  const {userID} = useGetUserInfo()

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
        maxAmount,
        actualAmount,
        categories,
        createdAt: serverTimestamp(),
      })
      console.log('Budgets added successfully.')
    } catch (error) {
      console.error('Error adding Budgets:', error)
    }
  }

  const updateBudget = async (budgetId, updatedData) => {
    const budgetsDocRef = doc(db, 'budgets', budgetId);

    try {
      await updateDoc(budgetsDocRef, updatedData);
      console.log('Budget updated successfully.');
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  return{ addBudget, updateBudget }

  
}