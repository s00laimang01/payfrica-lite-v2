import { IConfirmExchange, transactionStatus } from "@/types";
import React, { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import successSvg from "../public/success-check.json";
import errorSvg from "../public/error-status.json";
import pendingSvg from "../public/pending-status.json";
import Lottie from "lottie-react";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@suiet/wallet-kit";
import { PayfricaLiteV2 } from "@/lib/utils";

export const ConfirmExhange: FC<IConfirmExchange> = ({
  children,
  open: _open = true,
  forceClose,
  ...props
}) => {
  const { address } = useWallet();
  const [open, setOpen] = useState(_open);

  const payfricalitev2 = new PayfricaLiteV2(address);

  const {
    isLoading,
    data: verifyChargeData,
    isSuccess,
  } = useQuery({
    queryKey: ["verify-transaction", props.transactionId],
    queryFn: () => payfricalitev2.verifyCharge(props.transactionId),
    refetchInterval: 1000 * 5,
    enabled: Boolean(!!address && open && props.status === "pending"),
    retry: 2,
  });

  useEffect(() => {
    if (!isSuccess || isLoading || !verifyChargeData) return;

    props?.onTransactionUpdate?.(verifyChargeData);
  }, [isLoading, verifyChargeData, isSuccess]);

  const data: Record<transactionStatus, any> = {
    failed: {
      animationData: errorSvg,
      title: "Transaction Failed",
      description:
        "Your transaction could not be completed. Please try again later.",
    },
    pending: {
      animationData: pendingSvg,
      title: "Transaction Pending",
      description:
        "Your transaction is still pending. Please check back later.",
    },
    refunded: {
      animationData: successSvg,
      title: "Transaction Refunded",
      description:
        "Your transaction has been refunded. Please check your account for more details.",
    },
    success: {
      animationData: successSvg,
      title: "Transaction Successful",
      description: "Your transaction has been completed successfully.",
    },
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        if (forceClose) return;
        setOpen(e);
        props?.onClose?.(e);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90%] md:max-w-xl">
        <div className="w-full flex items-center flex-col justify-center">
          <Lottie
            animationData={data[props.status!]?.animationData}
            loop={false}
            className="md:w-[170px] md:h-[170px] w-[120px] h-[120px]"
          />
          <DialogTitle>{data[props.status!]?.title}</DialogTitle>
          <DialogDescription className="text-center">
            {props?.note || data[props.status!]?.description}
          </DialogDescription>
        </div>

        <div className="text-center flex items-center gap-1 justify-center mt-3">
          <p className="text-muted-foreground text-sm">Transaction ID:</p>{" "}
          <DialogTitle className="font-bold text-xs">
            {props.transactionId}
          </DialogTitle>
        </div>
        <Separator className="mt-5" />
        <div className="flex items-center justify-center gap-8 mt-3">
          <div className="flex items-center gap-2.5">
            <Image
              src={props.coins?.from?.image!}
              alt={props.coins?.from?.value!}
              width={30}
              height={30}
              className="rounded-full"
            />
            <p className="md:text-md text-xs">
              {props.coins?.from?.label} {props.coins?.from?.amount}
            </p>
          </div>
          <div className="md:border-6 border-3 rounded-full p-1">
            <ArrowLeftRight size={17} className="text-primary" />
          </div>
          <div className="flex items-center gap-2.5">
            <Image
              src={props.coins?.to?.image!}
              alt={props.coins?.to?.value!}
              width={30}
              height={30}
              className="rounded-full"
            />
            <p className="md:text-md text-xs">
              {props.coins?.to?.label} {props.coins?.to?.amount}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <Button asChild className="cursor-pointer">
            <Link className="w-full" href="/">
              Back Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="cursor-pointer">
            <Link href={`/reciept/${props.transactionId}`}>View Reciept</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
