'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, CheckCircle, X } from 'lucide-react';

export default function AdminReportsPage() {
  const mockReports = [
    {
      id: '1',
      type: 'job',
      reportedItem: 'Frontend Developer at TechCorp',
      reporter: 'john.doe@email.com',
      reason: 'Misleading job description',
      status: 'pending',
      date: '2024-01-15'
    },
    {
      id: '2',
      type: 'user',
      reportedItem: 'jane.smith@email.com',
      reporter: 'company@techcorp.com',
      reason: 'Fake profile information',
      status: 'resolved',
      date: '2024-01-14'
    },
    {
      id: '3',
      type: 'company',
      reportedItem: 'Fake Company Inc.',
      reporter: 'candidate@email.com',
      reason: 'Suspicious company profile',
      status: 'dismissed',
      date: '2024-01-13'
    },
    {
      id: '4',
      type: 'job',
      reportedItem: 'Marketing Manager at StartupCo',
      reporter: 'user@example.com',
      reason: 'Discriminatory requirements',
      status: 'pending',
      date: '2024-01-12'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
          <p className="text-gray-600 mt-2">Handle user reports and violations</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Reported Item</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <Badge variant="outline">{report.type}</Badge>
                    </TableCell>
                    <TableCell>{report.reportedItem}</TableCell>
                    <TableCell>{report.reporter}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>
                      <Badge variant={
                        report.status === 'resolved' ? 'default' :
                        report.status === 'dismissed' ? 'secondary' :
                        'destructive'
                      }>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {report.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}