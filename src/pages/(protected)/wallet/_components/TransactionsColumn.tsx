import { Badge } from "@/components/ui/badge";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import type { Transaction } from "@/types/transactions";
import { format } from "date-fns";

export const TransactionsColumn: ColumnDef<Transaction>[] = [
  {
    accessorKey: "name",
    header: () => <div className="pl-2">Transaction Name</div>,
    cell: () => <div className="pl-2">Funded account</div>,
  },
  {
    accessorKey: "type",
    header: () => <div className="pl-2">Transaction Type</div>,
    cell: ({ row }) => (
      <div className="pl-2 capitalize">{row.original.transactionType}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="pl-2">Amount Funded</div>,
    cell: ({ row }) => (
      <div className="pl-2">₦{row.original.netAmount?.toLocaleString()}</div>
    ),
  },
  {
    accessorKey: "date",
    header: () => <div className="pl-2">Date</div>,
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return (
        <div className="pl-2">
          {format(new Date(createdAt), "d MMM yyyy, h:mm a")}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="pl-2">Status</div>,
    cell: ({ row }) => {
      const status = row.original.transactionStatus;

      return (
        <div className="pl-2">
          <Badge
            variant="outline"
            className={`px-3 py-1 text-sm rounded-full border-none capitalize ${
              status === "pending"
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
