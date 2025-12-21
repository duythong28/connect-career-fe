import { useQuery, useMutation } from "@tanstack/react-query";
import { getWalletBalance, topUpWallet } from "@/api/endpoints/wallet.api";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  ArrowUp,
  ArrowDown,
  Loader2,
  ChevronDown,
  Plus,
  TrendingUp,
  Wallet,
  CreditCard,
  X,
  MessageSquare, // Added icon from SimplifyPage for button example
} from "lucide-react";

const paymentProviders = [
  { label: "MoMo", value: "momo" },
  { label: "ZaloPay", value: "zalopay" },
  { label: "Stripe", value: "stripe" },
];

const paymentMethods = {
  momo: [{ label: "MoMo Wallet", value: "momo" }],
  zalopay: [{ label: "ZaloPay Wallet", value: "zalopay" }],
  stripe: [{ label: "Credit Card", value: "credit_card" }],
};

// Component helper for uniformity (taken from SimplifyPage context/style)
const StatCard = ({
  icon: Icon,
  title,
  amount,
  currency,
  color,
  subtitle,
  iconBg,
  amountColor,
}) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-all hover:shadow-md group">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-bold text-gray-600">{title}</h3>
      <div className={`p-2 rounded-lg ${iconBg}`}>
        <Icon size={16} className={`${color}`} />
      </div>
    </div>
    <div className="flex items-end">
      <p className={`text-3xl font-bold ${amountColor}`}>{amount}</p>
      {currency && (
        <span className="text-sm text-gray-500 ml-2 mb-0.5">{currency}</span>
      )}
    </div>
    <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
  </div>
);

const UserWalletPage = () => {
  const {
    data: walletData,
    isLoading: loadingBalance,
    refetch,
  } = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: getWalletBalance,
  });

  // Top up state
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [provider, setProvider] = useState("momo");
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const topUpMutation = useMutation({
    mutationFn: (data: {
      amount: number;
      currency: string;
      provider: string;
      paymentMethod: string;
    }) => topUpWallet(data),
    onSuccess: (res) => {
      setRedirectUrl(res.paymentUrl || null);
      setExpiresAt(res.expiresAt || null);

      toast({ title: "Top up request created. Please complete payment." });
      refetch();
    },
    onError: () => {
      /* toast({ title: "Top up failed", variant: "destructive" })*/
    },
  });

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto py-8 px-6 animate-fadeIn font-sans">
      {/* Hero Balance Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 mb-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Wallet size={20} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Wallet Balance
              </h1>
            </div>
            {loadingBalance ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <p className="text-gray-600">Loading wallet data...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-5xl font-bold text-blue-600">
                  {formatCurrency(walletData?.balance ?? 0)}
                  <span className="text-2xl text-gray-500 ml-2">
                    {walletData?.currency}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  Wallet ID: {walletData?.walletId}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowTopUp(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all self-start lg:self-center"
          >
            <Plus size={18} /> Top Up Wallet
          </button>
        </div>
      </div>

      {/* Statistics Cards (using local StatCard component for Simplify style) */}
      {walletData?.statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={TrendingUp}
            title="Total Credits"
            amount={formatCurrency(walletData.statistics.totalCredits.total ?? 0)}
            currency={walletData.currency}
            color="text-green-600"
            amountColor="text-green-600"
            iconBg="bg-green-100"
            subtitle="Income & deposits"
          />
          <StatCard
            icon={ArrowDown}
            title="Total Debits"
            amount={formatCurrency(walletData.statistics.totalDebits.total ?? 0)}
            currency={walletData.currency}
            color="text-red-600"
            amountColor="text-red-600"
            iconBg="bg-red-100"
            subtitle="Withdrawals & refunds"
          />
          <StatCard
            icon={CreditCard}
            title="Total Spent"
            amount={
              walletData.statistics.totalSpent.total
                ? formatCurrency(walletData.statistics.totalSpent.total ?? 0)
                : "N/A"
            }
            currency={
              walletData.statistics.totalSpent.total ? walletData.currency : ""
            }
            color="text-amber-600"
            amountColor="text-amber-600"
            iconBg="bg-amber-100"
            subtitle="Service charges"
          />
        </div>
      )}

      {/* Recent Transactions */}
      {walletData?.recentTransactions &&
        walletData.recentTransactions.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Transactions
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Last {walletData.recentTransactions.length} transactions
                </p>
              </div>
              <button className="text-blue-600 font-bold text-xs px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">
                View All Transactions
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {walletData.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="px-6 py-4 hover:bg-blue-50/20 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`p-3 rounded-lg flex-shrink-0 ${
                        transaction.type === "credit"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm mb-1">
                        {transaction.description ||
                          (transaction.type === "credit" ? "Top-up" : "Debit")}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        {formatDateTime(transaction.createdAt)}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-md text-gray-600 font-medium">
                          Before: {formatCurrency(transaction.balanceBefore ?? 0)}{" "}
                          {walletData.currency}
                        </span>
                        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-md text-gray-600 font-medium">
                          After: {formatCurrency(transaction.balanceAfter ?? 0)}{" "}
                          {walletData.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p
                      className={`font-bold text-lg ${
                        transaction.type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatCurrency(transaction.amount ?? 0)}
                    </p>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider mt-1 inline-block px-2 py-0.5 rounded-full ${
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Top Up Modal (Styled to match EditModal/ReportModal in SimplifyPage) */}
      {showTopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl relative flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3 text-gray-900 font-bold text-lg">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Wallet size={20} />
                </div>
                Top Up Wallet
              </div>
              <button
                onClick={() => {
                  setShowTopUp(false);
                  setTopUpAmount("");
                  setRedirectUrl(null);
                  setExpiresAt(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      min="1"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                      {walletData?.currency}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">
                    Payment Provider
                  </label>
                  <div className="relative">
                    <select
                      value={provider}
                      onChange={(val) => {
                        setProvider(val.target.value);
                        setPaymentMethod(
                          paymentMethods[
                            val.target.value as keyof typeof paymentMethods
                          ][0].value
                        );
                      }}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white text-gray-700"
                    >
                      {paymentProviders.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">
                    Payment Method
                  </label>
                  <div className="relative">
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white text-gray-700"
                    >
                      {paymentMethods[
                        provider as keyof typeof paymentMethods
                      ].map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>
              </div>

              {redirectUrl && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-bold text-blue-900 mb-3">
                    ✓ Payment link ready
                  </p>
                  <a
                    href={redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-bold text-sm underline hover:text-blue-700 block mb-2"
                  >
                    → Complete Payment
                  </a>
                  <p className="text-[10px] text-gray-600">
                    Expires: {expiresAt ? formatDateTime(expiresAt) : ""}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-b-xl">
              <button
                onClick={() => {
                  setShowTopUp(false);
                  setTopUpAmount("");
                  setRedirectUrl(null);
                  setExpiresAt(null);
                }}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-bold text-sm hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  topUpMutation.mutate({
                    amount: Number(topUpAmount),
                    currency: "VND",
                    provider,
                    paymentMethod,
                  })
                }
                disabled={topUpMutation.isPending || !topUpAmount}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {topUpMutation.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Top Up Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserWalletPage;
