import React, { FC, useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { CoinSelector } from "./select-coin";
import { ICoin, IConversionCard } from "@/types";
import { useConversation } from "@/lib/store.zustand";
import { Input } from "./ui/input";

export const ConversionCard: FC<IConversionCard> = ({
  type,
  showFees,
  amount = 0,
  ...props
}) => {
  const conversion = useConversation();

  //This is trigger when a user selects a coin
  const onCoinSelect = (c: ICoin) => {
    const _type: Record<IConversionCard["type"], IConversionCard["type"]> = {
      buy: "sell",
      sell: "buy",
    };

    const allCoins = Array.from(
      new Set(
        [...conversion?.[type]?.coins, ...conversion?.[_type[type]]?.coins].map(
          (coin) => JSON.stringify(coin)
        )
      )
    ).map((strCoin) => JSON.parse(strCoin));

    conversion.edit?.(type, "coins", allCoins);

    const oppositeCoins = allCoins.filter((coin) => coin.id !== c.id);
    conversion.edit?.(_type[type], "coins", oppositeCoins);

    // Update the selected coin
    //setSelectedCoin(c);
    conversion.edit?.(type, "selectedCoin", c);

    // If the same coin was selected on both sides, update the current side
    if (c?.id === conversion?.[type]?.selectedCoin?.id) {
      conversion.edit?.(type, "selectedCoin", oppositeCoins[0]);
    }
  };

  return (
    <Card className="shadow-xl">
      <CardContent className="space-y-3">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-accent-foreground/50 font-semibold">
              {conversion?.[type].label}
            </p>
            <CardTitle className="md:text-2xl text-sm font-bold flex items-center gap-1">
              <Input
                value={String(amount)}
                onChange={(e) => {
                  if (isNaN(Number(e.target.value))) return;

                  props?.onAmountChange?.(Number(e.target.value));
                }}
                className="text-primary selection:bg-none selection:text-primary-foreground dark:bg-none border-none flex h-9 w-24 min-w-0 rounded-md border bg-transparent px-0 py-0 text-base shadow-none transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed md:text-2xl  focus-visible:border-none focus-visible:ring-0
        aria-invalid:ring-0 dark:aria-invalid:ring-0 aria-invalid:border-none"
              />
              {props.showAmountInDollar && <span>~$32,342.43</span>}
            </CardTitle>
          </div>
          <CoinSelector
            key={conversion?.[type]?.selectedCoin?.id}
            onCoinSelect={onCoinSelect}
            selectedCoin={conversion?.[type]?.selectedCoin}
            coins={conversion?.[type]?.coins || []}
            isDisabled={conversion?.[type]?.isDisabled}
          />
        </header>
        <Separator />
        {showFees ? (
          <div className="flex items-center justify-between">
            <p className="text-accent-foreground/60 text-sm">
              Estimated transaction fees: $3.2
            </p>
            <Button
              onClick={() => {
                conversion.modifyToggle?.("use2x");
              }}
              variant={conversion?.use2x ? "default" : "secondary"}
              size="sm"
              className="text-xs"
            >
              FAST
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-accent-foreground/60 text-sm">
              32.7654 BTC available
            </p>
            <Button
              size="sm"
              onClick={() => {
                conversion.modifyToggle?.("useMax");
              }}
              variant={conversion?.useMax ? "default" : "secondary"}
              className="text-xs"
            >
              MAX
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
