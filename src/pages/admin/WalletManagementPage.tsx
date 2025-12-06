import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAllWallets,
  getWalletUsageHistory,
  getWalletTransactions,
  topUpWallet,
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
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const WalletManagementPage = () => {
  const [page, setPage] = useState(1);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [showUsage, setShowUsage] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
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
  const { data: transactionsData, isLoading: loadingTransactions } = useQuery({
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
    mutationFn: (data: { userId: string; amount: number; reason: string }) =>
      createRefund(data),
    onSuccess: () => {
      toast({ title: "Refund created" });
      setShowRefund(false);
      setRefundAmount("");
      setRefundReason("");
      refetch();
    },
    onError: () => toast({ title: "Refund failed", variant: "destructive" }),
  });

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl">
            Wallet Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading wallets...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data?.wallets ?? []).map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={wallet.user.avatarUrl || undefined}
                            />
                            <AvatarFallback>
                              {wallet.user.fullName?.charAt(0) ||
                                wallet.user.username?.charAt(0) ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span>
                            {wallet.user.fullName || wallet.user.username}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{wallet.user.email}</TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {parseFloat(wallet.creditBalance).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{wallet.currency}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            wallet.user.status === "active"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {wallet.user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(wallet.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedWallet(wallet);
                            setShowUsage(true);
                          }}
                        >
                          Usage
                        </Button>
                        <Button
                          size="sm"
                          className="ml-2"
                          variant="outline"
                          onClick={() => {
                            setSelectedWallet(wallet);
                            setShowTransactions(true);
                          }}
                        >
                          Transactions
                        </Button>
                        <Button
                          size="sm"
                          className="ml-2"
                          variant="destructive"
                          onClick={() => {
                            setSelectedWallet(wallet);
                            setShowRefund(true);
                          }}
                        >
                          Refund
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {data && data.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="py-2 px-4">
                    Page {page} of {data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === data.totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Usage History Dialog */}
      <Dialog open={showUsage} onOpenChange={setShowUsage}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Usage History for{" "}
              {selectedWallet?.user?.fullName || selectedWallet?.user?.username}
            </DialogTitle>
          </DialogHeader>
          {loadingUsage ? (
            <p>Loading usage...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(usageData?.data ?? []).map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>
                      <span
                        className={
                          tx.amount > 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {tx.amount > 0 ? "+" : ""}
                        {tx.amount.toLocaleString()} {tx.currency}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tx.status === "success"
                            ? "default"
                            : tx.status === "pending"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {tx.description || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUsage(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transactions Dialog */}
      <Dialog open={showTransactions} onOpenChange={setShowTransactions}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Transactions for{" "}
              {selectedWallet?.user?.fullName || selectedWallet?.user?.username}
            </DialogTitle>
          </DialogHeader>
          {loadingTransactions ? (
            <p>Loading transactions...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(transactionsData?.data ?? []).map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>
                      <span
                        className={
                          tx.amount > 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {tx.amount > 0 ? "+" : ""}
                        {tx.amount.toLocaleString()} {tx.currency}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tx.status === "success"
                            ? "default"
                            : tx.status === "pending"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {tx.description || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransactions(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={showRefund} onOpenChange={setShowRefund}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Refund for{" "}
              {selectedWallet?.user?.fullName || selectedWallet?.user?.username}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Amount"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
            />
            <Input
              placeholder="Reason"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
            />
            <Button
              onClick={() =>
                refundMutation.mutate({
                  userId: selectedWallet.userId,
                  amount: Number(refundAmount),
                  reason: refundReason,
                })
              }
              disabled={
                refundMutation.isPending || !refundAmount || !refundReason
              }
              variant="destructive"
            >
              Refund
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefund(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletManagementPage;