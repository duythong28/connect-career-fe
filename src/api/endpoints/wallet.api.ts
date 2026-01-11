import axios from "../client/axios";
import {
  WalletBalance,
  TopUpRequest,
  TopUpResponse,
  WalletTransactionResponse,
  RefundRequest,
  RefundResponse,
  WalletListResponse,
  BillableActionResponse,
  CreateBillableActionRequest,
  CreateBillableActionResponse,
  UpdateBillableActionPriceRequest,
  UpdateBillableActionPriceResponse,
  AdminWalletTransactionResponse,
} from "../types/wallet.types";

// Get wallet balance
export const getWalletBalance = async (): Promise<WalletBalance> => {
  const response = await axios.get("/wallet/balance");
  return response.data;
};

// Top up wallet
export const topUpWallet = async (
  data: TopUpRequest
): Promise<TopUpResponse> => {
  const response = await axios.post("/wallet/top-up", data);
  return response.data;
};

// Check MoMo payment status
export const getMomoPaymentStatus = async (
  orderId: string
): Promise<{ status: string; message?: string }> => {
  const response = await axios.get(`/payments/momo/status`, {
    params: { orderId },
  });
  return response.data;
};

// Get all wallets (admin)
export const getAllWallets = async (params?: {
  page?: number;
  limit?: number;
}): Promise<WalletListResponse> => {
  const response = await axios.get(`/backoffice/wallets`, { params });
  return response.data;
};

// Get wallet transactions (admin)
export const getWalletTransactions = async (
  userId: string,
  params?: { pageNumber?: number; pageSize?: number }
): Promise<WalletTransactionResponse> => {
  const response = await axios.get(
    `/backoffice/wallets/${userId}/transactions`,
    { params }
  );
  return response.data;
};


// Get wallet usage history (admin)
export const getWalletUsageHistory = async (
  userId: string,
  params?: { pageNumber?: number; pageSize?: number }
): Promise<WalletTransactionResponse> => {
  const response = await axios.get(
    `/backoffice/wallets/${userId}/usage-history`,
    { params }
  );
  return response.data;
};

// Get all refunds (admin)
export const getAllRefunds = async (params?: {
  page?: number;
  limit?: number;
}): Promise<RefundResponse> => {
  const response = await axios.get(`/backoffice/refunds`, { params });
  return response.data;
};

// Create a refund (admin)
export const createRefund = async (
  data: RefundRequest
): Promise<RefundResponse> => {
  const response = await axios.post(`/backoffice/refunds`, data);
  return response.data;
};

export const getBillableActions = async (
  params?: { pageNumber?: number; pageSize?: number }
): Promise<BillableActionResponse> => {
  const response = await axios.get("/backoffice/billable-actions", { params });
  return response.data;
};

export const getPublicBillableActions = async (): Promise<BillableActionResponse> => {
  const response = await axios.get("public/billable-actions");
  return response.data;
}

export const createBillableAction = async (
  data: CreateBillableActionRequest
): Promise<CreateBillableActionResponse> => {
  const response = await axios.post("/backoffice/billable-actions", data);
  return response.data;
};

export const updateBillableActionPrice = async (
  actionId: string,
  data: UpdateBillableActionPriceRequest
): Promise<UpdateBillableActionPriceResponse> => {
  const response = await axios.patch(
    `/backoffice/billable-actions/${actionId}/price`,
    data
  );
  return response.data;
};

export const getAdminWalletTransactions = async (
  userId: string,
  params?: { page?: number; limit?: number }
): Promise<AdminWalletTransactionResponse> => {
  const response = await axios.get(
    `/backoffice/wallets/transactions/${userId}`,
    { params }
  );
  return response.data;
};