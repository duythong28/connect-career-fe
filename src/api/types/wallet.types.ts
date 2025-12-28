export interface WalletTransaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  currency: string;
  balanceBefore: number;
  balanceAfter: number;
  status: string;
  description?: string;
  createdAt: string;
}

export interface WalletStatistics {
  totalCredits: {
    total: string;
  };
  totalDebits: {
    total: string;
  };
  totalSpent: {
    total: string | null;
  };
}

export interface WalletBalance {
  balance: number;
  currency: string;
  walletId: string;
  recentTransactions: WalletTransaction[];
  recentUsageHistory: unknown[]; // Update type based on actual usage data
  statistics: WalletStatistics;
}

export interface TopUpRequest {
  amount: number;
  currency: string;
  provider: string;
  paymentMethod: string;
}

export interface TopUpResponse {
  paymentUrl?: string;
  redirectUrl?: string;
  expiresAt: string;
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
  paymentTransactionId: string;
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

export interface BillableAction {
  id: string;
  actionCode: string;
  actionName: string;
  description?: string;
  category: string;
  cost: number | string;
  currency: string;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BillableActionResponse {
  items: BillableAction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateBillableActionRequest {
  actionCode: string;
  actionName: string;
  description?: string;
  category: string;
  cost: number;
  currency: string;
  metadata?: Record<string, any>;
}



export interface UpdateBillableActionPriceRequest {
  cost: number;
}

export interface UpdateBillableActionPriceResponse {
  id: string;
  cost: number;
  updatedAt: string;
}

export interface CreateBillableActionResponse {
  id: string;
  actionCode: string;
  actionName: string;
  description?: string;
  category: string;
  cost: number;
  currency: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AdminWalletTransactionResponse {
  id: string;
  wallet: {
    id: string;
    userId: string;
    creditBalance: string;
    currency: string;
    stripeCustomerId: string | null;
    paymentMethodId: string | null;
    autoTopUpEnabled: boolean;
    autoTopUpThreshold: string | null;
    autoTopUpAmount: string | null;
    createdAt: string;
    updatedAt: string;
  };
  walletId: string;
  userId: string;
  type: "credit" | "debit";
  amount: string;
  currency: string;
  balanceBefore: string;
  balanceAfter: string;
  status: string;
  description?: string;
  relatedPaymentTransactionId?: string;
  relatedUsageLedgerId?: string | null;
  relatedRefundId?: string | null;
  metadata?: {
    exchangeRate?: number;
    originalAmount?: string;
    convertedAmount?: number;
    originalCurrency?: string;
    paymentTransactionId?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}