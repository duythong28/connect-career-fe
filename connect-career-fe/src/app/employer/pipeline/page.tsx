'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

// Mock data
const users = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/api/placeholder/100/100',
    role: 'candidate'
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: '/api/placeholder/100/100',
    role: 'candidate'
  },
  {
    id: 'user3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: '/api/placeholder/100/100',
    role: 'candidate'
  }
];

const candidates = [
  { id: '1', userId: 'user1' },
  { id: '2', userId: 'user2' },
  { id: '3', userId: 'user3' }
];

const jobs = [
  {
    id: 'job1',
    title: 'Senior Frontend Developer',
    employerId: 'emp1'
  },
  {
    id: 'job2',
    title: 'DevOps Engineer',
    employerId: 'emp1'
  }
];

const initialApplications = [
  {
    id: 'app1',
    candidateId: '1',
    jobId: 'job1',
    status: 'New',
    appliedDate: '2024-01-15',
    matchingScore: 85,
    feedback: null
  },
  {
    id: 'app2',
    candidateId: '2',
    jobId: 'job1',
    status: 'Screening',
    appliedDate: '2024-01-12',
    matchingScore: 92,
    feedback: null
  },
  {
    id: 'app3',
    candidateId: '3',
    jobId: 'job2',
    status: 'Interview',
    appliedDate: '2024-01-10',
    matchingScore: 78,
    feedback: {
      rating: 4,
      comment: 'Great technical skills'
    }
  }
];

const currentUser = { id: 'emp1', role: 'employer' };

export default function PipelinePage() {
  const router = useRouter();
  const [applications, setApplications] = useState(initialApplications);
  
  const userApplications = applications.filter(app => {
    const job = jobs.find(j => j.id === app.jobId);
    return job?.employerId === currentUser?.id;
  });

  const columns = ['New', 'Screening', 'Interview', 'Offer', 'Hired'] as const;

  const moveCandidate = (applicationId: string, newStatus: string) => {
    setApplications(applications.map(app => 
      app.id === applicationId 
        ? { ...app, status: newStatus }
        : app
    ));
    
    toast({
      title: "Candidate moved",
      description: `Application moved to ${newStatus}`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recruitment Pipeline</h1>
          <p className="text-gray-600 mt-2">Manage your candidates through the hiring process</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {columns.map((column) => {
            const columnApplications = userApplications.filter(app => app.status === column);
            
            return (
              <div key={column} className="bg-white rounded-lg border">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-900">{column}</h3>
                  <span className="text-sm text-gray-600">{columnApplications.length} candidates</span>
                </div>
                
                <div className="p-4 min-h-[500px]">
                  {columnApplications.map((app) => {
                    const candidate = candidates.find(c => c.id === app.candidateId);
                    const user = candidate ? users.find(u => u.id === candidate.userId) : null;
                    const job = jobs.find(j => j.id === app.jobId);
                    
                    if (!candidate || !user || !job) return null;
                    
                    return (
                      <div
                        key={app.id}
                        className="bg-white border rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-sm">{user.name}</h4>
                              <p className="text-xs text-gray-600">{job.title}</p>
                            </div>
                          </div>
                          
                          <Badge variant="outline" className="text-xs">
                            {app.matchingScore}% match
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-xs text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>Applied</span>
                            <span>{app.appliedDate}</span>
                          </div>
                          
                          {app.feedback && (
                            <div className="flex items-center space-x-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`h-3 w-3 ${star <= app.feedback!.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-xs">{app.feedback.rating}/5</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 space-y-2">
                          {/* Move candidate to different stages */}
                          <Select 
                            value={app.status} 
                            onValueChange={(value) => moveCandidate(app.id, value)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {columns.map((col) => (
                                <SelectItem key={col} value={col} className="text-xs">
                                  {col}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 text-xs"
                              onClick={() => router.push(`/candidate/profile/${candidate.id}`)}
                            >
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-xs">
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {columnApplications.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Users className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">No candidates</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}