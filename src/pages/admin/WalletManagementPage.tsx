import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAllWallets,
  getWalletUsageHistory,
  getWalletTransactions,
  createRefund,
  getBillableActions,
} from "@/api/endpoints/wallet.api";
import {
  WalletBalance,
  WalletTransaction,
  RefundRequest,
} from "@/api/types/wallet.types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Wallet, History, ArrowRightLeft, RotateCcw, Check, Copy } from "lucide-react";

// --- Components ---

const CopyableId = ({ id }: { id: string | null | undefined }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!id) return <span className="text-muted-foreground">-</span>;

  return (
    <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded w-fit max-w-full border border-border">
      <span className="font-mono text-xs truncate max-w-[120px] sm:max-w-[180px]" title={id}>
        {id}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 shrink-0 hover:bg-muted text-muted-foreground hover:text-foreground"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  );
};

// Helper to format full name safely
const formatName = (user: any) => {
  if (!user) return "Unknown User";
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.username || "Unknown User";
};

// --- Main Page Component ---

const WalletManagementPage = () => {
  // Pagination States
  const [walletPage, setWalletPage] = useState(1);
  const [usagePage, setUsagePage] = useState(1);
  const [transactionPage, setTransactionPage] = useState(1);

  // Selection States
  const [selectedWallet, setSelectedWallet] = useState<any | null>(null);
  
  // Dialog States
  const [showUsage, setShowUsage] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showRefund, setShowRefund] = useState(false);

  // Refund State
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundTransactionId, setRefundTransactionId] = useState("");

  // 1. Fetch all wallets
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ["admin-wallets", walletPage],
    queryFn: () => getAllWallets({ page: walletPage, limit: 10 }),
  });

  // Accessing userId safely
  const getUserId = (wallet: any | null) => {
    return wallet?.userId || wallet?.user?.id || "";
  };

  // 2. Fetch usage history (with pagination)
  const { data: usageData, isLoading: usageLoading } = useQuery({
    queryKey: ["wallet-usage", selectedWallet ? getUserId(selectedWallet) : "", usagePage],
    queryFn: () => {
      const userId = getUserId(selectedWallet);
      if (!userId) return Promise.resolve(undefined);
      return getWalletUsageHistory(userId, {
        pageNumber: usagePage,
        pageSize: 10,
      });
    },
    enabled: !!selectedWallet && showUsage,
  });

  // 3. Fetch transactions (with pagination)
  const { data: transactionsData, isLoading: transactionsLoading, refetch: refetchTransactions } = useQuery({
    queryKey: ["wallet-transactions", selectedWallet ? getUserId(selectedWallet) : "", transactionPage],
    queryFn: () => {
      const userId = getUserId(selectedWallet);
      if (!userId) return Promise.resolve(undefined);
      return getWalletTransactions(userId, {
        pageNumber: transactionPage,
        pageSize: 10,
      });
    },
    enabled: !!selectedWallet && showTransactions,
  });

  // Reset pagination when dialogs close/open
  useEffect(() => {
    async function getahahaha() {
      await getBillableActions();
    }

    getahahaha();
    if (!showUsage) setUsagePage(1);
  }, [showUsage]);

  useEffect(() => {
    if (!showTransactions) setTransactionPage(1);
  }, [showTransactions]);

  // 4. Create Refund Mutation
  const refundMutation = useMutation({
    mutationFn: (data: RefundRequest) => createRefund(data),
    onSuccess: () => {
      toast({ title: "Refund processed successfully" });
      setShowRefund(false);
      setRefundAmount("");
      setRefundReason("");
      setRefundTransactionId("");
      setSelectedTransaction(null);
      refetchTransactions();
    },
    onError: (error: any) => {
      toast({ 
        title: "Refund failed", 
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive" 
      });
    },
  });

  const handleInitiateRefund = (transaction: any) => {
    const paymentId = transaction.relatedPaymentTransactionId || transaction.metadata?.paymentTransactionId;
    
    if (!paymentId) {
      toast({ title: "Cannot refund: Missing Payment Transaction ID", variant: "destructive" });
      return;
    }

    setSelectedTransaction(transaction);
    setRefundTransactionId(paymentId); 
    setRefundAmount((transaction.amount ?? 0).toString()); 
    setRefundReason("");
    setShowRefund(true);
  };

  const handleSubmitRefund = () => {
    if (!selectedWallet) return;

    const request: RefundRequest = {
      userId: getUserId(selectedWallet),
      amount: Number(refundAmount),
      reason: refundReason,
      paymentTransactionId: refundTransactionId,
    };

    refundMutation.mutate(request);
  };

  // Helper validation for refund amount
  const isRefundAmountValid = () => {
    const amount = Number(refundAmount);
    if (!amount || amount <= 0) return false;
    
    // Check minimum 10000 VND constraint
    if (selectedTransaction?.currency === 'VND' && amount < 10000) {
      return false;
    }
    
    return true;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">
            Wallet Management
          </h1>
        </div>

        {/* Main Content Card - Wallets List */}
        <Card className="rounded-3xl border-border bg-card shadow-none">
          <CardContent className="p-0">
            {walletLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading wallets...
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12 pl-6">
                        User
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">
                        Email
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">
                        Balance
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">
                        Currency
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">
                        Last Updated
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12 text-right pr-6">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(walletData?.wallets ?? []).map((wallet: any) => {
                      const user = wallet.user;
                      return (
                        <TableRow
                          key={wallet.id}
                          className="border-border hover:bg-muted/30"
                        >
                          <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-border">
                                <AvatarImage
                                  src={user?.avatarUrl || undefined}
                                />
                                <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                                  {user?.firstName?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground">
                                  {formatName(user)}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {user?.email}
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-foreground">
                              {parseFloat(wallet.creditBalance || "0").toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="rounded-lg border-border font-medium"
                            >
                              {wallet.currency || "USD"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user?.status === "active"
                                  ? "default"
                                  : "destructive"
                              }
                              className="rounded-lg px-2.5 py-0.5 font-medium"
                            >
                              {user?.status || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {wallet.updatedAt ? new Date(wallet.updatedAt).toLocaleDateString() : "N/A"}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 px-3"
                                onClick={() => {
                                  setSelectedWallet(wallet);
                                  setShowUsage(true);
                                }}
                              >
                                <History className="h-4 w-4 mr-2 text-primary" />
                                Usage
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 px-3"
                                onClick={() => {
                                  setSelectedWallet(wallet);
                                  setShowTransactions(true);
                                }}
                              >
                                <ArrowRightLeft className="h-4 w-4 mr-2 text-primary" />
                                Transactions
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Wallets Pagination - ALWAYS SHOW */}
                <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
                  <Button
                    variant="outline"
                    className="h-9"
                    disabled={walletPage === 1}
                    onClick={() => setWalletPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground px-2">
                    Page {walletPage} of {walletData?.totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    className="h-9"
                    disabled={!walletData || walletPage === walletData.totalPages}
                    onClick={() => setWalletPage((p) => Math.min(walletData?.totalPages || 1, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 2. Usage History Dialog */}
        <Dialog open={showUsage} onOpenChange={setShowUsage}>
          <DialogContent className="max-w-7xl w-full bg-card border-border sm:rounded-3xl p-0 overflow-hidden gap-0">
            <DialogHeader className="p-6 border-b border-border">
              <DialogTitle className="text-xl font-bold text-foreground">
                Usage History
              </DialogTitle>
            </DialogHeader>
            <div className="p-0 max-h-[70vh] overflow-y-auto">
              {usageLoading ? (
                <div className="p-8 text-center text-muted-foreground">
                  Loading usage...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent bg-muted/30">
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-10 pl-6 w-[25%]">
                        Action
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-10 w-[15%]">
                        Cost
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-10 w-[25%]">
                        Balance Impact
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-10 w-[20%] pr-6">
                        Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {((usageData as any)?.data ?? []).map((item: any) => (
                      <TableRow key={item.id} className="border-border">
                        <TableCell className="pl-6 font-medium text-foreground align-top">
                          {item.action?.actionName || item.actionCode || "Unknown Action"}
                        </TableCell>
                        <TableCell className="align-top">
                          <span className="font-semibold text-red-600">
                            -{parseFloat(item.amountDeducted || "0").toLocaleString()} {item.currency}
                          </span>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex flex-col text-xs text-muted-foreground">
                            <span>Before: {parseFloat(item.balanceBefore).toLocaleString()}</span>
                            <span className="font-medium text-foreground">After: {parseFloat(item.balanceAfter).toLocaleString()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm align-top pr-6">
                          {item.timestamp ? new Date(item.timestamp).toLocaleString() : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!(usageData as any)?.data || (usageData as any).data.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                          No usage history found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
            
            {/* Usage Pagination - ALWAYS SHOW */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-border bg-[#F8F9FB]">
              <Button
                variant="outline"
                className="h-9"
                disabled={usagePage === 1}
                onClick={() => setUsagePage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-muted-foreground px-2">
                Page {usagePage} of {(usageData as any)?.totalPages || 1}
              </span>
              <Button
                variant="outline"
                className="h-9"
                disabled={!usageData || usagePage === (usageData as any).totalPages}
                onClick={() => setUsagePage((p) => Math.min((usageData as any)?.totalPages || 1, p + 1))}
              >
                Next
              </Button>
            </div>
            
            <DialogFooter className="p-4 bg-[#F8F9FB] border-t border-border">
              <Button
                variant="outline"
                className="h-9"
                onClick={() => setShowUsage(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 3. Transactions Dialog (Wide) */}
        <Dialog open={showTransactions} onOpenChange={setShowTransactions}>
          <DialogContent className="max-w-7xl w-full bg-card border-border sm:rounded-3xl p-0 overflow-hidden gap-0">
            <DialogHeader className="p-6 border-b border-border">
              <DialogTitle className="text-xl font-bold text-foreground">
                Transactions
              </DialogTitle>
            </DialogHeader>
            <div className="p-0 max-h-[70vh] overflow-y-auto">
              {transactionsLoading ? (
                <div className="p-8 text-center text-muted-foreground">
                  Loading transactions...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent bg-muted/30">
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-10 pl-6 w-[15%]">
                        Amount
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-10 w-[10%]">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-10 w-[10%]">
                        Method
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-10 w-[20%]">
                        Balance Change
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-10 w-[15%]">
                        Date
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-10 w-[20%]">
                        Payment Transaction ID
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-10">
                        Description
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-10 text-right pr-6 w-[10%]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {((transactionsData as any)?.data ?? []).map((tx: any) => {
                      const isCredit = tx.type === 'credit';
                      // Identify the correct ID for refunding. 
                      const paymentId = tx.relatedPaymentTransactionId || tx.metadata?.paymentTransactionId;
                      // Identify payment method
                      const paymentMethod = tx.relatedPaymentTransaction?.paymentMethod;

                      return (
                        <TableRow key={tx.id} className="border-border">
                          <TableCell className="pl-6 align-top">
                            <span
                              className={`font-semibold ${
                                isCredit ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {isCredit ? "+" : "-"}
                              {parseFloat(tx.amount || "0").toLocaleString()} {tx.currency}
                            </span>
                          </TableCell>
                          <TableCell className="align-top">
                            <Badge
                              variant={
                                tx.status === "completed" || tx.status === "success"
                                  ? "default"
                                  : tx.status === "pending"
                                  ? "outline"
                                  : "destructive"
                              }
                              className="rounded-md font-medium px-2 py-0.5 capitalize"
                            >
                              {tx.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="align-top">
                            {paymentMethod ? (
                              <Badge variant="outline" className="uppercase font-medium">
                                {paymentMethod}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell className="align-top">
                             <div className="flex flex-col text-xs text-muted-foreground gap-0.5">
                                <span>Before: {parseFloat(tx.balanceBefore).toLocaleString()}</span>
                                <span className="font-medium text-foreground">After: {parseFloat(tx.balanceAfter).toLocaleString()}</span>
                             </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm align-top">
                             {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "N/A"}
                          </TableCell>
                          <TableCell className="align-top">
                            <CopyableId id={paymentId} />
                          </TableCell>
                          <TableCell className="text-sm text-foreground align-top whitespace-normal break-words">
                            {tx.description || "-"}
                          </TableCell>
                          <TableCell className="text-right pr-6 align-top">
                            {/* Only show refund if credit, valid ID, and payment method is momo */}
                            {paymentId && isCredit && paymentMethod === 'momo' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 px-2"
                                onClick={() => handleInitiateRefund(tx)}
                              >
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Refund
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {(!(transactionsData as any)?.data || (transactionsData as any).data.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Transactions Pagination - ALWAYS SHOW */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-border bg-[#F8F9FB]">
              <Button
                variant="outline"
                className="h-9"
                disabled={transactionPage === 1}
                onClick={() => setTransactionPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-muted-foreground px-2">
                Page {transactionPage} of {(transactionsData as any)?.totalPages || 1}
              </span>
              <Button
                variant="outline"
                className="h-9"
                disabled={!transactionsData || transactionPage === (transactionsData as any).totalPages}
                onClick={() => setTransactionPage((p) => Math.min((transactionsData as any)?.totalPages || 1, p + 1))}
              >
                Next
              </Button>
            </div>

            <DialogFooter className="p-4 bg-[#F8F9FB] border-t border-border">
              <Button
                variant="outline"
                className="h-9"
                onClick={() => setShowTransactions(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 4. Refund Dialog */}
        <Dialog open={showRefund} onOpenChange={setShowRefund}>
          <DialogContent className="max-w-md bg-card border-border sm:rounded-3xl p-0 overflow-hidden gap-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-xl font-bold text-foreground text-center">
                Process Refund
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-muted/30 rounded-xl border border-border text-sm">
                <p className="text-muted-foreground font-semibold">Payment Transaction ID:</p>
                <div className="mt-1">
                   <CopyableId id={refundTransactionId} />
                </div>
                
                <div className="h-px bg-border my-2"/>
                
                <p className="text-muted-foreground">Original Transaction Amount:</p>
                <p className="font-semibold text-foreground">
                  {selectedTransaction?.amount ?? 0} {selectedTransaction?.currency}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Refund Amount
                </label>
                <Input
                  type="number"
                  placeholder="Amount"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className={`rounded-xl border-border focus:ring-primary ${
                    refundAmount && !isRefundAmountValid() ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                {refundAmount && !isRefundAmountValid() && (
                  <p className="text-xs text-red-500 font-medium">
                    Minimum refund amount is 10,000 VND
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Reason
                </label>
                <Input
                  placeholder="e.g. User request, duplicate charge"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="rounded-xl border-border focus:ring-primary"
                />
              </div>
              <Button
                className="w-full h-10 rounded-xl mt-2"
                onClick={handleSubmitRefund}
                disabled={
                  refundMutation.isPending || 
                  !isRefundAmountValid() || 
                  !refundReason || 
                  !refundTransactionId
                }
                variant="destructive"
              >
                {refundMutation.isPending ? "Processing..." : "Confirm Refund"}
              </Button>
            </div>
            <DialogFooter className="p-4 bg-[#F8F9FB] border-t border-border justify-center">
              <Button
                variant="outline"
                className="h-9 w-full sm:w-auto"
                onClick={() => setShowRefund(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default WalletManagementPage;