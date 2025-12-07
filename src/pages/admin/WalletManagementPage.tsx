import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAllWallets,
  getWalletUsageHistory,
  getWalletTransactions,
  createRefund,
} from "@/api/endpoints/wallet.api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
}
 from "@/components/ui/table";
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
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { WalletTransaction } from "@/api/types/wallet.types";
import { DollarSign, ChevronLeft, ChevronRight, MessageSquare, Briefcase, MinusCircle, User } from "lucide-react";

const WalletManagementPage = () => {
  const [page, setPage] = useState(1);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [showUsage, setShowUsage] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<WalletTransaction | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");

  // Fetch all wallets
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-wallets", page],
    queryFn: () => getAllWallets({ page, limit: 10 }),
  });

  // Fetch usage history for selected wallet
  const { data: usageData, isLoading: loadingUsage } = useQuery({
    queryKey: ["wallet-usage", selectedWallet?.userId],
    queryFn: () =>
      selectedWallet
        ? getWalletUsageHistory(selectedWallet.userId, {
            pageNumber: 1,
            pageSize: 10,
          })
        : Promise.resolve(undefined),
    enabled: !!selectedWallet && showUsage,
  });

  // Fetch transactions for selected wallet
  const {
    data: transactionsData,
    isLoading: loadingTransactions,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ["wallet-transactions", selectedWallet?.userId],
    queryFn: () =>
      selectedWallet
        ? getWalletTransactions(selectedWallet.userId, {
            pageNumber: 1,
            pageSize: 10,
          })
        : Promise.resolve(undefined),
    enabled: !!selectedWallet && showTransactions,
  });

  // Refund mutation
  const refundMutation = useMutation({
    mutationFn: (data: {
      userId: string;
      amount: number;
      reason: string;
      paymentTransactionId: string;
    }) => createRefund(data),
    onSuccess: () => {
      toast({ title: "Refund created successfully" });
      setShowRefund(false);
      setRefundAmount("");
      setRefundReason("");
      setSelectedTransaction(null);
      refetch();
      refetchTransactions();
    },
    onError: () => toast({ title: "Refund failed", variant: "destructive" }),
  });

  const handleRefundClick = (transaction: WalletTransaction) => {
    setSelectedTransaction(transaction);
    setRefundAmount(Math.abs(transaction.amount).toString());
    setRefundReason("");
    setShowRefund(true);
  };

  const handleRefundSubmit = () => {
    if (!selectedTransaction || !selectedWallet) return;

    refundMutation.mutate({
      userId: selectedWallet.userId,
      amount: Number(refundAmount),
      reason: refundReason,
      paymentTransactionId: selectedTransaction.id,
    });
  };

  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-6">
          <CardTitle className="text-3xl font-bold text-gray-900 flex items-center gap-3">
             <DollarSign size={30} className="text-[#0EA5E9]" />
             Wallet Management
          </CardTitle>
          <p className="text-gray-500 mt-1">Manage user balances, transactions, and refund requests.</p>
        </div>

        <Card className="border-gray-200 rounded-xl">
          <CardContent className="p-0 overflow-hidden">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">
                <p>Loading wallets...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                    <Table className="min-w-full divide-y divide-gray-100">
                        <TableHeader className="bg-gray-50">
                            <TableRow className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <TableHead className="px-6 py-3 text-left">User</TableHead>
                                <TableHead className="px-6 py-3 text-left">Email</TableHead>
                                <TableHead className="px-6 py-3 text-left">Balance</TableHead>
                                <TableHead className="px-6 py-3 text-left">Currency</TableHead>
                                <TableHead className="px-6 py-3 text-left">Status</TableHead>
                                <TableHead className="px-6 py-3 text-left">Last Updated</TableHead>
                                <TableHead className="px-6 py-3 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white divide-y divide-gray-100">
                            {(data?.wallets ?? []).map((wallet) => (
                                <TableRow key={wallet.id} className="hover:bg-blue-50/30 transition-colors">
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 rounded-full">
                                                <AvatarImage
                                                    src={wallet.user.avatarUrl || undefined}
                                                />
                                                <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                                                    {wallet.user.fullName?.charAt(0) ||
                                                    wallet.user.username?.charAt(0) ||
                                                    "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-gray-900 text-sm">
                                                {wallet.user.fullName || wallet.user.username}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-gray-600">{wallet.user.email}</TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-bold text-gray-900">
                                            {parseFloat(wallet.creditBalance).toLocaleString()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <Badge className="bg-gray-100 text-gray-600 border-gray-300 text-[10px] font-bold">{wallet.currency}</Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <Badge
                                            variant="default"
                                            className={`font-bold uppercase text-[10px] ${wallet.user.status === "active" ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'} border-none`}
                                        >
                                            {wallet.user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(wallet.updatedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedWallet(wallet);
                                                setShowUsage(true);
                                            }}
                                            className="font-bold text-xs border-gray-300 hover:bg-blue-50 hover:text-[#0EA5E9]"
                                        >
                                            Usage
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="font-bold text-xs border-gray-300 hover:bg-blue-50 hover:text-[#0EA5E9]"
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedWallet(wallet);
                                                setShowTransactions(true);
                                            }}
                                        >
                                            Transactions
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                {/* Pagination */}
                {data && data.totalPages > 1 && (
                  <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-white rounded-b-xl">
                    <span className="text-sm text-gray-600">
                      Showing <b>{data.wallets.length}</b> of <b>{data.total}</b> results
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700">
                        Page {page} of {totalPages}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page === 1}
                          onClick={() => setPage(page - 1)}
                          className="w-8 h-8 p-0 border-gray-300 hover:bg-gray-50"
                        >
                          <ChevronLeft size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page === totalPages}
                          onClick={() => setPage(page + 1)}
                          className="w-8 h-8 p-0 border-gray-300 hover:bg-gray-50"
                        >
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Usage History Dialog (Tái cấu trúc UI) */}
      <Dialog open={showUsage} onOpenChange={setShowUsage}>
        <DialogContent className="max-w-3xl rounded-xl p-0 overflow-hidden border-none">
          <DialogHeader className="p-6 pb-4 border-b border-gray-100 bg-gray-50/50">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#0EA5E9]" />
                Usage History for <span className="font-medium text-gray-700">{selectedWallet?.user?.fullName || selectedWallet?.user?.username}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {loadingUsage ? (
              <p className="text-center text-gray-500">Loading usage...</p>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100">
                    {(usageData?.data ?? []).map((tx) => (
                      <TableRow key={tx.id} className="text-sm text-gray-700 hover:bg-blue-50/30">
                        <TableCell className="capitalize">{tx.type}</TableCell>
                        <TableCell>
                          <span
                            className={`font-bold ${tx.amount > 0 ? "text-emerald-600" : "text-red-600"}`}
                          >
                            {tx.amount > 0 ? "+" : ""}
                            {tx.amount.toLocaleString()} {tx.currency}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="default"
                            className={`font-bold uppercase text-[10px] ${tx.status === "success" ? 'bg-emerald-100 text-emerald-800' : (tx.status === "pending" ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800')} border-none`}
                          >
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-gray-600">
                          {tx.description || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <DialogFooter className="p-6 pt-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
            <Button variant="outline" onClick={() => setShowUsage(false)} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 font-bold">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transactions Dialog (Tái cấu trúc UI) */}
      <Dialog open={showTransactions} onOpenChange={setShowTransactions}>
        <DialogContent className="max-w-4xl rounded-xl p-0 overflow-hidden border-none">
          <DialogHeader className="p-6 pb-4 border-b border-gray-100 bg-gray-50/50">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#0EA5E9]" />
                Transaction Log for <span className="font-medium text-gray-700">{selectedWallet?.user?.fullName || selectedWallet?.user?.username}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {loadingTransactions ? (
              <p className="text-center text-gray-500">Loading transactions...</p>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100">
                    {(transactionsData?.data ?? []).map((tx) => (
                      <TableRow key={tx.id} className="text-sm text-gray-700 hover:bg-blue-50/30">
                        <TableCell>
                          <Badge
                            variant="default"
                            className={`font-bold uppercase text-[10px] ${tx.type === "refund" ? 'bg-gray-100 text-gray-600' : (tx.type === "top_up" ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600')} border-none`}
                          >
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-bold ${tx.amount > 0 ? "text-emerald-600" : "text-red-600"}`}
                          >
                            {tx.amount > 0 ? "+" : ""}
                            {tx.amount.toLocaleString()} {tx.currency}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="default"
                            className={`font-bold uppercase text-[10px] ${tx.status === "success" ? 'bg-emerald-100 text-emerald-800' : (tx.status === "pending" ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800')} border-none`}
                          >
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-gray-600">
                          {tx.description || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {/* HIỂN THỊ NÚT REFUND CHO MỌI GIAO DỊCH */}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRefundClick(tx)}
                            className="bg-red-500 text-white hover:bg-red-600 font-bold text-xs"
                          >
                            Refund
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <DialogFooter className="p-6 pt-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
            <Button
              variant="outline"
              onClick={() => setShowTransactions(false)}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 font-bold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog (Tái cấu trúc UI) */}
      <Dialog
        open={showRefund}
        onOpenChange={(open) => {
          setShowRefund(open);
          if (!open) {
            setSelectedTransaction(null);
            setRefundAmount("");
            setRefundReason("");
          }
        }}
      >
        <DialogContent className="max-w-md rounded-xl border-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MinusCircle className="h-5 w-5 text-red-500" />
              Initiate Refund
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 space-y-2">
              <p>
                <b>User:</b> {selectedWallet?.user?.fullName || selectedWallet?.user?.username}
              </p>
              <p>
                <b>Transaction ID:</b> {selectedTransaction?.id.substring(0, 8)}...
              </p>
              <p>
                <b>Original Amount:</b>{" "}
                <span className="font-bold text-emerald-600">
                    {Math.abs(selectedTransaction?.amount || 0).toLocaleString()}{" "}
                    {selectedTransaction?.currency}
                </span>
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase block">Refund Amount</label>
              <Input
                type="number"
                placeholder="Enter refund amount"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase block">Reason for Refund</label>
              <Input
                placeholder="Enter reason for refund"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="border-gray-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefund(false)} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 font-bold">
              Cancel
            </Button>
            <Button
              onClick={handleRefundSubmit}
              disabled={
                refundMutation.isPending ||
                !refundAmount ||
                !refundReason ||
                !selectedTransaction
              }
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 font-bold"
            >
              {refundMutation.isPending ? "Processing..." : "Confirm Refund"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletManagementPage;