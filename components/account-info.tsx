"use client";

import React, { FC } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { IAccountInfo } from "@/types";
import { ChevronDown, Copy, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn, payfricalitev2 } from "@/lib/utils";
import { APP_CONSTANTS } from "@/lib/constant";
import { toast } from "sonner";
import { useWallet } from "@suiet/wallet-kit";
import { useRouter } from "next/navigation";

export const AccountInfo: FC<IAccountInfo> = ({
  username = "s00laimang",
  image = {
    width: 25,
    height: 25,
  },
  ...props
}) => {
  const r = useRouter();
  const { address, ...wallet } = useWallet();
  const copyAddress = (addr?: string) => {
    if (!addr) return;
    navigator.clipboard.writeText(addr);
    toast.success("Address copied to clipboard");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "px-2 hover:bg-primary/5 hover:border-primary cursor-pointer",
            props.className
          )}
        >
          <Image
            alt="avatar"
            src={`${APP_CONSTANTS.VERCEL_AVATAR}/${address}`}
            {...image}
            className="rounded-full"
          />
          <p>{payfricalitev2.truncateAddress(address!)}</p>
          <ChevronDown size={19} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="flex items-center justify-between">
          Wallet Details
          <Copy
            size={17}
            onClick={() => copyAddress(address)}
            className="font-bold hover:text-primary"
          />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center justify-between">
            Network
            <DropdownMenuLabel className="font-bold text-primary">
              {wallet.chain?.name}
            </DropdownMenuLabel>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center justify-between">
            Balance
            <DropdownMenuLabel className="font-bold text-primary">
              0 SUI
            </DropdownMenuLabel>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => r.push("/account")}
          className="text-destructive hover:text-destructive"
        >
          <Upload size={19} className="text-destructive rotate-90" />
          Disconnect
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
