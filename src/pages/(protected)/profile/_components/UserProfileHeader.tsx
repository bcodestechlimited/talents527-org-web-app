import { User, Shield, CheckCircle } from "lucide-react";
import type { User as UserType } from "@/types/user-profile";

interface UserProfileHeaderProps {
  user: UserType;
}

export const UserProfileHeader = ({ user }: UserProfileHeaderProps) => {
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600" />
      <div className="px-6 pb-6 relative h-24">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-[95%] absolute -top-10 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {initials ? (
                <span className="text-2xl font-bold text-indigo-600">{initials}</span>
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 sm:pt-0">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{user.orgName}</p>
            </div>
            <div className="flex gap-2">
              {user.emailVerified && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Email Verified
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200">
                <Shield className="w-3.5 h-3.5" />
                {user.role === "organisation" ? "Organisation" : user.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
