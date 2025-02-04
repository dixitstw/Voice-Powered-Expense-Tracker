import React, { useReducer, createContext, useEffect } from "react";
import contextReducer from "./contextReducer";

const initialState = [];

export const ExpenseTrackerContext = createContext(initialState);
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const Provider = ({ children }) => {
  const [transactions, dispatch] = useReducer(contextReducer, initialState);

  // Fetch transactions when component mounts
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${BASE_URL}/api/gettransactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch transactions");

        const data = await response.json();
        dispatch({ type: "SET_TRANSACTIONS", payload: data });
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/deletetransactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete transaction");

      const updatedTransactions = await response.json();
      dispatch({ type: "SET_TRANSACTIONS", payload: updatedTransactions });
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const addTransaction = async (transaction) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/posttransactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      });

      if (response.ok) {
        const updatedTransactions = await response.json();
        dispatch({ type: "SET_TRANSACTIONS", payload: updatedTransactions });
      } else {
        // Log errors and show feedback if the transaction was not added
        const errorMessage = await response.json();
        console.error("Failed to add transaction:", errorMessage.message);
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const balance = transactions.reduce(
    (acc, currVal) =>
      currVal.type === "Expense" ? acc - currVal.amount : acc + currVal.amount,
    0
  );

  return (
    <ExpenseTrackerContext.Provider
      value={{
        deleteTransaction,
        addTransaction,
        transactions,
        balance,
      }}
    >
      {children}
    </ExpenseTrackerContext.Provider>
  );
};
