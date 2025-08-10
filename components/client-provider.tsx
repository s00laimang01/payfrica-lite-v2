"use client";

import { WalletProvider } from "@suiet/wallet-kit";
import React, { FC } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "./provider";

export const ClientProvider: FC<{ children: any }> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <Provider>{children}</Provider>
        </WalletProvider>
      </QueryClientProvider>
    </div>
  );
};
