import { useQuery } from "@tanstack/react-query";
import { getAllRefunds } from "@/api/endpoints/wallet.api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const RefundManagementPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-refunds", page],
    queryFn: () => getAllRefunds({ page, limit: 10 }),
  });

  const getStatusBadge = (status: string) => {
    if (status === "pending") return <Badge variant="outline">Pending</Badge>;
    if (status === "approved") return <Badge variant="default">Approved</Badge>;
    if (status === "rejected") return <Badge variant="destructive">Rejected</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl">Refund Management</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading refunds...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Refund ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((refund) => (
                    <TableRow key={refund.id}>
                      <TableCell className="truncate max-w-xs">{refund.id}</TableCell>
                      <TableCell className="truncate max-w-xs">{refund.userId}</TableCell>
                      <TableCell>
                        <span className="font-semibold">{refund.amount.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(refund.status)}</TableCell>
                      <TableCell className="max-w-xs truncate">{refund.reason}</TableCell>
                      <TableCell>{new Date(refund.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {data && data.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Previous
                  </Button>
                  <span className="py-2 px-4">
                    Page {page} of {data.totalPages}
                  </span>
                  <Button variant="outline" disabled={page === data.totalPages} onClick={() => setPage(page + 1)}>
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RefundManagementPage;