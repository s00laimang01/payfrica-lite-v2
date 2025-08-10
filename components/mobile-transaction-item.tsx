"use client";

import { type FC, useState } from "react";
import { ChevronDown, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { ITransaction, transactionStatus } from "@/types";
import { APP_CONSTANTS } from "@/lib/constant";
import { payfricalitev2 } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

export const MobileTransactionItem: FC<ITransaction> = ({
  status,
  reference,
  amount,
  currency,
  email,
  type,
  from,
  to,
  createdAt,
  paystack,
  ...transaction
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: transactionStatus) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Transaction Reference Copied to clipboard");
  };

  return (
    <motion.div
      className="border-b"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Transaction Row */}
      <motion.div
        className="flex items-center justify-between p-4 cursor-pointer transition-colors rounded-lg"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{
          backgroundColor: "rgb(249 250 251)",
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3">
          {/* Transaction Icon/Avatar */}
          <motion.div
            className="flex items-center -space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Image
                src={
                  APP_CONSTANTS.VERCEL_AVATAR + `/${from?.id! || "placeholder"}`
                }
                alt={from?.label! || "Usdc"}
                width={25}
                height={25}
                className="rounded-full"
              />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Image
                src={
                  APP_CONSTANTS.VERCEL_AVATAR + `/${to?.id! || "placeholder"}`
                }
                alt={to?.label! || "Naira"}
                width={25}
                height={25}
                className="rounded-full"
              />
            </motion.div>
          </motion.div>

          {/* Transaction Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <motion.h3
                className="font-semibold text-gray-900 text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {type === "buy" ? "Buy" : "Sell"}
              </motion.h3>
              <motion.span
                className={`text-sm font-semibold ${
                  status === "failed"
                    ? "text-red-600"
                    : status === "success"
                    ? "text-green-600"
                    : "text-yellow-500"
                }`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                {payfricalitev2.formatCurrency(amount, "NGN")}
              </motion.span>
            </div>
            <motion.p
              className="text-xs text-gray-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {formatDate(createdAt)}
            </motion.p>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <motion.div
          className="ml-2"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              opacity: { duration: 0.2 },
            }}
            className="overflow-hidden"
          >
            <motion.div
              className="border-t border-gray-100 p-4 space-y-4"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {/* Coin Exchange Section */}
              {from && to && (
                <motion.div
                  className="bg-gray-50 rounded-lg p-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Exchange Details
                  </h4>
                  <div className="flex items-center justify-between">
                    <motion.div
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <Image
                        src={
                          APP_CONSTANTS.VERCEL_AVATAR + `/${from.id || "Usdc"}`
                        }
                        alt={from.label!}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {from.label}
                        </p>
                        <p className="text-xs text-gray-500">{from.label}</p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      <div className="w-8 h-0.5 bg-gray-300"></div>
                      <span className="text-xs text-gray-500">to</span>
                      <div className="w-8 h-0.5 bg-gray-300"></div>
                    </motion.div>

                    <motion.div
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                    >
                      <Image
                        src={
                          APP_CONSTANTS.VERCEL_AVATAR + `/${to.id || "Naira"}`
                        }
                        alt={to.label}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {to.label}
                        </p>
                        <p className="text-xs text-gray-500">{to.label}</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Transaction Details */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {[
                  { label: "Reference", value: reference, copyable: true },
                  { label: "Email", value: email },
                  {
                    label: "Payment Method",
                    value: paystack?.authorizationUrl
                      ? "Paystack CheckOut"
                      : "Bank Transfer",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                  >
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm ${
                          item.copyable ? "font-mono" : ""
                        } text-gray-900`}
                      >
                        {item.value}
                      </span>
                      {item.copyable && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(item.value)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  className="flex justify-between items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                >
                  <span className="text-sm text-gray-600">Status</span>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                  >
                    <Badge className={`text-xs ${getStatusColor(status)}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex space-x-2 pt-2 items-end justify-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="link"
                    size="sm"
                    className="w-fit bg-transparent"
                  >
                    <Download className="w-4 h-4" />
                    Receipt
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  <Button asChild size="sm" className="w-fit">
                    <Link href={`/reciept/${reference}`}> View Details</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
