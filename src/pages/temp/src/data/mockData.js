export const mockApplications = [
  {
    id: 1,
    jobTitle: "Senior Frontend Developer",
    company: "Tech Corp",
    dateApplied: "2025-10-01",
    status: "Interview 2",
    stage: 2,
    offerReceived: false,
    feedbacks: [
      { id: 1, message: "Great first interview! Looking forward to the technical round.", date: "2 days ago" },
      { id: 2, message: "Your portfolio is impressive.", date: "5 days ago" }
    ],
    offer: null,
    canReview: false
  },
  {
    id: 2,
    jobTitle: "UX Designer",
    company: "Design Studio",
    dateApplied: "2025-09-28",
    status: "Screening",
    stage: 0,
    offerReceived: false,
    feedbacks: [],
    offer: null,
    canReview: false
  },
  {
    id: 3,
    jobTitle: "Product Manager",
    company: "StartupXYZ",
    dateApplied: "2025-10-10",
    status: "Offer Received",
    stage: 3,
    offerReceived: true,
    feedbacks: [
      { id: 1, message: "We were very impressed with your interview performance!", date: "1 day ago" }
    ],
    offer: {
      salary: "$150,000",
      startDate: "2025-11-01",
      details: "Full benefits package including health insurance, 401k matching, and equity options."
    },
    canReview: false
  },
];

export const mockPipelines = [
  {
    id: 1,
    name: "Standard Tech",
    stages: [
      { name: "Screening", type: "screening" },
      { name: "Technical Interview", type: "interview" },
      { name: "Team Interview", type: "interview" },
      { name: "Offer", type: "offer" },
      { name: "Hired", type: "terminal" },
      { name: "Rejected", type: "terminal" },
    ],
  },
  {
    id: 2,
    name: "Sales Pipeline",
    stages: [
      { name: "Screening", type: "screening" },
      { name: "Phone Interview", type: "interview" },
      { name: "Final Interview", type: "interview" },
      { name: "Offer", type: "offer" },
      { name: "Hired", type: "terminal" },
      { name: "Rejected", type: "terminal" },
    ],
  },
];

export const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    status: "Active",
    pipelineId: 1,
    applicants: 12,
  },
  {
    id: 2,
    title: "Backend Engineer",
    status: "Active",
    pipelineId: 1,
    applicants: 8,
  },
  {
    id: 3,
    title: "Sales Manager",
    status: "Draft",
    pipelineId: 2,
    applicants: 0,
  },
];

export const mockCandidates = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    stage: 0,
    matchScore: 92,
    avatar: "JD",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    stage: 0,
    matchScore: 88,
    avatar: "JS",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    stage: 1,
    matchScore: 85,
    avatar: "MJ",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    stage: 2,
    matchScore: 95,
    avatar: "SW",
  },
];

export const mockInterviews = [
  {
    id: 1,
    company: "Tech Corp",
    position: "Senior Frontend Developer",
    type: "Technical Interview",
    date: "Monday, Oct 21",
    time: "10:00 AM",
    interviewer: "Sarah Johnson",
  },
  {
    id: 2,
    company: "Design Studio",
    position: "UX Designer",
    type: "Portfolio Review",
    date: "Tuesday, Oct 22",
    time: "2:00 PM",
    interviewer: "Mike Chen",
  },
  {
    id: 3,
    company: "StartupXYZ",
    position: "Product Manager",
    type: "Final Interview",
    date: "Friday, Oct 25",
    time: "11:00 AM",
    interviewer: "Lisa Park",
  },
];