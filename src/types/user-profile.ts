export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isOrgSetup: boolean;
  isEmpSetup: boolean;
  isProSetup: boolean;
  orgName: string;
  isTwoFactorEnabled: boolean;
  role: string;
  userStatus: string;
  isAdmin: boolean;
  emailVerified: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserProfileResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    user: User;
  };
}

export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserProfileResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    user: User;
  };
}
