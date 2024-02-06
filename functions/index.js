/* eslint-disable indent */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.generateMonthlyStatsPerUser = functions.pubsub.schedule("0 0 1 * *")
    .timeZone("Europe/Warsaw")
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    const endOfMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1);

    try {
      const usersSnapshot = await db.collection("users").get();
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const transactionsSnapshot = await db.collection("transactions")
          .where("userId", "==", userId)
          .where("date", ">=", startOfMonth)
          .where("date", "<", endOfMonth)
          .get();

        let totalIncome = 0;
        let totalExpense = 0;
        transactionsSnapshot.forEach((doc) => {
          const transaction = doc.data();
          if (transaction.type === "income") {
            totalIncome += transaction.amount;
          } else if (transaction.type === "expense") {
            totalExpense += transaction.amount;
          }
        });

        const statsRef = db.collection("monthlyStats").doc(`${userId}-${lastMonth.getFullYear()}-${lastMonth.getMonth() + 1}`);
        await statsRef.set({
          totalIncome,
          totalExpense,
          year: lastMonth.getFullYear(),
          month: lastMonth.getMonth() + 1,
          userId,
        });
      }
    } catch (error) {
      console.log("Error generating monthly stats", error);
    }
  });

// Funkcja do resetowania actualAmount w budżetach na koniec każdego miesiąca
exports.resetBudgets = functions.pubsub.schedule("0 0 1 * *")
  .timeZone("Europe/Warsaw")
  .onRun(async (context) => {
    const db = admin.firestore();

    try {
      const budgetsSnapshot = await db.collection("budgets").get();
      const batch = db.batch();

      budgetsSnapshot.forEach((doc) => {
        const budgetRef = db.collection("budgets").doc(doc.id);
        batch.update(budgetRef, {actualAmount: 0});
      });

      await batch.commit();
    } catch (error) {
      console.log("Error resetting budgets", error);
    }
  });
