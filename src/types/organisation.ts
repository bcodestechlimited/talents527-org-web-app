import type { Document } from "./documents";
import type { Asset } from "./upload";
import type { User } from "./user";

export interface Organisation {
  _id?: string;
  orgName: string;
  role: string;
  website: string;
  industry: string;
  orgType: string;
  orgSize: string;
  logo?: string;
  logoId?: Asset;
  user: string;
  aboutOrg: string;
  location: {
    country: string;
    state: string;
    address: string;
  };
  socials: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  requestDocsIds: Document[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FetchOrgResponse {
  status_code: string;
  message: string;
  user: User;
  organisation: Organisation;
}

export interface UserSettingsData {
  name?: string;
  isTwoFactorEnabled?: boolean;
  email?: string;
  password?: string;
  newPassword?: string;
}

export interface UserSettingsResponse {
  status_code: string;
  success: boolean;
  message: string;
  user: User;
}
export interface CreateOrgResponse {
  status_code: string;
  message: string;
  data: null;
}

export interface UpdateOrganisationData {
  organisation?: Partial<Organisation>;
  user?: Partial<User>;
}

export interface UpdateOrganisationResponse {
  success: boolean;
  message: string;
  user: User;
  organisation: Organisation;
}

export interface CreateOrgData {
  orgName: string;
  role: string;
  website: string;
  industry: string;
  orgSize: string;
  location: {
    country: string;
    state: string;
    address: string;
  };
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
}
