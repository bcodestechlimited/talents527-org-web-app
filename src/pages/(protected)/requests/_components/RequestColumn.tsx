import { Badge } from "@/components/ui/badge";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
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
    accessorKey: "assignedTo",
    header: () => <div className="pl-2">Selected Plan</div>,
    cell: ({ row }) => <div className="pl-2 capitalize">{row.original.selectedPlan}</div>,
  },
  {
    accessorKey: "planCost",
    header: () => <div className="pl-2">Plan Cost</div>,
    cell: ({ row }) => <div className="pl-2">₦{row.original.planCost.toLocaleString()}</div>,
  },
  {
    accessorKey: "status",
    header: () => <div className="pl-2">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <div className="pl-2">
          <Badge
            variant="outline"
            className={`px-3 py-1 text-sm rounded-full font-normal capitalize border-none ${
              status === "submitted"
                ? "bg-sky-100 text-royalblue"
                : status === "in-progress"
                ? "bg-amber-100 text-orange-600"
                : status === "completed"
                ? "bg-emerald-100 text-emerald-600"
                : "bg-rose-100 text-rose-600"
            }`}
          >
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-2">Actions</div>,
    cell: ({ row }) => {
      const entry = row.original;
      return (
        <div className="pl-2">
          <Link to={entry._id} state={{ entry }}>
            <Button size="sm" variant="ghost" className="cursor-pointer">
              View
            </Button>
          </Link>
        </div>
      );
    },
  },
];
