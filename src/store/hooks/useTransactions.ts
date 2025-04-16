import { TransactionsResponse } from "@/types/transactionTypes";
import { create } from "zustand";

interface TransactionState {
  transactions: TransactionsResponse | null;
  id_transaction: number | null;
  setTransactions: (data: TransactionsResponse) => void;
  setIdTransaction: (id: number) => void;
}

export const useTransactionStore = create<TransactionState>()((set) => ({
  transactions: null,
  setTransactions: (data: TransactionsResponse) => set({ transactions: data }),
  id_transaction: null,
  setIdTransaction: (id: number) => set({ id_transaction: id }),
}));
