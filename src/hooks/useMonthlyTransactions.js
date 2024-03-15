import { useState, useEffect } from 'react';
import { db } from '../config/firebase-config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { startOfMonth, endOfMonth } from 'date-fns';
import { useGetUserInfo } from "./useGetUserInfo"

export const useMonthlyTransactions = (year, month) => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userID } = useGetUserInfo(); // Załóżmy, że ten hook zwraca aktualnie zalogowanego użytkownika

  useEffect(() => {
    setIsLoading(true);
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(new Date(year, month));
    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef,
      where('userID', '==', userID),
      where('transactionDate', '>=', start),
      where('transactionDate', '<=', end),
      orderBy('transactionDate')
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      let loadedTransactions = [];
      let income = 0;
      let expenses = 0;

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        loadedTransactions.push({ id: doc.id, ...data });

        if (data.transactionType === 'income') {
          income += Number(data.transactionAmount);
        } else if (data.transactionType === 'expense') {
          expenses += Number(data.transactionAmount);
        }
      });

      setTransactions(loadedTransactions);
      setTotalIncome(income);
      setTotalExpenses(expenses);
      setIsLoading(false);
    }, err => {
      console.error(err);
      setError(err);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [year, month, userID]);

  return {
    transactions,
    totalIncome,
    totalExpenses,
    isLoading,
    error,
  };
};
