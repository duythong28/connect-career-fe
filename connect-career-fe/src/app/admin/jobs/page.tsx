'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, Trash2 } from 'lucide-react';
import { mockJobs } from '@/lib/mock-data';
import { Job } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Mock JobEditDialog component (placeholder)
const JobEditDialog = ({ job, open, onOpenChange, onSave }: any) => {
  return null; // This would be implemented with the actual dialog
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState(mockJobs);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { toast } = useToast();

  const handleSaveJob = (updatedJob: Job) => {
    const updatedJobs = jobs.map(j => j.id === updatedJob.id ? updatedJob : j);
    setJobs(updatedJobs);
    setEditingJob(null);
    toast({
      title: "Job updated",
      description: "Job information has been updated successfully."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Jobs Management</h1>
          <p className="text-gray-600 mt-2">Manage all job postings across the platform</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-gray-600">{job.location}</p>
                      </div>
                    </TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>
                      <Badge variant={
                        job.status === 'active' ? 'default' :
                        job.status === 'draft' ? 'secondary' :
                        'destructive'
                      }>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{job.applications}</TableCell>
                    <TableCell>{job.postedDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingJob(job as Job)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            const updatedJobs = jobs.filter(j => j.id !== job.id);
                            setJobs(updatedJobs);
                            toast({
                              title: "Job deleted",
                              description: "Job posting has been permanently deleted."
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
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
      
      <JobEditDialog 
        job={editingJob as any}
        open={!!editingJob}
        onOpenChange={(open: boolean) => !open && setEditingJob(null)}
        onSave={handleSaveJob as any}
      />
    </div>
  );
}