import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import OrganisationRequestActionsPopover from "./OrganisationRequestActionsPopover";
import type { Request } from "@/types/requests";

export const RequestColumn: ColumnDef<Request>[] = [
  {
    accessorKey: "title",
    header: () => <div className="pl-2">Request Title</div>,
    cell: ({ row }) => <div className="pl-2">{row.original.title}</div>,
  },
  {
    accessorKey: "candidateRole",
    header: () => <div className="pl-2">Role Requested</div>,
    cell: ({ row }) => <div className="pl-2">{row.original.candidateRole}</div>,
  },
  {
    accessorKey: "selectedPlan",
    header: () => <div className="pl-2">Selected Plan</div>,
    cell: ({ row }) => (
      <div className="pl-2 capitalize">{row.original.selectedPlan}</div>
    ),
  },
  {
    accessorKey: "planCost",
    header: () => <div className="pl-2">Plan Cost</div>,
    cell: ({ row }) => (
      <div className="pl-2">₦{row.original.planCost.toLocaleString()}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="pl-2">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;

      const displayText: Record<string, string> = {
        submitted: "Submitted",
        accepted: "Sourcing",
        rejected: "Rejected",
        "candidates-attached": "Candidates Attached",
        "org-accepted": "Candidates Accepted",
        "org-rejected": "Org Rejected",
        completed: "Completed",
      };

      const colorMap: Record<string, string> = {
        submitted: "bg-sky-100 text-sky-700",
        accepted: "bg-amber-100 text-amber-700",
        rejected: "bg-rose-100 text-rose-600",
        "candidates-attached": "bg-indigo-100 text-indigo-700",
        "org-accepted": "bg-blue-100 text-blue-700",
        "org-rejected": "bg-rose-100 text-rose-600",
        completed: "bg-emerald-100 text-emerald-700",
      };

      return (
        <div className="pl-2">
          <Badge
            variant="outline"
            className={`px-3 py-1 text-sm rounded-full font-medium capitalize border-none ${colorMap[status]}`}
          >
            {displayText[status] ?? status}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-2">Actions</div>,
    cell: ({ row }) => {
      const request = row.original;
      return (
        <div className="flex items-center justify-center">
          <OrganisationRequestActionsPopover request={request} />
        </div>
      );
    },
  },
];