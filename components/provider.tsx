"use client";

import { useConversation, usePayfricaV2Store } from "@/lib/store.zustand";
import { PayfricaLiteV2 } from "@/lib/utils";
import { useWallet } from "@suiet/wallet-kit";
import { useQuery } from "@tanstack/react-query";
import React, { FC, ReactNode, useEffect } from "react";
import { Welcome } from "./welcome";
import AccountModal from "./account-info-modal";
import { AddEmailModal } from "./add-email-modal";
import { Settings } from "./settings";

export const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const { address } = useWallet();
  const { edit, setAvailableCoins } = useConversation();
  const { setUser } = usePayfricaV2Store();

  const payfricalitev2 = new PayfricaLiteV2(address);

  const { isLoading, data: availableCoins = [] } = useQuery({
    queryKey: ["coins"],
    queryFn: () => payfricalitev2.getCoins(),
  });

  const { isLoading: isUserLoading, data: user } = useQuery({
    queryKey: ["user", address],
    queryFn: () => payfricalitev2.getMe(),
    enabled: !!address,
  });

  useEffect(() => {
    if (isUserLoading || !user) return;

    setUser?.(user);
  }, [isUserLoading, user]);

  //Setting up the available coins
  useEffect(() => {
    if (isLoading) return;

    setAvailableCoins?.(availableCoins);

    edit?.("buy", "coins", [availableCoins[1]]);
    edit?.("sell", "coins", availableCoins);

    //The default coins to be selected
    edit?.("buy", "selectedCoin", availableCoins[0]);
    edit?.("sell", "selectedCoin", availableCoins[1]);
  }, [!!availableCoins.length, isLoading]);

  return (
    <div>
      <Welcome />
      <AccountModal />
      <AddEmailModal />
      <Settings />
      {children}
    </div>
  );
};
