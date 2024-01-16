import { query, collection, where, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "../config/firebase-config"
import { useEffect, useState } from "react"
import { useGetUserInfo } from "./useGetUserInfo"

export const useGetBudgets = () => {
  const [budgets, setBudgets] = useState([])
  const budgetsCollectionRef = collection(db, 'budgets')
  const { userID } = useGetUserInfo()

  const getBudgets = async () => {
    let unsubscribe

    try {

      const queryWallets = query(
        budgetsCollectionRef,
        where("userID", "==", userID),
        orderBy("createdAt")
      )

      unsubscribe = onSnapshot(queryWallets, (snapshot) => {
        let docs = [];


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

    return () => unsubscribe()
  }

  useEffect(() => {
    getBudgets()
  }, [])

  return { budgets }
}