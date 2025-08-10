import React, { FC, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { IEnterBankDetails } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn, PayfricaLiteV2 } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@suiet/wallet-kit";

export const EnterBankDetails: FC<IEnterBankDetails> = ({
  onBankSelect,
  selectedBank,
  onAccountNumberInput,
  accountNumber,
  onAccountResolve,
}) => {
  const [open, setOpen] = useState(false);
  const { address } = useWallet();

  const payfricalitev2 = new PayfricaLiteV2(address);

  const {
    isLoading,
    data: banks = [],
    error,
  } = useQuery({
    queryKey: ["available-banks"],
    queryFn: () => payfricalitev2.getAvailableBanks(),
  });

  const {
    isLoading: isResolvingAccount,
    data: account,
    error: resolveError,
    isEnabled,
  } = useQuery({
    queryKey: ["resolve-account", selectedBank?.code, accountNumber],
    queryFn: () =>
      payfricalitev2.resolveAccount(accountNumber!, selectedBank?.code!),
    enabled: Boolean(accountNumber?.length === 10 && !!selectedBank?.code),
  });

  useEffect(() => {
    if (!isEnabled) return;

    onAccountResolve?.({
      account: {
        ...account!,
      },
      resolveError: resolveError,
      isResolving: isResolvingAccount,
    });
  }, [isResolvingAccount, resolveError, account]);

  return (
    <div className="space-y-3">
      <Input
        value={accountNumber}
        onChange={(e) => {
          if (isNaN(Number(e.target.value))) return;

          onAccountNumberInput?.(e.target.value);
        }}
        className="w-full h-[3rem] mt-2"
        placeholder="Account Number To Recieve Payment"
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={isLoading}
            className={cn(
              "w-full h-[3rem] rounded-sm data-[size=default]:h-[3rem] data-[size=sm]:h-[3rem] justify-between text-muted-foreground",
              !!selectedBank && "text-primary font-semibold",
              error && "border-destructive bg-destructive/10"
            )}
          >
            {selectedBank?.name || "Select your bank"}
            <ChevronsUpDownIcon className="md:ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[85%] p-0">
          <Command>
            <CommandInput placeholder="Search bannk..." />
            <CommandList>
              <CommandEmpty>No bank found.</CommandEmpty>
              <CommandGroup>
                {banks.map((bank) => (
                  <CommandItem
                    key={bank.id}
                    value={bank.name}
                    onSelect={() => {
                      onBankSelect?.(bank);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedBank?.code === bank.code
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />

                    {bank.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
