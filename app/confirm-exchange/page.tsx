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
import { cn } from "@/lib/utils";
import { IExchangeSessionState, paymentGateway } from "@/types";
import { useSessionStorage } from "@uidotdev/usehooks";
import { ChevronLeft, Landmark, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EnterBankDetails } from "@/components/enter-bank-details";

const Page = () => {
  const [gateway, setGateway] = useState<paymentGateway>();
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    selectedBank: "",
  });
  const [sessionState] = useSessionStorage<IExchangeSessionState | null>(
    "confirm-exchange",
    null
  );

  const onGatewaySelection = (selectedGateway: paymentGateway) => {
    setGateway(selectedGateway);
  };

  const confirm = async () => {
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
    } catch (error) {
      toast.error("Oops somthing went wrong, please try again");
    }
  };

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
                  {sessionState?.amount} {sessionState?.from?.label}
                </CardTitle>
                <CardDescription className="md:text-lg text-md">
                  ~$23.82
                </CardDescription>
              </div>
              {/* TO */}
              <div>
                <CardDescription>{sessionState?.toLabel}</CardDescription>
                <CardTitle className="md:text-4xl text-2xl font-bold text-primary">
                  {sessionState?.amount! * 2} {sessionState?.to?.label}
                </CardTitle>
                <CardDescription className="md:text-lg text-md">
                  ~$23.82
                </CardDescription>
              </div>

              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-accent-foreground/55">Rate</p>
                  <CardTitle>
                    1 {sessionState?.from?.label} = 2 {sessionState?.to?.label}{" "}
                    (~$5.5)
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
              <EnterBankDetails
                {...bankDetails}
                onAccountNumberInput={(e) =>
                  setBankDetails({ ...bankDetails, accountNumber: e! })
                }
                onBankSelect={(e) =>
                  setBankDetails({ ...bankDetails, selectedBank: e })
                }
              />
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
            <Button
              onClick={confirm}
              disabled={
                !gateway &&
                (bankDetails.accountNumber.length !== 10 ||
                  !bankDetails.selectedBank)
              }
              className="w-full h-[3rem] rounded-sm mt-2 cursor-pointer"
            >
              CONFIRM
            </Button>
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
