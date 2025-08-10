"use client";

import React, { FC, useEffect, useState } from "react";
import { IConnectWalletBtn } from "@/types";
import { cn, PayfricaLiteV2 } from "@/lib/utils";
import { ConnectModal, useWallet } from "@suiet/wallet-kit";
import { toast } from "sonner";
import { ResponseCodes } from "@/lib/constant";
import { usePayfricaV2Store } from "@/lib/store.zustand";

export const ConnectWalletBtn: FC<IConnectWalletBtn> = ({
  className,
  ...props
}) => {
  const [showModal, setShowModal] = useState(false);
  const [shouldCreateUser, setShouldCreateUser] = useState(false);
  const { setShowWelcomeModal } = usePayfricaV2Store();
  const { address, connected } = useWallet();

  //This will trigger is the user successfully connect their wallet address.
  const onWalletConnectSuccess = async () => {
    try {
      setShowModal(false);

      if (!address) return;

      const payfricalitev2 = new PayfricaLiteV2(address);
      const res = await payfricalitev2.createUser();

      props?.onWalletConnect?.();

      // User is a first timer, show a welcome modal
      if (res.code === ResponseCodes.SUCCESS) {
        setShowWelcomeModal?.(true);
      }

      if (res.code === ResponseCodes.ALREADY_EXIST && !res.data.email) {
        //Show a modal for the user to add their email address
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setShouldCreateUser(false);
    }
  };

  //this is only because of react async nature i.e address from d userWallet won't be available on first trigger.
  useEffect(() => {
    if (!connected || !shouldCreateUser || !address) return;

    onWalletConnectSuccess();
  }, [connected, shouldCreateUser, address]);

  return (
    <ConnectModal
      open={showModal}
      onOpenChange={setShowModal}
      onConnectSuccess={(e) => {
        setShouldCreateUser(true);
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
