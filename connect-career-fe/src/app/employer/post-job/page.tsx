'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, DollarSign, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

// Mock data
const companies = [
  {
    id: 'comp1',
    name: 'TechCorp Inc.',
    logo: '/api/placeholder/100/100'
  },
  {
    id: 'comp2',
    name: 'InnovateLabs',
    logo: '/api/placeholder/100/100'
  }
];

const currentUser = { id: 'emp1', role: 'employer', companyId: 'comp1' };

// Utility function to generate job descriptions
const generateJobDescription = (title: string, industry: string, level: string): string => {
  const templates = {
    technology: {
      senior: `# ${title}

## About the Role
We are seeking a ${title} to join our innovative technology team and drive our next generation of products.

## Key Responsibilities
- Lead technical architecture and design decisions
- Mentor junior team members
- Collaborate with cross-functional teams
- Implement best practices and coding standards
- Drive technical innovation and process improvements

## Qualifications
- 5+ years of relevant experience
- Strong technical leadership skills
- Experience with modern development practices
- Excellent communication and collaboration skills
- Bachelor's degree in Computer Science or related field

## What We Offer
- Competitive salary and equity package
- Comprehensive health benefits
- Flexible work arrangements
- Professional development opportunities
- Cutting-edge technology stack`,
      mid: `# ${title}

## Position Overview
Join our growing team as a ${title} and help build innovative solutions that impact millions of users.

## Responsibilities
- Develop and maintain high-quality software
- Collaborate with product and design teams
- Participate in code reviews and technical discussions
- Contribute to system architecture decisions
- Support junior developers

## Requirements
- 3+ years of relevant experience
- Strong problem-solving skills
- Experience with agile development
- Good communication skills
- Relevant technical degree preferred

## Benefits
- Health and dental insurance
- Professional development budget
- Flexible working hours
- Modern office environment`,
      junior: `# ${title}

## About the Opportunity
Start your career with us as a ${title} and grow your skills in a supportive environment.

## What You'll Do
- Learn and apply best development practices
- Work on real projects with experienced mentors
- Contribute to code reviews and team meetings
- Develop new features and fix bugs
- Participate in agile development process

## What We're Looking For
- Recent graduate or 1-2 years experience
- Strong fundamentals in programming
- Eagerness to learn and grow
- Good communication skills
- Team-oriented mindset

## What We Provide
- Comprehensive training program
- Mentorship from senior developers
- Health benefits
- Career growth opportunities`
    }
  };

  return templates.technology?.[level as keyof typeof templates.technology] || templates.technology.mid;
};

// Markdown component for rendering job descriptions
const Markdown = ({ content, className = '' }: { content: string; className?: string }) => {
  const formatContent = (text: string) => {
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(?!<[hlu])/gm, '<p class="mb-4">')
      .replace(/<p class="mb-4"><\/p>/g, '');
  };

  return (
    <div 
      className={`prose prose-gray max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: formatContent(content) }}
    />
  );
};

export default function PostJobPage() {
  const router = useRouter();
  const userCompany = companies.find(c => c.id === currentUser?.companyId);
  const [showPreview, setShowPreview] = useState(false);
  
  const [jobForm, setJobForm] = useState({
    title: '',
    location: '',
    salary: '',
    type: 'full-time',
    description: '',
    companyId: currentUser?.companyId || ''
  });

  const postJob = () => {
    if (!jobForm.title || !jobForm.description || !jobForm.companyId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Mock job creation - in real app would send to API
    const newJob = {
      id: `job${Date.now()}`,
      ...jobForm,
      postedDate: new Date().toISOString().split('T')[0],
      applications: 0,
      status: currentUser?.role === 'admin' ? 'active' : 'draft',
      views: 0,
      employerId: currentUser?.id || '',
      keywords: jobForm.description.toLowerCase().split(' ').filter(word => word.length > 3).slice(0, 5)
    };

    // Reset form
    setJobForm({ 
      title: '', 
      location: '', 
      salary: '', 
      type: 'full-time', 
      description: '', 
      companyId: currentUser?.companyId || '' 
    });
    
    toast({
      title: "Job posted",
      description: currentUser?.role === 'admin' ? "Job is now live!" : "Job submitted for review."
    });

    // Redirect to jobs page or dashboard
    router.push('/employer/jobs');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
          <p className="text-gray-600 mt-2">Create an attractive job posting to find the best candidates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                  placeholder="e.g., Senior Frontend Developer"
                />
              </div>

              <div>
                <Label htmlFor="company">Company *</Label>
                <Select
                  value={jobForm.companyId}
                  onValueChange={(value) => setJobForm({...jobForm, companyId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {userCompany && (
                      <SelectItem value={userCompany.id}>{userCompany.name}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Job Type *</Label>
                  <Select
                    value={jobForm.type}
                    onValueChange={(value) => setJobForm({...jobForm, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  value={jobForm.salary}
                  onChange={(e) => setJobForm({...jobForm, salary: e.target.value})}
                  placeholder="e.g., $120,000 - $160,000"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="description">Job Description * (Markdown supported)</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const generated = generateJobDescription(jobForm.title || 'Software Developer', 'technology', 'senior');
                      setJobForm({...jobForm, description: generated});
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
                <Textarea
                  id="description"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                  placeholder="## About the Role&#10;We are looking for...&#10;&#10;## Responsibilities&#10;- Develop and maintain...&#10;- Collaborate with teams...&#10;&#10;## Requirements&#10;- 3+ years of experience&#10;- Strong skills in..."
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Use Markdown formatting for better presentation. Include responsibilities, requirements, and benefits.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button onClick={postJob} className="flex-1">
                  Post Job
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex-1"
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview */}
          {showPreview && (
            <Card className="lg:sticky lg:top-6">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={userCompany?.logo} />
                      <AvatarFallback>{userCompany?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {jobForm.title || 'Job Title'}
                      </h3>
                      <p className="text-lg text-gray-700">
                        {userCompany?.name || 'Company Name'}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-gray-600">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {jobForm.location || 'Location'}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {jobForm.salary || 'Salary'}
                        </span>
                      </div>
                      
                      <Badge variant="secondary" className="mt-2 capitalize">
                        {jobForm.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    {jobForm.description ? (
                      <Markdown content={jobForm.description} className="prose-sm" />
                    ) : (
                      <p className="text-gray-500 italic">Job description will appear here...</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}