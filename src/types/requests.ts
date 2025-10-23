import type { Organisation } from "./organisation";
import type { Pagination } from "./pagination";
import type { Asset } from "./upload";

export type PlanType = "basic" | "standard" | "enterprise";
export type EmploymentType = "full-time" | "part-time" | "contract";
export type WorkScheduleType = "office-hours" | "shifts";
export type ModeOfWorkType = "on-site" | "remote" | "hybrid";
export type GenderPreferenceType = "no-preference" | "male" | "female";

export interface Request {
  _id: string;
  selectedPlan: PlanType;
  planCost: number;
  title: string;
  candidateRole: string;
  requestRequirements: string;
  employmentType: EmploymentType;
  workSchedule: WorkScheduleType;
  resumptionTime?: string;
  closingTime?: string;
  startDate: Date;
  endDate?: Date;
  workHours?: string;
  workDays: string;
  workSiteAddress: string;
  modeOfWork: ModeOfWorkType;
  language: string;
  genderPreference: GenderPreferenceType;
  organisation: string | Organisation;
  documents: string[] | Asset[];
  status: "in-progress" | "completed" | "submitted" | "rejected";
  createdAt: string;
  updatedAt: string;

  escrow: {
    _id: string;
    heldAmount: number;
    releasedAmount: number;
    status: "funded" | "releasing" | "pending" | "completed";
    createdAt: string;
    updatedAt: string;
  };
}

export interface GetRequestByIdResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    request: Request;
  };
}

export interface GetAllRequestsResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    requests: Request[];
    pagination: Pagination;
  };
}

export interface UpdateRequestPayload {
  title?: string;
  candidateRole?: string;
  requestRequirements?: string;
  employmentType?: "full-time" | "part-time" | "contract";
  workSchedule?: "office-hours" | "shifts";
  resumptionTime?: string;
  closingTime?: string;
  startDate?: Date;
  endDate?: Date;
  workHours?: string;
  workDays?: string;
  workSiteAddress?: string;
  modeOfWork?: "on-site" | "remote" | "hybrid";
  language?: string;
  genderPreference?: "no-preference" | "male" | "female";
}

export interface CreateRequestPayload {
  selectedPlan: PlanType;
  planCost: number;
  title: string;
  candidateRole: string;
  requestRequirements: string;
  employmentType: EmploymentType;
  workSchedule: WorkScheduleType;
  resumptionTime?: string;
  closingTime?: string;
  startDate: Date;
  endDate?: Date;
  workHours?: string;
  workDays: string;
  workSiteAddress: string;
  modeOfWork: ModeOfWorkType;
  language: string;
  genderPreference: GenderPreferenceType;
}

export interface CreateRequestResponse {
  message: string;
  newRequest: Request;
}
