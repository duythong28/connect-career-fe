'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Mail, Phone, Edit, MessageCircle, Briefcase, Award, Upload, Eye, Download, FileText, Brain, CheckCircle, Lightbulb, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

// Mock data
const users = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    avatar: '/api/placeholder/150/150',
    role: 'candidate',
    privacy: {
      email: true,
      phone: true
    }
  },
  {
    id: 'user2', 
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 987-6543',
    avatar: '/api/placeholder/150/150',
    role: 'candidate',
    privacy: {
      email: false,
      phone: false
    }
  }
];

const candidates = [
  {
    id: '1',
    userId: 'user1',
    headline: 'Senior Frontend Developer with 5+ years experience in React and TypeScript',
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Next.js', 'Node.js', 'GraphQL', 'AWS'],
    experience: [
      {
        id: 'exp1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        startDate: 'Jan 2022',
        endDate: 'Present',
        current: true,
        description: 'Lead frontend development for multiple web applications using React, TypeScript, and Next.js. Mentor junior developers and collaborate with design and backend teams.'
      },
      {
        id: 'exp2',
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        startDate: 'Jun 2020',
        endDate: 'Dec 2021',
        current: false,
        description: 'Developed responsive web applications using React and Redux. Implemented automated testing and improved application performance by 30%.'
      }
    ],
    education: [
      {
        id: 'edu1',
        degree: 'Bachelor of Computer Science',
        institution: 'University of Technology',
        field: 'Computer Science',
        startDate: '2016',
        endDate: '2020',
        current: false
      }
    ],
    cvs: [
      {
        id: 'cv1',
        name: 'John_Doe_Resume.pdf',
        uploadedAt: '2024-01-10',
        isDefault: true,
        contentMarkdown: `# John Doe
## Senior Frontend Developer

### Contact
- Email: john@example.com
- Phone: +1 (555) 123-4567

### Experience
**Senior Frontend Developer** at TechCorp Inc. (Jan 2022 - Present)
- Lead frontend development for multiple web applications
- Mentor junior developers and collaborate with teams
- Technologies: React, TypeScript, Next.js

**Frontend Developer** at StartupXYZ (Jun 2020 - Dec 2021)
- Developed responsive web applications
- Implemented automated testing
- Improved application performance by 30%

### Skills
React, TypeScript, JavaScript, CSS, Next.js, Node.js, GraphQL, AWS

### Education
**Bachelor of Computer Science**
University of Technology (2016-2020)`,
        fileName: 'John_Doe_Resume.pdf',
        type: 'pdf'
      },
      {
        id: 'cv2',
        name: 'John_Doe_Technical.pdf',
        uploadedAt: '2024-01-05',
        isDefault: false,
        contentMarkdown: `# John Doe - Technical Resume

### Technical Skills
- Frontend: React, TypeScript, JavaScript, CSS, HTML
- Backend: Node.js, Express, GraphQL
- Database: PostgreSQL, MongoDB
- Cloud: AWS, Docker, Kubernetes`,
        fileName: 'John_Doe_Technical.pdf',
        type: 'pdf'
      }
    ]
  },
  {
    id: '2',
    userId: 'user2',
    headline: 'Full Stack Developer specializing in modern web technologies',
    skills: ['JavaScript', 'Python', 'React', 'Django', 'PostgreSQL'],
    experience: [
      {
        id: 'exp3',
        title: 'Full Stack Developer',
        company: 'WebDev Agency',
        startDate: 'Mar 2021',
        endDate: 'Present',
        current: true,
        description: 'Build end-to-end web applications using React and Django. Work directly with clients to deliver custom solutions.'
      }
    ],
    education: [
      {
        id: 'edu2',
        degree: 'Master of Software Engineering',
        institution: 'Tech University',
        field: 'Software Engineering',
        startDate: '2019',
        endDate: '2021',
        current: false
      }
    ],
    cvs: []
  }
];

const companies = [
  {
    id: 'comp1',
    name: 'TechCorp Inc.'
  }
];

const jobs = [
  {
    id: 'job1',
    title: 'Senior Frontend Developer',
    companyId: 'comp1'
  }
];

const applications = [
  {
    id: 'app1',
    candidateId: '1',
    jobId: 'job1',
    status: 'Interview',
    appliedDate: '2024-01-15'
  }
];

const currentUser = { id: 'user1', role: 'candidate' };

// Utility functions
const maskEmail = (email: string, showFull: boolean) => {
  if (showFull) return email;
  const [username, domain] = email.split('@');
  return `${username.slice(0, 2)}****@${domain}`;
};

const maskPhone = (phone: string, showFull: boolean) => {
  if (showFull) return phone;
  return phone.replace(/\d(?=\d{4})/g, '*');
};

const getCVScore = (cv: any, keywords: string[]) => {
  return {
    score: Math.floor(Math.random() * 20) + 80,
    strengths: [
      'Strong technical skills section',
      'Clear work experience descriptions',
      'Relevant keywords present'
    ],
    weaknesses: [
      'Add more quantified achievements',
      'Include more industry keywords',
      'Expand project descriptions'
    ]
  };
};

const generateCVImprovement = (candidate: any) => {
  return {
    improvedHeadline: `Experienced ${candidate.headline.split(' ')[1]} ${candidate.headline.split(' ')[2]} with proven track record in building scalable web applications and leading development teams`,
    suggestions: [
      'Add specific metrics and achievements to your experience',
      'Include relevant certifications and training',
      'Optimize keywords for ATS systems',
      'Add a professional summary section'
    ]
  };
};

// Markdown component
const Markdown = ({ content }: { content: string }) => {
  const formatContent = (text: string) => {
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2 mt-4">$1</h3>')
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

interface CandidateProfilePageProps {
  params: { candidateId?: string };
}

export default function CandidateProfilePage({ params }: CandidateProfilePageProps) {
  const router = useRouter();
  const candidateId = params?.candidateId;
  
  // If no candidateId, redirect to own profile
  const targetCandidate = candidateId 
    ? candidates.find(c => c.id === candidateId || c.userId === candidateId)
    : candidates.find(c => c.userId === currentUser?.id);
    
  const targetUser = targetCandidate ? users.find(u => u.id === targetCandidate.userId) : null;
  const isOwnProfile = currentUser?.id === targetUser?.id;
  
  const [editMode, setEditMode] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const [selectedCV, setSelectedCV] = useState<any>(null);
  const [showCVUpload, setShowCVUpload] = useState(false);
  const [showAITools, setShowAITools] = useState(false);

  if (!targetCandidate || !targetUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Candidate not found</h2>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleCVUpload = (file: File) => {
    const newCV = {
      id: `cv${targetCandidate.cvs.length + 1}`,
      name: file.name,
      uploadedAt: new Date().toISOString().split('T')[0],
      contentMarkdown: `# ${targetUser.name}\n\n## Experience\n- Sample work experience\n\n## Skills\n- ${targetCandidate.skills.join('\n- ')}`,
      isDefault: targetCandidate.cvs.length === 0,
      fileName: file.name,
      type: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.docx') ? 'docx' : 'md'
    };

    // Mock - in real app would update database
    targetCandidate.cvs.push(newCV);
    setShowCVUpload(false);
    toast({
      title: "CV uploaded",
      description: "Your CV has been uploaded successfully."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={targetUser.avatar} />
                      <AvatarFallback className="text-2xl">{targetUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{targetUser.name}</h1>
                      <p className="text-xl text-gray-700 mb-4">{targetCandidate.headline}</p>
                      
                      <div className="flex items-center space-x-4 text-gray-600 mb-4">
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {maskEmail(targetUser.email, targetUser.privacy.email || isOwnProfile)}
                        </span>
                        {targetUser.phone && (
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {maskPhone(targetUser.phone, targetUser.privacy.phone || isOwnProfile)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {targetCandidate.skills.slice(0, 6).map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                        {targetCandidate.skills.length > 6 && (
                          <Badge variant="outline">+{targetCandidate.skills.length - 6} more</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isOwnProfile ? (
                      <Button onClick={() => setEditMode(!editMode)}>
                        <Edit className="h-4 w-4 mr-2" />
                        {editMode ? 'Cancel' : 'Edit Profile'}
                      </Button>
                    ) : (
                      <Button>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {targetCandidate.experience.map((exp) => (
                    <div key={exp.id} className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                        <p className="text-gray-700 mb-2">{exp.company}</p>
                        <p className="text-sm text-gray-600 mb-3">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                        <p className="text-gray-700">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {targetCandidate.education.map((edu) => (
                    <div key={edu.id} className="flex items-start space-x-4">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Award className="h-5 w-5 text-green-600" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-gray-700 mb-2">{edu.institution}</p>
                        <p className="text-sm text-gray-600 mb-2">
                          {edu.field} • {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CVs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>CVs & Resumes</CardTitle>
                  {isOwnProfile && (
                    <Button size="sm" onClick={() => setShowCVUpload(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {targetCandidate.cvs.length > 0 ? (
                    targetCandidate.cvs.map((cv) => (
                      <div key={cv.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium text-sm">{cv.name}</p>
                            <p className="text-xs text-gray-600">Uploaded {cv.uploadedAt}</p>
                            {cv.isDefault && (
                              <Badge variant="secondary" className="text-xs mt-1">Default</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedCV(cv);
                              setShowCVModal(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No CVs uploaded yet</p>
                    </div>
                  )}
                </div>

                {isOwnProfile && targetCandidate.cvs.length > 0 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setShowAITools(true)}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    AI CV Tools
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {targetCandidate.skills.map((skill) => (
                    <div key={skill} className="flex items-center justify-between">
                      <span className="text-sm">{skill}</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-2 h-2 rounded-full ${
                              level <= Math.floor(Math.random() * 3) + 3
                                ? 'bg-blue-500'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Application History */}
            {isOwnProfile && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {applications
                      .filter(app => app.candidateId === targetCandidate.id)
                      .slice(0, 3)
                      .map((app) => {
                        const job = jobs.find(j => j.id === app.jobId);
                        const company = job ? companies.find(c => c.id === job.companyId) : null;
                        
                        return (
                          <div key={app.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">{job?.title}</h4>
                              <Badge 
                                variant={app.status === 'Hired' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {app.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">{company?.name}</p>
                            <p className="text-xs text-gray-500">Applied {app.appliedDate}</p>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews (for employers viewing) */}
            {!isOwnProfile && currentUser?.role === 'employer' && (
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">4.5</div>
                      <div className="flex items-center justify-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Based on 3 reviews</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Excellent work quality</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">TechCorp Inc.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* CV Preview Modal */}
      <Dialog open={showCVModal} onOpenChange={setShowCVModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{selectedCV?.name}</DialogTitle>
            <DialogDescription>
              CV Preview • Uploaded {selectedCV?.uploadedAt}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCV && (
            <div className="mt-4">
              <Markdown content={selectedCV.contentMarkdown} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CV Upload Modal */}
      <Dialog open={showCVUpload} onOpenChange={setShowCVUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload CV</DialogTitle>
            <DialogDescription>
              Upload your resume or CV in PDF, DOCX, or Markdown format
            </DialogDescription>
          </DialogHeader>
          
          <div className="border-dashed border-2 border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Drag and drop your CV here, or click to browse</p>
            <Input
              type="file"
              accept=".pdf,.docx,.md"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleCVUpload(file);
                }
              }}
              className="hidden"
              id="cv-upload"
            />
            <Label htmlFor="cv-upload">
              <Button variant="outline" className="cursor-pointer">
                Browse Files
              </Button>
            </Label>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Tools Modal */}
      <Dialog open={showAITools} onOpenChange={setShowAITools}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI CV Tools</DialogTitle>
            <DialogDescription>
              Improve your CV with AI-powered suggestions and analysis
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {targetCandidate.cvs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">CV Analysis</h3>
                {targetCandidate.cvs.map((cv) => {
                  const analysis = getCVScore(cv, ['React', 'TypeScript', 'JavaScript']);
                  return (
                    <div key={cv.id} className="border rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{cv.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-green-600">{analysis.score}</span>
                          <span className="text-sm text-gray-600">/100</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-green-600 mb-2">Strengths</h5>
                          <ul className="text-sm space-y-1">
                            {analysis.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-orange-600 mb-2">Suggestions</h5>
                          <ul className="text-sm space-y-1">
                            {analysis.weaknesses.map((weakness, index) => (
                              <li key={index} className="flex items-start">
                                <Lightbulb className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold mb-4">AI Improvements</h3>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Enhanced Profile Headline</h4>
                <div className="bg-gray-50 p-3 rounded mb-3">
                  <p className="text-sm text-gray-600 mb-2">Current:</p>
                  <p className="text-sm">{targetCandidate.headline}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-blue-600 mb-2">AI Suggested:</p>
                  <p className="text-sm">{generateCVImprovement(targetCandidate).improvedHeadline}</p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 mt-4">
                <h4 className="font-medium mb-3">Improvement Suggestions</h4>
                <ul className="space-y-2">
                  {generateCVImprovement(targetCandidate).suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <Sparkles className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}