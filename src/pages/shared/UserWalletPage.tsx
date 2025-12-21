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
} from "lucide-react";
import { Button } from "@/components/ui/button";

const paymentProviders = [
  { label: "MoMo", value: "momo", currency: "VND", paymentMethod: "momo" },
  {
    label: "ZaloPay",
    value: "zalopay",
    currency: "VND",
    paymentMethod: "zalopay",
  },
  {
    label: "Stripe",
    value: "stripe",
    currency: "USD",
    paymentMethod: "credit_card",
  },
];

// Component helper for uniformity
const StatCard = ({
  icon: Icon,
  title,
  amount,
  currency,
  color,
  subtitle,
  iconBg,
  amountColor,
}: {
  icon: any;
  title: string;
  amount: string | number;
  currency?: string;
  color: string;
  subtitle: string;
  iconBg: string;
  amountColor: string;
}) => (
  <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
      <div className={`p-2 rounded-xl ${iconBg}`}>
        <Icon size={18} className={`${color}`} />
      </div>
    </div>
    <div className="flex items-end">
      <p className={`text-2xl font-bold ${amountColor}`}>{amount}</p>
      {currency && (
        <span className="text-sm text-muted-foreground ml-2 mb-1 font-medium">
          {currency}
        </span>
      )}
    </div>
    <p className="text-xs text-muted-foreground mt-2 font-medium">{subtitle}</p>
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
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  // Determine currency based on selected provider
  const selectedCurrency =
    paymentProviders.find((p) => p.value === provider)?.currency || "VND";

  const paymentMethod =
    paymentProviders.find((p) => p.value === provider)?.paymentMethod || "momo";

  // HELPER: Check if a payment session is active
  const isPaymentActive = !!redirectUrl;

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
    onError: () => {},
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
    <div className="container-custom py-8 animate-fade-in">
      {/* Hero Balance Card */}
      <div className="bg-card border border-border rounded-3xl p-8 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Wallet size={20} />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Wallet Balance
              </h1>
            </div>
            {loadingBalance ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium text-sm">
                  Loading wallet data...
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary tracking-tight">
                  {formatCurrency(walletData?.balance ?? 0)}
                  <span className="text-lg text-muted-foreground ml-2 font-medium">
                    {walletData?.currency}
                  </span>
                </div>
              </div>
            )}
          </div>
          <Button
            variant="default"
            onClick={() => setShowTopUp(true)}
            className="flex items-center gap-2 px-6 h-10 font-bold rounded-xl shadow-sm self-start lg:self-center"
          >
            <Plus size={18} /> Top Up Wallet
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {walletData?.statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={TrendingUp}
            title="Total Credits"
            amount={formatCurrency(
              walletData.statistics.totalCredits.total ?? 0
            )}
            currency={walletData.currency}
            color="text-green-600"
            amountColor="text-green-600"
            iconBg="bg-green-100"
            subtitle="Income & deposits"
          />
          <StatCard
            icon={ArrowDown}
            title="Total Debits"
            amount={formatCurrency(
              walletData.statistics.totalDebits.total ?? 0
            )}
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
                : 0
            }
            currency={walletData.currency}
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
          <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-secondary/5">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Transactions
                </h2>
              </div>
            </div>
            <div className="divide-y divide-border">
              {walletData.recentTransactions.map((transaction: any) => (
                <div
                  key={transaction.id}
                  className="px-6 py-4 hover:bg-secondary/20 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`p-2.5 rounded-xl flex-shrink-0 ${
                        transaction.type === "credit"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm mb-1 truncate">
                        {transaction.description ||
                          (transaction.type === "credit" ? "Top-up" : "Debit")}
                      </p>
                      <p className="text-xs text-muted-foreground mb-1.5 font-medium">
                        {formatDateTime(transaction.createdAt)}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-lg text-muted-foreground font-bold uppercase tracking-wide border border-border">
                          Before:{" "}
                          {formatCurrency(transaction.balanceBefore ?? 0)}{" "}
                          {walletData.currency}
                        </span>
                        <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-lg text-muted-foreground font-bold uppercase tracking-wide border border-border">
                          After: {formatCurrency(transaction.balanceAfter ?? 0)}{" "}
                          {walletData.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p
                      className={`font-bold text-base ${
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
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-yellow-100 text-yellow-700 border border-yellow-200"
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

      {/* Top Up Modal */}
      {showTopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-card rounded-3xl w-full max-w-md shadow-2xl border border-border relative flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
              <div className="flex items-center gap-3 text-foreground font-bold text-lg">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
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
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-secondary/50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-5 mb-6">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      min="1"
                      disabled={isPaymentActive} // DISABLE INPUT
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none placeholder-muted-foreground text-foreground font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">
                      {selectedCurrency}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">
                    Payment Provider
                  </label>
                  <div className="relative">
                    <select
                      value={provider}
                      onChange={(val) => {
                        setProvider(val.target.value);
                      }}
                      disabled={isPaymentActive} // DISABLE SELECT
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none appearance-none text-foreground font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {paymentProviders.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>
              </div>

              {redirectUrl && (
                <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                  <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wide">
                    ✓ Payment link ready
                  </p>
                  <a
                    href={redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-bold text-sm hover:underline hover:text-primary/80 block mb-1 transition-colors"
                  >
                    → Complete Payment
                  </a>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Expires: {expiresAt ? formatDateTime(expiresAt) : ""}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-border flex justify-between items-center bg-secondary/10 gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowTopUp(false);
                  setTopUpAmount("");
                  setRedirectUrl(null);
                  setExpiresAt(null);
                }}
                className="px-6 h-10 border-border rounded-xl text-muted-foreground font-bold text-sm hover:text-foreground bg-background hover:bg-secondary w-full"
              >
                {isPaymentActive ? "Close" : "Cancel"}
              </Button>
              <Button
                variant="default"
                onClick={() =>
                  topUpMutation.mutate({
                    amount: Number(topUpAmount),
                    currency: selectedCurrency,
                    provider,
                    paymentMethod,
                  })
                }
                disabled={
                  topUpMutation.isPending || !topUpAmount || isPaymentActive
                } // DISABLE SUBMIT BUTTON
                className="px-6 h-10 font-bold text-sm rounded-xl shadow-sm w-full gap-2"
              >
                {topUpMutation.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Top Up Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserWalletPage;
