import { http, HttpResponse } from 'msw';
import { mockJobs, mockCandidates, mockCompanies, mockApplications, mockInterviews, mockAnalytics } from '../mock-data';
import { Job, Candidate, Application, Interview, User, Company, Message } from '../types';

// In-memory store for demo persistence
let jobs = [...mockJobs];
let candidates = [...mockCandidates];
let applications = [...mockApplications];
let interviews = [...mockInterviews];
let companies = [...mockCompanies];
let notifications: any[] = [];

// Mock users for auth
const mockUsers: User[] = [
  {
    id: 'candidate-1',
    name: 'Sarah Johnson',
    email: 'candidate@example.com',
    role: 'candidate',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150',
    phone: '+1-555-0123',
    visibility: { phone: true, email: true }
  },
  {
    id: 'employer-1',
    name: 'John Smith',
    email: 'employer@example.com',
    role: 'employer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    companyId: '1'
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  }
];

let currentUser: User | null = null;

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email } = await request.json() as { email: string };
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      currentUser = user;
      return HttpResponse.json({ user, token: 'mock-jwt-token' });
    }
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json({ user: currentUser });
  }),

  http.post('/api/auth/logout', () => {
    currentUser = null;
    return HttpResponse.json({ success: true });
  }),

  // Jobs endpoints
  http.get('/api/jobs', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const location = url.searchParams.get('location') || '';
    const jobType = url.searchParams.get('jobType') || '';
    const salaryMin = parseInt(url.searchParams.get('salaryMin') || '0');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    let filteredJobs = jobs.filter(job => {
      const matchesSearch = !search || job.title.toLowerCase().includes(search.toLowerCase()) ||
                           job.company.toLowerCase().includes(search.toLowerCase());
      const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
      const matchesType = !jobType || job.type === jobType;
      const matchesSalary = !salaryMin || parseInt(job.salary.replace(/[^0-9]/g, '')) >= salaryMin;
      
      return matchesSearch && matchesLocation && matchesType && matchesSalary;
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    return HttpResponse.json({
      jobs: paginatedJobs,
      total: filteredJobs.length,
      page,
      limit,
      hasMore: endIndex < filteredJobs.length
    });
  }),

  http.get('/api/jobs/:id', ({ params }) => {
    const { id } = params;
    const job = jobs.find(j => j.id === id);
    if (!job) {
      return HttpResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    // Increment view count
    job.applications += 1;
    
    return HttpResponse.json(job);
  }),

  http.post('/api/jobs', async ({ request }) => {
    const jobData = await request.json() as Omit<Job, 'id' | 'postedDate' | 'applications'>;
    const newJob: Job = {
      ...jobData,
      id: Math.random().toString(36).substr(2, 9),
      postedDate: new Date().toISOString().split('T')[0],
      applications: 0,
      status: 'active'
    };
    jobs.push(newJob);
    return HttpResponse.json(newJob);
  }),

  // Applications endpoints
  http.post('/api/apply', async ({ request }) => {
    const { jobId, candidateId, cvId, coverLetter } = await request.json() as any;
    const newApplication: Application = {
      id: Math.random().toString(36).substr(2, 9),
      jobId,
      candidateId,
      status: 'New',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: coverLetter || ''
    };
    applications.push(newApplication);
    
    // Add notification
    notifications.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'application',
      message: 'New application received',
      timestamp: new Date().toISOString(),
      read: false
    });
    
    return HttpResponse.json(newApplication);
  }),

  http.get('/api/applications', ({ request }) => {
    const url = new URL(request.url);
    const candidateId = url.searchParams.get('candidateId');
    const employerId = url.searchParams.get('employerId');
    
    let filteredApplications = applications;
    
    if (candidateId) {
      filteredApplications = applications.filter(app => app.candidateId === candidateId);
    }
    
    if (employerId) {
      // Filter by jobs from employer's company
      const employerJobs = jobs.filter(job => job.company === 'TechCorp Inc.'); // Mock filter
      const jobIds = employerJobs.map(job => job.id);
      filteredApplications = applications.filter(app => jobIds.includes(app.jobId));
    }
    
    return HttpResponse.json(filteredApplications);
  }),

  // Candidates endpoints
  http.get('/api/candidates', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const skills = url.searchParams.get('skills') || '';
    
    let filteredCandidates = candidates;
    
    if (search) {
      filteredCandidates = candidates.filter(candidate =>
        candidate.name.toLowerCase().includes(search.toLowerCase()) ||
        candidate.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (skills) {
      filteredCandidates = filteredCandidates.filter(candidate =>
        candidate.skills.some(skill => 
          skill.toLowerCase().includes(skills.toLowerCase())
        )
      );
    }
    
    return HttpResponse.json(filteredCandidates);
  }),

  http.get('/api/candidates/:id', ({ params }) => {
    const { id } = params;
    const candidate = candidates.find(c => c.id === id);
    if (!candidate) {
      return HttpResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }
    return HttpResponse.json(candidate);
  }),

  // AI endpoints
  http.post('/api/ai/cv-improve', () => {
    const suggestions = [
      "Add quantifiable achievements with specific numbers and percentages",
      "Include more relevant technical skills for your target role",
      "Improve the professional summary to highlight your unique value proposition"
    ];
    
    const improvedSummary = "Experienced software engineer with 6+ years developing scalable web applications. Proven track record of increasing team productivity by 40% and reducing deployment time by 60%. Expert in React, TypeScript, and cloud technologies with strong leadership and mentoring skills.";
    
    return HttpResponse.json({ suggestions, improvedSummary });
  }),

  http.post('/api/ai/job-recommendations', () => {
    const recommendedJobs = jobs.slice(0, 3).map(job => ({
      ...job,
      matchPercentage: Math.floor(Math.random() * 30) + 70 // 70-100% match
    }));
    
    return HttpResponse.json(recommendedJobs);
  }),

  // Analytics endpoints
  http.get('/api/analytics/overview', () => {
    return HttpResponse.json(mockAnalytics);
  }),

  http.get('/api/analytics/revenue', () => {
    const revenueData = [
      { month: 'Jan', revenue: 45000 },
      { month: 'Feb', revenue: 52000 },
      { month: 'Mar', revenue: 48000 },
      { month: 'Apr', revenue: 61000 },
      { month: 'May', revenue: 55000 },
      { month: 'Jun', revenue: 67000 }
    ];
    return HttpResponse.json(revenueData);
  }),

  // Notifications endpoint
  http.get('/api/notifications', () => {
    return HttpResponse.json(notifications.slice(-10)); // Last 10 notifications
  }),

  http.patch('/api/notifications/:id/read', ({ params }) => {
    const { id } = params;
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
    return HttpResponse.json({ success: true });
  }),

  // Pipeline/Kanban endpoints
  http.patch('/api/applications/:id/status', async ({ params, request }) => {
    const { id } = params;
    const { status } = await request.json() as { status: string };
    
    const application = applications.find(app => app.id === id);
    if (application) {
      application.status = status as any;
    }
    
    return HttpResponse.json(application);
  }),

  // Messages endpoints
  http.get('/api/messages', () => {
    const mockMessages = [
      {
        id: '1',
        senderId: 'employer-1',
        receiverId: 'candidate-1',
        content: 'Thank you for your application. We would like to schedule an interview.',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: false
      },
      {
        id: '2',
        senderId: 'candidate-1', 
        receiverId: 'employer-1',
        content: 'Thank you for considering my application. I am available for an interview.',
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        read: true
      }
    ];
    
    return HttpResponse.json(mockMessages);
  }),

  http.post('/api/messages', async ({ request }) => {
    const messageData = await request.json() as any;
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      ...messageData,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    return HttpResponse.json(newMessage);
  })
];