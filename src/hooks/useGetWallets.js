import { query, collection, where, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "../config/firebase-config"
import { useEffect, useState } from "react"
import { useGetUserInfo } from "./useGetUserInfo"

export const useGetWallets = () => {
  const [wallets, setWallets] = useState([])
  const walletsCollectionRef = collection(db, 'wallets')
  const { userID } = useGetUserInfo()

  const getWallets = async () => {
    let unsubscribe

    try {

      const queryWallets = query(
        walletsCollectionRef,
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

        setWallets(docs)

      })
    } catch (err) {
      console.error(err)
    }

    return () => unsubscribe()
  }

  useEffect(() => {
    getWallets()
  }, [])

  return { wallets }
}