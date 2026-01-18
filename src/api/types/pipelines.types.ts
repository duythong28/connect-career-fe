import { Job } from "./jobs.types";

export interface PipelineCreateDto {
  name: string;
  organizationId?: string;
  description?: string;
  stages?: PipelineStage[];
  transitions?: PipelineTransition[];
}

export interface PipelineUpdateDto {
  name?: string;
  description?: string;
  active?: boolean;
  organizationId?: string;
  stages?: PipelineStage[];
  transitions?: PipelineTransition[];
}

export interface StageCreateDto {
  key: string;
  name: string;
  description?: string;
  order: number;
  isActive?: boolean;
}

export interface TransitionCreateDto {
  fromStageKey: string;
  toStageKey: string;
  name?: string;
  description?: string;
}

export interface JobAssignDto {
  jobId: string;
}

export interface SalaryDetails {
  currency: string;
  maxAmount: number;
  minAmount: number;
  paymentPeriod: string;
}

export interface PipelineStage {
  id?: string;
  pipelineId?: string;
  key: string;
  name: string;
  type?: string;
  order: number;
  terminal?: boolean;
}

export interface PipelineTransition {
  id?: string;
  pipelineId?: string;
  fromStageKey: string;
  toStageKey: string;
  actionName?: string;
  allowedRoles?: string[];
}

export interface Pipeline {
  id?: string;
  organizationId?: string | null;
  jobs?: Job[];
  name: string;
  active?: boolean;
  description?: string | null;
  stages?: PipelineStage[];
  transitions?: PipelineTransition[];
  createdAt?: string;
  updatedAt?: string;
}
