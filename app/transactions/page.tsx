"use client";

import { TransactionFilters } from "@/components/transaction-filters";
import { Transactions } from "@/components/transactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavBar } from "@/components/ui/navbar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePayfricaV2Store } from "@/lib/store.zustand";
import { ITransactionFilters } from "@/types";
import { SlidersHorizontalIcon } from "lucide-react";
import React, { useState } from "react";

const Page = () => {
  const { user } = usePayfricaV2Store();
  const [transactionFilters, setTransactionFilters] =
    useState<ITransactionFilters>();

  return (
    <div className="max-w-6xl mx-auto p-3 w-full pb-20">
      <NavBar />
      <div className="mt-5 space-y-4">
        <header className=" flex items-center gap-3">
          <Input
            value={transactionFilters?.search || ""}
            onChange={(e) => {
              setTransactionFilters({
                ...transactionFilters,
                search: e.target.value,
              });
            }}
            placeholder="Search with type, address or chains"
            className="h-[3rem] rounded-2xl md:text-lg"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <TransactionFilters
                key={user?.createdAt}
                user={user}
                transactionFilters={transactionFilters}
                setTransactionFilters={setTransactionFilters}
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-[3rem] rounded-2xl"
                >
                  <SlidersHorizontalIcon />
                </Button>
              </TransactionFilters>
            </TooltipTrigger>
            <TooltipContent side="bottom">Filter Transactions</TooltipContent>
          </Tooltip>
        </header>
        <h2 className="md:text-5xl text-3xl font-light">History</h2>
      </div>
      <Transactions
        transactionFilters={transactionFilters}
        setTransactionFilters={setTransactionFilters}
      />
    </div>
  );
};

export default Page;
