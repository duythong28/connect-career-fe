export interface OfferCreateDto {
  baseSalary: number;
  currency: string;
  salaryPeriod?: "YEARLY" | "MONTHLY" | string;
  signingBonus?: number;
  equity?: string;
  benefits?: string[];
  notes?: string;
  offeredBy?: string;
  isNegotiable?: boolean;
}

export enum SalaryPeriod {
  HOURLY = "hourly",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
  PROJECT = "project",
}

export interface OfferUpdateDto {
  baseSalary?: number;
  currency?: string;
  salaryPeriod?: SalaryPeriod;
  signingBonus?: number;
  equity?: string;
  benefits?: string[];
  notes?: string;
  offeredBy?: string;
  isNegotiable?: boolean;
}

export enum OfferStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export interface OfferCandidateResponseDto {
  response: OfferStatus;
  candidateNotes?: string;
  recordedBy?: string;
}

export interface OfferResponse {
  id: string;
  applicationId: string;
  baseSalary: number;
  currency: string;
  salaryPeriod?: string;
  signingBonus?: number;
  equity?: string;
  benefits?: string[];
  notes?: string;
  offeredBy?: string;
  isNegotiable?: boolean;
  createdAt?: string;
  updatedAt?: string;
  status: OfferStatus;
}
