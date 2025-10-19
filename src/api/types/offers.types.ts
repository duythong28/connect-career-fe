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

export interface OfferUpdateDto {
  baseSalary?: number;
  currency?: string;
  salaryPeriod?: "YEARLY" | "MONTHLY" | string;
  signingBonus?: number;
  equity?: string;
  benefits?: string[];
  notes?: string;
  offeredBy?: string;
  isNegotiable?: boolean;
}

export interface OfferCandidateResponseDto {
  response: "ACCEPTED" | "DECLINED" | "COUNTER" | string;
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
}