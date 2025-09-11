import type { Organisation } from "./organisation";
import type { User } from "./user";

export type OrgInfoContext = {
  orgInfo: {
    user: User;
    organisation: Organisation;
  };
  refetch: () => void;
};
