import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMyCandidateReports } from "@/api/endpoints/reports.api";
import { Report, ReportStatus } from "@/api/types/reports.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "lucide-react";

// Định nghĩa lại getStatusBadge để sử dụng màu sắc phù hợp với Simplify
const getStatusBadge = (status: ReportStatus) => {
  const variants: Record<ReportStatus, { variant: "default" | "secondary" | "destructive" | "outline" | "default"; label: string; className: string }> = {
    [ReportStatus.PENDING]: { variant: "outline", label: "Pending", className: "bg-gray-50 text-gray-600 border border-gray-200" },
    [ReportStatus.UNDER_REVIEW]: { variant: "secondary", label: "Under Review", className: "bg-blue-50 text-blue-700 border border-blue-100" },
    [ReportStatus.RESOLVED]: { variant: "default", label: "Resolved", className: "bg-emerald-500 text-white font-bold" },
    [ReportStatus.DISMISSED]: { variant: "destructive", label: "Dismissed", className: "bg-red-50 text-red-700 border border-red-100" },
    [ReportStatus.CLOSED]: { variant: "outline", label: "Closed", className: "bg-gray-100 text-gray-500 border border-gray-200" },
  };
  const config = variants[status];
  // Sử dụng config.className để ghi đè Tailwind classes mặc định của Badge (nếu cần)
  return <Badge variant={config.variant} className={`text-[10px] font-bold uppercase ${config.className}`}>{config.label}</Badge>;
};

const MyReportsPage = () => {
  const [page, setPage] = useState(1);

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ["my-candidate-reports", page],
    queryFn: () => getMyCandidateReports({ page, limit: 10 }),
  });

  return (
    // Thay đổi container thành phong cách SimplifyPage (nền xám nhạt, padding chuẩn)
    <div className="min-h-screen bg-[#F8F9FB] font-sans px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports Dashboard</h1>
        
        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader className="p-6 border-b border-gray-100">
            <CardTitle className="text-xl font-bold text-gray-900">My Reports</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <p className="p-6 text-gray-500">Loading reports...</p>
            ) : reportsData && reportsData.data.length > 0 ? (
              <>
                <Table>
                  <TableHeader className="bg-gray-50 border-b border-gray-200">
                    <TableRow className="hover:bg-gray-50">
                      {/* Chỉnh sửa style cho TableHead */}
                      <TableHead className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Entity Type</TableHead>
                      <TableHead className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Reason</TableHead>
                      <TableHead className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</TableHead>
                      <TableHead className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportsData.data.map((report: Report) => (
                      // Thêm hover effect cho TableRow
                      <TableRow key={report.id} className="hover:bg-blue-50/30 transition-colors cursor-pointer border-b border-gray-100">
                        <TableCell className="py-4 text-sm font-medium text-gray-700">
                          {/* Đảm bảo Badge cho entityType trông gọn gàng */}
                          <Badge variant="outline" className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px] font-medium uppercase px-2 py-0.5 rounded-full">
                            {report.entityType}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-sm text-gray-700 max-w-xs truncate">
                          {report.reason}
                        </TableCell>
                        <TableCell className="py-4">
                            {/* getStatusBadge đã được cập nhật CSS bên trên */}
                            {getStatusBadge(report.status)}
                        </TableCell>
                        <TableCell className="py-4 text-xs font-medium text-gray-500">
                          <span className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Pagination Section */}
                {reportsData.totalPages > 1 && (
                  <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-white">
                    <button
                      className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${page === 1 ? 'text-gray-400 cursor-not-allowed border border-gray-100 bg-gray-50' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm'}`}
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                      Page <span className="font-bold text-gray-900">{page}</span> of <span className="font-bold text-gray-900">{reportsData.totalPages}</span>
                    </span>
                    <button
                      className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${page === reportsData.totalPages ? 'text-gray-400 cursor-not-allowed border border-gray-100 bg-gray-50' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm'}`}
                      disabled={page === reportsData.totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
                <div className="p-6 text-center">
                    <p className="text-sm text-gray-600 mb-4">You have not submitted any reports yet.</p>
                    <p className="text-xs text-gray-400">Reports are used to flag incorrect job postings or bad company information.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyReportsPage;