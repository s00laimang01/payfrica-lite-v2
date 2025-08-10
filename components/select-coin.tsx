"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useConversation } from "@/lib/store.zustand";
import Image from "next/image";
import { ICoinSelector } from "@/types";

export function CoinSelector({
  onCoinSelect,
  selectedCoin,
  coins = [],
  ...props
}: ICoinSelector) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={props.isDisabled}
          className="md:gap-1 rounded-full text-xs md:text-sm h-8 md:h-9"
        >
          <Image
            src={selectedCoin?.image!}
            alt={selectedCoin?.label!}
            width={20}
            height={20}
            className="rounded-full -ml-1"
          />
          {selectedCoin?.label!}
          <ChevronsUpDownIcon className="md:ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search coin..." />
          <CommandList>
            <CommandEmpty>No coin found.</CommandEmpty>
            <CommandGroup>
              {coins?.map((coin) => (
                <CommandItem
                  key={coin?.value}
                  value={coin?.value}
                  onSelect={() => {
                    onCoinSelect?.(coin);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCoin?.value === coin.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <Image
                    src={coin.image!}
                    alt={coin.label}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  {coin.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
