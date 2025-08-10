"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Headphones, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ITransaction, transactionStatus } from "@/types";
import { format } from "date-fns";
import Image from "next/image";
import { payfricalitev2 } from "@/lib/utils";

interface TransactionReceiptProps {
  transaction: ITransaction;
  fees?: number;
  onDelete?: () => void;
}

export default function TransactionReceipt({
  transaction,
  fees = 0.5,
  onDelete,
}: TransactionReceiptProps) {
  const [overviewExpanded, setOverviewExpanded] = useState(true);
  const [historyExpanded, setHistoryExpanded] = useState(true);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [excludeFromAnalytics, setExcludeFromAnalytics] = useState(false);

  const getStatusColor = (status: transactionStatus) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const netAmount = transaction?.amount || 0 - fees;

  return (
    <div className="max-w-2xl mx-auto bg-white">
      {/* Header */}
      <div className="p-6 bg-primary text-accent">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-white">
            {payfricalitev2.formatCurrency(
              transaction?.amount || 0,
              transaction.currency
            )}
          </h1>
          <Badge className={getStatusColor(transaction.status)}>
            {transaction.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-200">
          {transaction.type === "buy"
            ? `From ${transaction.from?.label || "Bank Account"} to ${
                transaction.to?.label || "Wallet"
              }`
            : `From ${transaction.from?.label || "Wallet"} to ${
                transaction.to?.label || "Bank Account"
              }`}
        </p>
      </div>

      {/* Overview Section */}
      <Card className="border-0 rounded-none">
        <CardHeader
          className="flex flex-row items-center justify-between cursor-pointer p-4"
          onClick={() => setOverviewExpanded(!overviewExpanded)}
        >
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Overview
          </h2>
          {overviewExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </CardHeader>

        {overviewExpanded && (
          <CardContent className="p-4 pt-0">
            <div className="space-y-4">
              {/* From */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">From</span>
                <div className="flex items-center gap-2">
                  <Image
                    src={transaction.from?.image!}
                    alt="From Logo"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  <span className="text-sm font-medium">
                    {transaction.from?.label || "Bank Account"}
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Date</span>
                <span className="text-sm font-medium">
                  {transaction.createdAt
                    ? format(transaction.createdAt, "PPP")
                    : "N/A"}
                </span>
              </div>

              {/* Amount */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-sm font-medium text-red-600">
                  -
                  {payfricalitev2.formatCurrency(
                    transaction.from?.amount!,
                    transaction.from?.id === "usdc" ? "USD" : "NGN"
                  )}
                </span>
              </div>

              <Separator />

              {/* To */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">To</span>
                <div className="flex items-center gap-2">
                  <Image
                    src={transaction.to?.image!}
                    alt="To Logo"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  <span className="text-sm font-medium">
                    {transaction.to?.label || "Wallet"}
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Date</span>
                <span className="text-sm font-medium">
                  {transaction.updatedAt
                    ? format(transaction.updatedAt, "PPP")
                    : "N/A"}
                </span>
              </div>

              {/* Amount */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-sm font-medium text-green-600">
                  +{" "}
                  {payfricalitev2.formatCurrency(
                    transaction.to?.amount!,
                    transaction.to?.id === "usdc" ? "USD" : "NGN"
                  )}
                </span>
              </div>

              <Separator />

              {/* Fees */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fees</span>
                <span className="text-sm font-medium">${fees.toFixed(2)}</span>
              </div>

              {/* Net Amount */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-900">
                  Net Amount
                </span>
                <span className="text-sm font-semibold">
                  {payfricalitev2.formatCurrency(
                    netAmount,
                    transaction.currency
                  )}
                </span>
              </div>

              {/* Transfer Amount */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Transfer Amount</span>
                <span className="text-sm font-medium">
                  {payfricalitev2.formatCurrency(
                    transaction.amount,
                    transaction.currency
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <Separator />

      {/* Details Section */}
      {/* History Section */}
      <Card className="border-0 rounded-none">
        <CardHeader
          className="flex flex-row items-center justify-between cursor-pointer p-4"
          onClick={() => setHistoryExpanded(!historyExpanded)}
        >
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            History
          </h2>
          {historyExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </CardHeader>

        {historyExpanded && (
          <CardContent className="p-4 pt-0">
            <div className="space-y-4">
              {transaction.history &&
              Object.keys(transaction.history).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(transaction.history).map(
                    ([key, entry], index) => (
                      <div key={key} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">
                            {entry.note || "No note available"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {entry.time || "No timestamp"}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No history available</p>
                </div>
              )}

              <Separator className="my-4" />

              <div className="space-y-2 text-xs text-gray-500">
                <p>
                  <strong>Reference:</strong> {transaction.reference}
                </p>
                <p>
                  <strong>Transaction ID:</strong> {transaction._id || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {transaction.email}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <Separator />

      {/* Settings Section */}
      <Card className="border-0 rounded-none">
        <CardHeader
          className="flex flex-row items-center justify-between cursor-pointer p-4"
          onClick={() => setSettingsExpanded(!settingsExpanded)}
        >
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            More
          </h2>
          {settingsExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </CardHeader>

        {settingsExpanded && (
          <CardContent className="p-4 pt-0">
            <div className="space-y-6">
              {/* Exclude from analytics */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    Exclude from analytics
                  </h3>
                  <p className="text-xs text-gray-500">
                    This excludes the transaction from any in-app features or
                    analytics.
                  </p>
                </div>
                <Switch
                  checked={excludeFromAnalytics}
                  onCheckedChange={setExcludeFromAnalytics}
                />
              </div>

              <Separator />

              {/* Delete transaction */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    Need help?
                  </h3>
                  <p className="text-xs text-gray-500">
                    Do you need help with this transaction? Feel free to send a
                    DM
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={onDelete}
                >
                  <Headphones className="h-4 w-4 mr-1" />
                  Send DM
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
