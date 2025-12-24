import { useQuery } from "@tanstack/react-query";
import { getAllRefunds } from "@/api/endpoints/wallet.api";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Check, Eye } from "lucide-react";
import { useState } from "react";

// Component Copy ID - Refactored for Design System
const CopyableId = ({ id }: { id: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-xl w-fit border border-border/50">
      <span className="text-xs font-medium text-foreground truncate max-w-[100px] sm:max-w-[140px]" title={id}>
        {id}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 text-muted-foreground hover:text-foreground shrink-0 rounded-full"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  );
};

const RefundManagementPage = () => {
  const [page, setPage] = useState(1);
  const [selectedRefund, setSelectedRefund] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-refunds", page],
    queryFn: () => getAllRefunds({ page, limit: 10 }),
  });

  const handleViewDetail = (refund: any) => {
    setSelectedRefund(refund);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processed":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 border-transparent text-white rounded-lg font-semibold shadow-none">Processed</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-amber-600 border-amber-600 bg-amber-50 rounded-lg font-semibold">Pending</Badge>;
      case "failed":
      case "rejected":
        return <Badge variant="destructive" className="rounded-lg font-semibold shadow-none">Failed</Badge>;
      default:
        return <Badge variant="secondary" className="rounded-lg font-semibold text-muted-foreground">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: string | number, currency: string) => {
    return new Intl.NumberFormat('en-US').format(Number(amount)) + ` ${currency}`;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Refund Management</h1>
        </div>

        {/* Main Content Card */}
        <Card className="rounded-3xl border-border bg-card shadow-none overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground text-sm">Loading data...</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-border">
                        <TableHead className="text-xs font-bold uppercase text-muted-foreground pl-6 h-12">User</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">Refund ID</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">Amount</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">Reason</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">Status</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">Created At</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-muted-foreground text-right pr-6 h-12">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.data.map((refund: any) => (
                        <TableRow 
                          key={refund.id} 
                          className="cursor-pointer hover:bg-muted/50 border-border group transition-colors" 
                          onClick={() => handleViewDetail(refund)}
                        >
                          {/* User Info */}
                          <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-border">
                                <AvatarImage src={refund.user?.avatarUrl} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                  {refund.user?.firstName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm text-foreground">{refund.user?.fullName}</span>
                                <span className="text-xs text-muted-foreground">{refund.user?.email}</span>
                              </div>
                            </div>
                          </TableCell>

                          {/* Refund ID */}
                          <TableCell className="py-4">
                             <CopyableId id={refund.id} />
                          </TableCell>

                          {/* Amount */}
                          <TableCell className="font-semibold text-sm py-4 text-foreground">
                            {formatCurrency(refund.amount, refund.currency)}
                          </TableCell>

                          {/* Reason */}
                          <TableCell className="max-w-[150px] truncate py-4 text-sm text-muted-foreground" title={refund.reason || ""}>
                            {refund.reason || "-"}
                          </TableCell>

                          {/* Status */}
                          <TableCell className="py-4">{getStatusBadge(refund.status)}</TableCell>

                          {/* Created At */}
                          <TableCell className="text-muted-foreground text-sm py-4 font-medium">
                            {new Date(refund.createdAt).toLocaleDateString()}
                          </TableCell>

                          {/* Action */}
                          <TableCell className="text-right pr-6 py-4">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                              onClick={(e) => { e.stopPropagation(); handleViewDetail(refund); }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                  <div className="flex items-center justify-end gap-2 p-4 border-t border-border bg-card">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 rounded-xl border-border text-foreground hover:bg-muted px-4 font-medium"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <span className="text-xs font-bold uppercase text-muted-foreground px-2">
                      Page {page} of {data.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 rounded-xl border-border text-foreground hover:bg-muted px-4 font-medium"
                      disabled={page === data.totalPages}
                      onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl rounded-3xl p-6 gap-6 bg-card border-border shadow-lg">
            <DialogHeader className="text-left space-y-2">
              <DialogTitle className="text-xl font-bold text-foreground">Refund Detail</DialogTitle>
              <div className="flex items-center gap-2">
                 <span className="text-xs font-bold uppercase text-muted-foreground">ID:</span>
                 {selectedRefund && <CopyableId id={selectedRefund.id} />}
              </div>
            </DialogHeader>
            
            {selectedRefund && (
              <div className="grid gap-6">
                
                {/* Summary Section */}
                <div className="flex items-center justify-between bg-muted/30 p-5 rounded-2xl border border-border">
                  <div>
                     <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Refund Amount</p>
                     <p className="text-2xl font-bold text-foreground">{formatCurrency(selectedRefund.amount, selectedRefund.currency)}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Status</p>
                     {getStatusBadge(selectedRefund.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  
                  {/* User Information */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-foreground border-b border-border pb-2">User Information</h4>
                    <div className="space-y-3">
                      <DetailRow label="Full Name" value={selectedRefund.user?.fullName} />
                      <DetailRow label="Email" value={selectedRefund.user?.email} />
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="space-y-4">
                     <h4 className="font-bold text-sm text-foreground border-b border-border pb-2">Transaction Details</h4>
                     <div className="space-y-3">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs font-bold uppercase text-muted-foreground">Payment Transaction ID</span>
                          <CopyableId id={selectedRefund.paymentTransactionId} />
                        </div>
                        <DetailRow label="Provider" value={selectedRefund.paymentTransaction?.provider} capitalize />
                     </div>
                  </div>
                </div>

                {/* Refund Specifics */}
                <div className="space-y-4">
                   <h4 className="font-bold text-sm text-foreground border-b border-border pb-2">Additional Info</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <DetailRow label="Reason" value={selectedRefund.reason} />
                      <DetailRow label="Created At" value={new Date(selectedRefund.createdAt).toLocaleString()} />
                   </div>
                </div>
              </div>
            )}

            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button variant="outline" className="h-9 rounded-xl border-border px-6 font-medium">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, capitalize }: { label: string, value: any, capitalize?: boolean }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-bold uppercase text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium text-foreground ${capitalize ? 'capitalize' : ''}`}>
        {value}
      </span>
    </div>
  );
}

export default RefundManagementPage;