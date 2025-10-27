export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: number;
  role: "organisation";
  orgName: string;
  isOrgSetup: boolean;
  emailVerified: Date;
  logoId: {
    _id: string;
    url: string;
    originalName: string;
    public_id: string;
    assetType: string;
    entityType: string;
  };
  isTwoFactorEnabled: boolean;
}

export interface Professional {
  _id: string;
  firstName: string;
  lastName: string;
  profession: string;
  phone: string;
  age: number;
  yearsOfExperience: number;
  location: {
    country: string;
    state: string;
    address: string;
  };
  imageId?: {
    url: string;
  };
  resumeId?: {
    url: string;
  };
  industry?: {
    _id: string;
    name: string;
  };
  skills: [
    {
      _id: string;
      name: string;
    }
  ];
  languages: {
    _id: string;
    name: string;
  }[];
  user: {
    _id: string;
    email: string;
    emailVerified: Date | null;
    userStatus: string;
  };
  salaryExpectation: {
    min: 500000;
    max: 900000;
  };

  qualifications: [
    {
      _id: "68d100376a210801011e7109";
      name: "AWS Security";
    }
  ];
  createdAt: string;
}