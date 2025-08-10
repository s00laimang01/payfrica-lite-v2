import type { ITransaction } from "@/types";
import type { FC } from "react";
import { TableCell, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calendar,
  Hash,
  User,
} from "lucide-react";
import { APP_CONSTANTS } from "@/lib/constant";
import { payfricalitev2 } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import Link from "next/link";

export const TransactionTableItem: FC<ITransaction> = ({ ...transaction }) => {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-100";
      case "pending":
        return "bg-yellow-100";
      case "failed":
        return "bg-red-100";
      case "refunded":
        return "bg-purple-100";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "sell":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "buy":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <RefreshCw className="w-4 h-4 text-blue-600" />;
    }
  };

  const getAmountColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "sell":
        return "text-green-600";
      case "buy":
        return "text-red-600";
      default:
        return "text-gray-900";
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const formattedAmount = payfricalitev2.formatCurrency(amount, "NGN");
    const prefix =
      type.toLowerCase() === "credit" || type.toLowerCase() === "deposit"
        ? "+"
        : "-";
    return `${prefix}${formattedAmount}`;
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <TableRow className="cursor-pointer hover:bg-muted/50 transition-colors duration-200 group">
          <TableCell className="py-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {format(transaction.createdAt!, "MMM dd, yyyy")}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(transaction.createdAt!, "HH:mm")}
              </span>
            </div>
          </TableCell>

          <TableCell className="py-4">
            <div className="flex items-center gap-2">
              {getTransactionIcon(transaction.type)}
              <span className="capitalize font-medium text-sm">
                {transaction.type}
              </span>
            </div>
          </TableCell>

          <TableCell className="py-4">
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Image
                    src={
                      APP_CONSTANTS.VERCEL_AVATAR +
                      `/${transaction.from?.id || "/placeholder.svg"}`
                    }
                    alt={transaction.from?.id! || "Usdc"}
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-background shadow-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground truncate max-w-20">
                    {transaction.from?.label || transaction.from?.id || "USDC"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Image
                    src={
                      APP_CONSTANTS.VERCEL_AVATAR +
                      `/${transaction.to?.id || "/placeholder.svg"}`
                    }
                    alt={transaction.to?.id! || "Naira"}
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-background shadow-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground truncate max-w-20">
                    {transaction.to?.label || transaction.to?.id || "Naira"}
                  </span>
                </div>
              </div>
            </div>
          </TableCell>

          <TableCell className="py-4">
            <div className="">
              <span
                className={cn(
                  "font-semibold text-sm",
                  getAmountColor(transaction.type)
                )}
              >
                {formatAmount(transaction.amount, transaction.type)}
              </span>
            </div>
          </TableCell>

          <TableCell className="py-4">
            <Badge
              variant="outline"
              className={cn(
                "capitalize text-xs font-bold px-2 py-1",
                getStatusColor(transaction.status),
                getStatusVariant(transaction.status)
              )}
            >
              {transaction.status}
            </Badge>
          </TableCell>
        </TableRow>
      </HoverCardTrigger>

      <HoverCardContent className="w-80" side="top">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Transaction Details</h4>
            <Badge
              variant="outline"
              className={cn(
                "capitalize text-xs font-bold",
                getStatusColor(transaction.status),
                getStatusVariant(transaction.status)
              )}
            >
              {transaction.status}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Transaction ID</p>
                <p className="text-sm font-mono">{transaction._id || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Date & Time</p>
                <p className="text-sm">
                  {format(transaction.createdAt!, "PPP 'at' p")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">From → To</p>
                <p className="text-sm">
                  {transaction.from?.label || transaction.from?.id || "USDC"} →{" "}
                  {transaction.to?.label || transaction.to?.id || "Naira"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {getTransactionIcon(transaction.type)}
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    getAmountColor(transaction.type)
                  )}
                >
                  {formatAmount(transaction.amount, transaction.type)}
                </p>
              </div>
            </div>

            {/*{transaction.description && (
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm">{transaction.description}</p>
              </div>
            )}*/}
          </div>

          <Separator />
          <div className="space-y-2">
            <Button asChild variant="secondary" className="w-full">
              <Link href={`/reciept/${transaction.reference}`}>
                View Reciept
              </Link>
            </Button>
            <Button className="w-full">Download Reciept</Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
