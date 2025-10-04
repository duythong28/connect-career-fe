import { Job, Candidate, Company, Application, Interview, User, Message, ViolationReport, RefundRequest } from './types';

export const mockJobs: Job[] = [
  {
    id: 'job1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
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
    requirements: ['React', 'TypeScript', 'Next.js', '5+ years experience'],
    postedDate: '2024-01-15',
    applications: 12,
    status: 'active'
  },
  {
    id: 'job2',
    title: 'Product Manager',
    company: 'InnovateLabs',
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
    requirements: ['Product Management', 'AI', 'Strategy', 'Analytics', 'Agile'],
    postedDate: '2024-01-14',
    applications: 8,
    status: 'active'
  },
  {
    id: 'job3',
    title: 'UX Designer',
    company: 'DesignStudio',
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
    requirements: ['UX Design', 'Figma', 'User Research', 'Prototyping', 'Remote'],
    postedDate: '2024-01-13',
    applications: 15,
    status: 'active'
  },
  {
    id: 'job4',
    title: 'Data Scientist',
    company: 'InnovateLabs',
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
    requirements: ['Data Science', 'Machine Learning', 'Python', 'Statistics', 'AI'],
    postedDate: '2024-01-12',
    applications: 6,
    status: 'active'
  },
  {
    id: 'job5',
    title: 'DevOps Engineer',
    company: 'TechCorp Inc.',
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
    requirements: ['DevOps', 'AWS', 'Kubernetes', 'Docker', 'Infrastructure'],
    postedDate: '2024-01-11',
    applications: 9,
    status: 'active'
  },
  {
    id: 'job6',
    title: 'Financial Analyst',
    company: 'FinanceForward',
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
    requirements: ['Finance', 'Analysis', 'Excel', 'Modeling', 'CFA'],
    postedDate: '2024-01-10',
    applications: 11,
    status: 'active'
  }
];

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'candidate',
    avatar: '/api/placeholder/50/50',
    phone: '+1234567890',
    visibility: { phone: true, email: true },
    subscription: { plan: 'Free' }
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'candidate',
    avatar: '/api/placeholder/50/50',
    phone: '+1234567891',
    visibility: { phone: false, email: true },
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
    visibility: { phone: true, email: true },
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
    visibility: { phone: true, email: true },
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
    visibility: { phone: true, email: true },
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
    visibility: { phone: true, email: true },
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
    visibility: { phone: true, email: true },
    subscription: { plan: 'Premium', expiresAt: '2024-12-31' }
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@jobboard.com',
    role: 'admin',
    avatar: '/api/placeholder/50/50',
    phone: '+1234567897',
    visibility: { phone: true, email: true },
    subscription: { plan: 'Premium' }
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
    id: 'comp1',
    name: 'TechCorp Inc.',
    industry: 'Technology',
    size: '500-1000 employees',
    location: 'San Francisco, CA',
    description: '# About TechCorp\n\nTechCorp is a leading technology company focused on creating innovative solutions for the modern workplace.\n\n## Our Mission\nTo empower businesses through cutting-edge technology and exceptional user experiences.\n\n## Values\n- Innovation\n- Collaboration\n- Excellence\n- Diversity',
    jobs: 12
  },
  {
    id: 'comp2',
    name: 'InnovateLabs',
    industry: 'AI & Machine Learning',
    size: '100-500 employees',
    location: 'New York, NY',
    description: '# InnovateLabs\n\nPioneering AI solutions for tomorrow\'s challenges.\n\n## What We Do\n- Machine Learning Research\n- AI Product Development\n- Consulting Services\n\n## Why Join Us?\n- Work on cutting-edge AI projects\n- Collaborative environment\n- Competitive compensation',
    jobs: 8
  },
  {
    id: 'comp3',
    name: 'DesignStudio',
    industry: 'Design & Creative',
    size: '50-100 employees',
    location: 'Remote',
    description: '# DesignStudio\n\nCreating beautiful, user-centered digital experiences.\n\n## Our Expertise\n- UX/UI Design\n- Brand Identity\n- Digital Strategy\n- Product Design\n\n## Remote-First Culture\nWe believe in flexibility and work-life balance.',
    jobs: 5
  },
  {
    id: 'comp4',
    name: 'FinanceForward',
    industry: 'Financial Services',
    size: '200-500 employees',
    location: 'Chicago, IL',
    description: '# FinanceForward\n\nRevolutionizing financial services through technology.\n\n## Our Services\n- Digital Banking Solutions\n- Investment Platforms\n- Financial Analytics\n\n## Career Growth\nWe invest in our people and provide clear career progression paths.',
    jobs: 15
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

export const mockMessages: Message[] = [
  {
    id: 'msg1',
    senderId: 'emp1',
    receiverId: 'user1',
    content: 'Thank you for your application. We would like to schedule an interview.',
    timestamp: '2024-01-20T10:00:00Z',
    read: false
  },
  {
    id: 'msg2',
    senderId: 'user1',
    receiverId: 'emp1',
    content: 'I would be happy to schedule an interview. What times work for you?',
    timestamp: '2024-01-20T14:30:00Z',
    read: true
  },
  {
    id: 'msg3',
    senderId: 'emp1',
    receiverId: 'user1',
    content: 'How about Tuesday at 2 PM?',
    timestamp: '2024-01-20T16:00:00Z',
    read: false
  }
];

export const mockViolationReports: ViolationReport[] = [
  {
    id: 'report1',
    reporterId: 'user1',
    targetType: 'job',
    targetId: 'job1',
    reason: 'Discriminatory language in job description',
    status: 'pending',
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'report2',
    reporterId: 'user2',
    targetType: 'user',
    targetId: 'emp1',
    reason: 'Inappropriate behavior during interview',
    status: 'resolved',
    createdAt: '2024-01-10T14:30:00Z'
  }
];

export const mockRefundRequests: RefundRequest[] = [
  {
    id: 'refund1',
    userId: 'user1',
    plan: 'Premium',
    reason: 'Service not as advertised',
    amount: 99.99,
    status: 'pending',
    requestedAt: '2024-01-18T10:00:00Z'
  },
  {
    id: 'refund2',
    userId: 'emp2',
    plan: 'Standard',
    reason: 'Cancelled subscription',
    amount: 49.99,
    status: 'approved',
    requestedAt: '2024-01-12T15:30:00Z'
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