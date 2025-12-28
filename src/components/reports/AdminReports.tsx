import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReports, updateReportStatus } from "@/api/endpoints/reports.api";
import {
  entityTypeDisplay,
  Report,
  ReportStatus,
} from "@/api/types/reports.types";
import { Card, CardContent } from "@/components/ui/card";
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
import ShareButton from "../shared/ShareButton";

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
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: ReportStatus;
      notes?: string;
    }) => updateReportStatus(id, { status, adminNotes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      toast({ title: "Report status updated successfully" });
      setSelectedReport(null);
      setNewStatus("");
      setAdminNotes("");
    },
    onError: () => {
      toast({
        title: "Failed to update report status",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: ReportStatus) => {
    const variants: Record<
      ReportStatus,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      [ReportStatus.PENDING]: { variant: "outline", label: "Pending" },
      [ReportStatus.UNDER_REVIEW]: {
        variant: "secondary",
        label: "Under Review",
      },
      [ReportStatus.RESOLVED]: { variant: "default", label: "Resolved" },
      [ReportStatus.DISMISSED]: { variant: "destructive", label: "Dismissed" },
      [ReportStatus.CLOSED]: { variant: "outline", label: "Closed" },
    };
    const config = variants[status];
    return (
      <Badge
        variant={config.variant}
        className="rounded-lg px-2.5 py-0.5 font-medium"
      >
        {config.label}
      </Badge>
    );
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
    <div className="min-h-screen bg-[#F8F9FB] p-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">
            Reports Management
          </h1>
        </div>

        {/* Main Content Card */}
        <Card className="rounded-3xl border-border bg-card shadow-none">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading reports...
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">
                        Entity Type
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">
                        Reason
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">
                        Created At
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12 text-right pr-6">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportsData?.data.map((report) => (
                      <TableRow
                        key={report.id}
                        className="border-border hover:bg-muted/30"
                      >
                        <TableCell className="py-4 font-medium text-foreground">
                          <Badge
                            variant="outline"
                            className="rounded-md border-border text-foreground"
                          >
                            {report.entityType}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-muted-foreground">
                          {report.reason}
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9"
                            onClick={() => setSelectedReport(report)}
                          >
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {reportsData && reportsData.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 p-4 border-t border-border">
                    <Button
                      variant="outline"
                      className="h-9"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm font-medium text-muted-foreground px-4">
                      Page {page} of {reportsData.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      className="h-9"
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
      </div>

      <Dialog
        open={!!selectedReport}
        onOpenChange={() => setSelectedReport(null)}
      >
        <DialogContent className="max-w-2xl bg-card border-border sm:rounded-3xl p-0 overflow-hidden gap-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-bold text-foreground">
              Report Details
            </DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="p-6 space-y-6">
              {/* Report Information Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">
                    Entity Type
                  </h4>
                  <span className="text-sm text-foreground font-medium flex flex-row items-center gap-2">
                    <span>
                      {entityTypeDisplay[selectedReport.entityType] ||
                        selectedReport.entityType}
                    </span>
                    {["job", "organization", "user","refund"].includes(
                      selectedReport.entityType
                    ) && (
                      <ShareButton
                        pathname={
                          selectedReport.entityType === "job"
                            ? `admin/jobs/${selectedReport.entityId}`
                            : selectedReport.entityType === "organization"
                            ? `admin/companies/${selectedReport.entityId}`
                            : selectedReport.entityType === "user"
                            ? `admin/users/${selectedReport.entityId}`
                            : selectedReport.entityType === "refund"
                            ? `admin/wallets/${selectedReport.entityId}`
                            : ""
                        }
                        minimal
                      />
                    )}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">
                    Current Status
                  </h4>
                  {getStatusBadge(selectedReport.status)}
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-muted-foreground">
                  Subject
                </h4>
                <p className="text-sm font-medium text-foreground">
                  {selectedReport.subject}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-muted-foreground">
                  Reason
                </h4>
                <p className="text-sm font-medium text-foreground">
                  {selectedReport.reason}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-muted-foreground">
                  Description
                </h4>
                <div className="bg-muted/30 p-3 rounded-xl border border-border">
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.description}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-muted-foreground">
                  Priority
                </h4>
                <p className="text-sm font-medium text-foreground">
                  {selectedReport.priority}
                </p>
              </div>

              {selectedReport.adminNotes && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">
                    Previous Admin Notes
                  </h4>
                  <p className="text-sm text-muted-foreground italic">
                    {selectedReport.adminNotes}
                  </p>
                </div>
              )}

              {/* Action Area */}
              <div className="bg-[#F8F9FB] -mx-6 -mb-6 p-6 space-y-4 border-t border-border mt-4">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">
                    Update Status
                  </h4>
                  <Select
                    value={newStatus}
                    onValueChange={(value) =>
                      setNewStatus(value as ReportStatus)
                    }
                  >
                    <SelectTrigger className="h-10 rounded-xl bg-card border-border">
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ReportStatus.PENDING}>
                        Pending
                      </SelectItem>
                      <SelectItem value={ReportStatus.UNDER_REVIEW}>
                        Under Review
                      </SelectItem>
                      <SelectItem value={ReportStatus.RESOLVED}>
                        Resolved
                      </SelectItem>
                      <SelectItem value={ReportStatus.DISMISSED}>
                        Dismissed
                      </SelectItem>
                      <SelectItem value={ReportStatus.CLOSED}>
                        Closed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">
                    Admin Notes
                  </h4>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this report..."
                    rows={3}
                    className="rounded-xl border-border bg-card focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="p-6 bg-[#F8F9FB] border-t border-border mt-0">
            <Button
              variant="outline"
              onClick={() => setSelectedReport(null)}
              className="h-9"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="h-9"
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
