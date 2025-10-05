import React, { useState } from "react";
import { Eye, Edit, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Company } from "@/lib/types";
import { mockCompanies } from "@/lib/mock-data";

const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Companies Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage company profiles and verifications
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Active Jobs</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={company.logo} />
                          <AvatarFallback>
                            {company.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-sm text-gray-600">
                            {company.location}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{company.industry}</TableCell>
                    <TableCell>{company.size}</TableCell>
                    <TableCell>{company.jobs}</TableCell>
                    <TableCell>
                      <Badge variant="default">Verified</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Ban className="h-4 w-4" />
                        </Button>
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
};

export default AdminCompaniesPage;
