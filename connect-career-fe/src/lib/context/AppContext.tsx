'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

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

interface RefundRequest {
  id: string;
  userId: string;
  plan: string;
  reason: string;
  amount: number;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: string;
}

// Mock Data - Exactly from recruit-flow-lab App.tsx
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

// App Context
interface AppContextType {
  // State
  currentUser: User | null;
  companies: Company[];
  jobs: Job[];
  users: User[];
  candidates: Candidate[];
  applications: Application[];
  interviews: Interview[];
  messages: Message[];
  violationReports: ViolationReport[];
  refundRequests: RefundRequest[];
  
  // UI State
  sidebarOpen: boolean;
  currentPage: string;
  showLogin: boolean;
  showCompanyOnboarding: boolean;
  
  // Form States
  jobForm: any;
  companyForm: any;
  searchFilters: any;
  chatMessages: any[];
  chatInput: string;
  
  // Actions
  login: (role: 'candidate' | 'employer' | 'admin', userData?: Partial<User>) => void;
  logout: () => void;
  switchRole: (role: 'candidate' | 'employer' | 'admin') => void;
  createCompany: (formData: any) => void;
  joinCompany: (companyId: string) => void;
  postJob: () => void;
  applyToJob: (jobId: string, cvId: string, coverLetter?: string) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
  getFilteredJobs: () => Job[];
  getRecommendedJobs: (candidateId: string) => any[];
  
  // Setters
  setSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
  setShowLogin: (show: boolean) => void;
  setShowCompanyOnboarding: (show: boolean) => void;
  setJobForm: (form: any) => void;
  setCompanyForm: (form: any) => void;
  setSearchFilters: (filters: any) => void;
  setChatMessages: (messages: any[]) => void;
  setChatInput: (input: string) => void;
  setCurrentUser: (user: User | null) => void;
  setCompanies: (companies: Company[]) => void;
  setJobs: (jobs: Job[]) => void;
  setUsers: (users: User[]) => void;
  setCandidates: (candidates: Candidate[]) => void;
  setApplications: (applications: Application[]) => void;
  setInterviews: (interviews: Interview[]) => void;
  setMessages: (messages: Message[]) => void;
  setViolationReports: (reports: ViolationReport[]) => void;
  setRefundRequests: (requests: RefundRequest[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // State Management - exactly like original
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

  // Authentication Functions - exactly like original
  const login = (role: 'candidate' | 'employer' | 'admin', userData?: Partial<User>) => {
    let user: User;
    
    if (role === 'candidate') {
      user = users.find(u => u.role === 'candidate') || users[0];
    } else if (role === 'employer') {
      if (userData?.companyId) {
        user = users.find(u => u.role === 'employer' && u.companyId === userData.companyId) || users[1];
      } else {
        setShowCompanyOnboarding(true);
        return;
      }
    } else {
      user = users.find(u => u.role === 'admin') || users[2];
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

  // All other functions from original App.tsx...
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
      keywords: jobForm.description.toLowerCase().split(' ').filter((word: string) => word.length > 3).slice(0, 5)
    };

    setJobs([...jobs, newJob]);
    setJobForm({ title: '', location: '', salary: '', type: 'full-time', description: '', companyId: '' });
    
    toast({
      title: "Job posted",
      description: currentUser?.role === 'admin' ? "Job is now live!" : "Job submitted for review."
    });
  };

  const applyToJob = (jobId: string, cvId: string, coverLetter?: string) => {
    const candidate = candidates.find(c => c.userId === currentUser?.id);
    if (!candidate) return;

    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const newApplication: Application = {
      id: `app${applications.length + 1}`,
      jobId,
      candidateId: candidate.id,
      status: 'New',
      appliedDate: new Date().toISOString().split('T')[0],
      cvId,
      coverLetter,
      matchingScore: 85
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
        matchScore: 85 // Simplified matching score
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  };

  const value: AppContextType = {
    // State
    currentUser,
    companies,
    jobs,
    users,
    candidates,
    applications,
    interviews,
    messages,
    violationReports,
    refundRequests,
    
    // UI State
    sidebarOpen,
    currentPage,
    showLogin,
    showCompanyOnboarding,
    
    // Form States
    jobForm,
    companyForm,
    searchFilters,
    chatMessages,
    chatInput,
    
    // Actions
    login,
    logout,
    switchRole,
    createCompany,
    joinCompany,
    postJob,
    applyToJob,
    updateApplicationStatus,
    getFilteredJobs,
    getRecommendedJobs,
    
    // Setters
    setSidebarOpen,
    setCurrentPage,
    setShowLogin,
    setShowCompanyOnboarding,
    setJobForm,
    setCompanyForm,
    setSearchFilters,
    setChatMessages,
    setChatInput,
    setCurrentUser,
    setCompanies,
    setJobs,
    setUsers,
    setCandidates,
    setApplications,
    setInterviews,
    setMessages,
    setViolationReports,
    setRefundRequests,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Export types
export type {
  Company,
  Job,
  User,
  Candidate,
  Application,
  Interview,
  Message,
  ViolationReport,
  RefundRequest,
  Experience,
  Education,
  CV,
  CompanyMember
};
