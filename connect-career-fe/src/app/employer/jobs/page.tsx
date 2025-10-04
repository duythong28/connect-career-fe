'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, BarChart3, Trash2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

// Mock data - in real app this would come from API/database
const jobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    applications: 45,
    postedDate: '2024-01-15',
    status: 'active' as const,
    salary: '$120,000 - $150,000',
    description: 'We are looking for an experienced Frontend Developer to join our team and help build the next generation of web applications...'
  },
  {
    id: '2', 
    title: 'Full Stack Engineer',
    company: 'TechCorp',
    location: 'Remote',
    applications: 32,
    postedDate: '2024-01-10',
    status: 'active' as const,
    salary: '$100,000 - $130,000',
    description: 'Join our engineering team to work on exciting projects using modern technologies like React, Node.js, and AWS...'
  }
];

const currentUser = {
  id: '1',
  name: 'John Doe',
  company: 'TechCorp',
  role: 'employer' as const
};

// Mock JobEditDialog component
const JobEditDialog = ({ job, open, onOpenChange, onSave }: any) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Edit Job</h3>
        <p className="text-gray-600 mb-4">Job editing functionality would be implemented here.</p>
        <div className="flex gap-2">
          <Button onClick={() => onOpenChange(false)} variant="outline">Cancel</Button>
          <Button onClick={() => { onSave(job); onOpenChange(false); }}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default function EmployerJobsPage() {
  const router = useRouter();
  const [editingJob, setEditingJob] = useState<any>(null);
  const [jobsList, setJobsList] = useState(jobs);
  
  const employerJobs = jobsList.filter(job => job.company === currentUser?.company);

  const handleSaveJob = (updatedJob: any) => {
    const updatedJobs = jobsList.map(j => j.id === updatedJob.id ? updatedJob : j);
    setJobsList(updatedJobs);
    setEditingJob(null);
    toast({
      title: "Job updated",
      description: "Job information has been updated successfully."
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
            <p className="text-gray-600 mt-2">Manage your job postings</p>
          </div>
          <Button onClick={() => router.push('/employer/post-job')}>
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>

        <div className="grid gap-6">
          {employerJobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <p className="text-gray-600">{job.location}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Applications</p>
                        <p className="font-medium">{job.applications}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Posted</p>
                        <p className="font-medium">{job.postedDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Salary</p>
                        <p className="font-medium">{job.salary}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700">{job.description.substring(0, 200)}...</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingJob(job)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        const updatedJobs = jobsList.filter(j => j.id !== job.id);
                        setJobsList(updatedJobs);
                        toast({
                          title: "Job deleted",
                          description: "Job posting has been successfully deleted."
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {employerJobs.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
                <p className="text-gray-600 mb-4">Create your first job posting to start hiring</p>
                <Button onClick={() => router.push('/employer/post-job')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Job
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <JobEditDialog 
        job={editingJob}
        open={!!editingJob}
        onOpenChange={(open: boolean) => !open && setEditingJob(null)}
        onSave={handleSaveJob}
      />
    </div>
  );
}