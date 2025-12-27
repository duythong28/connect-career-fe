import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMyCandidateReports } from "@/api/endpoints/reports.api";
import {
  Report,
  ReportStatus,
  entityTypeDisplay,
  reasonDisplay,
  priorityDisplay,
} from "@/api/types/reports.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Eye,
  FileText,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SmartPagination } from "@/components/shared/SmartPagination";
import ShareButton from "@/components/shared/ShareButton";

// Status badge helper
const getStatusBadge = (status: ReportStatus) => {
  const variants: Record<
    ReportStatus,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      label: string;
      className: string;
    }
  > = {
    [ReportStatus.PENDING]: {
      variant: "outline",
      label: "Pending",
      className: "bg-secondary text-muted-foreground border-border",
    },
    [ReportStatus.UNDER_REVIEW]: {
      variant: "secondary",
      label: "Under Review",
      className: "bg-primary/10 text-primary border-primary/20",
    },
    [ReportStatus.RESOLVED]: {
      variant: "default",
      label: "Resolved",
      className: "bg-green-500 text-white font-bold",
    },
    [ReportStatus.DISMISSED]: {
      variant: "destructive",
      label: "Dismissed",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    [ReportStatus.CLOSED]: {
      variant: "outline",
      label: "Closed",
      className: "bg-muted text-muted-foreground border-border",
    },
  };
  const config = variants[status];
  return (
    <Badge
      variant={config.variant}
      className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-0.5 ${config.className}`}
    >
      {config.label}
    </Badge>
  );
};

const MyReportsPage = () => {
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ["my-candidate-reports", page],
    queryFn: () => getMyCandidateReports({ page, limit: 10 }),
  });

  const currentPage = page;
  const totalPages = reportsData?.totalPages || 1;

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 sm:px-6 py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          Reports Dashboard
        </h1>
        <Card className="rounded-3xl border border-border shadow-sm bg-card overflow-hidden">
          <CardHeader className="p-6 border-b border-border">
            <CardTitle className="text-xl font-bold text-foreground">
              My Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <p className="p-6 text-muted-foreground font-medium text-sm">
                Loading reports...
              </p>
            ) : reportsData && reportsData.data.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-secondary/50 border-b border-border">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Subject
                        </TableHead>
                        <TableHead className="py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Entity Type
                        </TableHead>
                        <TableHead className="py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Reason
                        </TableHead>
                        <TableHead className="py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Priority
                        </TableHead>
                        <TableHead className="py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Status
                        </TableHead>
                        <TableHead className="py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Created At
                        </TableHead>
                        <TableHead className="py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportsData.data.map((report: Report) => (
                        <TableRow
                          key={report.id}
                          className="hover:bg-secondary/20 transition-colors border-b border-border"
                        >
                          <TableCell className="py-4 px-6 text-sm font-bold text-foreground">
                            {report.subject}
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <Badge
                              variant="outline"
                              className="bg-secondary text-muted-foreground border-border text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full"
                            >
                              {entityTypeDisplay[report.entityType] ||
                                report.entityType}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 px-6 text-sm text-muted-foreground max-w-xs truncate font-medium">
                            {reasonDisplay[report.reason] || report.reason}
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <Badge
                              variant="outline"
                              className="bg-primary/5 text-primary border-primary/20 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full"
                            >
                              {priorityDisplay[report.priority] ||
                                report.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            {getStatusBadge(report.status)}
                          </TableCell>
                          <TableCell className="py-4 px-6 text-xs font-semibold text-muted-foreground">
                            <span className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 px-6 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-3 text-xs font-bold text-primary hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                              onClick={() => setSelectedReport(report)}
                            >
                              <Eye className="w-3.5 h-3.5 mr-1.5" /> View Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="py-6 flex justify-center bg-card border-t border-border">
                  <SmartPagination
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p)}
                  />
                </div>

                <Dialog
                  open={!!selectedReport}
                  onOpenChange={() => setSelectedReport(null)}
                >
                  <DialogContent className="max-w-lg rounded-3xl border border-border bg-card p-0 overflow-hidden shadow-2xl">
                    <DialogHeader className="p-6 bg-secondary/30 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                          <FileText size={20} />
                        </div>
                        <DialogTitle className="text-xl font-bold text-foreground">
                          Report Details
                        </DialogTitle>
                      </div>
                    </DialogHeader>

                    {selectedReport && (
                      <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6 pb-6 border-b border-border/50">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              Status
                            </span>
                            <div>{getStatusBadge(selectedReport.status)}</div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              Priority
                            </span>
                            <Badge
                              variant="outline"
                              className="w-fit bg-primary/5 text-primary border-primary/20 text-[10px] font-bold uppercase rounded-full px-2 py-0.5"
                            >
                              {priorityDisplay[selectedReport.priority] ||
                                selectedReport.priority}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              Subject
                            </span>
                            <span className="text-sm text-foreground font-bold">
                              {selectedReport.subject}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                Entity Type
                              </span>
                              <span className="text-sm text-foreground font-medium">
                                {entityTypeDisplay[selectedReport.entityType] ||
                                  selectedReport.entityType}
                                {["job", "organization", "user"].includes(
                                  selectedReport.entityType
                                )}
                                <ShareButton
                                  pathname={
                                    selectedReport.entityType === "job"
                                      ? `jobs/${selectedReport.entityId}`
                                      : selectedReport.entityType ===
                                        "organization"
                                      ? `companies/${selectedReport.entityId}`
                                      : selectedReport.entityType === "user"
                                      ? `candidate/profile/${selectedReport.entityId}`
                                      : ""
                                  }
                                />
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                Reason
                              </span>
                              <span className="text-sm text-foreground font-medium">
                                {reasonDisplay[selectedReport.reason] ||
                                  selectedReport.reason}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              Description
                            </span>
                            <div className="text-sm text-muted-foreground font-medium leading-relaxed bg-secondary/20 p-4 rounded-2xl border border-border/50">
                              {selectedReport.description}
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-border/50 space-y-3">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-muted-foreground flex items-center gap-1.5">
                              <Clock
                                size={12}
                                className="text-muted-foreground/60"
                              />{" "}
                              Reported On
                            </span>
                            <span className="text-foreground">
                              {new Date(
                                selectedReport.createdAt
                              ).toLocaleString()}
                            </span>
                          </div>

                          {selectedReport.resolvedAt && (
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="text-muted-foreground flex items-center gap-1.5">
                                <CheckCircle2
                                  size={12}
                                  className="text-green-500"
                                />{" "}
                                Resolved On
                              </span>
                              <span className="text-green-600">
                                {new Date(
                                  selectedReport.resolvedAt
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="pt-2">
                          <Button
                            onClick={() => setSelectedReport(null)}
                            className="w-full h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                          >
                            Close Details
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <div className="p-16 text-center bg-card">
                <div className="bg-secondary/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldAlert className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <p className="text-lg font-bold text-foreground mb-1">
                  You have not submitted any reports yet.
                </p>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">
                  Reports are used to flag incorrect job postings or bad company
                  information.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyReportsPage;
