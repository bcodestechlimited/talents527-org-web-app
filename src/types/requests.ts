import type { Pagination } from "./pagination";

export interface Request {
  _id: string;
  requestId: string;
  title: string;
  candidateRole: string;
  numberOfCandidates: number;
  requestRequirements: string;
  employmentType: "full-time" | "part-time" | "contract";
  workSchedule: "office-hours" | "shifts";
  modeOfWork: "on-site" | "remote" | "hybrid";
  workHours: string;
  startDate: Date;
  endDate: Date;
  resumptionTime: string;
  closingTime: string;
  workDays: string;
  workSiteAddress: string;
  language: string;
  genderPreference: string;
  specialNotes: string;
  documents: string[];
  status: "submitted" | "in-progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAllRequestsResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    documents: Request[];
    pagination: Pagination;
  };
}
