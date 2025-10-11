import React, { useState } from "react";
import { CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { RefundRequest, User } from "@/lib/types";
import { mockRefundRequests, mockUsers } from "@/lib/mock-data";

const RefundPage = () => {
  const [refundRequests, setRefundRequests] =
    useState<RefundRequest[]>(mockRefundRequests);
  const [users, setUsers] = useState<User[]>(mockUsers);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Refund Management
          </h1>
          <p className="text-gray-600 mt-2">
            Review and process refund requests
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Refund Requests</CardTitle>
            <CardDescription>
              {refundRequests.filter((r) => r.status === "pending").length}{" "}
              pending requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refundRequests.map((request) => {
                  const user = users.find((u) => u.id === request.userId);
                  return (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback>
                              {user?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user?.name}</p>
                            <p className="text-sm text-gray-600">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{request.plan}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${request.amount}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p
                          className="text-sm text-gray-700 truncate"
                          title={request.reason}
                        >
                          {request.reason}
                        </p>
                      </TableCell>
                      <TableCell>{request.requestedAt}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === "approved"
                              ? "default"
                              : request.status === "denied"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                setRefundRequests(
                                  refundRequests.map((r) =>
                                    r.id === request.id
                                      ? { ...r, status: "approved" }
                                      : r
                                  )
                                );
                                toast({
                                  title: "Refund approved",
                                  description: `$${request.amount} refund approved for ${user?.name}.`,
                                });
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setRefundRequests(
                                  refundRequests.map((r) =>
                                    r.id === request.id
                                      ? { ...r, status: "denied" }
                                      : r
                                  )
                                );
                                toast({
                                  title: "Refund denied",
                                  description: `Refund request denied for ${user?.name}.`,
                                });
                              }}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Deny
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RefundPage;
