import type { Pagination } from "./pagination";
import type { User } from "./user";

export type TransactionType = "funding" | "payment" | "withdrawal";
export type TransactionStatus = "pending" | "completed" | "failed";

export interface Transaction {
  _id: string;
  from: User;
  to: User;
  amount: number;
  charge?: number;
  netAmount?: number;
  transactionType: "funding";
  transactionStatus: TransactionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GetTransactionsResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    transactions: Transaction[];
    pagination: Pagination;
  };
}
