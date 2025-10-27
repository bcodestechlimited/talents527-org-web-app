import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Award,
  Download,
  CheckCircle,
} from "lucide-react";
import UserAvatar from "./UserAvatar";
import { formatCurrency } from "@/utils/formatCurrency";
import ConfirmHireModal from "./ConfirmHireModal";
import { useMarkAsHired } from "@/hooks/useMarkAsHired";

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  profession: string;
  yearsOfExperience: number;
  age: number;
  email: string;
  phone: string;
  location: {
    state: string;
    country: string;
  };
  skills: Array<{
    _id: string;
    name: string;
  }>;
  qualifications: Array<{
    _id: string;
    name: string;
  }>;
  salaryExpectation: {
    min: number;
    max: number;
  };
  resumeUrl?: string;
  imageUrl?: string;
  isHired?: boolean;
}

interface CandidateCardProps {
  candidate: Candidate;
  requestId: string;
  requestTitle: string;
}

const CandidateCard = ({
  candidate,
  requestId,
  requestTitle,
}: CandidateCardProps) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { mutate: markAsHired, isPending: isMarkingHired } = useMarkAsHired();

  const handleMarkAsHired = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmHire = () => {
    markAsHired(
      { requestId, professionalId: candidate._id },
      {
        onSuccess: () => {
          setShowConfirmModal(false);
        },
      }
    );
  };

  const isHired = candidate.isHired;

  return (
    <>
      <Card className="p-6 shadow-none">
        <div className="flex items-start gap-4 mb-4">
          <UserAvatar
            firstName={candidate.firstName}
            lastName={candidate.lastName}
            avatarUrl={candidate.imageUrl}
            className="h-16 w-16"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {candidate.firstName} {candidate.lastName}
                </h3>
                <p className="text-sm text-gray-600">{candidate.profession}</p>
              </div>
              {isHired && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Hired
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {candidate.yearsOfExperience} years exp.
              </Badge>
              <Badge variant="outline" className="text-xs">
                {candidate.age} years old
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{candidate.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{candidate.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>
              {candidate.location.state}, {candidate.location.country}
            </span>
          </div>
        </div>

        {candidate.skills && candidate.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Skills</p>
            <div className="flex flex-wrap gap-1">
              {candidate.skills.slice(0, 5).map((skill) => (
                <Badge
                  key={skill._id}
                  variant="outline"
                  className="text-xs bg-green-50 text-green-700"
                >
                  {skill.name}
                </Badge>
              ))}
              {candidate.skills.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{candidate.skills.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {candidate.qualifications && candidate.qualifications.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">
              <Award className="h-3 w-3 inline mr-1" />
              Qualifications
            </p>
            <div className="flex flex-wrap gap-1">
              {candidate.qualifications.map((qual) => (
                <Badge
                  key={qual._id}
                  variant="outline"
                  className="text-xs bg-blue-50 text-blue-700"
                >
                  {qual.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-700 mb-1">
            Salary Expectation
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(candidate.salaryExpectation.min)} -{" "}
            {formatCurrency(candidate.salaryExpectation.max)}
          </p>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          {candidate.resumeUrl && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(candidate.resumeUrl, "_blank")}
              disabled={isMarkingHired}
            >
              <Download className="h-4 w-4 mr-2" />
              Resume
            </Button>
          )}
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={handleMarkAsHired}
            disabled={isHired || isMarkingHired}
          >
            {isMarkingHired ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Marking...
              </>
            ) : isHired ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Hired
              </>
            ) : (
              "Mark as Hired"
            )}
          </Button>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <ConfirmHireModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmHire}
        isLoading={isMarkingHired}
        candidateName={`${candidate.firstName} ${candidate.lastName}`}
        requestTitle={requestTitle}
      />
    </>
  );
};

export default CandidateCard;
