"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import Image from "next/image";
import { APP_CONSTANTS, availableCoins } from "@/lib/constant";
import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export const Balance = () => {
  const query = useSearchParams();
  const r = useRouter();
  const [open, setOpen] = useState(false);

  const findCoin = (coinId: string) => {
    const coin = availableCoins.find((coin) => coin.id === coinId);

    return coin || availableCoins[0];
  };

  const onSelect = (coinId: string) => {
    const coin = findCoin(coinId);

    if (!coin) return;

    const queryParam = new URLSearchParams({
      coinId: coin.id,
    });

    r.push(`?${queryParam.toString()}`);
    setOpen((prev) => !prev);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="px-2 h-10 text-primary cursor-pointer"
        >
          <Image
            alt="coin-image"
            width={30}
            height={40}
            src={findCoin(query.get("coinId")!).image}
            className="rounded-full"
          />
          0.00 {findCoin(query.get("coinId")!).name}
          <ChevronDown size={19} className="text-accent-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2">
        <ul className="space-y-2">
          {availableCoins.map((coin) => (
            <li
              key={coin.id}
              onClick={() => onSelect(coin.id)}
              className="flex items-center gap-2.5 hover:bg-accent py-2 px-3 rounded-2xl cursor-pointer"
            >
              <Image
                src={coin.image}
                alt="coin-image"
                width={25}
                height={25}
                className="rounded-full"
              />
              {coin.name}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
