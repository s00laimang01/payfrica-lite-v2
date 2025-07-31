"use client";

import React, { FC, useState } from "react";
import { Button } from "./ui/button";
import { IConnectWalletBtn } from "@/types";
import { cn } from "@/lib/utils";
import { ConnectModal } from "@suiet/wallet-kit";
import { toast } from "sonner";

export const ConnectWalletBtn: FC<IConnectWalletBtn> = ({
  className,
  ...props
}) => {
  const [showModal, setShowModal] = useState(false);

  if (!props?.children) {
    props.children = (
      <Button className={cn("cursor-pointer", className)}>
        Connect Wallet
      </Button>
    );
  }

  return (
    <ConnectModal
      open={showModal}
      onOpenChange={setShowModal}
      onConnectSuccess={() => {
        setShowModal(false);
      }}
      onConnectError={(e) => {
        toast.error(
          e.message ||
            "Hey! Something went wrong while trying to connect your wallet, Try again."
        );
      }}
    >
      {props.children}
    </ConnectModal>
  );
};
