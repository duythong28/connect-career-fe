export interface WalletBalance {
  id: string;
  user: {
    id: string;
    email: string;
    username: string;
    fullName: string | null;
    avatarUrl: string | null;
    status: string;
    // add other fields as needed
  };
  userId: string;
  creditBalance: string; // string from API
  balance: number;
  currency: string;
  updatedAt: string;
}

export interface TopUpRequest {
  amount: number;
  currency: string;
  provider: string; // e.g. "momo", "zalopay", "stripe"
  paymentMethod: string; // e.g. "momo", "zalopay", "credit_card"
}

export interface TopUpResponse {
  paymentId: string;
  redirectUrl: string;
  expiresAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  provider?: string;
  paymentMethod?: string;
  description?: string;
}

export interface WalletTransactionResponse {
  data: WalletTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RefundRequest {
  userId: string;
  amount: number;
  reason: string;
  paymentTransactionId : string;
}

export interface Refund {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface RefundResponse {
  data: Refund[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface WalletListResponse {
  wallets: WalletBalance[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
