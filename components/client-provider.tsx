"use client";

import { WalletProvider } from "@suiet/wallet-kit";
import React, { FC } from "react";

export const ClientProvider: FC<{ children: any }> = ({ children }) => {
  return (
    <div>
      <WalletProvider>{children}</WalletProvider>
    </div>
  );
};
