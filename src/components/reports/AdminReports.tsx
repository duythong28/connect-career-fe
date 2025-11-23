import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReports, updateReportStatus } from "@/api/endpoints/reports.api";
import { Report, ReportStatus } from "@/api/types/reports.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle, Calendar, FileText } from "lucide-react";

const AdminReports = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus | "">("");
  const [adminNotes, setAdminNotes] = useState("");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ["admin-reports", page],
    queryFn: () => getReports({ page, limit: 10 }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: ReportStatus; notes?: string }) =>
      updateReportStatus(id, { status, adminNotes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      toast({ title: "Report status updated successfully" });
      setSelectedReport(null);
      setNewStatus("");
      setAdminNotes("");
    },
    onError: () => {
      toast({ title: "Failed to update report status", variant: "destructive" });
    },
  });

  const getStatusBadge = (status: ReportStatus) => {
    const variants: Record<ReportStatus, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      [ReportStatus.PENDING]: { variant: "outline", label: "Pending" },
      [ReportStatus.UNDER_REVIEW]: { variant: "secondary", label: "Under Review" },
      [ReportStatus.RESOLVED]: { variant: "default", label: "Resolved" },
      [ReportStatus.DISMISSED]: { variant: "destructive", label: "Dismissed" },
      [ReportStatus.CLOSED]: { variant: "outline", label: "Closed" },
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleUpdateStatus = () => {
    if (!selectedReport || !newStatus) return;
    updateStatusMutation.mutate({
      id: selectedReport.id,
      status: newStatus as ReportStatus,
      notes: adminNotes,
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Reports Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading reports...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportsData?.data.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <Badge variant="outline">{report.entityType}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{report.reason}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedReport(report)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {reportsData && reportsData.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="py-2 px-4">
                    Page {page} of {reportsData.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === reportsData.totalPages}
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

      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Entity Type</h4>
                <Badge variant="outline">{selectedReport.entityType}</Badge>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Reason</h4>
                <p>{selectedReport.reason}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Subject</h4>
                <p>{selectedReport.subject}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground">{selectedReport.description}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Priority</h4>
                <p>{selectedReport.priority}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Current Status</h4>
                {getStatusBadge(selectedReport.status)}
              </div>
              {selectedReport.adminNotes && (
                <div>
                  <h4 className="font-semibold mb-2">Admin Notes</h4>
                  <p className="text-muted-foreground">{selectedReport.adminNotes}</p>
                </div>
              )}
              <div>
                <h4 className="font-semibold mb-2">Update Status</h4>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as ReportStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ReportStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={ReportStatus.UNDER_REVIEW}>Under Review</SelectItem>
                    <SelectItem value={ReportStatus.RESOLVED}>Resolved</SelectItem>
                    <SelectItem value={ReportStatus.DISMISSED}>Dismissed</SelectItem>
                    <SelectItem value={ReportStatus.CLOSED}>Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Admin Notes</h4>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this report..."
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={!newStatus || updateStatusMutation.isPending}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReports;