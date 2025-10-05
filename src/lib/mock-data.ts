import {
  Job,
  Candidate,
  Company,
  Application,
  Interview,
  RefundRequest,
  ViolationReport,
  Message,
  User,
} from "./types";

export const mockJobs: Job[] = [
  {
    id: "job1",
    title: "Senior Frontend Developer",
    companyId: "comp1",
    location: "San Francisco, CA",
    salary: "$120,000 - $160,000",
    type: "full-time",
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
    postedDate: "2024-01-15",
    applications: 12,
    status: "active",
    views: 245,
    employerId: "emp1",
    keywords: ["React", "TypeScript", "Frontend", "JavaScript", "GraphQL"],
  },
  {
    id: "job2",
    title: "Product Manager",
    companyId: "comp2",
    location: "New York, NY",
    salary: "$130,000 - $180,000",
    type: "full-time",
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
    postedDate: "2024-01-14",
    applications: 8,
    status: "active",
    views: 189,
    employerId: "emp3",
    keywords: ["Product Management", "AI", "Strategy", "Analytics", "Agile"],
  },
  {
    id: "job3",
    title: "UX Designer",
    companyId: "comp3",
    location: "Remote",
    salary: "$90,000 - $120,000",
    type: "remote",
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
    postedDate: "2024-01-13",
    applications: 15,
    status: "active",
    views: 167,
    employerId: "emp4",
    keywords: ["UX Design", "Figma", "User Research", "Prototyping", "Remote"],
  },
  {
    id: "job4",
    title: "Data Scientist",
    companyId: "comp2",
    location: "New York, NY",
    salary: "$110,000 - $150,000",
    type: "full-time",
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
    postedDate: "2024-01-12",
    applications: 6,
    status: "active",
    views: 134,
    employerId: "emp3",
    keywords: [
      "Data Science",
      "Machine Learning",
      "Python",
      "Statistics",
      "AI",
    ],
  },
  {
    id: "job5",
    title: "DevOps Engineer",
    companyId: "comp1",
    location: "San Francisco, CA",
    salary: "$130,000 - $170,000",
    type: "full-time",
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
    postedDate: "2024-01-11",
    applications: 9,
    status: "active",
    views: 198,
    employerId: "emp1",
    keywords: ["DevOps", "AWS", "Kubernetes", "Docker", "Infrastructure"],
  },
  {
    id: "job6",
    title: "Financial Analyst",
    companyId: "comp4",
    location: "Chicago, IL",
    salary: "$80,000 - $110,000",
    type: "full-time",
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
    postedDate: "2024-01-10",
    applications: 11,
    status: "draft",
    views: 156,
    employerId: "emp5",
    keywords: ["Finance", "Analysis", "Excel", "Modeling", "CFA"],
  },
];

export const mockCandidates: Candidate[] = [
  {
    id: "cand1",
    userId: "user1",
    headline: "Frontend Developer with 3 years experience",
    skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
    experience: [
      {
        id: "exp1",
        company: "StartupCorp",
        title: "Frontend Developer",
        startDate: "2021-01-01",
        endDate: "2023-12-31",
        description: "Developed React applications and improved user experience",
        current: false,
      },
    ],
    education: [
      {
        id: "edu1",
        institution: "University of Technology",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "2017-09-01",
        endDate: "2021-06-01",
        current: false,
      },
    ],
    cvs: [
      {
        id: "cv1",
        name: "John Doe Resume",
        uploadedAt: "2024-01-01",
        contentMarkdown: "# John Doe\n\nExperienced Frontend Developer\n\n## Skills\n- React\n- TypeScript\n- JavaScript",
        isDefault: true,
        fileName: "john_doe_resume.pdf",
        type: "pdf",
      },
    ],
    savedJobs: ["job1", "job3"],
    followedCompanies: ["comp1", "comp3"],
    settings: {
      profileVisibility: true,
      jobAlerts: true,
    },
    name: "",
    email: "",
    title: "",
    location: "",
    status: "active"
  },
  {
    id: "cand2",
    userId: "user2",
    headline: "Product Manager with 5 years experience in tech",
    skills: ["Product Management", "Analytics", "Agile", "SQL", "Strategy"],
    experience: [
      {
        id: "exp2",
        company: "TechGiant",
        title: "Senior Product Manager",
        startDate: "2019-03-01",
        description: "Led product strategy for consumer mobile apps",
        current: true,
      },
    ],
    education: [
      {
        id: "edu2",
        institution: "Business University",
        degree: "Master of Business Administration",
        field: "Business Administration",
        startDate: "2015-09-01",
        endDate: "2017-06-01",
        current: false,
      },
    ],
    cvs: [
      {
        id: "cv2",
        name: "Jane Smith Resume",
        uploadedAt: "2024-01-02",
        contentMarkdown: "# Jane Smith\n\nProduct Manager\n\n## Experience\n- 5 years in product management\n- Led multiple successful product launches",
        isDefault: true,
        fileName: "jane_smith_resume.pdf",
        type: "pdf",
      },
    ],
    savedJobs: ["job2", "job4"],
    followedCompanies: ["comp2", "comp4"],
    settings: {
      profileVisibility: true,
      jobAlerts: true,
    },
    name: "",
    email: "",
    title: "",
    location: "",
    status: "active"
  },
];

export const mockCompanies: Company[] = [
  {
    id: "comp1",
    name: "TechCorp Inc.",
    slug: "techcorp-inc",
    industry: "Technology",
    size: "500-1000 employees",
    headquarters: "San Francisco, CA",
    website: "https://techcorp.com",
    description:
      "# About TechCorp\n\nTechCorp is a leading technology company focused on creating innovative solutions for the modern workplace.\n\n## Our Mission\nTo empower businesses through cutting-edge technology and exceptional user experiences.\n\n## Values\n- Innovation\n- Collaboration\n- Excellence\n- Diversity",
    logo: "/api/placeholder/100/100",
    founded: "2015",
    employees: 750,
    followers: 1250,
    jobs: 12,
    members: [
      {
        id: "m1",
        userId: "emp1",
        role: "Company Admin",
        joinedAt: "2015-01-01",
      },
      { id: "m2", userId: "emp2", role: "HR", joinedAt: "2020-06-15" },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/company/techcorp",
      twitter: "https://twitter.com/techcorp",
    },
  },
  {
    id: "comp2",
    name: "InnovateLabs",
    slug: "innovate-labs",
    industry: "AI & Machine Learning",
    size: "100-500 employees",
    headquarters: "New York, NY",
    website: "https://innovatelabs.com",
    description:
      "# InnovateLabs\n\nPioneering AI solutions for tomorrow's challenges.\n\n## What We Do\n- Machine Learning Research\n- AI Product Development\n- Consulting Services\n\n## Why Join Us?\n- Work on cutting-edge AI projects\n- Collaborative environment\n- Competitive compensation",
    logo: "/api/placeholder/100/100",
    founded: "2018",
    employees: 320,
    followers: 890,
    jobs: 8,
    members: [
      {
        id: "m3",
        userId: "emp3",
        role: "Company Admin",
        joinedAt: "2018-03-01",
      },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/company/innovatelabs",
    },
  },
  {
    id: "comp3",
    name: "DesignStudio",
    slug: "design-studio",
    industry: "Design & Creative",
    size: "50-100 employees",
    headquarters: "Remote",
    website: "https://designstudio.com",
    description:
      "# DesignStudio\n\nCreating beautiful, user-centered digital experiences.\n\n## Our Expertise\n- UX/UI Design\n- Brand Identity\n- Digital Strategy\n- Product Design\n\n## Remote-First Culture\nWe believe in flexibility and work-life balance.",
    logo: "/api/placeholder/100/100",
    founded: "2019",
    employees: 85,
    followers: 650,
    jobs: 5,
    members: [
      {
        id: "m4",
        userId: "emp4",
        role: "Company Admin",
        joinedAt: "2019-01-01",
      },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/company/designstudio",
      twitter: "https://twitter.com/designstudio",
    },
  },
  {
    id: "comp4",
    name: "FinanceForward",
    slug: "finance-forward",
    industry: "Financial Services",
    size: "200-500 employees",
    headquarters: "Chicago, IL",
    website: "https://financeforward.com",
    description:
      "# FinanceForward\n\nRevolutionizing financial services through technology.\n\n## Our Services\n- Digital Banking Solutions\n- Investment Platforms\n- Financial Analytics\n\n## Career Growth\nWe invest in our people and provide clear career progression paths.",
    logo: "/api/placeholder/100/100",
    founded: "2016",
    employees: 420,
    followers: 1100,
    jobs: 15,
    members: [
      {
        id: "m5",
        userId: "emp5",
        role: "Company Admin",
        joinedAt: "2016-05-01",
      },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/company/financeforward",
    },
  },
];

export const mockApplications: Application[] = [
  {
    id: "app1",
    jobId: "job1",
    candidateId: "cand1",
    status: "New",
    appliedDate: "2024-01-16",
    cvId: "cv1",
    coverLetter: "I am very interested in this position...",
    matchingScore: 85,
    feedback: { rating: 4, comment: "Strong technical skills" },
  },
  {
    id: "app2",
    jobId: "job2",
    candidateId: "cand2",
    status: "Interview",
    appliedDate: "2024-01-15",
    cvId: "cv2",
    matchingScore: 92,
    feedback: { rating: 5, comment: "Excellent product experience" },
  },
  {
    id: "app3",
    jobId: "job3",
    candidateId: "cand1",
    status: "Screening",
    appliedDate: "2024-01-14",
    cvId: "cv1",
    coverLetter: "I would love to contribute to your design team...",
    matchingScore: 78,
  },
];

export const mockInterviews: Interview[] = [
  {
    id: "int1",
    applicationId: "app2",
    date: "2024-01-20",
    time: "14:00",
    type: "video",
    status: "scheduled",
    notes: "Technical interview with the team lead",
  },
  {
    id: "int2",
    applicationId: "app3",
    date: "2024-01-22",
    time: "10:00",
    type: "phone",
    status: "scheduled",
    notes: "Initial screening call",
  },
];

// Additional mock data for pipeline management
export const mockPipelineData = {
  New: [
    {
      id: "4",
      jobId: "1",
      candidateId: "4",
      status: "New",
      appliedDate: "2024-01-16",
      notes: "Fresh application, needs initial review",
      matchingScore: 85,
    },
    {
      id: "5",
      jobId: "2",
      candidateId: "5",
      status: "New",
      appliedDate: "2024-01-17",
      notes: "Interesting background in product management",
      matchingScore: 78,
    },
  ],
  Screening: [
    {
      id: "2",
      jobId: "2",
      candidateId: "2",
      status: "Screening",
      appliedDate: "2024-01-12",
      notes: "Excellent product management experience",
      matchingScore: 92,
    },
  ],
  Interview: [
    {
      id: "1",
      jobId: "1",
      candidateId: "1",
      status: "Interview",
      appliedDate: "2024-01-10",
      notes: "Strong technical background, good communication skills",
      matchingScore: 94,
    },
  ],
  Offer: [
    {
      id: "3",
      jobId: "3",
      candidateId: "3",
      status: "Offer",
      appliedDate: "2024-01-08",
      notes: "Outstanding portfolio and design thinking",
      matchingScore: 96,
    },
  ],
  Hired: [],
  Rejected: [],
  Withdrawn: [],
};

// Enhanced candidate data with more profiles
export const mockExtendedCandidates = [
  ...mockCandidates,
  {
    id: "6",
    name: "Alex Thompson",
    email: "alex.thompson@email.com",
    title: "Full Stack Developer",
    location: "Austin, TX",
    experience: "4 years",
    skills: ["React", "Node.js", "Python", "PostgreSQL", "AWS"],
    status: "active",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    bio: "Full-stack developer passionate about building scalable applications.",
    linkedinUrl: "https://linkedin.com/in/alexthompson",
  },
  {
    id: "7",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    title: "Product Designer",
    location: "Denver, CO",
    experience: "5 years",
    skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
    status: "active",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    bio: "Creative product designer with expertise in user-centered design.",
    linkedinUrl: "https://linkedin.com/in/mariagarcia",
  },
  {
    id: "8",
    name: "James Wilson",
    email: "james.wilson@email.com",
    title: "Backend Engineer",
    location: "Chicago, IL",
    experience: "6 years",
    skills: ["Java", "Spring Boot", "Microservices", "Kafka", "Docker"],
    status: "active",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    bio: "Backend engineer specializing in distributed systems and APIs.",
    linkedinUrl: "https://linkedin.com/in/jameswilson",
  },
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
    { name: "Mon", views: 120 },
    { name: "Tue", views: 98 },
    { name: "Wed", views: 145 },
    { name: "Thu", views: 167 },
    { name: "Fri", views: 189 },
    { name: "Sat", views: 76 },
    { name: "Sun", views: 54 },
  ],
  applicationsByStatus: [
    { name: "Applied", value: 45, color: "#0070f3" },
    { name: "Screening", value: 28, color: "#7c3aed" },
    { name: "Interview", value: 12, color: "#059669" },
    { name: "Offer", value: 8, color: "#dc2626" },
    { name: "Hired", value: 6, color: "#16a34a" },
  ],
};

export const mockRevenueData = [
  { month: "Jan", revenue: 12000, subscriptions: 150 },
  { month: "Feb", revenue: 15000, subscriptions: 180 },
  { month: "Mar", revenue: 18000, subscriptions: 220 },
  { month: "Apr", revenue: 22000, subscriptions: 260 },
  { month: "May", revenue: 28000, subscriptions: 320 },
  { month: "Jun", revenue: 35000, subscriptions: 400 },
];

export const mockPlanData = [
  { name: "Free", value: 60, color: "#8884d8" },
  { name: "Standard", value: 25, color: "#82ca9d" },
  { name: "Premium", value: 15, color: "#ffc658" },
];

export const mockRefundRequests: RefundRequest[] = [
  {
    id: "ref1",
    userId: "user2",
    plan: "Premium",
    reason: "Service not as expected",
    amount: 99,
    status: "pending",
    requestedAt: "2024-01-15",
  },
  {
    id: "ref2",
    userId: "emp1",
    plan: "Standard",
    reason: "Billing error",
    amount: 49,
    status: "approved",
    requestedAt: "2024-01-10",
  },
];

export const mockMessages: Message[] = [
  {
    id: "msg1",
    senderId: "emp1",
    receiverId: "user1",
    content:
      "Hi John, we reviewed your application and would like to schedule an interview.",
    timestamp: "2024-01-16T10:00:00Z",
    read: false,
  },
  {
    id: "msg2",
    senderId: "user2",
    receiverId: "emp3",
    content:
      "Thank you for considering my application. I am available for an interview next week.",
    timestamp: "2024-01-15T15:30:00Z",
    read: true,
  },
];

export const mockViolationReports: ViolationReport[] = [
  {
    id: "vio1",
    reporterId: "user1",
    targetType: "job",
    targetId: "job1",
    reason: "Misleading job description",
    status: "pending",
    createdAt: "2024-01-15",
  },
  {
    id: "vio2",
    reporterId: "user2",
    targetType: "user",
    targetId: "emp1",
    reason: "Inappropriate communication",
    status: "resolved",
    createdAt: "2024-01-14",
  },
];

export const mockUsers: User[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    role: "candidate",
    avatar: "/api/placeholder/150/150",
    privacy: { phone: true, email: true },
    subscription: { plan: "Free" },
    status: "active",
    joinedDate: "2024-01-01",
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "employer",
    avatar: "/api/placeholder/150/150",
    privacy: { phone: true, email: true },
    subscription: { plan: "Standard" },
    status: "active",
    joinedDate: "2024-01-02",
  },
  {
    id: "user3",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "/api/placeholder/150/150",
    privacy: { phone: true, email: true },
    subscription: { plan: "Premium" },
    status: "active",
    joinedDate: "2024-01-01",
  },
];
