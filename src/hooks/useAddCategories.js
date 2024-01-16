import { addDoc, doc, collection, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from "../config/firebase-config"
import { useGetUserInfo } from './useGetUserInfo'

export const useAddCategories = () => {
  const categoriesCollectionRef = collection(db, 'categories')
  const {userID} = useGetUserInfo()

  const addCategory = async ({
    name,
    categoryType, 
    icon, 
    color,
    bgColor,
  }) => {
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
      console.log('Transaction added successfully.')
    } catch (error) {
      console.error('Error adding transaction:', error)
    }
  }

  const updateCategory = async (categoryId, updatedData) => {
    const categoryDocRef = doc(db, 'categories', categoryId);

    try {
      await updateDoc(categoryDocRef, updatedData);
      console.log('Category updated successfully.');
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return{ addCategory, updateCategory }

  
}