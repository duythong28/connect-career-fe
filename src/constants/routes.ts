export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  JOBS: "/jobs",
  JOB_DETAIL: "/jobs/:id",
  COMPANY_PROFILE: "/companies/:companyId",
  CANDIDATE_PUBLIC_PROFILE: "/candidates/:candidateId",

  // Candidate routes
  CANDIDATE: {
    DASHBOARD: "/candidate/dashboard",
    PROFILE: "/candidate/profile",
    APPLICATIONS: "/candidate/applications",
    INTERVIEWS: "/candidate/interviews",
    SAVED_JOBS: "/candidate/saved",
    MESSAGES: "/candidate/messages",
    CHATBOT: "/candidate/chatbot",
    SETTINGS: "/candidate/settings",
    CREATE_ORGANIZATION: "/candidate/create-organization",
    RESUME_IMPROVEMENT: "/candidate/resume-improvement",
  },

  // Company routes (accessed by candidates)
  COMPANY: {
    DASHBOARD: "/dashboard",
    PROFILE: "/company",
    POST_JOB: "/post-job",
    JOBS: "/jobs",
    PIPELINE: "/pipeline",
    CANDIDATES: "/candidates",
    INTERVIEWS: "/interviews",
    MESSAGES: "/messages",
    CHATBOT: "/chatbot",
    ANALYTICS: "/analytics",
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
