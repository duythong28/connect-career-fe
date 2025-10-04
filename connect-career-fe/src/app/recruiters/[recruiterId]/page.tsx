'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Edit, MessageSquare, User, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

// Mock data
const users = [
  {
    id: 'emp1',
    name: 'John Smith',
    email: 'john@techcorp.com',
    avatar: '/api/placeholder/150/150',
    role: 'employer',
    title: 'Senior Recruiter',
    company: 'TechCorp Inc.',
    bio: 'Experienced recruiter with 8+ years in tech industry. Passionate about connecting talented individuals with amazing opportunities.',
    linkedinUrl: 'https://linkedin.com/in/johnsmith'
  },
  {
    id: 'emp2',
    name: 'Jane Doe',
    email: 'jane@innovatelabs.com',
    avatar: '/api/placeholder/150/150',
    role: 'employer',
    title: 'Head of Talent Acquisition',
    company: 'InnovateLabs',
    bio: 'Leading talent acquisition efforts at InnovateLabs. Focused on building diverse and inclusive teams.',
    linkedinUrl: 'https://linkedin.com/in/janedoe'
  }
];

const jobs = [
  {
    id: 'job1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'full-time',
    applications: 23
  },
  {
    id: 'job2',
    title: 'DevOps Engineer',
    company: 'TechCorp Inc.',
    location: 'Seattle, WA',
    type: 'full-time',
    applications: 15
  },
  {
    id: 'job3',
    title: 'Product Manager',
    company: 'InnovateLabs',
    location: 'New York, NY',
    type: 'full-time',
    applications: 34
  }
];

const currentUser = { id: 'emp1', role: 'employer' };

interface RecruiterProfilePageProps {
  params: { recruiterId?: string };
}

export default function RecruiterProfilePage({ params }: RecruiterProfilePageProps) {
  const router = useRouter();
  const recruiterId = params?.recruiterId;
  
  const recruiter = users.find(u => u.id === recruiterId || u.id === currentUser?.id);
  const isOwnProfile = recruiterId === currentUser?.id || !recruiterId;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: recruiter?.name || '',
    title: recruiter?.title || 'Recruiter',
    bio: recruiter?.bio || '',
    linkedinUrl: recruiter?.linkedinUrl || ''
  });

  if (!recruiter) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Recruiter not found</h3>
              <p className="text-gray-600">The recruiter profile you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const saveProfile = () => {
    if (currentUser && isOwnProfile) {
      // Mock save - in real app would update database
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    }
  };

  const recruiterJobs = jobs.filter(j => j.company === recruiter.company);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={recruiter.avatar} />
                  <AvatarFallback className="text-2xl">{recruiter.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        placeholder="Full Name"
                      />
                      <Input
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        placeholder="Job Title"
                      />
                      <Textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                        placeholder="Bio"
                        rows={3}
                      />
                      <Input
                        value={editForm.linkedinUrl}
                        onChange={(e) => setEditForm({...editForm, linkedinUrl: e.target.value})}
                        placeholder="LinkedIn URL"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{recruiter.name}</h1>
                      <p className="text-xl text-gray-600 mb-2">{recruiter.title || 'Recruiter'}</p>
                      <p className="text-gray-600 mb-4">{recruiter.company}</p>
                      {recruiter.bio && (
                        <p className="text-gray-700 mb-4">{recruiter.bio}</p>
                      )}
                      {recruiter.linkedinUrl && (
                        <Button variant="outline" size="sm" onClick={() => window.open(recruiter.linkedinUrl, '_blank')}>
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn Profile
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {isOwnProfile && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={saveProfile}>
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              )}
              
              {!isOwnProfile && (
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {recruiterJobs.length}
                </p>
                <p className="text-gray-600">Active Jobs</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor(Math.random() * 100 + 50)}
                </p>
                <p className="text-gray-600">Successful Hires</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-gray-600">Rating</p>
              </div>
            </div>

            {/* Recent Job Postings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Job Postings</h2>
              <div className="space-y-4">
                {recruiterJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.location} • {job.type}</p>
                      <p className="text-sm text-gray-500">{job.applications} applications</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/jobs/${job.id}`)}>
                      View Job
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}