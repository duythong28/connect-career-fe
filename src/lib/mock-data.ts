import { Job, Candidate, Company, Application, Interview } from './types';

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120k - $160k',
    type: 'full-time',
    description: 'We are looking for a Senior Frontend Developer to join our dynamic team...',
    requirements: ['React', 'TypeScript', 'Next.js', '5+ years experience'],
    postedDate: '2024-01-15',
    applications: 45,
    status: 'active'
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateLabs',
    location: 'New York, NY',
    salary: '$130k - $180k',
    type: 'full-time',
    description: 'Lead product strategy and drive innovation in our AI-powered solutions...',
    requirements: ['Product Management', 'Agile', 'Data Analysis', '3+ years experience'],
    postedDate: '2024-01-14',
    applications: 32,
    status: 'active'
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'Remote',
    salary: '$90k - $120k',
    type: 'remote',
    description: 'Create intuitive and beautiful user experiences for our digital products...',
    requirements: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    postedDate: '2024-01-13',
    applications: 28,
    status: 'active'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Austin, TX',
    salary: '$110k - $150k',
    type: 'full-time',
    description: 'Manage and optimize our cloud infrastructure and deployment pipelines...',
    requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', '4+ years experience'],
    postedDate: '2024-01-12',
    applications: 19,
    status: 'active'
  },
  {
    id: '5',
    title: 'Data Scientist',
    company: 'AI Innovations',
    location: 'Boston, MA',
    salary: '$125k - $170k',
    type: 'full-time',
    description: 'Apply machine learning techniques to solve complex business problems...',
    requirements: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'PhD preferred'],
    postedDate: '2024-01-11',
    applications: 52,
    status: 'active'
  }
];

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    title: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    experience: '6 years',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    status: 'active'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    title: 'Product Manager',
    location: 'New York, NY',
    experience: '4 years',
    skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research'],
    status: 'active'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    title: 'UX Designer',
    location: 'Los Angeles, CA',
    experience: '5 years',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    status: 'active'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@email.com',
    title: 'DevOps Engineer',
    location: 'Seattle, WA',
    experience: '7 years',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    status: 'active'
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    title: 'Data Scientist',
    location: 'Boston, MA',
    experience: '3 years',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    status: 'active'
  }
];

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechCorp Inc.',
    industry: 'Technology',
    size: '500-1000',
    location: 'San Francisco, CA',
    description: 'Leading technology company focused on innovative solutions...',
    jobs: 12
  },
  {
    id: '2',
    name: 'InnovateLabs',
    industry: 'AI & Machine Learning',
    size: '100-500',
    location: 'New York, NY',
    description: 'Cutting-edge AI research and development company...',
    jobs: 8
  },
  {
    id: '3',
    name: 'DesignStudio',
    industry: 'Design & Creative',
    size: '50-100',
    location: 'Remote',
    description: 'Creative design agency specializing in digital experiences...',
    jobs: 5
  }
];

export const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    candidateId: '1',
    status: 'Interview',
    appliedDate: '2024-01-10',
    notes: 'Strong technical background, good communication skills'
  },
  {
    id: '2',
    jobId: '2',
    candidateId: '2',
    status: 'Screening',
    appliedDate: '2024-01-12',
    notes: 'Excellent product management experience'
  },
  {
    id: '3',
    jobId: '3',
    candidateId: '3',
    status: 'Offer',
    appliedDate: '2024-01-08',
    notes: 'Outstanding portfolio and design thinking'
  }
];

export const mockInterviews: Interview[] = [
  {
    id: '1',
    applicationId: '1',
    jobId: '1',
    candidateId: '1',
    date: '2024-01-20',
    time: '10:00 AM',
    type: 'video',
    status: 'scheduled'
  },
  {
    id: '2',
    applicationId: '2',
    jobId: '2',
    candidateId: '2',
    date: '2024-01-22',
    time: '2:00 PM',
    type: 'phone',
    status: 'scheduled'
  },
  {
    id: '3',
    applicationId: '3',
    jobId: '3',
    candidateId: '3',
    date: '2024-01-25',
    time: '11:00 AM',
    type: 'in-person',
    status: 'scheduled'
  },
  {
    id: '4',
    applicationId: '1',
    jobId: '1',
    candidateId: '4',
    date: '2024-01-18',
    time: '3:00 PM',
    type: 'video',
    status: 'completed'
  },
  {
    id: '5',
    applicationId: '2',
    jobId: '2',
    candidateId: '5',
    date: '2024-01-16',
    time: '9:00 AM',
    type: 'phone',
    status: 'completed'
  }
];

// Additional mock data for pipeline management
export const mockPipelineData = {
  'New': [
    {
      id: '4',
      jobId: '1',
      candidateId: '4',
      status: 'New',
      appliedDate: '2024-01-16',
      notes: 'Fresh application, needs initial review',
      matchingScore: 85
    },
    {
      id: '5',
      jobId: '2', 
      candidateId: '5',
      status: 'New',
      appliedDate: '2024-01-17',
      notes: 'Interesting background in product management',
      matchingScore: 78
    }
  ],
  'Screening': [
    {
      id: '2',
      jobId: '2',
      candidateId: '2', 
      status: 'Screening',
      appliedDate: '2024-01-12',
      notes: 'Excellent product management experience',
      matchingScore: 92
    }
  ],
  'Interview': [
    {
      id: '1',
      jobId: '1',
      candidateId: '1',
      status: 'Interview', 
      appliedDate: '2024-01-10',
      notes: 'Strong technical background, good communication skills',
      matchingScore: 94
    }
  ],
  'Offer': [
    {
      id: '3',
      jobId: '3',
      candidateId: '3',
      status: 'Offer',
      appliedDate: '2024-01-08', 
      notes: 'Outstanding portfolio and design thinking',
      matchingScore: 96
    }
  ],
  'Hired': [],
  'Rejected': [],
  'Withdrawn': []
};

// Enhanced candidate data with more profiles
export const mockExtendedCandidates = [
  ...mockCandidates,
  {
    id: '6',
    name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    title: 'Full Stack Developer',
    location: 'Austin, TX',
    experience: '4 years',
    skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Full-stack developer passionate about building scalable applications.',
    linkedinUrl: 'https://linkedin.com/in/alexthompson'
  },
  {
    id: '7',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com', 
    title: 'Product Designer',
    location: 'Denver, CO',
    experience: '5 years',
    skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    bio: 'Creative product designer with expertise in user-centered design.',
    linkedinUrl: 'https://linkedin.com/in/mariagarcia'
  },
  {
    id: '8',
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    title: 'Backend Engineer',
    location: 'Chicago, IL', 
    experience: '6 years',
    skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'Docker'],
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    bio: 'Backend engineer specializing in distributed systems and APIs.',
    linkedinUrl: 'https://linkedin.com/in/jameswilson'
  }
];

export const mockAnalytics = {
  totalJobs: 156,
  totalCandidates: 2847,
  totalApplications: 1243,
  totalCompanies: 78,
  activeJobs: 142,
  pendingApplications: 89,
  scheduledInterviews: 23,
  jobViews: [
    { name: 'Mon', views: 120 },
    { name: 'Tue', views: 98 },
    { name: 'Wed', views: 145 },
    { name: 'Thu', views: 167 },
    { name: 'Fri', views: 189 },
    { name: 'Sat', views: 76 },
    { name: 'Sun', views: 54 }
  ],
  applicationsByStatus: [
    { name: 'Applied', value: 45, color: '#0070f3' },
    { name: 'Screening', value: 28, color: '#7c3aed' },
    { name: 'Interview', value: 12, color: '#059669' },
    { name: 'Offer', value: 8, color: '#dc2626' },
    { name: 'Hired', value: 6, color: '#16a34a' }
  ]
};