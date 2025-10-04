'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Users, Building2, UserPlus, ExternalLink, Edit, Star, Briefcase, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

// Mock data
const companies = [
  {
    id: 'comp1',
    name: 'TechCorp Inc.',
    slug: 'techcorp',
    logo: '/api/placeholder/150/150',
    industry: 'Technology',
    size: '500-1000',
    headquarters: 'San Francisco, CA',
    founded: '2010',
    employees: 750,
    followers: 1250,
    website: 'https://techcorp.com',
    description: `# About TechCorp Inc.

TechCorp Inc. is a leading technology company focused on innovative solutions for the modern world. We build products that make a difference in people's lives and drive digital transformation across industries.

## Our Mission
To create technology solutions that empower businesses and individuals to achieve their full potential.

## What We Do
- Software Development
- Cloud Solutions
- AI & Machine Learning
- Digital Transformation
- Consulting Services

## Company Culture
We believe in fostering a collaborative and inclusive environment where every team member can thrive. Our culture is built on innovation, integrity, and continuous learning.`,
    socialLinks: {
      linkedin: 'https://linkedin.com/company/techcorp',
      twitter: 'https://twitter.com/techcorp'
    },
    members: [
      { id: 'mem1', userId: 'emp1', role: 'CEO' },
      { id: 'mem2', userId: 'emp2', role: 'CTO' }
    ]
  },
  {
    id: 'comp2',
    name: 'InnovateLabs',
    slug: 'innovatelabs',
    logo: '/api/placeholder/150/150',
    industry: 'Technology',
    size: '100-500',
    headquarters: 'New York, NY',
    founded: '2015',
    employees: 320,
    followers: 890,
    website: 'https://innovatelabs.com',
    description: `# InnovateLabs

Innovation-driven company creating cutting-edge solutions for businesses worldwide. We specialize in emerging technologies and digital innovation.`,
    socialLinks: {
      linkedin: 'https://linkedin.com/company/innovatelabs'
    },
    members: []
  }
];

const jobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    companyId: 'comp1',
    location: 'San Francisco, CA',
    salary: '$120,000 - $150,000',
    type: 'full-time',
    status: 'active',
    postedDate: '2024-01-15',
    description: 'We are looking for an experienced Senior Frontend Developer to join our growing engineering team.',
    keywords: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Next.js']
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    companyId: 'comp1',
    location: 'San Francisco, CA',
    salary: '$110,000 - $140,000',
    type: 'full-time',
    status: 'active',
    postedDate: '2024-01-20',
    description: 'Join our DevOps team to build and maintain our cloud infrastructure.',
    keywords: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform']
  }
];

const users = [
  {
    id: 'emp1',
    name: 'John Smith',
    email: 'john@techcorp.com',
    avatar: '/api/placeholder/100/100',
    role: 'employer'
  },
  {
    id: 'emp2',
    name: 'Jane Doe',
    email: 'jane@techcorp.com',
    avatar: '/api/placeholder/100/100',
    role: 'employer'
  }
];

const candidates = [
  { 
    id: '1', 
    userId: 'user1', 
    followedCompanies: [] as string[]
  }
];

const currentUser = { id: 'user1', role: 'candidate', companyId: null };

// Markdown component for rendering company descriptions
const Markdown = ({ content }: { content: string }) => {
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
      className="prose prose-gray max-w-none"
      dangerouslySetInnerHTML={{ __html: formatContent(content) }}
    />
  );
};

interface CompanyProfilePageProps {
  params: { slug: string };
}

export default function CompanyProfilePage({ params }: CompanyProfilePageProps) {
  const router = useRouter();
  const slug = params.slug;
  
  const company = companies.find(c => c.slug === slug);
  const companyJobs = jobs.filter(j => j.companyId === company?.id && j.status === 'active');
  const candidate = candidates.find(c => c.userId === currentUser?.id);
  const isFollowing = candidate?.followedCompanies.includes(company?.id || '') || false;
  const isCompanyMember = currentUser?.companyId === company?.id;
  
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState(company || {
    id: '',
    name: '',
    slug: '',
    industry: '',
    size: '',
    headquarters: '',
    website: '',
    description: '',
    logo: '',
    founded: '',
    employees: 0,
    followers: 0,
    socialLinks: {},
    members: []
  });

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Company not found</h2>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const toggleFollow = () => {
    if (!candidate) return;
    
    toast({
      title: isFollowing ? "Unfollowed company" : "Following company",
      description: isFollowing ? "Removed from your followed companies" : "Added to your followed companies"
    });
  };

  const saveCompanyEdit = () => {
    toast({
      title: "Company updated",
      description: "Company information has been updated successfully."
    });
    setEditMode(false);
  };

  const similarCompanies = companies
    .filter(c => c.id !== company.id && c.industry === company.industry)
    .slice(0, 3);

  const reviews = [
    {
      id: 1,
      rating: 5,
      title: "Great place to work",
      content: "Amazing company culture and great opportunities for growth. The team is very supportive and the work is challenging and rewarding.",
      author: "Software Engineer",
      date: "2024-01-10"
    },
    {
      id: 2,
      rating: 4,
      title: "Good work-life balance",
      content: "Really appreciate the flexible working arrangements and the company's focus on employee wellbeing. Management is understanding and supportive.",
      author: "Product Manager",
      date: "2024-01-05"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <Avatar className="h-32 w-32 border-4 border-white">
                <AvatarImage src={company.logo} />
                <AvatarFallback className="text-4xl">{company.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
                <p className="text-xl text-blue-100 mb-4">{company.industry}</p>
                
                <div className="flex items-center space-x-6 text-blue-100">
                  <span className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    {company.headquarters}
                  </span>
                  <span className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {company.size}
                  </span>
                  <span className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    Founded {company.founded}
                  </span>
                </div>
                
                <div className="flex items-center space-x-6 mt-4 text-sm">
                  <span>{company.employees} employees</span>
                  <span>{company.followers} followers</span>
                  <span>{companyJobs.length} open positions</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {candidate && (
                <Button
                  onClick={toggleFollow}
                  variant={isFollowing ? "secondary" : "outline"}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isFollowing ? 'Following' : 'Follow Company'}
                </Button>
              )}
              
              {company.website && (
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => window.open(company.website, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Website
                </Button>
              )}
              
              {isCompanyMember && (
                <Button
                  onClick={() => setEditMode(!editMode)}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {editMode ? 'Cancel Edit' : 'Edit Company'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About {company.name}</CardTitle>
                {isCompanyMember && editMode && (
                  <Button onClick={saveCompanyEdit} size="sm">
                    Save Changes
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {editMode && isCompanyMember ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Company Name</Label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Industry</Label>
                      <Input
                        value={editForm.industry}
                        onChange={(e) => setEditForm({...editForm, industry: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        rows={10}
                      />
                    </div>
                  </div>
                ) : (
                  <Markdown content={company.description} />
                )}
              </CardContent>
            </Card>

            {/* Open Positions */}
            <Card>
              <CardHeader>
                <CardTitle>Open Positions ({companyJobs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {companyJobs.length > 0 ? (
                  <div className="space-y-4">
                    {companyJobs.map((job) => (
                      <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/jobs/${job.id}`)}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                              <div className="flex items-center text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                {job.location}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <DollarSign className="h-4 w-4 mr-2" />
                                {job.salary}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="h-4 w-4 mr-2" />
                                {job.postedDate}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {job.keywords.slice(0, 4).map((keyword) => (
                                <Badge key={keyword} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                            
                            <p className="text-gray-700 text-sm line-clamp-2">
                              {job.description.substring(0, 120)}...
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge variant="secondary" className="capitalize">{job.type}</Badge>
                            <Button variant="outline" size="sm">
                              View Job
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No open positions at the moment</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Company Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Employee Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">4.2</div>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Based on 127 reviews</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{review.title}</h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>{review.author}</span>
                              <span>•</span>
                              <span>{review.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{review.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Company Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Industry</span>
                    <span className="font-medium">{company.industry}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Company Size</span>
                    <span className="font-medium">{company.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Founded</span>
                    <span className="font-medium">{company.founded}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Headquarters</span>
                    <span className="font-medium">{company.headquarters}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Employees</span>
                    <span className="font-medium">{company.employees}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Followers</span>
                    <span className="font-medium">{company.followers}</span>
                  </div>
                </div>
                
                {company.socialLinks && Object.keys(company.socialLinks).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Social Links</div>
                    <div className="flex space-x-2">
                      {company.socialLinks.linkedin && (
                        <Button variant="outline" size="sm" onClick={() => window.open(company.socialLinks.linkedin, '_blank')}>
                          LinkedIn
                        </Button>
                      )}
                      {company.socialLinks.twitter && (
                        <Button variant="outline" size="sm" onClick={() => window.open(company.socialLinks.twitter, '_blank')}>
                          Twitter
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team Members (for company members only) */}
            {isCompanyMember && (
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {company.members.map((member) => {
                      const user = users.find(u => u.id === member.userId);
                      if (!user) return null;
                      
                      return (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-gray-600">{member.role}</p>
                            </div>
                          </div>
                          
                          {currentUser?.id === user.id && (
                            <Badge variant="secondary" className="text-xs">You</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Similar Companies */}
            {similarCompanies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Similar Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {similarCompanies.map((similarCompany) => (
                      <div 
                        key={similarCompany.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => router.push(`/companies/${similarCompany.slug}`)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={similarCompany.logo} />
                          <AvatarFallback>{similarCompany.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{similarCompany.name}</p>
                          <p className="text-xs text-gray-600">{similarCompany.industry}</p>
                          <p className="text-xs text-gray-500">{jobs.filter(j => j.companyId === similarCompany.id).length} jobs</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}