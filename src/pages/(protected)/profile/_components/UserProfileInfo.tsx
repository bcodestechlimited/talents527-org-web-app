import type { User } from "@/types/user-profile";
import { Mail, Phone, Building, Calendar, Shield, CheckCircle, XCircle } from "lucide-react";

interface UserProfileInfoProps {
  user: User;
}

export const UserProfileInfo = ({ user }: UserProfileInfoProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
        <p className="text-sm text-gray-500 mt-0.5">Your personal details.</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              First Name
            </label>
            <p className="text-sm text-gray-900">{user.firstName}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Last Name
            </label>
            <p className="text-sm text-gray-900">{user.lastName}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Email
            </label>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-900">{user.email}</p>
              {user.emailVerified ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Organisation
            </label>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-900">{user.orgName}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Role
            </label>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-900 capitalize">{user.role}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Member Since
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
