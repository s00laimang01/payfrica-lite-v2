"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { ConversionCard } from "./conversion-card";
import { Button } from "./ui/button";
import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import { useConversation } from "@/lib/store.zustand";
import { cn } from "@/lib/utils";
import { WalletNotConnected } from "./wallet-not-connected";

export const BuyNdSellCard = () => {
  const { active, buy, sell, edit } = useConversation();

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
      <CardContent className="space-y-3">
        <ConversionCard
          type="sell"
          amount={sell.amount}
          showAmountInDollar
          onAmountChange={(amt) => {
            edit?.("sell", "amount", amt);
          }}
        />
        <ConversionCard type="buy" showFees amount={sell.amount * 2} />
      </CardContent>
      <CardFooter>
        <WalletNotConnected>
          <Button className="w-full h-[3rem] text-lg cursor-pointer">
            Exchange
          </Button>
        </WalletNotConnected>
      </CardFooter>
    </Card>
  );
};
