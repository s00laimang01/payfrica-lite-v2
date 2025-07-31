"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { ConversionCard } from "./conversion-card";
import { Button } from "./ui/button";
import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import { useConversation } from "@/lib/store.zustand";
import { cn } from "@/lib/utils";
import { WalletNotConnected } from "./wallet-not-connected";
import { useWallet } from "@suiet/wallet-kit";
import { useSessionStorage } from "@uidotdev/usehooks";
import { IExchangeSessionState } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const BuyNdSellCard = () => {
  const r = useRouter();
  const { connected: walletIsConnected } = useWallet();
  const { active, sell, buy, edit } = useConversation();
  const [_confirmExchange, setConfirmExchange] =
    useSessionStorage<IExchangeSessionState | null>("confirm-exchange", null);

  const exchange = () => {
    if (!walletIsConnected) return;

    //verify the data pass
    if (active === "sell" && sell.amount <= 0) {
      toast.error("Please enter an amount to sell");
      return;
    }

    if (active === "buy" && buy.amount <= 0) {
      toast.error("Please enter an amount to buy");
      return;
    }

    //Empty the session state before setting variables
    setConfirmExchange(null);

    //We know that wallet is connected now, so let's proceed
    const payload = {
      from: sell.selectedCoin!,
      to: buy.selectedCoin!,
      amount: active === "sell" ? buy.amount : sell.amount!,
      fromLabel: active === "sell" ? "You sell" : "You pay",
      toLabel: active === "sell" ? "You buy" : "You receive",
      active,
    };

    setConfirmExchange(payload);
    r.push("/confirm-exchange");
  };

  return (
    <Card className="lg:w-3/6 md:w-3/5 w-[90%] relative">
      <CardHeader className="absolute top-[-2rem] p-1 rounded-md left-1/2 -translate-x-1/2 w-[50%] bg-accent flex items-center gap-0 h-fit">
        <Button
          variant="ghost"
          className={cn("bg-accent w-1/2", active === "buy" && "bg-white")}
        >
          <BanknoteArrowDown />
          Buy
        </Button>
        <Button
          variant="ghost"
          className={cn("bg-accent w-1/2", active === "sell" && "bg-white")}
        >
          <BanknoteArrowUp />
          Sell
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 p-2 md:p-6">
        <ConversionCard
          type="sell"
          amount={sell.amount}
          onAmountChange={(amt) => {
            edit?.("sell", "amount", amt);
            edit?.("buy", "amount", amt * 2);
          }}
        />
        <ConversionCard type="buy" showFees amount={buy.amount} />
      </CardContent>
      <CardFooter>
        <WalletNotConnected forceClose={walletIsConnected}>
          <Button
            onClick={exchange}
            className="w-full h-[3rem] text-lg cursor-pointer"
          >
            Exchange
          </Button>
        </WalletNotConnected>
      </CardFooter>
    </Card>
  );
};
