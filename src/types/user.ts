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
}
