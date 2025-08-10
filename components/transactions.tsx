"use client";

import { useMediaQuery } from "@/hooks";
import React, { Dispatch, FC, SetStateAction } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { PayfricaLiteV2 } from "@/lib/utils";
import { useWallet } from "@suiet/wallet-kit";
import { useQuery } from "@tanstack/react-query";
import { TransactionTableItem } from "./transaction-table-item";
import { Logo } from "./logo";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { MobileTransactionItem } from "./mobile-transaction-item";
import { ITransactionFilters } from "@/types";

export const Transactions: FC<{
  transactionFilters?: ITransactionFilters;
  setTransactionFilters?: Dispatch<
    SetStateAction<ITransactionFilters | undefined>
  >;
}> = ({ transactionFilters }) => {
  const isMobile = useMediaQuery("(max-width:767px)");
  const { address } = useWallet();

  const payfricalitev2 = new PayfricaLiteV2(address);

  const { isLoading, data, error } = useQuery({
    queryKey: ["transactions", address, transactionFilters],
    queryFn: () =>
      payfricalitev2.getTransactions({
        ...transactionFilters,
        sortOrder: "desc",
        sortBy: "createdAt",
      }),
  });

  const todayTransactions = data?.data.transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.createdAt!);
    const today = new Date();
    return (
      transactionDate.getDate() === today.getDate() &&
      transactionDate.getMonth() === today.getMonth() &&
      transactionDate.getFullYear() === today.getFullYear()
    );
  });

  const yesterdayTransactions = data?.data.transactions.filter(
    (transaction) => {
      const transactionDate = new Date(transaction.createdAt!);
      const today = new Date();
      today.setDate(today.getDate() - 1);
      return (
        transactionDate.getDate() === today.getDate() &&
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getFullYear() === today.getFullYear()
      );
    }
  );

  const restDaysTransactions = data?.data.transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.createdAt!);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Check if transaction is neither from today nor yesterday
    const isToday =
      transactionDate.getDate() === today.getDate() &&
      transactionDate.getMonth() === today.getMonth() &&
      transactionDate.getFullYear() === today.getFullYear();

    const isYesterday =
      transactionDate.getDate() === yesterday.getDate() &&
      transactionDate.getMonth() === yesterday.getMonth() &&
      transactionDate.getFullYear() === yesterday.getFullYear();

    return !isToday && !isYesterday;
  });

  if (isLoading) {
    return (
      <div className="flex mt-[15rem] items-center justify-center">
        <Logo showImage showName className="animate-pulse text-3xl" />
      </div>
    );
  }

  if (!data?.data.transactions.length) {
    return (
      <div className="flex items-center justify-center flex-col gap-3 mt-20">
        <Image src="/no-data.svg" alt="no data" width={200} height={200} />
        <p className="text-center text-gray-500 text-2xl">
          No transactions found
        </p>
        <p className="text-center">
          There is not a single transaction that matches your filter or you have
          no transactions.
        </p>
        <Button asChild className="w-[15rem] h-[2.5rem]">
          <Link href="/">Trade Now</Link>
        </Button>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="mt-5 flex flex-col gap-3">
        {!!todayTransactions?.length && (
          <div>
            <h2 className="text-xl font-semibold">Today</h2>
            {todayTransactions?.map((transaction) => (
              <MobileTransactionItem
                key={transaction.reference}
                {...transaction}
              />
            ))}
          </div>
        )}
        {!!yesterdayTransactions?.length && (
          <div>
            <h2>Yesterday</h2>
            {yesterdayTransactions?.map((transaction) => (
              <MobileTransactionItem
                key={transaction.reference}
                {...transaction}
              />
            ))}
          </div>
        )}
        {!!restDaysTransactions?.length && (
          <div>
            <h2>Others</h2>
            {restDaysTransactions?.map((transaction) => (
              <MobileTransactionItem
                key={transaction.reference}
                {...transaction}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {" "}
      <Table className="mt-10">
        <TableCaption>Record of your recent transactions.</TableCaption>
        <TableHeader className="">
          <TableRow className="bg-primary/5 h-10">
            <TableHead className="w-[200px]">Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Coins</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.transactions?.map((transaction) => (
            <TransactionTableItem
              key={transaction.reference}
              {...transaction}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
