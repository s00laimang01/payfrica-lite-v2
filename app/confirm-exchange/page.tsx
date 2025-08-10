"use client";

import { SelectPaymentGateway } from "@/components/select-payment-gateway";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { NavBar } from "@/components/ui/navbar";
import { Separator } from "@/components/ui/separator";
import { cn, PayfricaLiteV2 } from "@/lib/utils";
import {
  IBank,
  IConfirmExchange,
  IExchangeSessionState,
  IResolveAccount,
  paymentGateway,
} from "@/types";
import {
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronLeft,
  Landmark,
  Loader2,
  ThumbsUp,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EnterBankDetails } from "@/components/enter-bank-details";
import { useSessionStorage } from "@/hooks";
import { NotFound } from "@/components/not-found";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmExhange } from "@/components/confirm-exchange";
import { useWallet } from "@suiet/wallet-kit";
import { useQuery } from "@tanstack/react-query";
import { usePayfricaV2Store } from "@/lib/store.zustand";
import { SelectBeneficiary } from "@/components/select-beneficiary";

const Page = () => {
  const { address, connected } = useWallet();

  const { setShowAddEmailModal, user } = usePayfricaV2Store();
  const [gateway, setGateway] = useState<paymentGateway>();
  const [resolvedAccount, setResolvedAccount] = useState<IResolveAccount>();
  const [sessionState] = useSessionStorage<IExchangeSessionState | null>(
    "confirm-exchange",
    null
  );
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    selectedBank: {} as IBank,
  });
  const [confirmExhange, setConfirmExchange] = useState<IConfirmExchange>();
  const [isLoading, setIsLoading] = useState(false);

  const payfricalitev2 = new PayfricaLiteV2(address);

  const { isLoading: isCalculating, data } = useQuery({
    queryKey: [
      "exchange",
      sessionState?.from.id,
      sessionState?.to.id,
      sessionState?.amount,
    ],
    queryFn: () =>
      payfricalitev2.calculateExchange(
        sessionState?.from.id!,
        sessionState?.to.id!,
        Number(sessionState?.amount)
      ),
    enabled: Boolean(
      !!sessionState &&
        !!sessionState.from.id &&
        !!sessionState.to.id &&
        !!sessionState.amount
    ),
    refetchInterval: 1000 * 60,
  });

  const onGatewaySelection = (selectedGateway: paymentGateway) => {
    if (!gateway && !user?.email) {
      setShowAddEmailModal?.(true);
    }

    setGateway(selectedGateway);
  };

  const doesSessionExist = () => {
    if (!connected) return false;

    if (!sessionState) return false;

    const { active, from, to } = sessionState;

    if (!active) return false;

    if (!from.id || !from.image || !from.value) return false;

    if (!to.id || !to.image || !to.value) return false;

    return true;
  };

  const confirm = async () => {
    const transactionId = payfricalitev2.generateTransactionId();

    try {
      if (!sessionState) {
        toast.success("Exchange session not found");
        return;
      }

      if (sessionState.active === "buy" && !gateway) {
        toast.error("Please select a payment gateway");
        return;
      }

      if (
        sessionState.active === "sell" &&
        (!bankDetails.accountNumber || !bankDetails.selectedBank)
      ) {
        toast.error("Please enter your bank details");
        return;
      }

      setIsLoading(true);

      if (sessionState.active === "buy") {
        const res = await payfricalitev2.initiateCharge({
          amount: sessionState.amount,
          from: sessionState.from.id!,
          type: "buy",
          transactionId: transactionId,
        });

        window.open(res.transaction?.paystack?.authorizationUrl!, "__blank");

        setConfirmExchange({
          ...confirmExhange,
          open: true,
          transactionId: res.transaction.reference,
          coins: {
            from: {
              ...sessionState.from,
              amount: res.transaction.from?.amount,
            },
            to: { ...sessionState.to, amount: res.transaction.to?.amount! },
          },
          status: res.transaction.status,
          note: "Your transaction has been initiated, you will receive your coins once we have confirm your payment",
        });
      }

      if (sessionState.active === "sell") {
        const { data: res, message } = await payfricalitev2.placeWithdrawal({
          from: sessionState.from.id!,
          to: sessionState.to.id!,
          account: {
            accountName: resolvedAccount?.account.accountName,
            accountNumber: resolvedAccount?.account.accountNumber,
            bankCode: bankDetails.selectedBank.code,
            bankName: bankDetails.selectedBank.name,
          },
          amount: sessionState.from.amount!,
        });

        setConfirmExchange({
          ...confirmExhange,
          transactionId: res.reference,
          coins: {
            from: { ...sessionState?.from!, amount: sessionState?.amount },
            to: { ...sessionState?.to!, amount: res.amount },
          },
          status: res.status,
          note:
            message ||
            "Your transaction has been initiated, you will receive your coins once we have confirm your payment",
          open: true,
        });
      }
    } catch (error: any) {
      setConfirmExchange({
        ...confirmExhange,
        transactionId,
        coins: {
          from: { ...sessionState?.from!, amount: sessionState?.amount },
          to: { ...sessionState?.to!, amount: sessionState?.amount! / 2 },
        },
        status: "failed",
        note:
          error.response.data.message ??
          "Failed to complete the transaction, please try again",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!doesSessionExist()) {
    return (
      <div>
        <NavBar />
        <NotFound
          title="SESSION EXPIRED"
          description="Your session has expired, please try again"
          className="w-screen h-[calc(100vh-200px)]"
        />
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      {/* Confirm Transaction Section */}
      <div className="max-w-7xl mx-auto p-3 mt-5 w-full flex md:flex-row flex-col gap-6 md:gap-[8rem] pb-20 md:pb-0">
        <div className="md:w-1/2 w-full">
          <Link
            href={"/"}
            className="flex items-center gap-1 hover:text-primary hover:underline w-fit"
          >
            <ChevronLeft />
            <p className="text-xl font-semibold">Home</p>
          </Link>
          <Card className="rounded-sm mt-4 border-primary">
            <CardContent className="relative space-y-5">
              {/* From */}
              <div>
                <CardDescription>{sessionState?.fromLabel}</CardDescription>
                <CardTitle className="md:text-4xl text-2xl font-bold text-primary">
                  {data?.from.amount || 0} {sessionState?.from?.label}
                </CardTitle>
                <CardDescription className="md:text-lg text-md">
                  ~{" "}
                  {payfricalitev2.formatCurrency(
                    sessionState?.amount!,
                    sessionState?.from.id === "usdc" ? "USD" : "NGN"
                  )}
                </CardDescription>
              </div>
              {/* TO */}
              <div>
                <CardDescription>{sessionState?.toLabel}</CardDescription>
                <CardTitle className="md:text-4xl text-2xl font-bold text-primary">
                  {data?.to.amount?.toFixed(4) || "0"} {sessionState?.to?.label}
                </CardTitle>
                <CardDescription className="md:text-lg text-md">
                  ~
                  {payfricalitev2.formatCurrency(
                    data?.to?.amount!,
                    sessionState?.to.id === "usdc" ? "USD" : "NGN"
                  )}
                </CardDescription>
              </div>

              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-accent-foreground/55">Rate</p>
                  <CardTitle>
                    {data?.from?.rate?.usdc} {data?.from?.label} ={" "}
                    {data?.from?.rate?.naira} {data?.to?.label} (~$1)
                  </CardTitle>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-accent-foreground/55">Exchange fee</p>
                  <CardTitle>$1.06</CardTitle>
                </div>
              </div>

              {/* Coins to exchange logos */}
              <div className="absolute right-5 top-0">
                <div className="flex items-center flex-col gap-1">
                  <Image
                    src={sessionState?.from?.image!}
                    alt={sessionState?.from?.label!}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="w-0.5 h-18 bg-gradient-to-b to-primary/80 via-primary/20 from-accent/20" />
                  <Image
                    src={sessionState?.to?.image!}
                    alt={sessionState?.to?.label!}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:w-1/2 w-full relative">
          <div>
            <div className="">
              <Landmark size={40} className="text-accent-foreground/45" />
              <CardTitle className="mt-3 text-primary">
                {sessionState?.active === "sell"
                  ? "Enter Bank Details for Withdrawal"
                  : "Choose Your Payment Method"}
              </CardTitle>
              <CardDescription>
                {sessionState?.active === "sell"
                  ? "Please provide your complete bank account details in the form below to process your withdrawal request. Our system will initiate the transfer to your specified account, and funds typically arrive within one hour of processing."
                  : "Please carefully review and select your preferred payment gateway or provider from the available options listed below. Choose the method that best aligns with your transaction requirements and security preferences."}
              </CardDescription>
            </div>
            {sessionState?.active === "buy" ? (
              <div className="mt-3">
                {/* Selected Gateway */}
                {gateway && (
                  <motion.div
                    animate={{ opacity: 1, transition: { duration: 0.3 } }}
                    initial={{ opacity: 0 }}
                    className={cn(
                      "h-auto min-h-[4rem] w-full justify-start p-3 transition-all group bg-primary/5"
                    )}
                    onClick={() => {}}
                  >
                    <div className="flex items-center w-full gap-3">
                      <div className="flex-shrink-0 p-1">
                        <Image
                          src={gateway?.image!}
                          alt={gateway.id}
                          width={40}
                          height={40}
                          className="object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex flex-col items-start flex-grow overflow-hidden">
                        <span className="text-base font-medium text-left">
                          {gateway.label}
                        </span>
                        <span className="text-sm text-muted-foreground line-clamp-2 text-left w-full">
                          {gateway.description}
                        </span>
                      </div>
                      <Checkbox
                        checked={!!gateway.id}
                        className="ml-2 h-5 w-5"
                      />
                    </div>
                  </motion.div>
                )}
                <SelectPaymentGateway
                  gateway={gateway}
                  onGatewaySelection={onGatewaySelection}
                />
              </div>
            ) : (
              <div>
                {
                  <div className="flex items-center justify-between">
                    <SelectBeneficiary
                      onBankSelection={(bank) => {
                        setBankDetails({
                          accountNumber: bank.account.accountNumber,
                          selectedBank: {
                            ...bankDetails.selectedBank,
                            code: bank.account.bankCode,
                            name: bank.account.bankName!,
                            id: Math.floor(Math.random() * 10000000),
                          },
                        });
                      }}
                    >
                      <Button variant="link" size="sm" className="mt-3">
                        Beneficiaries
                      </Button>
                    </SelectBeneficiary>
                    {resolvedAccount?.isResolving ? (
                      <Skeleton className="w-[8.5rem] h-6" />
                    ) : (
                      <div className="flex items-center gap-1 mt-2">
                        {resolvedAccount?.account?.accountName && (
                          <CheckCircle2 size={16} className="text-green-500" />
                        )}
                        <h2
                          className={cn(
                            resolvedAccount?.account?.accountName &&
                              "ms:text-sm text-xs text-muted-foreground font-semibold",
                            !!resolvedAccount?.resolveError &&
                              "text-destructive"
                          )}
                        >
                          {resolvedAccount?.account?.accountName ||
                            resolvedAccount?.resolveError?.message}
                        </h2>
                      </div>
                    )}
                  </div>
                }
                <EnterBankDetails
                  key={bankDetails.selectedBank.name}
                  {...bankDetails}
                  onAccountNumberInput={(e) =>
                    setBankDetails({ ...bankDetails, accountNumber: e! })
                  }
                  onBankSelect={(e) =>
                    setBankDetails({ ...bankDetails, selectedBank: e })
                  }
                  onAccountResolve={(resolvedAccount) => {
                    setResolvedAccount({ ...resolvedAccount });
                  }}
                />
              </div>
            )}
          </div>
          <div className="mt-3">
            <div className="">
              <ThumbsUp size={40} className="text-accent-foreground/45" />
              <CardTitle className="mt-3 text-primary">
                Everything is set
              </CardTitle>
              <CardDescription>
                Now that everthing is set, please click on the button below to
                proceed
              </CardDescription>
            </div>
            <ConfirmExhange
              key={String(confirmExhange?.open) + confirmExhange?.status}
              open={!!confirmExhange?.open}
              transactionId={confirmExhange?.transactionId!}
              status={confirmExhange?.status}
              coins={{ ...confirmExhange?.coins! }}
              note={confirmExhange?.note!}
              forceClose={!confirmExhange?.open}
              onTransactionUpdate={(transaction) => {
                setConfirmExchange({
                  ...confirmExhange!,
                  status: transaction.status,
                  note:
                    transaction.status === "success"
                      ? "We have recieved your payment and we will release the coins to you shortly"
                      : transaction.status == "failed"
                      ? "Your transaction could not be completed. This could be due to network issues or insufficient funds. Please check and try again. If the problem persists, contact our support team for assistance."
                      : confirmExhange?.note,
                });
              }}
              onClose={(e) =>
                setConfirmExchange({ ...confirmExhange!, open: e })
              }
            >
              <Button
                onClick={confirm}
                disabled={
                  isLoading ||
                  (!gateway &&
                    (bankDetails.accountNumber.length !== 10 ||
                      !bankDetails.selectedBank.code) &&
                    !resolvedAccount?.account?.accountName)
                }
                className="w-full h-[3rem] rounded-sm mt-2 cursor-pointer"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "CONFIRM"}
              </Button>
            </ConfirmExhange>
          </div>

          {/* Numbering */}
          <div className="absolute top-0 left-0 -ml-12 hidden md:flex">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="size-8 border-[3px] bg-accent flex items-center justify-center border-primary/50 ">
                1
              </div>
              <div className="w-0.5 h-[16.5rem] bg-accent-foreground/20" />
              <div className="size-8 border-[3px] bg-accent flex items-center justify-center border-primary/50 ">
                2
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
