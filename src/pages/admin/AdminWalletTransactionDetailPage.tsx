import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  Copy,
  Calendar,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Info,
  History,
  ShieldCheck,
  ArrowDownRight,
} from "lucide-react";
import { getAdminWalletTransactions } from "../../api/endpoints/wallet.api";
import { AdminWalletTransactionResponse } from "../../api/types/wallet.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// --- UI Component: CopyableId (Giữ nguyên logic nhưng hiển thị tinh tế hơn) ---
const CopyableId = ({ id }: { id: string | null | undefined }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!id)
    return (
      <span className="text-muted-foreground italic text-xs">
        Not available
      </span>
    );

  return (
    <div className="flex items-center gap-2 bg-muted/30 px-2 py-1.5 rounded-lg w-fit max-w-full border border-border/50 group hover:border-primary/30 transition-colors">
      <span
        className="font-mono text-[11px] text-muted-foreground truncate max-w-[140px] sm:max-w-[200px]"
        title={id}
      >
        {id}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4 shrink-0 text-muted-foreground hover:text-primary transition-colors"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};

// --- Main Page Component ---
function AdminWalletTransactionDetailPage() {
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const {
    data: transaction,
    isLoading,
    isError,
    error,
  } = useQuery<AdminWalletTransactionResponse, Error>({
    queryKey: ["adminWalletTransaction", transactionId],
    queryFn: () => getAdminWalletTransactions(transactionId as string),
    enabled: !!transactionId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FB] gap-4">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground font-medium">
          Loading transaction details...
        </p>
      </div>
    );
  }

  if (isError || !transaction) {
    return (
      <div className="p-6 bg-[#F8F9FB] min-h-screen flex items-center justify-center">
        <div className="bg-card border border-border rounded-3xl p-8 max-w-md text-center shadow-sm">
          <div className="bg-red-50 text-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">
            {"We couldn't find the transaction you're looking for."}
          </p>
        </div>
      </div>
    );
  }

  const isCredit = transaction.type === "credit";

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-8 animate-fade-in">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto mb-8">
        <Button
          variant="ghost"
          className="mb-4 -ml-2 text-muted-foreground hover:text-primary flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Transactions
        </Button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Transaction Receipt
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Processed on{" "}
              {new Date(transaction.createdAt).toLocaleString("en-US", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
          </div>
          <Badge
            className={cn(
              "w-fit px-4 py-1.5 rounded-full capitalize text-xs font-bold border-none shadow-sm",
              transaction.status === "completed"
                ? "bg-green-500 text-white"
                : "bg-orange-400 text-white"
            )}
          >
            {transaction.status}
          </Badge>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Transaction Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden">
            {/* Background Decoration */}
            <div
              className={cn(
                "absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10",
                isCredit ? "bg-green-500" : "bg-red-500"
              )}
            />

            <div className="flex items-center gap-5 mb-8">
              <div
                className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm",
                  isCredit
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                )}
              >
                {!isCredit ? (
                  <ArrowDownRight className="h-8 w-8" />
                ) : (
                  <ArrowUpRight className="h-8 w-8" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Amount Total
                </p>
                <p
                  className={cn(
                    "text-3xl font-bold",
                    isCredit ? "text-green-600" : "text-foreground"
                  )}
                >
                  {isCredit ? "+" : "-"}
                  {transaction.amount} {transaction.currency}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 pt-6 border-t border-dashed border-border">
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                    Internal Reference
                  </label>
                  <CopyableId id={transaction.id} />
                </div>
                {transaction.metadata?.paymentTransactionId && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                      Payment Provider Ref
                    </label>
                    <CopyableId
                      id={
                        transaction.metadata?.paymentTransactionId ||
                        transaction.relatedPaymentTransactionId
                      }
                    />
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                    Transaction Type
                  </label>
                  <div className="flex items-center gap-2 text-sm font-semibold capitalize">
                    <CreditCard className="h-4 w-4 text-primary" />
                    {transaction.type}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                    Description
                  </label>
                  <p className="text-sm text-foreground font-medium italic">
                    "
                    {transaction.description ||
                      "No notes available for this transaction."}
                    "
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Balance Movement */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <History className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">
                Balance Adjustment
              </h3>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#F8F9FB] border border-border">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                  Previous Balance
                </p>
                <p className="text-lg font-bold">
                  {transaction.balanceBefore}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    {transaction.currency}
                  </span>
                </p>
              </div>
              <div className="h-px w-12 md:h-12 md:w-px bg-border flex items-center justify-center">
                <ArrowRightIcon className="h-4 w-4 text-muted-foreground rotate-90 md:rotate-0" />
              </div>
              <div className="text-center md:text-right">
                <p className="text-[10px] font-bold uppercase text-primary mb-1">
                  New Balance
                </p>
                <p className="text-lg font-bold text-primary">
                  {transaction.balanceAfter}{" "}
                  <span className="text-sm font-normal opacity-70">
                    {transaction.currency}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Account & Security */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">
                Account Source
              </h3>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-2">
                  Associated Wallet
                </label>
                <CopyableId id={transaction.walletId} />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-2">
                  User Reference
                </label>
                <CopyableId id={transaction.userId} />
              </div>

              <div className="pt-4 mt-2 border-t border-border">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">
                    Current Credit
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {transaction.wallet.creditBalance}{" "}
                    {transaction.wallet.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">
                    Auto Top-up
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-bold px-2 py-0",
                      transaction.wallet.autoTopUpEnabled
                        ? "text-green-600 border-green-200 bg-green-50"
                        : "text-muted-foreground"
                    )}
                  >
                    {transaction.wallet.autoTopUpEnabled
                      ? "ACTIVE"
                      : "INACTIVE"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Conversion Details */}
          {transaction.metadata?.exchangeRate && (
            <div className="bg-primary text-primary-foreground rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 opacity-80" />
                <h3 className="text-lg font-bold">Exchange Info</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-primary-foreground/20 pb-3">
                  <span className="text-xs font-medium opacity-80">
                    Paid Amount
                  </span>
                  <div className="text-right">
                    <p className="font-bold">
                      {transaction.metadata.originalAmount}{" "}
                      {transaction.metadata.originalCurrency}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium opacity-80">
                    Final Credit
                  </span>
                  <span className="font-bold">
                    {transaction.metadata.convertedAmount}{" "}
                    {transaction.currency}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Small Helper Component
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

export default AdminWalletTransactionDetailPage;
