"use client";

import TransactionReceipt from "@/components/transaction-reciept";
import { NavBar } from "@/components/ui/navbar";
import { APP_CONSTANTS } from "@/lib/constant";
import { PayfricaLiteV2 } from "@/lib/utils";
import { useWallet } from "@suiet/wallet-kit";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const { reference = "" } = useParams() as { reference: string };
  const { address = "" } = useWallet();
  const payfricalitev2 = new PayfricaLiteV2(address);

  const { isLoading, data, error, isEnabled } = useQuery({
    queryKey: ["transaction", reference],
    queryFn: () => payfricalitev2.getTransaction(reference),
    enabled: !!reference && !!address,
  });

  const handleDeleteTransaction = () => {
    // Implement delete functionality
    console.log("Delete transaction:", reference);
  };

  if (isLoading || !isEnabled) {
    return (
      <div className="md:max-w-6xl w-full p-3 mx-auto">
        <NavBar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:max-w-6xl w-full p-3 mx-auto">
        <NavBar />
        <div className="flex items-center justify-center h-64">
          <p className="text-red-600">Failed to load transaction details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:max-w-6xl w-full p-3 mx-auto">
      <NavBar />
      <div className="mt-5">
        <TransactionReceipt
          transaction={data!}
          fees={0.5}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </div>
  );
};

export default Page;
