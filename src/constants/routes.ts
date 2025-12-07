export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  JOBS: "/jobs",
  JOB_DETAIL: "/jobs/:id",
  COMPANY_PROFILE: "/company/:companyId/profile",
  CANDIDATE_PROFILE: "/candidate/profile/:candidateId",

  // Candidate routes
  CANDIDATE: {
    DASHBOARD: "/candidate/dashboard",
    APPLICATIONS: "/candidate/applications",
    INTERVIEWS: "/candidate/interviews",
    SAVED_JOBS: "/candidate/saved",
    MESSAGES: "/candidate/messages",
    CHATBOT: "/candidate/chatbot",
    SETTINGS: "/candidate/settings",
    AI_MOCK_INTERVIEW: "/candidate/ai-mock-interview",
    AI_AGENT_CHATBOT: "/candidate/chatbot",
    CREATE_ORGANIZATION: "/candidate/create-organization",
    JOIN_ORGANIZATION: "/candidate/join-organization",
    RESUME_IMPROVEMENT: "/candidate/resume-improvement",
    MY_REPORTS: "/candidate/my-reports",
  },

  // Company routes (accessed by candidates)
  COMPANY: {
    DASHBOARD: "/dashboard",
    POST_JOB: "/post-job",
    JOBS: "/jobs",
    PIPELINE: "/pipeline",
    CANDIDATES: "/candidates",
    INTERVIEWS: "/interviews",
    MESSAGES: "/messages",
    CHATBOT: "/chatbot",
    ANALYTICS: "/analytics",
    MEMBERS: "/members",
    SETTINGS: "/settings",
  },

  // Admin routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    CONTENT: "/admin/content",
    JOBS: "/admin/jobs",
    COMPANIES: "/admin/companies",
    REPORTS: "/admin/reports",
    REVENUE: "/admin/revenue",
    REFUNDS: "/admin/refunds",
    ANALYTICS: "/admin/analytics",
  },

  NOT_FOUND: "*",
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.JOBS,
] as const;

export const PROTECTED_ROUTES = {
  CANDIDATE: Object.values(ROUTES.CANDIDATE),
  COMPANY: Object.values(ROUTES.COMPANY),
  ADMIN: Object.values(ROUTES.ADMIN),
} as const;
