import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMyCandidateReports } from "@/api/endpoints/reports.api";
import { Report, ReportStatus } from "@/api/types/reports.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "lucide-react";

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

const MyReportsPage = () => {
  const [page, setPage] = useState(1);

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ["my-candidate-reports", page],
    queryFn: () => getMyCandidateReports({ page, limit: 10 }),
  });

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Reports</CardTitle>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportsData?.data.map((report: Report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <Badge variant="outline">{report.entityType}</Badge>
                      </TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {reportsData && reportsData.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    className="px-3 py-1 border rounded"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                  <span className="py-2 px-4">
                    Page {page} of {reportsData.totalPages}
                  </span>
                  <button
                    className="px-3 py-1 border rounded"
                    disabled={page === reportsData.totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyReportsPage;