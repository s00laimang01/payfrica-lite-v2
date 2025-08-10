"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { ConversionCard } from "./conversion-card";
import { Button } from "./ui/button";
import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import { useConversation } from "@/lib/store.zustand";
import { cn, PayfricaLiteV2 } from "@/lib/utils";
import { WalletNotConnected } from "./wallet-not-connected";
import { useWallet } from "@suiet/wallet-kit";
import { ICoin, IExchangeSessionState } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSessionStorage } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";

/**
 * Calculate the converted amount based on coin types and rates
 */
interface ConversionParams {
  sellCoinId?: string;
  buyCoinId?: string;
  sellAmount: number;
  sellCoinRate?: {
    usdc?: number;
    naira?: number;
  };
}

const calculateConvertedAmount = ({
  sellCoinId,
  buyCoinId,
  sellAmount,
  sellCoinRate,
}: ConversionParams): number => {
  // Same currency type (no conversion needed)
  if (sellCoinId === buyCoinId) {
    return sellAmount;
  }

  // Naira to USDC conversion
  if (sellCoinId === "naira" && buyCoinId === "usdc") {
    return Number((sellAmount / sellCoinRate?.usdc!)?.toFixed(3));
  }

  // USDC to Naira conversion
  if (sellCoinId === "usdc" && buyCoinId === "naira") {
    return Number((sellAmount * sellCoinRate?.naira!)?.toFixed(3));
  }

  // Default fallback (should not reach here in normal operation)
  return sellAmount;
};

export const BuyNdSellCard = () => {
  const { address } = useWallet();

  const payfricalitev2 = new PayfricaLiteV2(address);

  const r = useRouter();
  const { connected: walletIsConnected } = useWallet();
  const { active, sell, buy, edit, ...conversion } = useConversation();
  const [open, setOpen] = useState(true);
  const debouncedAmount = useDebounce(sell.amount || 0, 1000);
  const [_confirmExchange, setConfirmExchange] =
    useSessionStorage<IExchangeSessionState | null>("confirm-exchange", null);

  const { isLoading: isCalculating, data } = useQuery({
    queryKey: [
      "exchangeRate",
      sell.selectedCoin?.id,
      buy?.selectedCoin?.id,
      debouncedAmount,
    ],
    queryFn: () =>
      payfricalitev2.calculateExchange(
        sell.selectedCoin?.id!,
        buy?.selectedCoin?.id!,
        debouncedAmount
      ),
    enabled: Boolean(
      sell.selectedCoin?.id && buy?.selectedCoin?.id && !!debouncedAmount
    ),
  });

  const exchange = () => {
    if (!walletIsConnected) {
      setOpen(false);
      return;
    }

    //verify the data pass
    if (sell.amount <= 0) {
      toast.error("Please enter an amount to sell");
      return;
    }

    //Empty the session state before setting variables
    setConfirmExchange(null);

    //We know that wallet is connected now, so let's proceed
    const payload = {
      from: { ...sell.selectedCoin!, amount: sell.amount },
      to: { ...buy.selectedCoin!, amount: buy.amount },
      amount: sell.amount!,
      fromLabel: active === "sell" ? "You sell" : "You pay",
      toLabel: "You receive",
      active,
      useFast: !!conversion.use2x,
    };

    setConfirmExchange(payload);
    r.push("/confirm-exchange");
  };

  return (
    <Card className="lg:w-3/6 md:w-3/5 w-[90%] relative">
      <CardHeader className="absolute top-[-2rem] p-1 rounded-md left-1/2 -translate-x-1/2 w-[50%] bg-accent flex items-center gap-0 h-fit">
        <Button
          onClick={() => {
            conversion.onActiveChange?.("buy");
            edit?.("sell", "coins", sell.coins);
            edit?.("buy", "coins", [sell.coins[0]]);

            edit?.("buy", "selectedCoin", sell.coins[0]);
          }}
          variant="ghost"
          className={cn("bg-accent w-1/2", active === "buy" && "bg-white")}
        >
          <BanknoteArrowDown />
          Buy
        </Button>
        <Button
          variant="ghost"
          className={cn("bg-accent w-1/2", active === "sell" && "bg-white")}
          onClick={() => {
            conversion.onActiveChange?.("sell");
            edit?.("sell", "coins", sell.coins);
            edit?.("buy", "coins", [sell.coins[1]]);

            edit?.("sell", "selectedCoin", sell.coins[0]);
            edit?.("buy", "selectedCoin", sell.coins[1]);
          }}
        >
          <BanknoteArrowUp />
          Sell
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 p-2 md:p-6">
        <ConversionCard
          type="sell"
          amount={sell.amount}
          onCoinSelection={(c) => {
            // Update the selected coin
            edit?.("sell", "selectedCoin", c);
          }}
          onAmountChange={(amt) => {
            edit?.("sell", "amount", amt);
          }}
        />
        <ConversionCard
          disableinput
          type="buy"
          showFees
          amount={Number((!!data?.to.amount ? data?.to.amount : 0).toFixed(4))}
        />
      </CardContent>
      <CardFooter>
        <WalletNotConnected
          key={open + ""}
          forceClose={open}
          onWalletConnected={exchange}
        >
          <Button
            disabled={isCalculating}
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
