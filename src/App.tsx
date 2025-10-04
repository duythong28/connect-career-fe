import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  User, Briefcase, Building2, Users, Search, MapPin, DollarSign, Clock, 
  Eye, Send, Upload, Edit, Trash2, Plus, Menu, X, ChevronRight, 
  Home, Star, Award, Globe, Phone, Mail, FileText, CheckCircle,
  ArrowLeft, Filter, Heart, Bell, Settings, Share, Calendar,
  MessageCircle, Shield, TrendingUp, BarChart3, UserCheck,
  Ban, AlertTriangle, CreditCard, ChevronDown, Download,
  Zap, Target, Brain, Lightbulb, Rocket, Coffee, UserPlus,
  FileCheck, ThumbsUp, ThumbsDown, ExternalLink, Copy, Linkedin,
  Sparkles, MessageSquare, Video, MapPinIcon, Clock4, PlusCircle
} from 'lucide-react';
import { CandidateProfile } from '@/components/candidate/CandidateProfile';
import { UserEditDialog } from '@/components/admin/UserEditDialog';
import { JobEditDialog } from '@/components/admin/JobEditDialog';
import { CompanyProfile } from '@/components/employer/CompanyProfile';
import { CandidateSearch } from '@/components/employer/CandidateSearch';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Markdown } from '@/components/ui/markdown';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// ====== TYPES ======
interface Company {
  id: string;
  name: string;
  slug: string;
  industry: string;
  size: string;
  headquarters: string;
  website: string;
  description: string;
  logo: string;
  founded: string;
  employees: number;
  followers: number;
  jobs: number;
  members: CompanyMember[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  // Optional for places where location is referenced
  location?: string;
}

interface CompanyMember {
  id: string;
  userId: string;
  role: 'Company Admin' | 'HR' | 'Recruiter' | 'Viewer';
  joinedAt: string;
}

interface Job {
  id: string;
  title: string;
  companyId: string;
  // Optional: some UI references use company name directly
  company?: string;
  location: string;
  salary: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote' | 'internship';
  description: string; // Markdown formatted
  postedDate: string;
  applications: number;
  status: 'active' | 'closed' | 'draft';
  views: number;
  employerId: string;
  keywords: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'employer' | 'admin';
  avatar?: string;
  phone?: string;
  companyId?: string;
  // Optional fields used across the UI
  company?: string;
  title?: string;
  location?: string;
  skills?: string[];
  bio?: string;
  linkedinUrl?: string;
  savedJobs?: string[];
  status?: 'active' | 'banned' | 'inactive';
  joinedDate?: string;
  privacy: {
    phone: boolean;
    email: boolean;
  };
  subscription: {
    plan: 'Free' | 'Standard' | 'Premium';
    expiresAt?: string;
  };
}

interface Candidate {
  id: string;
  userId: string;
  headline: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  cvs: CV[];
  savedJobs: string[];
  followedCompanies: string[];
  settings: {
    profileVisibility: boolean;
    jobAlerts: boolean;
  };
}

interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  description: string;
  current: boolean;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

interface CV {
  id: string;
  name: string;
  uploadedAt: string;
  contentMarkdown: string;
  isDefault: boolean;
  fileName: string;
  type: 'pdf' | 'docx' | 'md';
}

interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected' | 'Withdrawn';
  appliedDate: string;
  cvId: string;
  coverLetter?: string;
  notes?: string;
  matchingScore: number;
  feedback?: {
    rating: number;
    comment: string;
  };
}

interface Interview {
  id: string;
  applicationId: string;
  // Optional fields referenced in UI components
  jobId?: string;
  candidateId?: string;
  date: string;
  time: string;
  type: 'phone' | 'video' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface ViolationReport {
  id: string;
  reporterId: string;
  targetType: 'job' | 'user' | 'company';
  targetId: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

interface Subscription {
  id: string;
  userId: string;
  plan: 'Free' | 'Standard' | 'Premium';
  status: 'active' | 'cancelled' | 'expired';
  billingHistory: BillingRecord[];
}

interface BillingRecord {
  id: string;
  date: string;
  plan: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}

interface RefundRequest {
  id: string;
  userId: string;
  plan: string;
  reason: string;
  amount: number;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: string;
}

// ====== MOCK DATA ======
const mockCompanies: Company[] = [
  {
    id: 'comp1',
    name: 'TechCorp Inc.',
    slug: 'techcorp-inc',
    industry: 'Technology',
    size: '500-1000 employees',
    headquarters: 'San Francisco, CA',
    website: 'https://techcorp.com',
    description: '# About TechCorp\n\nTechCorp is a leading technology company focused on creating innovative solutions for the modern workplace.\n\n## Our Mission\nTo empower businesses through cutting-edge technology and exceptional user experiences.\n\n## Values\n- Innovation\n- Collaboration\n- Excellence\n- Diversity',
    logo: '/api/placeholder/100/100',
    founded: '2015',
    employees: 750,
    followers: 1250,
    jobs: 12,
    members: [
      { id: 'm1', userId: 'emp1', role: 'Company Admin', joinedAt: '2015-01-01' },
      { id: 'm2', userId: 'emp2', role: 'HR', joinedAt: '2020-06-15' }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/techcorp',
      twitter: 'https://twitter.com/techcorp'
    }
  },
  {
    id: 'comp2',
    name: 'InnovateLabs',
    slug: 'innovate-labs',
    industry: 'AI & Machine Learning',
    size: '100-500 employees',
    headquarters: 'New York, NY',
    website: 'https://innovatelabs.com',
    description: '# InnovateLabs\n\nPioneering AI solutions for tomorrow\'s challenges.\n\n## What We Do\n- Machine Learning Research\n- AI Product Development\n- Consulting Services\n\n## Why Join Us?\n- Work on cutting-edge AI projects\n- Collaborative environment\n- Competitive compensation',
    logo: '/api/placeholder/100/100',
    founded: '2018',
    employees: 320,
    followers: 890,
    jobs: 8,
    members: [
      { id: 'm3', userId: 'emp3', role: 'Company Admin', joinedAt: '2018-03-01' }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/innovatelabs'
    }
  },
  {
    id: 'comp3',
    name: 'DesignStudio',
    slug: 'design-studio',
    industry: 'Design & Creative',
    size: '50-100 employees',
    headquarters: 'Remote',
    website: 'https://designstudio.com',
    description: '# DesignStudio\n\nCreating beautiful, user-centered digital experiences.\n\n## Our Expertise\n- UX/UI Design\n- Brand Identity\n- Digital Strategy\n- Product Design\n\n## Remote-First Culture\nWe believe in flexibility and work-life balance.',
    logo: '/api/placeholder/100/100',
    founded: '2019',
    employees: 85,
    followers: 650,
    jobs: 5,
    members: [
      { id: 'm4', userId: 'emp4', role: 'Company Admin', joinedAt: '2019-01-01' }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/designstudio',
      twitter: 'https://twitter.com/designstudio'
    }
  },
  {
    id: 'comp4',
    name: 'FinanceForward',
    slug: 'finance-forward',
    industry: 'Financial Services',
    size: '200-500 employees',
    headquarters: 'Chicago, IL',
    website: 'https://financeforward.com',
    description: '# FinanceForward\n\nRevolutionizing financial services through technology.\n\n## Our Services\n- Digital Banking Solutions\n- Investment Platforms\n- Financial Analytics\n\n## Career Growth\nWe invest in our people and provide clear career progression paths.',
    logo: '/api/placeholder/100/100',
    founded: '2016',
    employees: 420,
    followers: 1100,
    jobs: 15,
    members: [
      { id: 'm5', userId: 'emp5', role: 'Company Admin', joinedAt: '2016-05-01' }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/financeforward'
    }
  }
];

const mockJobs: Job[] = [
  {
    id: 'job1',
    title: 'Senior Frontend Developer',
    companyId: 'comp1',
    location: 'San Francisco, CA',
    salary: '$120,000 - $160,000',
    type: 'full-time',
    description: `# Senior Frontend Developer

## About the Role
We are looking for a Senior Frontend Developer to join our dynamic team and help build the next generation of web applications.

## Responsibilities
- Develop and maintain React-based web applications
- Collaborate with design and backend teams
- Implement responsive and accessible user interfaces
- Optimize applications for maximum speed and scalability
- Mentor junior developers

## Qualifications
- 5+ years of experience with React and TypeScript
- Experience with Next.js and modern build tools
- Strong understanding of HTML, CSS, and JavaScript
- Knowledge of GraphQL and RESTful APIs
- Experience with TailwindCSS or similar CSS frameworks

## Benefits
- Health Insurance (Medical, Dental, Vision)
- 401k with company matching
- Flexible PTO policy
- Remote work options
- $2,000 annual learning budget
- Stock options`,
    postedDate: '2024-01-15',
    applications: 12,
    status: 'active',
    views: 245,
    employerId: 'emp1',
    keywords: ['React', 'TypeScript', 'Frontend', 'JavaScript', 'GraphQL']
  },
  {
    id: 'job2',
    title: 'Product Manager',
    companyId: 'comp2',
    location: 'New York, NY',
    salary: '$130,000 - $180,000',
    type: 'full-time',
    description: `# Product Manager - AI Solutions

## Role Overview
Lead product strategy and drive innovation in our AI-powered solutions. Work closely with engineering and design teams to deliver exceptional user experiences.

## Key Responsibilities
- Define product roadmap and strategy
- Conduct market research and competitive analysis
- Work with engineering teams to prioritize features
- Analyze user data to inform product decisions
- Collaborate with sales and marketing teams

## Requirements
- 3+ years of product management experience
- Experience with AI/ML products preferred
- Strong analytical and problem-solving skills
- Proficiency in SQL and data analysis tools
- Experience with Agile/Scrum methodologies

## What We Offer
- Competitive salary and equity package
- Comprehensive health benefits
- Unlimited PTO
- Professional development budget
- Work with cutting-edge AI technology`,
    postedDate: '2024-01-14',
    applications: 8,
    status: 'active',
    views: 189,
    employerId: 'emp3',
    keywords: ['Product Management', 'AI', 'Strategy', 'Analytics', 'Agile']
  },
  {
    id: 'job3',
    title: 'UX Designer',
    companyId: 'comp3',
    location: 'Remote',
    salary: '$90,000 - $120,000',
    type: 'remote',
    description: `# UX Designer - Remote

## About the Position
Create intuitive and beautiful user experiences for our digital products. Join our fully remote team and work on projects for top-tier clients.

## What You'll Do
- Conduct user research and usability testing
- Create wireframes, prototypes, and design systems
- Collaborate with product and engineering teams
- Design responsive interfaces for web and mobile
- Present design concepts to stakeholders

## Qualifications
- 3+ years of UX design experience
- Proficiency in Figma and design tools
- Experience with user research methodologies
- Strong portfolio demonstrating design process
- Understanding of HTML/CSS principles

## Remote Benefits
- Work from anywhere
- Flexible working hours
- Home office setup allowance
- Annual team retreats
- Professional development budget`,
    postedDate: '2024-01-13',
    applications: 15,
    status: 'active',
    views: 167,
    employerId: 'emp4',
    keywords: ['UX Design', 'Figma', 'User Research', 'Prototyping', 'Remote']
  },
  {
    id: 'job4',
    title: 'Data Scientist',
    companyId: 'comp2',
    location: 'New York, NY',
    salary: '$110,000 - $150,000',
    type: 'full-time',
    description: `# Data Scientist

## Position Summary
Join our AI team to build machine learning models and extract insights from large datasets.

## Responsibilities
- Develop and deploy ML models
- Analyze complex datasets
- Create data visualizations and reports
- Collaborate with product and engineering teams
- Research new ML techniques and tools

## Requirements
- PhD or MS in Computer Science, Statistics, or related field
- 2+ years of experience in data science
- Proficiency in Python, R, and SQL
- Experience with TensorFlow or PyTorch
- Strong statistical analysis skills

## Benefits
- Cutting-edge technology stack
- Research collaboration opportunities
- Conference attendance support
- Competitive compensation package`,
    postedDate: '2024-01-12',
    applications: 6,
    status: 'active',
    views: 134,
    employerId: 'emp3',
    keywords: ['Data Science', 'Machine Learning', 'Python', 'Statistics', 'AI']
  },
  {
    id: 'job5',
    title: 'DevOps Engineer',
    companyId: 'comp1',
    location: 'San Francisco, CA',
    salary: '$130,000 - $170,000',
    type: 'full-time',
    description: `# DevOps Engineer

## Overview
Build and maintain our cloud infrastructure to support our growing platform.

## Key Duties
- Manage AWS/GCP cloud infrastructure
- Implement CI/CD pipelines
- Monitor system performance and reliability
- Automate deployment processes
- Ensure security best practices

## Qualifications
- 4+ years of DevOps experience
- Experience with Kubernetes and Docker
- Proficiency in Terraform or CloudFormation
- Knowledge of monitoring tools (Prometheus, Grafana)
- Strong scripting skills (Python, Bash)

## Perks
- Stock options
- Flexible work arrangements
- Health and wellness benefits
- Professional certification support`,
    postedDate: '2024-01-11',
    applications: 9,
    status: 'active',
    views: 198,
    employerId: 'emp1',
    keywords: ['DevOps', 'AWS', 'Kubernetes', 'Docker', 'Infrastructure']
  },
  {
    id: 'job6',
    title: 'Financial Analyst',
    companyId: 'comp4',
    location: 'Chicago, IL',
    salary: '$80,000 - $110,000',
    type: 'full-time',
    description: `# Financial Analyst

## Role Description
Analyze financial data and provide insights to support business decisions in our fast-growing fintech company.

## Responsibilities
- Prepare financial reports and analysis
- Build financial models and forecasts
- Support budgeting and planning processes
- Analyze investment opportunities
- Present findings to senior management

## Requirements
- Bachelor's degree in Finance, Economics, or related field
- 2+ years of financial analysis experience
- Advanced Excel and SQL skills
- Experience with financial modeling
- CFA or similar certification preferred

## Benefits
- Competitive salary and bonus structure
- Comprehensive benefits package
- Career advancement opportunities
- Modern office in downtown Chicago`,
    postedDate: '2024-01-10',
    applications: 11,
    status: 'draft',
    views: 156,
    employerId: 'emp5',
    keywords: ['Finance', 'Analysis', 'Excel', 'Modeling', 'CFA']
  }
];

const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'candidate',
    avatar: '/api/placeholder/50/50',
    phone: '+1234567890',
    privacy: { phone: true, email: true },
    subscription: { plan: 'Free' }
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'candidate',
    avatar: '/api/placeholder/50/50',
    phone: '+1234567891',
    privacy: { phone: false, email: true },
    subscription: { plan: 'Standard', expiresAt: '2024-12-31' }
  },
  {
    id: 'emp1',
    name: 'Alice Johnson',
    email: 'alice@techcorp.com',
    role: 'employer',
    avatar: '/api/placeholder/50/50',
    phone: '+1234567892',
    companyId: 'comp1',
    privacy: { phone: true, email: true },
    subscription: { plan: 'Premium', expiresAt: '2024-12-31' }
  },
  {
    id: 'emp2',
    name: 'Bob Wilson',
    email: 'bob@techcorp.com',
    role: 'employer',
    avatar: '/api/placeholder/50/50',
    phone: '+1234567893',
    companyId: 'comp1',
    privacy: { phone: true, email: true },
    subscription: { plan: 'Standard', expiresAt: '2024-12-31' }
  },
  {
    id: 'emp3',
    name: 'Carol Davis',
    email: 'carol@innovatelabs.com',
    role: 'employer',
    avatar: '/api/placeholder/50/50',
    phone: '+1234567894',
    companyId: 'comp2',
    privacy: { phone: true, email: true },
    subscription: { plan: 'Premium', expiresAt: '2024-12-31' }
  },
  {
    id: 'emp4',
    name: 'David Brown',
    email: 'david@designstudio.com',
    role: 'employer',
    avatar: '/api/placeholder/50/50',
    phone: '+1234567895',
    companyId: 'comp3',
    privacy: { phone: true, email: true },
    subscription: { plan: 'Standard', expiresAt: '2024-12-31' }
  },
  {
    id: 'emp5',
    name: 'Eva Martinez',
    email: 'eva@financeforward.com',
    role: 'employer',
    avatar: '/api/placeholder/50/50',
    phone: '+1234567896',
    companyId: 'comp4',
    privacy: { phone: true, email: true },
    subscription: { plan: 'Premium', expiresAt: '2024-12-31' }
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@jobboard.com',
    role: 'admin',
    avatar: '/api/placeholder/50/50',
    phone: '+1234567897',
    privacy: { phone: true, email: true },
    subscription: { plan: 'Premium' }
  }
];

const mockCandidates: Candidate[] = [
  {
    id: 'cand1',
    userId: 'user1',
    headline: 'Frontend Developer with 3 years experience',
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
    experience: [
      {
        id: 'exp1',
        company: 'StartupCorp',
        title: 'Frontend Developer',
        startDate: '2021-01-01',
        endDate: '2023-12-31',
        description: 'Developed React applications and improved user experience',
        current: false
      }
    ],
    education: [
      {
        id: 'edu1',
        institution: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2017-09-01',
        endDate: '2021-06-01',
        current: false
      }
    ],
    cvs: [
      {
        id: 'cv1',
        name: 'John Doe Resume',
        uploadedAt: '2024-01-01',
        contentMarkdown: '# John Doe\n\nExperienced Frontend Developer\n\n## Skills\n- React\n- TypeScript\n- JavaScript',
        isDefault: true,
        fileName: 'john_doe_resume.pdf',
        type: 'pdf'
      }
    ],
    savedJobs: ['job1', 'job3'],
    followedCompanies: ['comp1', 'comp3'],
    settings: {
      profileVisibility: true,
      jobAlerts: true
    }
  },
  {
    id: 'cand2',
    userId: 'user2',
    headline: 'Product Manager with 5 years experience in tech',
    skills: ['Product Management', 'Analytics', 'Agile', 'SQL', 'Strategy'],
    experience: [
      {
        id: 'exp2',
        company: 'TechGiant',
        title: 'Senior Product Manager',
        startDate: '2019-03-01',
        description: 'Led product strategy for consumer mobile apps',
        current: true
      }
    ],
    education: [
      {
        id: 'edu2',
        institution: 'Business University',
        degree: 'Master of Business Administration',
        field: 'Business Administration',
        startDate: '2015-09-01',
        endDate: '2017-06-01',
        current: false
      }
    ],
    cvs: [
      {
        id: 'cv2',
        name: 'Jane Smith Resume',
        uploadedAt: '2024-01-02',
        contentMarkdown: '# Jane Smith\n\nProduct Manager\n\n## Experience\n- 5 years in product management\n- Led multiple successful product launches',
        isDefault: true,
        fileName: 'jane_smith_resume.pdf',
        type: 'pdf'
      }
    ],
    savedJobs: ['job2', 'job4'],
    followedCompanies: ['comp2', 'comp4'],
    settings: {
      profileVisibility: true,
      jobAlerts: true
    }
  }
];

const mockApplications: Application[] = [
  {
    id: 'app1',
    jobId: 'job1',
    candidateId: 'cand1',
    status: 'New',
    appliedDate: '2024-01-16',
    cvId: 'cv1',
    coverLetter: 'I am very interested in this position...',
    matchingScore: 85,
    feedback: { rating: 4, comment: 'Strong technical skills' }
  },
  {
    id: 'app2',
    jobId: 'job2',
    candidateId: 'cand2',
    status: 'Interview',
    appliedDate: '2024-01-15',
    cvId: 'cv2',
    matchingScore: 92,
    feedback: { rating: 5, comment: 'Excellent product experience' }
  },
  {
    id: 'app3',
    jobId: 'job3',
    candidateId: 'cand1',
    status: 'Screening',
    appliedDate: '2024-01-14',
    cvId: 'cv1',
    coverLetter: 'I would love to contribute to your design team...',
    matchingScore: 78,
  }
];

const mockInterviews: Interview[] = [
  {
    id: 'int1',
    applicationId: 'app2',
    date: '2024-01-20',
    time: '14:00',
    type: 'video',
    status: 'scheduled',
    notes: 'Technical interview with the team lead'
  },
  {
    id: 'int2',
    applicationId: 'app3',
    date: '2024-01-22',
    time: '10:00',
    type: 'phone',
    status: 'scheduled',
    notes: 'Initial screening call'
  }
];

const mockMessages: Message[] = [
  {
    id: 'msg1',
    senderId: 'emp1',
    receiverId: 'user1',
    content: 'Hi John, we reviewed your application and would like to schedule an interview.',
    timestamp: '2024-01-16T10:00:00Z',
    read: false
  },
  {
    id: 'msg2',
    senderId: 'user2',
    receiverId: 'emp3',
    content: 'Thank you for considering my application. I am available for an interview next week.',
    timestamp: '2024-01-15T15:30:00Z',
    read: true
  }
];

const mockViolationReports: ViolationReport[] = [
  {
    id: 'vio1',
    reporterId: 'user1',
    targetType: 'job',
    targetId: 'job1',
    reason: 'Misleading job description',
    status: 'pending',
    createdAt: '2024-01-15'
  },
  {
    id: 'vio2',
    reporterId: 'user2',
    targetType: 'user',
    targetId: 'emp1',
    reason: 'Inappropriate communication',
    status: 'resolved',
    createdAt: '2024-01-14'
  }
];

const mockRefundRequests: RefundRequest[] = [
  {
    id: 'ref1',
    userId: 'user2',
    plan: 'Premium',
    reason: 'Service not as expected',
    amount: 99,
    status: 'pending',
    requestedAt: '2024-01-15'
  },
  {
    id: 'ref2',
    userId: 'emp1',
    plan: 'Standard',
    reason: 'Billing error',
    amount: 49,
    status: 'approved',
    requestedAt: '2024-01-10'
  }
];

const mockRevenueData = [
  { month: 'Jan', revenue: 12000, subscriptions: 150 },
  { month: 'Feb', revenue: 15000, subscriptions: 180 },
  { month: 'Mar', revenue: 18000, subscriptions: 220 },
  { month: 'Apr', revenue: 22000, subscriptions: 260 },
  { month: 'May', revenue: 28000, subscriptions: 320 },
  { month: 'Jun', revenue: 35000, subscriptions: 400 }
];

const mockPlanData = [
  { name: 'Free', value: 60, color: '#8884d8' },
  { name: 'Standard', value: 25, color: '#82ca9d' },
  { name: 'Premium', value: 15, color: '#ffc658' }
];

// ====== UTILITY FUNCTIONS ======
const maskEmail = (email: string, showFull: boolean = true): string => {
  if (showFull) return email;
  const [name, domain] = email.split('@');
  return `${name.substring(0, 2)}****@${domain}`;
};

const maskPhone = (phone: string, showFull: boolean = true): string => {
  if (showFull) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
};

const calculateMatchingScore = (candidateSkills: string[], jobKeywords: string[], experienceYears: number = 0): number => {
  const baseScore = 50;
  const skillMatches = candidateSkills.filter(skill => 
    jobKeywords.some(keyword => keyword.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(keyword.toLowerCase()))
  ).length;
  const skillScore = skillMatches * 8;
  const experienceScore = Math.min(experienceYears * 3, 20);
  return Math.min(baseScore + skillScore + experienceScore, 100);
};

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
- Flexible PTO
- Modern office environment`,
      junior: `# ${title}

## Role Description
Great opportunity for a ${title} to start their career with a dynamic technology company.

## What You'll Do
- Write clean, maintainable code
- Learn from experienced team members
- Participate in team meetings and planning
- Contribute to feature development
- Grow your technical skills

## Qualifications
- 0-2 years of experience
- Strong fundamentals in programming
- Eagerness to learn and grow
- Good problem-solving abilities
- Recent graduate or bootcamp completion

## Why Join Us
- Mentorship and learning opportunities
- Collaborative team environment
- Growth potential
- Competitive entry-level compensation`
    }
  };

  return templates.technology?.[level] || templates.technology.mid;
};

const getCVScore = (cv: CV, jobKeywords: string[]): { score: number; strengths: string[]; weaknesses: string[] } => {
  const content = cv.contentMarkdown.toLowerCase();
  const matchedKeywords = jobKeywords.filter(keyword => content.includes(keyword.toLowerCase()));
  const score = Math.min(60 + (matchedKeywords.length * 10), 100);
  
  const strengths = [
    `Matches ${matchedKeywords.length} key requirements`,
    'Well-structured resume format',
    'Relevant work experience highlighted'
  ];
  
  const weaknesses = [
    'Could include more specific achievements',
    'Consider adding quantifiable results',
    'Tailor skills section to job requirements'
  ];
  
  return { score, strengths: strengths.slice(0, 2), weaknesses: weaknesses.slice(0, 2) };
};

const generateCVImprovement = (candidate: Candidate): { suggestions: string[]; improvedHeadline: string } => {
  const suggestions = [
    'Add specific metrics and achievements to quantify your impact',
    'Include relevant keywords from your target job descriptions',
    'Highlight your most recent and relevant projects prominently'
  ];
  
  const improvedHeadline = `${candidate.headline.split(' ')[0]} ${candidate.headline.split(' ')[1]} with proven track record in ${candidate.skills.slice(0, 2).join(' and ')} | ${candidate.experience.length}+ years experience`;
  
  return { suggestions, improvedHeadline };
};

// ====== MAIN APP COMPONENT ======
function App() {
  // State Management
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [violationReports, setViolationReports] = useState<ViolationReport[]>(mockViolationReports);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>(mockRefundRequests);
  
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [showCompanyOnboarding, setShowCompanyOnboarding] = useState(false);
  
  // Form States
  const [jobForm, setJobForm] = useState({
    title: '',
    location: '',
    salary: '',
    type: 'full-time',
    description: '',
    companyId: ''
  });
  
  const [companyForm, setCompanyForm] = useState({
    name: '',
    slug: '',
    industry: '',
    size: '',
    headquarters: '',
    website: '',
    description: ''
  });
  
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    location: '',
    type: '',
    salaryRange: [0, 200000],
    industry: ''
  });

  const [chatMessages, setChatMessages] = useState<Array<{id: string; sender: 'user' | 'bot'; content: string; timestamp: string}>>([]);
  const [chatInput, setChatInput] = useState('');

  // Authentication Functions
  const login = (role: 'candidate' | 'employer' | 'admin', userData?: Partial<User>) => {
    let user: User;
    
    if (role === 'candidate') {
      user = users.find(u => u.role === 'candidate') || users[0];
    } else if (role === 'employer') {
      if (userData?.companyId) {
        user = users.find(u => u.role === 'employer' && u.companyId === userData.companyId) || users[2];
      } else {
        // Show company onboarding
        setShowCompanyOnboarding(true);
        return;
      }
    } else {
      user = users.find(u => u.role === 'admin') || users[7];
    }
    
    setCurrentUser(user);
    setShowLogin(false);
    toast({
      title: "Logged in successfully",
      description: `Welcome back, ${user.name}!`
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully."
    });
  };

  const switchRole = (role: 'candidate' | 'employer' | 'admin') => {
    if (role === 'employer' && !currentUser?.companyId) {
      setShowCompanyOnboarding(true);
      return;
    }
    
    const user = users.find(u => u.role === role) || users[0];
    setCurrentUser(user);
    setCurrentPage(role === 'candidate' ? 'candidate-dashboard' : role === 'employer' ? 'employer-dashboard' : 'admin-dashboard');
  };

  // Company Functions
  const createCompany = (formData: typeof companyForm) => {
    const newCompany: Company = {
      id: `comp${companies.length + 1}`,
      ...formData,
      logo: '/api/placeholder/100/100',
      founded: new Date().getFullYear().toString(),
      employees: 0,
      followers: 0,
      jobs: 0,
      members: [{
        id: `m${Date.now()}`,
        userId: currentUser?.id || 'temp',
        role: 'Company Admin',
        joinedAt: new Date().toISOString()
      }],
      socialLinks: {}
    };
    
    setCompanies([...companies, newCompany]);
    
    if (currentUser) {
      const updatedUser = { ...currentUser, companyId: newCompany.id };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    }
    
    setShowCompanyOnboarding(false);
    setCurrentPage('employer-dashboard');
    toast({
      title: "Company created",
      description: `${formData.name} has been successfully created.`
    });
  };

  const joinCompany = (companyId: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, companyId };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
      
      setCompanies(companies.map(c => 
        c.id === companyId 
          ? {
              ...c,
              members: [...c.members, {
                id: `m${Date.now()}`,
                userId: currentUser.id,
                role: 'Recruiter',
                joinedAt: new Date().toISOString()
              }]
            }
          : c
      ));
    }
    
    setShowCompanyOnboarding(false);
    setCurrentPage('employer-dashboard');
    toast({
      title: "Joined company",
      description: "You have successfully joined the company."
    });
  };

  // Job Functions
  const postJob = () => {
    if (!jobForm.title || !jobForm.description || !jobForm.companyId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newJob: Job = {
      id: `job${jobs.length + 1}`,
      ...jobForm,
      type: jobForm.type as Job['type'],
      postedDate: new Date().toISOString().split('T')[0],
      applications: 0,
      status: currentUser?.role === 'admin' ? 'active' : 'draft',
      views: 0,
      employerId: currentUser?.id || '',
      keywords: jobForm.description.toLowerCase().split(' ').filter(word => word.length > 3).slice(0, 5)
    };

    setJobs([...jobs, newJob]);
    setJobForm({ title: '', location: '', salary: '', type: 'full-time', description: '', companyId: '' });
    
    toast({
      title: "Job posted",
      description: currentUser?.role === 'admin' ? "Job is now live!" : "Job submitted for review."
    });
  };

  const approveJob = (jobId: string) => {
    setJobs(jobs.map(job => job.id === jobId ? { ...job, status: 'active' as const } : job));
    toast({
      title: "Job approved",
      description: "Job is now visible to candidates."
    });
  };

  // Application Functions
  const applyToJob = (jobId: string, cvId: string, coverLetter?: string) => {
    const candidate = candidates.find(c => c.userId === currentUser?.id);
    if (!candidate) return;

    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const matchingScore = calculateMatchingScore(candidate.skills, job.keywords, candidate.experience.length);

    const newApplication: Application = {
      id: `app${applications.length + 1}`,
      jobId,
      candidateId: candidate.id,
      status: 'New',
      appliedDate: new Date().toISOString().split('T')[0],
      cvId,
      coverLetter,
      matchingScore
    };

    setApplications([...applications, newApplication]);
    setJobs(jobs.map(j => j.id === jobId ? { ...j, applications: j.applications + 1 } : j));
    
    toast({
      title: "Application submitted",
      description: "Your application has been sent to the employer."
    });
  };

  const updateApplicationStatus = (applicationId: string, status: Application['status']) => {
    setApplications(applications.map(app => 
      app.id === applicationId ? { ...app, status } : app
    ));
    
    toast({
      title: "Application updated",
      description: `Application status changed to ${status}.`
    });
  };

  // Pipeline drag and drop
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as Application['status'];
    
    updateApplicationStatus(draggableId, newStatus);
  };

  // Chat Functions
  const sendChatMessage = (message: string, chatType: 'candidate' | 'recruiter') => {
    const userMessage = {
      id: `msg${Date.now()}`,
      sender: 'user' as const,
      content: message,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Generate bot response
    setTimeout(() => {
      let botResponse = '';
      
      if (chatType === 'candidate') {
        if (message.toLowerCase().includes('cv') || message.toLowerCase().includes('resume')) {
          botResponse = "Here are some tips to improve your CV: 1) Use action verbs, 2) Quantify your achievements, 3) Tailor it to each job application. Would you like specific advice for any section?";
        } else if (message.toLowerCase().includes('interview')) {
          botResponse = "Interview preparation tips: 1) Research the company thoroughly, 2) Practice common questions, 3) Prepare questions to ask them, 4) Dress appropriately. What type of interview are you preparing for?";
        } else if (message.toLowerCase().includes('job')) {
          botResponse = "I can help you find relevant jobs based on your skills and experience. What type of role are you looking for?";
        } else {
          botResponse = "I'm here to help with your career! I can assist with CV improvements, interview preparation, job search strategies, and career advice. What would you like to know?";
        }
      } else {
        if (message.toLowerCase().includes('job description')) {
          botResponse = "Here are tips for writing effective job descriptions: 1) Use clear, specific language, 2) Include both required and preferred qualifications, 3) Highlight company culture and benefits, 4) Use inclusive language. Would you like me to review a specific job posting?";
        } else if (message.toLowerCase().includes('candidate')) {
          botResponse = "For better candidate attraction: 1) Write compelling job titles, 2) Include salary ranges, 3) Highlight growth opportunities, 4) Showcase company culture. Need help with candidate screening?";
        } else if (message.toLowerCase().includes('interview')) {
          botResponse = "Interview best practices: 1) Prepare structured questions, 2) Allow time for candidate questions, 3) Take detailed notes, 4) Provide clear next steps. What interview stage are you planning?";
        } else {
          botResponse = "I'm your recruiting assistant! I can help with writing job descriptions, candidate screening strategies, interview planning, and hiring best practices. How can I assist you today?";
        }
      }

      const botMessage = {
        id: `msg${Date.now()}`,
        sender: 'bot' as const,
        content: botResponse,
        timestamp: new Date().toISOString()
      };

      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);

    setChatInput('');
  };

  // Filtering Functions
  const getFilteredJobs = () => {
    return jobs.filter(job => {
      if (job.status !== 'active') return false;
      
      const matchesKeyword = !searchFilters.keyword || 
        job.title.toLowerCase().includes(searchFilters.keyword.toLowerCase()) ||
        job.description.toLowerCase().includes(searchFilters.keyword.toLowerCase()) ||
        job.keywords.some(k => k.toLowerCase().includes(searchFilters.keyword.toLowerCase()));
      
      const matchesLocation = !searchFilters.location || 
        job.location.toLowerCase().includes(searchFilters.location.toLowerCase());
      
      const matchesType = !searchFilters.type || searchFilters.type === 'all' || job.type === searchFilters.type;
      
      const matchesIndustry = !searchFilters.industry || searchFilters.industry === 'all' || 
        companies.find(c => c.id === job.companyId)?.industry === searchFilters.industry;
      
      return matchesKeyword && matchesLocation && matchesType && matchesIndustry;
    });
  };

  const getRecommendedJobs = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return [];

    return jobs
      .filter(job => job.status === 'active')
      .map(job => ({
        ...job,
        matchScore: calculateMatchingScore(candidate.skills, job.keywords, candidate.experience.length)
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  };

  // Components are defined below in the correct order

  // Page Components
  const HomePage = () => {
    const featuredJobs = getFilteredJobs().slice(0, 6);
    const navigate = useNavigate();

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Find Your Dream Job</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Connect with top companies and discover opportunities that match your skills and aspirations.
            </p>
            
            <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Job title or keyword"
                  value={searchFilters.keyword}
                  onChange={(e) => setSearchFilters({...searchFilters, keyword: e.target.value})}
                  className="text-gray-900"
                />
                <Input
                  placeholder="Location"
                  value={searchFilters.location}
                  onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
                  className="text-gray-900"
                />
                <Select value={searchFilters.type} onValueChange={(value) => setSearchFilters({...searchFilters, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => navigate('/jobs')} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 mr-2" />
                  Search Jobs
                </Button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">{jobs.filter(j => j.status === 'active').length}+</div>
                <div className="text-blue-100">Active Jobs</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{companies.length}+</div>
                <div className="text-blue-100">Companies</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{candidates.length}k+</div>
                <div className="text-blue-100">Candidates</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Jobs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => {
                const company = companies.find(c => c.id === job.companyId);
                return (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={company?.logo} />
                            <AvatarFallback>{company?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            <p className="text-sm text-gray-600">{company?.name}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="capitalize">{job.type}</Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.postedDate}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {job.keywords.slice(0, 3).map((keyword) => (
                          <Badge key={keyword} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="w-full"
                        variant="outline"
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Button onClick={() => navigate('/jobs')} size="lg">
                View All Jobs
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Top Companies */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Top Companies</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {companies.slice(0, 4).map((company) => (
                <Card key={company.id} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src={company.logo} />
                      <AvatarFallback className="text-2xl">{company.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg mb-2">{company.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{company.industry}</p>
                    <div className="text-sm text-gray-500">
                      {company.jobs} open positions
                    </div>
                    <Button 
                      onClick={() => navigate(`/companies/${company.slug}`)}
                      className="mt-4"
                      variant="outline"
                      size="sm"
                    >
                      View Company
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  };

  const JobSearchPage = () => {
    const navigate = useNavigate();
    const filteredJobs = getFilteredJobs();
    const candidate = candidates.find(c => c.userId === currentUser?.id);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Keyword</Label>
                    <Input
                      placeholder="Job title, skills..."
                      value={searchFilters.keyword}
                      onChange={(e) => setSearchFilters({...searchFilters, keyword: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label>Location</Label>
                    <Input
                      placeholder="City, state, or remote"
                      value={searchFilters.location}
                      onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label>Job Type</Label>
                    <Select value={searchFilters.type} onValueChange={(value) => setSearchFilters({...searchFilters, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Industry</Label>
                    <Select value={searchFilters.industry} onValueChange={(value) => setSearchFilters({...searchFilters, industry: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="All industries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All industries</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                        <SelectItem value="Design & Creative">Design & Creative</SelectItem>
                        <SelectItem value="Financial Services">Financial Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Salary Range</Label>
                    <div className="px-2 py-4">
                      <Slider
                        value={searchFilters.salaryRange}
                        onValueChange={(value) => setSearchFilters({...searchFilters, salaryRange: value})}
                        max={200000}
                        min={0}
                        step={10000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>${searchFilters.salaryRange[0].toLocaleString()}</span>
                        <span>${searchFilters.salaryRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setSearchFilters({ keyword: '', location: '', type: '', salaryRange: [0, 200000], industry: '' })}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>

              {/* Recommended Jobs for Candidates */}
              {candidate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Recommended for You
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getRecommendedJobs(candidate.id).slice(0, 3).map((job) => {
                        const company = companies.find(c => c.id === job.companyId);
                        return (
                          <div key={job.id} className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/jobs/${job.id}`)}>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">{job.title}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {job.matchScore}% match
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">{company?.name}</p>
                            <p className="text-xs text-gray-500">{job.location}</p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Job Results */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {filteredJobs.length} Jobs Found
                </h1>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="date">Most Recent</SelectItem>
                    <SelectItem value="salary">Highest Salary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredJobs.map((job) => {
                  const company = companies.find(c => c.id === job.companyId);
                  const isApplied = applications.some(app => app.jobId === job.id && app.candidateId === candidate?.id);
                  const isSaved = candidate?.savedJobs.includes(job.id);

                  return (
                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={company?.logo} />
                              <AvatarFallback>{company?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                                  <p className="text-lg text-gray-700 mb-2">{company?.name}</p>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  {candidate && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const updatedCandidates = candidates.map(c => 
                                          c.id === candidate.id 
                                            ? {
                                                ...c, 
                                                savedJobs: isSaved 
                                                  ? c.savedJobs.filter(id => id !== job.id)
                                                  : [...c.savedJobs, job.id]
                                              }
                                            : c
                                        );
                                        setCandidates(updatedCandidates);
                                        toast({
                                          title: isSaved ? "Job unsaved" : "Job saved",
                                          description: isSaved ? "Removed from saved jobs" : "Added to saved jobs"
                                        });
                                      }}
                                    >
                                      <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                                    </Button>
                                  )}
                                  <Badge variant="secondary" className="capitalize">{job.type}</Badge>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                              
                              <div className="mb-4">
                                <p className="text-gray-700 line-clamp-2">
                                  {job.description.replace(/[#*]/g, '').substring(0, 150)}...
                                </p>
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                {job.keywords.slice(0, 5).map((keyword) => (
                                  <Badge key={keyword} variant="outline" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <Eye className="h-4 w-4 mr-1" />
                                    {job.views} views
                                  </span>
                                  <span className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    {job.applications} applicants
                                  </span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => navigate(`/jobs/${job.id}`)}
                                  >
                                    View Details
                                  </Button>
                                  
                                  {candidate && !isApplied && (
                                    <Button
                                      onClick={() => {
                                        if (candidate.cvs.length === 0) {
                                          toast({
                                            title: "No CV uploaded",
                                            description: "Please upload a CV before applying to jobs.",
                                            variant: "destructive"
                                          });
                                          return;
                                        }
                                        applyToJob(job.id, candidate.cvs.find(cv => cv.isDefault)?.id || candidate.cvs[0].id);
                                      }}
                                    >
                                      Apply Now
                                    </Button>
                                  )}
                                  
                                  {isApplied && (
                                    <Button disabled variant="secondary">
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Applied
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const JobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const job = jobs.find(j => j.id === id);
    const company = job ? companies.find(c => c.id === job.companyId) : null;
    const employer = job ? users.find(u => u.id === job.employerId) : null;
    const candidate = candidates.find(c => c.userId === currentUser?.id);
    const isApplied = applications.some(app => app.jobId === job?.id && app.candidateId === candidate?.id);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedCvId, setSelectedCvId] = useState('');
    const [coverLetter, setCoverLetter] = useState('');

    if (!job || !company) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
            <Button onClick={() => navigate('/jobs')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </div>
        </div>
      );
    }

    const handleApply = () => {
      if (!selectedCvId) {
        toast({
          title: "Please select a CV",
          description: "You must select a CV to apply for this job.",
          variant: "destructive"
        });
        return;
      }
      
      applyToJob(job.id, selectedCvId, coverLetter);
      setShowApplyModal(false);
      setSelectedCvId('');
      setCoverLetter('');
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={company.logo} />
                        <AvatarFallback className="text-2xl">{company.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                        <p className="text-xl text-gray-700 mb-2">{company.name}</p>
                        <div className="flex items-center space-x-4 text-gray-600">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary}
                          </span>
                          <Badge variant="secondary" className="capitalize">{job.type}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                      {candidate && (
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 mt-4">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Posted {job.postedDate}
                    </span>
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {job.views} views
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {job.applications} applicants
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                      <Markdown content={job.description} />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <h4 className="text-lg font-medium w-full mb-2">Required Skills</h4>
                      {job.keywords.map((keyword) => (
                        <Badge key={keyword} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Application Actions */}
              <Card>
                <CardContent className="p-6">
                  {candidate && !isApplied ? (
                    <Button 
                      onClick={() => setShowApplyModal(true)}
                      className="w-full mb-4"
                      size="lg"
                    >
                      Apply for this Job
                    </Button>
                  ) : isApplied ? (
                    <Button disabled className="w-full mb-4" size="lg">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Application Submitted
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setShowLogin(true)}
                      className="w-full mb-4"
                      size="lg"
                    >
                      Login to Apply
                    </Button>
                  )}
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Applicants</span>
                      <span className="font-medium">{job.applications}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Job Type</span>
                      <span className="font-medium capitalize">{job.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Posted</span>
                      <span className="font-medium">{job.postedDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle>About {company.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-700 text-sm mb-4">
                        {company.description.replace(/[#*]/g, '').substring(0, 150)}...
                      </p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Industry</span>
                        <span className="font-medium">{company.industry}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Company Size</span>
                        <span className="font-medium">{company.size}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Location</span>
                        <span className="font-medium">{company.headquarters}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/companies/${company.slug}`)}
                        className="flex-1"
                      >
                        View Company
                      </Button>
                      <Button variant="outline" size="sm">
                        <Globe className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recruiter Info */}
              {employer && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recruiter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar>
                        <AvatarImage src={employer.avatar} />
                        <AvatarFallback>{employer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{employer.name}</p>
                        <p className="text-sm text-gray-600">HR Manager</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate(`/recruiters/${employer.id}`)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Recruiter
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Similar Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle>Similar Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {jobs
                      .filter(j => j.id !== job.id && j.status === 'active' && j.companyId === job.companyId)
                      .slice(0, 3)
                      .map((similarJob) => (
                        <div 
                          key={similarJob.id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => navigate(`/jobs/${similarJob.id}`)}
                        >
                          <h4 className="font-medium text-sm mb-1">{similarJob.title}</h4>
                          <p className="text-xs text-gray-600 mb-2">{similarJob.location}</p>
                          <p className="text-xs text-gray-500">{similarJob.salary}</p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Apply for {job.title}</DialogTitle>
              <DialogDescription>
                Submit your application to {company.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Select CV</Label>
                <RadioGroup value={selectedCvId} onValueChange={setSelectedCvId}>
                  {candidate?.cvs.map((cv) => (
                    <div key={cv.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value={cv.id} id={cv.id} />
                      <Label htmlFor={cv.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{cv.name}</p>
                            <p className="text-sm text-gray-600">Uploaded {cv.uploadedAt}</p>
                          </div>
                          {cv.isDefault && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="coverLetter" className="text-base font-medium mb-3 block">
                  Cover Letter (Optional)
                </Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Tell the employer why you're interested in this position..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowApplyModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleApply}>
                  Submit Application
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  const CompanyProfilePage = () => {
    const { slug } = useParams();
    const company = companies.find(c => c.slug === slug);
    const companyJobs = jobs.filter(j => j.companyId === company?.id && j.status === 'active');
    const candidate = candidates.find(c => c.userId === currentUser?.id);
    const isFollowing = candidate?.followedCompanies.includes(company?.id || '');
    const isCompanyMember = currentUser?.companyId === company?.id;
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState<Company>(
      company ?? {
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
        jobs: 0,
        members: [],
        socialLinks: {}
      }
    );
    const navigate = useNavigate();

    if (!company) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Company not found</h2>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      );
    }

    const toggleFollow = () => {
      if (!candidate) return;
      
      const updatedCandidates = candidates.map(c => 
        c.id === candidate.id 
          ? {
              ...c, 
              followedCompanies: isFollowing 
                ? c.followedCompanies.filter(id => id !== company.id)
                : [...c.followedCompanies, company.id]
            }
          : c
      );
      setCandidates(updatedCandidates);
      
      setCompanies(companies.map(c => 
        c.id === company.id 
          ? { ...c, followers: isFollowing ? c.followers - 1 : c.followers + 1 }
          : c
      ));
      
      toast({
        title: isFollowing ? "Unfollowed company" : "Following company",
        description: isFollowing ? "Removed from your followed companies" : "Added to your followed companies"
      });
    };

    const saveCompanyEdit = () => {
      setCompanies(companies.map(c => 
        c.id === company.id ? { ...c, ...editForm } : c
      ));
      setEditMode(false);
      toast({
        title: "Company updated",
        description: "Company information has been updated successfully."
      });
    };

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
                        <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)}>
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
                                {job.description.replace(/[#*]/g, '').substring(0, 120)}...
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
                      {[
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
                      ].map((review) => (
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
              <Card>
                <CardHeader>
                  <CardTitle>Similar Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {companies
                      .filter(c => c.id !== company.id && c.industry === company.industry)
                      .slice(0, 3)
                      .map((similarCompany) => (
                        <div 
                          key={similarCompany.id}
                          className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => navigate(`/companies/${similarCompany.slug}`)}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={similarCompany.logo} />
                            <AvatarFallback>{similarCompany.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{similarCompany.name}</p>
                            <p className="text-xs text-gray-600">{similarCompany.industry}</p>
                            <p className="text-xs text-gray-500">{similarCompany.jobs} jobs</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CandidateProfilePage = () => {
    const { candidateId } = useParams();
    const navigate = useNavigate();
    
    // Nếu không có candidateId (trang /candidate/profile) thì hiển thị trang hồ sơ của chính ứng viên
    if (!candidateId) {
      return <CandidateProfile />;
    }
    
    const targetCandidate = candidates.find(c => c.id === candidateId || c.userId === candidateId);
    const targetUser = targetCandidate ? users.find(u => u.id === targetCandidate.userId) : null;
    const isOwnProfile = currentUser?.id === targetUser?.id;
    const [editMode, setEditMode] = useState(false);
    const [showCVModal, setShowCVModal] = useState(false);
    const [selectedCV, setSelectedCV] = useState<CV | null>(null);
    const [showCVUpload, setShowCVUpload] = useState(false);
    
    // If it's the user's own profile, show the detailed profile component
    if (isOwnProfile) {
      return <CandidateProfile />;
    }
    const [showAITools, setShowAITools] = useState(false);

    if (!targetCandidate || !targetUser) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Candidate not found</h2>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      );
    }

    const handleCVUpload = (file: File) => {
      const newCV: CV = {
        id: `cv${targetCandidate.cvs.length + 1}`,
        name: file.name,
        uploadedAt: new Date().toISOString().split('T')[0],
        contentMarkdown: `# ${targetUser.name}\n\n## Experience\n- Sample work experience\n\n## Skills\n- ${targetCandidate.skills.join('\n- ')}`,
        isDefault: targetCandidate.cvs.length === 0,
        fileName: file.name,
        type: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.docx') ? 'docx' : 'md'
      };

      setCandidates(candidates.map(c => 
        c.id === targetCandidate.id 
          ? { ...c, cvs: [...c.cvs, newCV] }
          : c
      ));

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
            <Button variant="ghost" onClick={() => navigate(-1)}>
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
  };

  const PipelinePage = () => {
    const userApplications = applications.filter(app => {
      const job = jobs.find(j => j.id === app.jobId);
      return job?.employerId === currentUser?.id;
    });

    const columns = ['New', 'Screening', 'Interview', 'Offer', 'Hired'] as const;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Recruitment Pipeline</h1>
            <p className="text-gray-600 mt-2">Manage your candidates through the hiring process</p>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {columns.map((column) => {
                const columnApplications = userApplications.filter(app => app.status === column);
                
                return (
                  <div key={column} className="bg-white rounded-lg border">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900">{column}</h3>
                      <span className="text-sm text-gray-600">{columnApplications.length} candidates</span>
                    </div>
                    
                    <Droppable droppableId={column}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`p-4 min-h-[500px] ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                        >
                          {columnApplications.map((app, index) => {
                            const candidate = candidates.find(c => c.id === app.candidateId);
                            const user = candidate ? users.find(u => u.id === candidate.userId) : null;
                            const job = jobs.find(j => j.id === app.jobId);
                            
                            if (!candidate || !user || !job) return null;
                            
                            return (
                              <Draggable key={app.id} draggableId={app.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`bg-white border rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                                      snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                                    }`}
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
                                    
                                    <div className="flex space-x-1 mt-3">
                                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                                        View
                                      </Button>
                                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                                        Message
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                          
                          {columnApplications.length === 0 && (
                            <div className="text-center py-8 text-gray-400">
                              <Users className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-sm">No candidates</p>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </div>
      </div>
    );
  };

  const PostJobPage = () => {
    const userCompany = companies.find(c => c.id === currentUser?.companyId);
    const [showPreview, setShowPreview] = useState(false);

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
                      onValueChange={(value) => setJobForm({...jobForm, type: value as any})}
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
  };

  const ChatbotPage = () => {
    const chatType = currentUser?.role === 'candidate' ? 'candidate' : 'recruiter';

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {chatType === 'candidate' ? 'Career Assistant' : 'Recruiting Assistant'}
            </h1>
            <p className="text-gray-600 mt-2">
              {chatType === 'candidate' 
                ? 'Get personalized advice for your career growth'
                : 'Get help with recruiting and hiring strategies'
              }
            </p>
          </div>

          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>AI Assistant</CardTitle>
                  <CardDescription>
                    {chatType === 'candidate' ? 'Your personal career advisor' : 'Your recruiting expert'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-auto p-6">
              <div className="space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Start a conversation
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {chatType === 'candidate' 
                        ? 'Ask me about CV improvements, interview tips, job search strategies, or career advice.'
                        : 'Ask me about writing job descriptions, candidate screening, interview techniques, or hiring best practices.'
                      }
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {chatType === 'candidate' ? [
                        "How can I improve my CV?",
                        "Tips for job interviews?",
                        "Help me find relevant jobs",
                        "Career transition advice"
                      ] : [
                        "How to write effective job descriptions?",
                        "Best practices for candidate screening",
                        "Interview question suggestions",
                        "Strategies to attract top talent"
                      ].map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          size="sm"
                          onClick={() => sendChatMessage(suggestion, chatType)}
                          className="text-left"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-600'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Ask your ${chatType === 'candidate' ? 'career' : 'recruiting'} question...`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && chatInput.trim()) {
                      sendChatMessage(chatInput, chatType);
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (chatInput.trim()) {
                      sendChatMessage(chatInput, chatType);
                    }
                  }}
                  disabled={!chatInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const AdminDashboard = () => {
    const pendingJobs = jobs.filter(j => j.status === 'draft');
    const pendingReports = violationReports.filter(r => r.status === 'pending');

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage platform content and monitor system health</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {jobs.filter(j => j.status === 'active').length}
                    </p>
                  </div>
                  <Briefcase className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Companies</p>
                    <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingReports.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pending Job Approvals */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Job Approvals</CardTitle>
                <CardDescription>Jobs waiting for admin approval</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingJobs.length > 0 ? (
                  <div className="space-y-4">
                    {pendingJobs.slice(0, 5).map((job) => {
                      const company = companies.find(c => c.id === job.companyId);
                      return (
                        <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{job.title}</h4>
                            <p className="text-sm text-gray-600">{company?.name}</p>
                            <p className="text-xs text-gray-500">Posted {job.postedDate}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => approveJob(job.id)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No pending job approvals</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Violation Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Violation Reports</CardTitle>
                <CardDescription>Recent user reports that need attention</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingReports.length > 0 ? (
                  <div className="space-y-4">
                    {pendingReports.slice(0, 5).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{report.reason}</h4>
                          <p className="text-sm text-gray-600">
                            {report.targetType} reported • {report.createdAt}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setViolationReports(violationReports.map(r => 
                                r.id === report.id ? { ...r, status: 'resolved' } : r
                              ));
                              toast({
                                title: "Report resolved",
                                description: "The violation report has been marked as resolved."
                              });
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setViolationReports(violationReports.map(r => 
                                r.id === report.id ? { ...r, status: 'dismissed' } : r
                              ));
                              toast({
                                title: "Report dismissed",
                                description: "The violation report has been dismissed."
                              });
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No pending reports</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Analytics Chart */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>User activity and growth metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="subscriptions" fill="#8884d8" name="New Users" />
                    <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const RevenuePage = () => {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Revenue Management</h1>
            <p className="text-gray-600 mt-2">Monitor revenue, subscriptions, and financial metrics</p>
          </div>

          {/* Revenue Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">$130,000</p>
                    <p className="text-sm text-green-600">+12% from last month</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                    <p className="text-2xl font-bold text-gray-900">1,250</p>
                    <p className="text-sm text-green-600">+8% from last month</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Refunds</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${refundRequests.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0)}
                    </p>
                    <p className="text-sm text-orange-600">{refundRequests.filter(r => r.status === 'pending').length} requests</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">MRR</p>
                    <p className="text-2xl font-bold text-gray-900">$28,500</p>
                    <p className="text-sm text-green-600">+15% from last month</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Plan Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockPlanData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockPlanData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Paying Customers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Paying Customers</CardTitle>
              <CardDescription>Highest revenue generating users and companies</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Monthly Revenue</TableHead>
                    <TableHead>Total Paid</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.filter(u => u.role === 'employer').slice(0, 5).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.subscription.plan === 'Premium' ? 'default' : 'secondary'}>
                          {user.subscription.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        ${user.subscription.plan === 'Premium' ? '99' : user.subscription.plan === 'Standard' ? '49' : '0'}
                      </TableCell>
                      <TableCell>
                        ${Math.floor(Math.random() * 5000) + 500}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600">Active</Badge>
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

  const RefundPage = () => {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Refund Management</h1>
            <p className="text-gray-600 mt-2">Review and process refund requests</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Refund Requests</CardTitle>
              <CardDescription>
                {refundRequests.filter(r => r.status === 'pending').length} pending requests
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
                    const user = users.find(u => u.id === request.userId);
                    return (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user?.avatar} />
                              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user?.name}</p>
                              <p className="text-sm text-gray-600">{user?.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.plan}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">${request.amount}</TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm text-gray-700 truncate" title={request.reason}>
                            {request.reason}
                          </p>
                        </TableCell>
                        <TableCell>{request.requestedAt}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === 'approved' ? 'default' :
                              request.status === 'denied' ? 'destructive' : 'secondary'
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setRefundRequests(refundRequests.map(r => 
                                    r.id === request.id ? { ...r, status: 'approved' } : r
                                  ));
                                  toast({
                                    title: "Refund approved",
                                    description: `$${request.amount} refund approved for ${user?.name}.`
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
                                  setRefundRequests(refundRequests.map(r => 
                                    r.id === request.id ? { ...r, status: 'denied' } : r
                                  ));
                                  toast({
                                    title: "Refund denied",
                                    description: `Refund request denied for ${user?.name}.`
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

  const SubscriptionPage = () => {
    const [selectedPlan, setSelectedPlan] = useState(currentUser?.subscription.plan || 'Free');

    const plans = [
      {
        name: 'Free',
        price: 0,
        features: ['3 job applications per month', 'Basic profile', 'Email support'],
        popular: false
      },
      {
        name: 'Standard',
        price: 29,
        features: ['20 job applications per month', 'Enhanced profile', 'Priority support', 'CV analysis'],
        popular: true
      },
      {
        name: 'Premium',
        price: 99,
        features: ['Unlimited applications', 'Premium profile badge', '24/7 support', 'AI career coach', 'Direct recruiter contact'],
        popular: false
      }
    ];

    const employerPlans = [
      {
        name: 'Free',
        price: 0,
        features: ['1 job posting', 'Basic analytics', 'Email support'],
        popular: false
      },
      {
        name: 'Standard',
        price: 199,
        features: ['10 job postings', 'Advanced analytics', 'Priority support', 'Candidate search'],
        popular: true
      },
      {
        name: 'Premium',
        price: 499,
        features: ['Unlimited job postings', 'Premium analytics', '24/7 support', 'AI recruiting tools', 'Featured company profile'],
        popular: false
      }
    ];

    const currentPlans = currentUser?.role === 'employer' ? employerPlans : plans;

    const upgradePlan = (planName: string) => {
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          subscription: {
            ...currentUser.subscription,
            plan: planName as any,
            expiresAt: '2024-12-31'
          }
        };
        setCurrentUser(updatedUser);
        setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
        
        toast({
          title: "Subscription updated",
          description: `Successfully upgraded to ${planName} plan.`
        });
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Subscription & Billing</h1>
            <p className="text-gray-600 mt-2">Manage your subscription plan and billing information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Subscription */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="bg-blue-100 p-4 rounded-lg mb-4">
                      <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                      <h3 className="text-2xl font-bold text-gray-900">{currentUser?.subscription.plan}</h3>
                      <p className="text-gray-600">Current Plan</p>
                    </div>
                    
                    {currentUser?.subscription.expiresAt && (
                      <p className="text-sm text-gray-600 mb-4">
                        Expires: {currentUser.subscription.expiresAt}
                      </p>
                    )}
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Applications</span>
                        <span>{currentUser?.subscription.plan === 'Premium' ? 'Unlimited' : 
                               currentUser?.subscription.plan === 'Standard' ? '20/month' : '3/month'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Support</span>
                        <span>{currentUser?.subscription.plan === 'Premium' ? '24/7' : 
                               currentUser?.subscription.plan === 'Standard' ? 'Priority' : 'Email'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: '2024-01-01', plan: 'Standard', amount: 29, status: 'paid' },
                      { date: '2023-12-01', plan: 'Standard', amount: 29, status: 'paid' },
                      { date: '2023-11-01', plan: 'Free', amount: 0, status: 'paid' },
                    ].map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{record.plan}</p>
                          <p className="text-xs text-gray-600">{record.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${record.amount}</p>
                          <Badge variant="outline" className="text-xs">
                            {record.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Available Plans */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Plans</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentPlans.map((plan) => (
                  <Card key={plan.name} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-600">Most Popular</Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold text-gray-900">
                        ${plan.price}
                        <span className="text-base font-normal text-gray-600">/month</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button
                        onClick={() => upgradePlan(plan.name)}
                        disabled={currentUser?.subscription.plan === plan.name}
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {currentUser?.subscription.plan === plan.name ? 'Current Plan' : 
                         plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">Need a custom plan for your organization?</p>
                <Button variant="outline">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============== MISSING PAGES IMPLEMENTATION ==============

  const CandidateApplicationsPage = () => {
    const navigate = useNavigate();
    const candidateApplications = applications.filter(app => app.candidateId === currentUser?.id);
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-600 mt-2">Track your job applications and their status</p>
          </div>

          <div className="grid gap-6">
            {candidateApplications.map((application) => {
              const job = jobs.find(j => j.id === application.jobId);
              if (!job) return null;
              
              return (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div>
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <p className="text-gray-600">{job.company} • {job.location}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Applied Date</p>
                            <p className="font-medium">{application.appliedDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <Badge variant={
                              application.status === 'Hired' ? 'default' :
                              application.status === 'Rejected' ? 'destructive' :
                              application.status === 'Offer' ? 'default' :
                              'secondary'
                            }>
                              {application.status}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Salary</p>
                            <p className="font-medium">{job.salary}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Type</p>
                            <p className="font-medium">{job.type}</p>
                          </div>
                        </div>
                        
                        {application.notes && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">Recruiter Feedback</p>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{application.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Job
                        </Button>
                        {application.status === 'New' && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => {
                              const updatedApplications = applications.map(app =>
                                app.id === application.id ? { ...app, status: 'Withdrawn' as const } : app
                              );
                              setApplications(updatedApplications);
                              toast({
                                title: "Application withdrawn",
                                description: "You have successfully withdrawn your application."
                              });
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Withdraw
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {candidateApplications.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600 mb-4">Start applying to jobs to see them here</p>
                  <Button onClick={() => navigate('/jobs')}>
                    Browse Jobs
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CandidateInterviewsPage = () => {
    const navigate = useNavigate();
    const candidateInterviews = interviews.filter(interview => interview.candidateId === currentUser?.id);
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Interviews</h1>
            <p className="text-gray-600 mt-2">Manage your upcoming and past interviews</p>
          </div>

          <div className="grid gap-6">
            {candidateInterviews.map((interview) => {
              const job = jobs.find(j => j.id === interview.jobId);
              if (!job) return null;
              
              return (
                <Card key={interview.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div>
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <p className="text-gray-600">{job.company}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{interview.date}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-medium">{interview.time}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Type</p>
                            <Badge variant="outline">{interview.type}</Badge>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <Badge variant={
                              interview.status === 'completed' ? 'default' :
                              interview.status === 'cancelled' ? 'destructive' :
                              'secondary'
                            }>
                              {interview.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {interview.status === 'scheduled' && (
                          <Button size="sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            Add to Calendar
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message Recruiter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {candidateInterviews.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews scheduled</h3>
                  <p className="text-gray-600">Interviews will appear here once scheduled by recruiters</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  const SavedJobsPage = () => {
    const navigate = useNavigate();
    const savedJobIds = currentUser?.savedJobs || [];
    const savedJobs = jobs.filter(job => savedJobIds.includes(job.id));
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
            <p className="text-gray-600 mt-2">Jobs you've bookmarked for later</p>
          </div>

          <div className="grid gap-6">
            {savedJobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div>
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          <p className="text-gray-600">{job.company} • {job.location}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Salary</p>
                          <p className="font-medium">{job.salary}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Type</p>
                          <Badge variant="outline">{job.type}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Posted</p>
                          <p className="font-medium">{job.postedDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Applications</p>
                          <p className="font-medium">{job.applications}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{job.description.substring(0, 200)}...</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Job
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          if (currentUser) {
                            const updatedUser = {
                              ...currentUser,
                              savedJobs: currentUser.savedJobs?.filter(id => id !== job.id) || []
                            };
                            setCurrentUser(updatedUser);
                            setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
                            toast({
                              title: "Job removed",
                              description: "Job removed from saved list."
                            });
                          }
                        }}
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Unsave
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {savedJobs.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs</h3>
                  <p className="text-gray-600 mb-4">Save jobs you're interested in to access them quickly later</p>
                  <Button onClick={() => navigate('/jobs')}>
                    Browse Jobs
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  const MessagesPage = () => {
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    
    // Mock conversations
    const conversations = [
      {
        id: '1',
        participantId: 'recruiter-1',
        participantName: 'Sarah Johnson',
        participantRole: 'HR Manager at TechCorp',
        lastMessage: 'Hi! I saw your application for the Frontend Developer position...',
        timestamp: '2024-01-15 10:30',
        unread: 2
      },
      {
        id: '2',
        participantId: 'recruiter-2',
        participantName: 'Mike Chen',
        participantRole: 'Recruiter at DataSoft',
        lastMessage: 'Thanks for your interest! When would be a good time for an interview?',
        timestamp: '2024-01-14 16:45',
        unread: 0
      }
    ];

    const messages = selectedConversation ? [
      {
        id: '1',
        senderId: 'recruiter-1',
        content: 'Hi! I saw your application for the Frontend Developer position. Your profile looks great!',
        timestamp: '2024-01-15 10:30',
        isFromMe: false
      },
      {
        id: '2',
        senderId: currentUser?.id || '',
        content: 'Thank you! I\'m very interested in the position.',
        timestamp: '2024-01-15 10:32',
        isFromMe: true
      },
      {
        id: '3',
        senderId: 'recruiter-1',
        content: 'Would you be available for a phone interview this week?',
        timestamp: '2024-01-15 10:35',
        isFromMe: false
      }
    ] : [];

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-2">Communicate with recruiters and candidates</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border h-[600px] flex">
            {/* Conversations List */}
            <div className="w-1/3 border-r">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Conversations</h2>
              </div>
              
              <div className="overflow-y-auto h-full">
                {conversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{conversation.participantName}</h3>
                        <p className="text-sm text-gray-600">{conversation.participantRole}</p>
                        <p className="text-sm text-gray-500 mt-1 truncate">{conversation.lastMessage}</p>
                        <p className="text-xs text-gray-400 mt-1">{conversation.timestamp}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge className="bg-blue-600">{conversation.unread}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          {conversations.find(c => c.id === selectedConversation)?.participantName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {conversations.find(c => c.id === selectedConversation)?.participantRole}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id}
                        className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isFromMe 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-900'
                        }`}>
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.isFromMe ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            setNewMessage('');
                            toast({
                              title: "Message sent",
                              description: "Your message has been sent successfully."
                            });
                          }
                        }}
                      />
                      <Button>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EmployerJobsPage = () => {
    const navigate = useNavigate();
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const employerJobs = jobs.filter(job => job.company === currentUser?.company);

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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
              <p className="text-gray-600 mt-2">Manage your job postings</p>
            </div>
            <Button onClick={() => navigate('/employer/post-job')}>
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
                          const updatedJobs = jobs.filter(j => j.id !== job.id);
                          setJobs(updatedJobs);
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
                  <Button onClick={() => navigate('/employer/post-job')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Post Your First Job
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <JobEditDialog 
          job={editingJob as any}
          open={!!editingJob}
          onOpenChange={(open) => !open && setEditingJob(null)}
          onSave={handleSaveJob as any}
        />
      </div>
    );
  };

  const CandidateSearchPage = () => {
    const navigate = useNavigate();
    const [searchFilters, setSearchFilters] = useState({
      skills: '',
      location: '',
      experience: '',
      education: ''
    });
    
    const filteredCandidates = users.filter(user => 
      user.role === 'candidate' &&
      (searchFilters.skills === '' || user.skills?.some(skill => 
        skill.toLowerCase().includes(searchFilters.skills.toLowerCase())
      )) &&
      (searchFilters.location === '' || user.location?.toLowerCase().includes(searchFilters.location.toLowerCase()))
    );

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Candidate Search</h1>
            <p className="text-gray-600 mt-2">Find and connect with talented candidates</p>
          </div>

          {/* Search Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="skills">Skills</Label>
                  <Input
                    id="skills"
                    value={searchFilters.skills}
                    onChange={(e) => setSearchFilters({...searchFilters, skills: e.target.value})}
                    placeholder="e.g., React, JavaScript"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={searchFilters.location}
                    onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
                    placeholder="e.g., San Francisco"
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Select value={searchFilters.experience} onValueChange={(value) => setSearchFilters({...searchFilters, experience: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All levels</SelectItem>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior Level (6+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="education">Education</Label>
                  <Select value={searchFilters.education} onValueChange={(value) => setSearchFilters({...searchFilters, education: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All education</SelectItem>
                      <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidates List */}
          <div className="grid gap-6">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{candidate.name}</h3>
                          <Badge variant="outline">
                            {Math.floor(Math.random() * 30 + 70)}% Match
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-2">{candidate.title || 'Software Developer'}</p>
                        <p className="text-gray-600 mb-3">{candidate.location || 'San Francisco, CA'}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(candidate.skills || ['React', 'JavaScript', 'Node.js']).slice(0, 5).map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                        
                        <p className="text-gray-700 text-sm">
                          {candidate.bio || 'Experienced software developer with a passion for creating innovative solutions...'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/candidates/${candidate.id}`)}
                      >
                        <User className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                      <Button size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredCandidates.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
                  <p className="text-gray-600">Try adjusting your search filters to find more candidates</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  const EmployerInterviewsPage = () => {
    const navigate = useNavigate();
    const employerInterviews = interviews.filter(interview => {
      const job = jobs.find(j => j.id === interview.jobId);
      return job && job.company === currentUser?.company;
    });
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
              <p className="text-gray-600 mt-2">Manage interview schedules and feedback</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          </div>

          <div className="grid gap-6">
            {employerInterviews.map((interview) => {
              const job = jobs.find(j => j.id === interview.jobId);
              const candidate = users.find(u => u.id === interview.candidateId);
              if (!job || !candidate) return null;
              
              return (
                <Card key={interview.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold">{candidate.name}</h3>
                          <p className="text-gray-600">{job.title}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                              <p className="text-sm text-gray-500">Date</p>
                              <p className="font-medium">{interview.date}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Time</p>
                              <p className="font-medium">{interview.time}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Type</p>
                              <Badge variant="outline">{interview.type}</Badge>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Status</p>
                              <Badge variant={
                                interview.status === 'completed' ? 'default' :
                                interview.status === 'cancelled' ? 'destructive' :
                                'secondary'
                              }>
                                {interview.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Reschedule
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        {interview.status === 'completed' && (
                          <Button size="sm">
                            <Star className="h-4 w-4 mr-1" />
                            Rate Candidate
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {employerInterviews.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews scheduled</h3>
                  <p className="text-gray-600">Interviews will appear here once you schedule them with candidates</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  const EmployerAnalyticsPage = () => {
    const navigate = useNavigate();
    const employerJobs = jobs.filter(job => job.company === currentUser?.company);
    const totalApplications = employerJobs.reduce((sum, job) => sum + job.applications, 0);
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your recruitment performance and insights</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{employerJobs.filter(j => j.status === 'active').length}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Scheduled Interviews</p>
                    <p className="text-2xl font-bold text-gray-900">{interviews.filter(i => i.status === 'scheduled').length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">68%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <BarChart3 className="h-16 w-16 mr-4" />
                  <div>
                    <p className="font-medium">Applications per week</p>
                    <p className="text-sm">Mock chart: 45% increase this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employerJobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-gray-600">{job.applications} applications</p>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(job.applications * 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const RecruiterProfilePage = () => {
    const navigate = useNavigate();
    const { recruiterId } = useParams();
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
        const updatedUser = { ...currentUser, ...editForm };
        setCurrentUser(updatedUser);
        setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
        setIsEditing(false);
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated."
        });
      }
    };

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
                          <Button variant="outline" size="sm">
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
                    {jobs.filter(j => j.company === recruiter.company).length}
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
                  {jobs.filter(j => j.company === recruiter.company).slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.location} • {job.type}</p>
                        <p className="text-sm text-gray-500">{job.applications} applications</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/jobs/${job.id}`)}>
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
  };

  // ============== ADMIN PAGES ==============

  const AdminUsersPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [editingUser, setEditingUser] = useState<User | null>(null);
    
    const filteredUsers = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });

    const handleSaveUser = (updatedUser: User) => {
      const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
      setUsers(updatedUsers);
      setEditingUser(null);
      toast({
        title: "User updated",
        description: "User information has been updated successfully."
      });
    };
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="candidate">Candidates</SelectItem>
                  <SelectItem value="employer">Employers</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                          {user.status || 'active'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.joinedDate || '2024-01-01'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingUser(user as any)}>
                             <Edit className="h-4 w-4" />
                           </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => {
                              const updatedUsers = users.map(u => 
                                u.id === user.id 
                                  ? ({ ...u, status: (u.status === 'active' ? 'banned' : 'active') as 'active' | 'banned' } as User)
                                  : u
                              );
                              setUsers(updatedUsers);
                              toast({
                                title: `User ${user.status === 'active' ? 'banned' : 'activated'}`,
                                description: `${user.name} has been ${user.status === 'active' ? 'banned' : 'activated'}.`
                              });
                            }}
                          >
                            {user.status === 'active' ? 'Ban' : 'Unban'}
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
        
        <UserEditDialog 
          user={editingUser as any}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          onSave={handleSaveUser as any}
        />
      </div>
    );
  };

  const AdminContentPage = () => {
    const [pendingJobs] = useState(jobs.filter(j => j.status === 'draft'));
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-2">Review and approve content before publication</p>
          </div>

          <div className="space-y-6">
            {/* Pending Job Approvals */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Job Approvals ({pendingJobs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingJobs.length > 0 ? (
                  <div className="space-y-4">
                    {pendingJobs.map((job) => (
                      <div key={job.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            <p className="text-gray-600">{job.company} • {job.location}</p>
                            <p className="text-gray-700 mt-2">{job.description.substring(0, 200)}...</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">Salary: {job.salary}</Badge>
                              <Badge variant="outline">{job.type}</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const updatedJobs = jobs.map(j => 
                                  j.id === job.id ? { ...j, status: 'active' as const } : j
                                );
                                setJobs(updatedJobs);
                                toast({
                                  title: "Job approved",
                                  description: "Job posting has been approved and is now live."
                                });
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                const updatedJobs = jobs.filter(j => j.id !== job.id);
                                setJobs(updatedJobs);
                                toast({
                                  title: "Job rejected",
                                  description: "Job posting has been rejected and removed."
                                });
                              }}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No pending job approvals</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Content Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{jobs.filter(j => j.status === 'active').length}</p>
                    <p className="text-gray-600">Active Jobs</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{pendingJobs.length}</p>
                    <p className="text-gray-600">Pending Reviews</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
                    <p className="text-gray-600">Companies</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'candidate').length}</p>
                    <p className="text-gray-600">Candidates</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AdminJobsPage = () => {
    const [editingJob, setEditingJob] = useState<Job | null>(null);

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
                          <Button variant="outline" size="sm" onClick={() => setEditingJob(job)}>
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
          onOpenChange={(open) => !open && setEditingJob(null)}
          onSave={handleSaveJob as any}
        />
      </div>
    );
  };

  const AdminCompaniesPage = () => {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Companies Management</h1>
            <p className="text-gray-600 mt-2">Manage company profiles and verifications</p>
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
                            <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{company.name}</p>
                            <p className="text-sm text-gray-600">{company.location}</p>
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

  const AdminReportsPage = () => {
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
  };

  const AdminAnalyticsPage = () => {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive platform insights and metrics</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                    <p className="text-xs text-green-600">+12% this month</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{jobs.filter(j => j.status === 'active').length}</p>
                    <p className="text-xs text-green-600">+8% this month</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                    <p className="text-xs text-green-600">+23% this month</p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">$12,450</p>
                    <p className="text-xs text-green-600">+15% this month</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <TrendingUp className="h-16 w-16 mr-4" />
                  <div>
                    <p className="font-medium">User registrations over time</p>
                    <p className="text-sm">Mock chart: Steady 15% growth</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Application Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <BarChart3 className="h-16 w-16 mr-4" />
                  <div>
                    <p className="font-medium">Application to hire conversion</p>
                    <p className="text-sm">Mock chart: 12% success rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Health */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">99.9%</p>
                  <p className="text-gray-600">Uptime</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">1.2s</p>
                  <p className="text-gray-600">Avg Response Time</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">4.8/5</p>
                  <p className="text-gray-600">User Satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const CompanyOnboarding = () => {
    const [step, setStep] = useState<'choice' | 'create' | 'join'>('choice');
    const [searchQuery, setSearchQuery] = useState('');
    const filteredCompanies = companies.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <Dialog open={showCompanyOnboarding} onOpenChange={setShowCompanyOnboarding}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Welcome to JobBoard</DialogTitle>
            <DialogDescription>
              Let's get your employer account set up. Choose how you'd like to proceed.
            </DialogDescription>
          </DialogHeader>

          {step === 'choice' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStep('create')}>
                  <CardContent className="p-6 text-center">
                    <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Create a New Company</h3>
                    <p className="text-sm text-gray-600">Start fresh with your company profile and become a Company Admin</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStep('join')}>
                  <CardContent className="p-6 text-center">
                    <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <UserPlus className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Join Existing Company</h3>
                    <p className="text-sm text-gray-600">Join your company as a Recruiter or HR member</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {step === 'create' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Create Your Company</h3>
                <p className="text-gray-600">Fill in your company details to get started</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                      placeholder="e.g., TechCorp Inc."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="companySlug">Company URL Slug *</Label>
                    <Input
                      id="companySlug"
                      value={companyForm.slug}
                      onChange={(e) => setCompanyForm({...companyForm, slug: e.target.value})}
                      placeholder="e.g., techcorp-inc"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select value={companyForm.industry} onValueChange={(value) => setCompanyForm({...companyForm, industry: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                        <SelectItem value="Design & Creative">Design & Creative</SelectItem>
                        <SelectItem value="Financial Services">Financial Services</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="size">Company Size *</Label>
                    <Select value={companyForm.size} onValueChange={(value) => setCompanyForm({...companyForm, size: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10 employees">1-10 employees</SelectItem>
                        <SelectItem value="11-50 employees">11-50 employees</SelectItem>
                        <SelectItem value="51-200 employees">51-200 employees</SelectItem>
                        <SelectItem value="201-500 employees">201-500 employees</SelectItem>
                        <SelectItem value="501-1000 employees">501-1000 employees</SelectItem>
                        <SelectItem value="1000+ employees">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="headquarters">Headquarters *</Label>
                    <Input
                      id="headquarters"
                      value={companyForm.headquarters}
                      onChange={(e) => setCompanyForm({...companyForm, headquarters: e.target.value})}
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={companyForm.website}
                      onChange={(e) => setCompanyForm({...companyForm, website: e.target.value})}
                      placeholder="e.g., https://techcorp.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    value={companyForm.description}
                    onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})}
                    placeholder="Tell us about your company, mission, and values..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('choice')}>
                  Back
                </Button>
                <Button onClick={() => createCompany(companyForm)}>
                  Create Company
                </Button>
              </div>
            </div>
          )}

          {step === 'join' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Join Existing Company</h3>
                <p className="text-gray-600">Search for your company and request to join</p>
              </div>

              <div>
                <Label htmlFor="search">Search Companies</Label>
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type company name..."
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredCompanies.map((company) => (
                  <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={company.logo} />
                        <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{company.name}</h4>
                        <p className="text-sm text-gray-600">{company.industry} • {company.size}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => joinCompany(company.id)}>
                      Join
                    </Button>
                  </div>
                ))}
              </div>

              {filteredCompanies.length === 0 && searchQuery && (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No companies found with that name</p>
                  <p className="text-sm">Try a different search term or create a new company</p>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('choice')}>
                  Back
                </Button>
                <Button variant="outline" onClick={() => setStep('create')}>
                  Create New Instead
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  // Authentication Pages
  const LoginPage = () => {
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      // Mock login - find user by email
      const user = users.find(u => u.email === loginForm.email);
      if (user) {
        setCurrentUser(user);
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`
        });
        navigate(user.role === 'candidate' ? '/candidate/dashboard' : 
               user.role === 'employer' ? '/employer/dashboard' : '/admin/dashboard');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password"
        });
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Sign In</Button>
              <div className="text-center text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  const SignupPage = () => {
    const [signupForm, setSignupForm] = useState({
      name: '',
      email: '',
      password: '',
      role: 'candidate' as 'candidate' | 'employer'
    });
    const [showOnboarding, setShowOnboarding] = useState(false);
    const navigate = useNavigate();

    const handleSignup = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Check if email already exists
      const existingUser = users.find(u => u.email === signupForm.email);
      if (existingUser) {
        toast({
          title: "Registration failed",
          description: "Email already exists"
        });
        return;
      }

      // Create new user
      const newUser: User = {
        id: `user${Date.now()}`,
        name: signupForm.name,
        email: signupForm.email,
        role: signupForm.role,
        avatar: '/api/placeholder/150/150',
        privacy: { phone: true, email: true },
        subscription: { plan: 'Free' }
      };

      setUsers([...users, newUser]);
      setCurrentUser(newUser);

      // If employer, show onboarding
      if (signupForm.role === 'employer') {
        setShowOnboarding(true);
      } else {
        // For candidates, create basic profile
        const newCandidate: Candidate = {
          id: `cand${Date.now()}`,
          userId: newUser.id,
          headline: 'Looking for opportunities',
          skills: [],
          experience: [],
          education: [],
          cvs: [],
          savedJobs: [],
          followedCompanies: [],
          settings: { profileVisibility: true, jobAlerts: true }
        };
        setCandidates([...candidates, newCandidate]);
        
        toast({
          title: "Registration successful",
          description: "Welcome to our platform!"
        });
        navigate('/candidate/dashboard');
      }
    };

    if (showOnboarding && signupForm.role === 'employer') {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Complete Your Employer Profile</CardTitle>
              <CardDescription>You'll be redirected to the company onboarding flow</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => {
                toast({
                  title: "Registration successful",
                  description: "Welcome! Please complete your company setup."
                });
                navigate('/employer/company');
              }} className="w-full">
                Continue to Company Setup
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Join our recruitment platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                  placeholder="Create a password"
                  required
                />
              </div>
              <div>
                <Label>I am a:</Label>
                <RadioGroup 
                  value={signupForm.role} 
                  onValueChange={(value) => setSignupForm({...signupForm, role: value as 'candidate' | 'employer'})}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="candidate" id="candidate" />
                    <Label htmlFor="candidate">Job Seeker / Candidate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="employer" id="employer" />
                    <Label htmlFor="employer">Employer / Recruiter</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button type="submit" className="w-full">Create Account</Button>
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Fixed Sidebar Component with Role-Specific Navigation
  const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const getCandidateMenuItems = () => [
      { title: 'Dashboard', url: '/candidate/dashboard', icon: Home },
      { title: 'My Profile', url: '/candidate/profile', icon: User },
      { title: 'Job Search', url: '/jobs', icon: Search },
      { title: 'Applications', url: '/candidate/applications', icon: FileText },
      { title: 'Interviews', url: '/candidate/interviews', icon: Calendar },
      { title: 'Saved Jobs', url: '/candidate/saved', icon: Heart },
      { title: 'Messages', url: '/candidate/messages', icon: MessageCircle },
      { title: 'Career Assistant', url: '/candidate/chatbot', icon: Brain },
      { title: 'Settings', url: '/candidate/settings', icon: Settings }
    ];

    const getEmployerMenuItems = () => [
      { title: 'Dashboard', url: '/employer/dashboard', icon: Home },
      { title: 'Company Profile', url: '/employer/company', icon: Building2 },
      { title: 'Post New Job', url: '/employer/post-job', icon: Plus },
      { title: 'My Jobs', url: '/employer/jobs', icon: Briefcase },
      { title: 'Pipeline', url: '/employer/pipeline', icon: Users },
      { title: 'Candidate Search', url: '/employer/candidates', icon: Search },
      { title: 'Interviews', url: '/employer/interviews', icon: Calendar },
      { title: 'Messages', url: '/employer/messages', icon: MessageCircle },
      { title: 'Recruiter Assistant', url: '/employer/chatbot', icon: Brain },
      { title: 'Analytics', url: '/employer/analytics', icon: BarChart3 },
      { title: 'Settings', url: '/employer/settings', icon: Settings }
    ];

    const getAdminMenuItems = () => [
      { title: 'Dashboard', url: '/admin/dashboard', icon: Home },
      { title: 'User Management', url: '/admin/users', icon: Users },
      { title: 'Content Management', url: '/admin/content', icon: FileText },
      { title: 'Job Approvals', url: '/admin/jobs', icon: CheckCircle },
      { title: 'Company Management', url: '/admin/companies', icon: Building2 },
      { title: 'Reports & Violations', url: '/admin/reports', icon: AlertTriangle },
      { title: 'Revenue Management', url: '/admin/revenue', icon: DollarSign },
      { title: 'Refunds', url: '/admin/refunds', icon: CreditCard },
      { title: 'Analytics', url: '/admin/analytics', icon: TrendingUp }
    ];

    const getMenuItems = () => {
      if (!currentUser) return [];
      switch (currentUser.role) {
        case 'candidate': return getCandidateMenuItems();
        case 'employer': return getEmployerMenuItems();
        case 'admin': return getAdminMenuItems();
        default: return [];
      }
    };

    const menuItems = getMenuItems();

    return (
      <div className={`bg-white border-r border-gray-200 h-screen fixed left-0 top-16 transition-transform duration-200 z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64`}>
        <div className="p-6">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = currentPath === item.url;
              return (
                <Link
                  key={item.url}
                  to={item.url}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Updated Header Component
  const Header = () => {
    const navigate = useNavigate();

    const handleRoleChange = (newRole: 'candidate' | 'employer' | 'admin') => {
      if (!currentUser) return;
      
      const updatedUser = { ...currentUser, role: newRole };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
      
      // Navigate to appropriate dashboard
      const dashboardPath = newRole === 'candidate' ? '/candidate/dashboard' : 
                           newRole === 'employer' ? '/employer/dashboard' : '/admin/dashboard';
      navigate(dashboardPath);
    };

    const handleLogout = () => {
      setCurrentUser(null);
      setSidebarOpen(false);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
      navigate('/');
    };

    return (
      <header className="bg-white border-b border-gray-200 px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {currentUser && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">TalentHub</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Select value={currentUser.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="candidate">Candidate</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{currentUser.name}</span>
                </div>
                
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  };

  // Router Setup - Main App Return
  return (
    <div className="App">
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          
          <div className="flex pt-16">
            {currentUser && <Sidebar />}
            
            <main className={`flex-1 ${currentUser ? (sidebarOpen ? 'ml-64' : 'ml-0') : ''} transition-all duration-200`}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/jobs" element={<JobSearchPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                <Route path="/companies/:slug" element={<CompanyProfilePage />} />
                <Route path="/candidates/:candidateId" element={<CandidateProfilePage />} />
                <Route path="/recruiters/:recruiterId" element={<RecruiterProfilePage />} />
                
                {/* Candidate Routes */}
                <Route path="/candidate/dashboard" element={<HomePage />} />
                <Route path="/candidate/profile" element={<CandidateProfilePage />} />
                <Route path="/candidate/applications" element={<CandidateApplicationsPage />} />
                <Route path="/candidate/interviews" element={<CandidateInterviewsPage />} />
                <Route path="/candidate/messages" element={<MessagesPage />} />
                <Route path="/candidate/saved" element={<SavedJobsPage />} />
                <Route path="/candidate/chatbot" element={<ChatbotPage />} />
                <Route path="/candidate/settings" element={<SubscriptionPage />} />
                
                {/* Employer Routes */}
                <Route path="/employer/dashboard" element={<HomePage />} />
                <Route path="/employer/company" element={<div className="p-6"><CompanyProfile /></div>} />
                <Route path="/employer/post-job" element={<PostJobPage />} />
                <Route path="/employer/jobs" element={<EmployerJobsPage />} />
                <Route path="/employer/pipeline" element={<PipelinePage />} />
                <Route path="/employer/candidates" element={<div className="p-6"><CandidateSearch /></div>} />
                <Route path="/employer/interviews" element={<EmployerInterviewsPage />} />
                <Route path="/employer/messages" element={<MessagesPage />} />
                <Route path="/employer/chatbot" element={<ChatbotPage />} />
                <Route path="/employer/analytics" element={<EmployerAnalyticsPage />} />
                <Route path="/employer/profile" element={<RecruiterProfilePage />} />
                <Route path="/employer/settings" element={<SubscriptionPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/content" element={<AdminContentPage />} />
                <Route path="/admin/jobs" element={<AdminJobsPage />} />
                <Route path="/admin/companies" element={<AdminCompaniesPage />} />
                <Route path="/admin/reports" element={<AdminReportsPage />} />
                <Route path="/admin/revenue" element={<RevenuePage />} />
                <Route path="/admin/refunds" element={<RefundPage />} />
                <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              </Routes>
            </main>
          </div>
        </div>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;