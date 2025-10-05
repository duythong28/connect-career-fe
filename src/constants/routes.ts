export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  JOBS: "/jobs",
  JOB_DETAIL: "/jobs/:id",
  COMPANY_PROFILE: "/companies/:slug",
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
  },

  // Company routes (accessed by candidates)
  COMPANY: {
    DASHBOARD: "/company/dashboard",
    PROFILE: "/company/profile",
    POST_JOB: "/company/post-job",
    JOBS: "/company/jobs",
    PIPELINE: "/company/pipeline",
    CANDIDATES: "/company/candidates",
    INTERVIEWS: "/company/interviews",
    MESSAGES: "/company/messages",
    CHATBOT: "/company/chatbot",
    ANALYTICS: "/company/analytics",
    SETTINGS: "/company/settings",
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
