import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFetchWallet } from "@/hooks/useFetchWallet";

import { CirclePlus } from "lucide-react";
import { useCallback, useMemo, useState, useEffect } from "react";
import { AddFundsModal } from "./_components/AddFundsModal";
import type { OrgInfoContext } from "@/types/contexts";
import { useNavigate, useOutletContext, useSearchParams } from "react-router";
import { toast } from "sonner";
import type { Transaction } from "@/types/transactions";
import { useMutation } from "@tanstack/react-query";
import { verifyPayment } from "@/services/wallet.service";
import { RecordsLoader } from "@/components/shared/DataLoader";
import { DataTable } from "@/components/tables/DataTable";
import { TransactionsColumn } from "./_components/TransactionsColumn";
import { useFetchTransactions } from "@/hooks/useFetchTransactions";

const WalletPage = () => {
  const navigate = useNavigate();
  const { orgInfo } = useOutletContext<OrgInfoContext>();
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("limit") || "10", 10);
  const status = searchParams.get("status") || "";

  const paymentReference = useMemo(() => {
    return searchParams.get("reference") || searchParams.get("trxref");
  }, [searchParams]);

  const {
    data,
    isLoading: walletLoading,
    error: walletError,
    refetch: refetchWallet,
  } = useFetchWallet();

  const updateSearchParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== "" &&
          value !== 1 &&
          value !== 10
        ) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const queryParams = {
    page: currentPage,
    limit: pageSize,
    status,
  };

  const {
    data: transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useFetchTransactions(true, queryParams);

  const handlePageChange = useCallback(
    (page: number) => {
      updateSearchParams({ page: page > 1 ? page : undefined });
    },
    [updateSearchParams]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      updateSearchParams({
        limit: newPageSize !== 10 ? newPageSize : undefined,
        page: undefined,
      });
    },
    [updateSearchParams]
  );

  const verifyPaymentMutation = useMutation({
    mutationFn: verifyPayment,
    onSuccess: (result) => {
      // console.log(result);

      if (result.message) {
        toast.success(result.message);
      }

      cleanUpReferenceParam();

      setTimeout(() => {
        Promise.all([refetchWallet(), refetchTransactions()])
          .then(() => {
            console.log("Data refetched successfully");
            setHasVerified(false);
          })
          .catch((error) => {
            console.error("Error refetching data:", error);
          });
      }, 100);
    },
    onError: (error) => {
      console.error("Verification error:", error);
      toast.error(error?.message || "Verification failed");

      cleanUpReferenceParam();
      setHasVerified(false);
    },
  });

  const cleanUpReferenceParam = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("reference");
    params.delete("trxref");
    params.delete("amount");
    params.delete("status");

    const newUrl = `${location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    navigate(newUrl, { replace: true });
  }, [searchParams, navigate]);

  useEffect(() => {
    if (
      paymentReference &&
      !verifyPaymentMutation.isPending &&
      !verifyPaymentMutation.isSuccess &&
      !hasVerified
    ) {
      console.log("Starting verification for reference:", paymentReference);
      setHasVerified(true);
      verifyPaymentMutation.mutate(paymentReference);
    }
  }, [paymentReference, verifyPaymentMutation, hasVerified]);

  useEffect(() => {
    if (!paymentReference) {
      setHasVerified(false);
    }
  }, [paymentReference]);

  const loading =
    walletLoading || transactionsLoading || verifyPaymentMutation.isPending;
  const error = walletError?.message || transactionsError?.message;

  return (
    <div className="p-4">
      <div>
        <div className="text-sm text-gray-500">Total Balance</div>
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-light">
              ₦ {data?.wallet.balance.toLocaleString() ?? "0"}
            </span>
            <Badge variant="outline" className="rounded-lg py-1.5 px-3 gap-2">
              <img
                src={import.meta.env.VITE_APP_NGN_FLAG}
                alt="NGN Logo"
                style={{ width: "20px", height: "auto" }}
              />
              <span className="text-xs font-light">NGN</span>
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={() => setShowAddFundsModal(true)}
              className="bg-transparent font-normal border rounded-full text-sm hover:opacity-80 px-2 h-10 transition"
            >
              <span>Add funds</span>
              <CirclePlus className="text-indigo-700 size-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <RecordsLoader
            isLoading={loading}
            error={error}
            recordType="Requests"
            retryAction={refetchTransactions || refetchWallet}
          >
            <DataTable<Transaction, unknown>
              columns={TransactionsColumn}
              data={transactions?.data.transactions || []}
              paginationMeta={{
                page: currentPage,
                limit: pageSize,
                total: transactions?.data.pagination.total || 0,
                totalPages: transactions?.data.pagination.totalPages || 1,
                hasPreviousPage: currentPage > 1,
                hasNextPage:
                  currentPage < (transactions?.data.pagination.totalPages || 1),
              }}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </RecordsLoader>
        </div>
      </div>
      <AddFundsModal
        onClose={() => setShowAddFundsModal(false)}
        isOpen={showAddFundsModal}
        onSuccess={() => {
          refetchWallet();
          // refetchTransactions();
        }}
        defaultEmail={orgInfo.user.email}
      />
    </div>
  );
};

export default WalletPage;
