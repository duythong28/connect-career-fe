export enum ReportStatus {
  PENDING = "pending",
  UNDER_REVIEW = "under_review",
  RESOLVED = "resolved",
  DISMISSED = "dismissed",
  CLOSED = "closed",
}

export type ReportEntityType = "job" | "user" | "organization" | "refund";

export interface Report {
  id: string;
  reporterId: string;
  entityType: ReportEntityType;
  entityId: string;
  reason: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high";
  metadata?: Record<string, any>;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  adminNotes?: string | null;
}

export interface CreateReportDto {
  entityType: ReportEntityType;
  entityId: string;
  reason: string;
  subject: string;
  description: string;
  priority?: "low" | "medium" | "high";
  metadata?: Record<string, any>;
}

export interface UpdateReportStatusDto {
  status: ReportStatus;
  adminNotes?: string;
}

export interface ReportsResponse {
  data: Report[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Report reasons specific to each entity type
export enum UserReportReason {
  INAPPROPRIATE_BEHAVIOR = 'inappropriate_behavior',
  SPAM = 'spam',
  FAKE_ACCOUNT = 'fake_account',
  HARASSMENT = 'harassment',
  IMPERSONATION = 'impersonation',
  FRAUD = 'fraud',
  OTHER = 'other',
}

export enum OrganizationReportReason {
  FAKE_COMPANY = 'fake_company',
  SCAM = 'scam',
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  MISLEADING_INFO = 'misleading_info',
  OTHER = 'other',
}

export enum JobReportReason {
  FAKE_JOB = 'fake_job',
  SCAM = 'scam',
  MISLEADING_DESCRIPTION = 'misleading_description',
  DISCRIMINATORY = 'discriminatory',
  DUPLICATE = 'duplicate',
  EXPIRED = 'expired',
  OTHER = 'other',
}

export enum RefundReportReason {
  FRAUD = 'fraud',
  MISLEADING_INFO = 'misleading_info',
  WRONG_AMOUNT = 'wrong_amount',
  WRONG_CURRENCY = 'wrong_currency',
  WRONG_PAYMENT_METHOD = 'wrong_payment_method',
  WRONG_PAYMENT_STATUS = 'wrong_payment_status',
  WRONG_PAYMENT_DATE = 'wrong_payment_date',
  WRONG_PAYMENT_TIME = 'wrong_payment_time',
  OTHER = 'other',
}