import type { Organisation } from "./organisation";
import type { Pagination } from "./pagination";
import type { Asset } from "./upload";

export type PlanType = "basic" | "standard" | "enterprise";
export type EmploymentType = "full-time" | "part-time" | "contract";
export type WorkScheduleType = "office-hours" | "shifts";
export type ModeOfWorkType = "on-site" | "remote" | "hybrid";
export type GenderPreferenceType = "no-preference" | "male" | "female";
export type StatusType =
  | "submitted"
  | "accepted"
  | "rejected"
  | "candidates-attached"
  | "org-accepted"
  | "org-rejected"
  | "completed";

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
  status: StatusType;
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

export interface MarkAsHiredResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    professional: {
      _id: string;
      firstName: string;
      lastName: string;
      profession: string;
      isHired: boolean;
    };
    request: {
      _id: string;
      title: string;
      candidateRole: string;
    };
  };
}

export interface ShortlistedCandidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
  phone: string;
  gender: string;
  age: number;
  yearsOfExperience: number;
  location: {
    country: string;
    state: string;
    address: string;
  };
  salaryExpectation: {
    min: number;
    max: number;
  };
  imageUrl?: string;
  resumeUrl?: string;
  portfolio: string;
  about: string;
  coreSkills: string[];
  industry: {
    _id: string;
    name: string;
  };
  qualifications: Array<{
    _id: string;
    name: string;
  }>;
  skills: Array<{
    _id: string;
    name: string;
  }>;
  languages: Array<{
    _id: string;
    name: string;
  }>;
  isHired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetShortlistedCandidatesResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    request: {
      _id: string;
      title: string;
      candidateRole: string;
      status: string;
      selectedPlan: string;
      planCost: number;
      employmentType: string;
      workSchedule: string;
      modeOfWork: string;
      startDate: Date;
      endDate?: Date;
      workDays: string;
      workSiteAddress: string;
      escrow: {
        _id: string;
        heldAmount: number;
        releasedAmount: number;
        status: string;
      };
    };
    candidates: ShortlistedCandidate[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
}

export interface GetShortlistedCandidatesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AcceptRejectCandidatesResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    request: Request;
    wallet: {
      balance: number;
      holds: number;
    };
    escrow: {
      heldAmount: number;
      releasedAmount: number;
      status: string;
    };
    amountReleased?: number;
    amountRefunded?: number;
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
