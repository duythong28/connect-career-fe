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
import { AlertTriangle, Calendar, FileText, ChevronLeft, ChevronRight, MessageSquare, ArrowRight } from "lucide-react";

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
    const config = {
      [ReportStatus.PENDING]: { bg: "bg-yellow-100 text-yellow-800", label: "Pending" },
      [ReportStatus.UNDER_REVIEW]: { bg: "bg-blue-100 text-blue-800", label: "Under Review" },
      [ReportStatus.RESOLVED]: { bg: "bg-emerald-100 text-emerald-800", label: "Resolved" },
      [ReportStatus.DISMISSED]: { bg: "bg-red-100 text-red-800", label: "Dismissed" },
      [ReportStatus.CLOSED]: { bg: "bg-gray-100 text-gray-600", label: "Closed" },
    };
    const { bg, label } = config[status];
    return (
      <Badge className={`${bg} font-bold uppercase text-[10px] px-2 py-0.5 border-none`}>
        {label}
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

  const totalPages = reportsData?.totalPages || 1;
  const totalReports = reportsData?.total || 0;

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-6">
          <CardTitle className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <AlertTriangle size={30} className="text-[#0EA5E9]" />
            Reports Management
          </CardTitle>
          <p className="text-gray-500 mt-1">Review and manage reported content across the platform.</p>
        </div>

        <Card className="border-gray-200 rounded-xl border-none">
          <CardContent className="p-0 overflow-hidden">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">
                <p>Loading reports...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <Table className="min-w-full divide-y divide-gray-100">
                    <TableHeader className="bg-gray-50">
                      <TableRow className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <TableHead className="px-6 py-3 text-left"><b>Entity Type</b></TableHead>
                        <TableHead className="px-6 py-3 text-left"><b>Reason</b></TableHead>
                        <TableHead className="px-6 py-3 text-left"><b>Status</b></TableHead>
                        <TableHead className="px-6 py-3 text-left"><b>Created At</b></TableHead>
                        <TableHead className="px-6 py-3 text-center"><b>Actions</b></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white divide-y divide-gray-100">
                      {reportsData?.data.map((report) => (
                        <TableRow key={report.id} className="hover:bg-blue-50/30 transition-colors">
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <Badge className="bg-gray-100 text-gray-700 border-gray-300 text-xs font-bold uppercase">{report.entityType}</Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{report.reason}</TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">{getStatusBadge(report.status)}</TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-center whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedReport(report)}
                              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-xs"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!reportsData || reportsData.data.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={5} className="px-6 py-6 text-center text-sm text-gray-500">
                            No reports found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {reportsData && totalPages > 1 && (
                  <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-white rounded-b-xl">
                    <span className="text-sm text-gray-600">
                      Showing <b>{reportsData.data.length}</b> of <b>{totalReports}</b> results
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

      {/* Dialog for Report Details (Revamped) */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => {
          if (!open) {
              setSelectedReport(null);
              setNewStatus("");
              setAdminNotes("");
          }
      }}>
        <DialogContent className="max-w-3xl rounded-xl p-0 overflow-hidden border-none">
          <DialogHeader className="p-6 pb-4 border-b border-gray-100 bg-gray-50/50">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#0EA5E9]" />
                Report Details: <span className="font-medium text-gray-700">{selectedReport?.id.substring(0, 8)}...</span>
            </DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="p-6 space-y-6">
              {/* Report Information Grid */}
              <div className="grid grid-cols-2 gap-4 border border-gray-200 rounded-xl p-4 bg-white">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Entity Type</h4>
                  <Badge className="bg-gray-100 text-gray-700 border-gray-300 text-sm">{selectedReport.entityType}</Badge>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Reported By</h4>
                  <p className="text-sm font-medium text-gray-900">{selectedReport.reportedBy || 'Anonymous'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Priority</h4>
                  <p className="text-sm font-medium text-gray-900">{selectedReport.priority}</p>
                </div>
                 <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Created At</h4>
                  <p className="text-sm font-medium text-gray-900">{new Date(selectedReport.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* Subject & Description */}
              <div className="space-y-4">
                 <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Subject</h4>
                    <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg border border-gray-100">{selectedReport.subject}</p>
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Reason / Message</h4>
                    <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg border border-gray-100">{selectedReport.reason} - {selectedReport.description}</p>
                 </div>
              </div>

              {/* Status Update Section */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#0EA5E9]" /> Update Action
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Current Status</h4>
                        {getStatusBadge(selectedReport.status)}
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Select New Status</h4>
                        <Select value={newStatus} onValueChange={(value) => setNewStatus(value as ReportStatus)}>
                            <SelectTrigger className="bg-white border-gray-300 text-sm">
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
                </div>
                
                {/* Admin Notes */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Admin Notes (Optional)</h4>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this report..."
                    rows={4}
                    className="border-gray-300 text-sm focus:ring-2 focus:ring-[#0EA5E9]"
                  />
                  {selectedReport.adminNotes && (
                      <p className="text-xs text-gray-500 mt-2">Previous notes: {selectedReport.adminNotes}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="p-6 pt-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
            <Button variant="outline" onClick={() => setSelectedReport(null)} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 font-bold">
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={!newStatus || updateStatusMutation.isPending}
              className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold"
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