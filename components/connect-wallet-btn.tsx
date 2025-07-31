import React, { FC } from "react";
import { Button } from "./ui/button";
import { IConnectWalletBtn } from "@/types";
import { cn } from "@/lib/utils";

export const ConnectWalletBtn: FC<IConnectWalletBtn> = ({
  className,
  ...props
}) => {
  return (
    <div>
      <Button className={cn("cursor-pointer", className)}>
        Connect Wallet
      </Button>
    </div>
  );
};
