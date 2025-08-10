import { IWalletNotConnected } from "@/types";
import React, { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Wallet2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { ConnectWalletBtn } from "./connect-wallet-btn";

export const WalletNotConnected: FC<IWalletNotConnected> = ({
  children,
  ...props
}) => {
  const [open, setOpen] = useState(props.open || !props.forceClose);
  const dots = [
    {
      id: 0,
      size: "size-2",
      background: "bg-primary/20",
    },
    {
      id: 1,
      size: "size-4",
      background: "bg-primary/50",
    },
    {
      id: 2,
      size: "size-6",
      background: "bg-primary",
    },
    {
      id: 3,
      size: "size-4",
      background: "bg-primary/50",
    },
    {
      id: 4,
      size: "size-2",
      background: "bg-primary/20",
    },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        if (!e) {
          setOpen(e);
        }

        if (!props.forceClose) {
          setOpen(e);
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogTitle className="sr-only" />
        <div className="flex items-center gap-6 justify-center">
          <Wallet2 className="w-[3.3rem] h-[3.3rem] bg-primary text-white p-2 rounded-2xl" />
          <ul className="flex items-center gap-2">
            {dots.map((dot) => (
              <li
                key={dot.id}
                className={cn("rounded-full", dot.background, dot.size)}
              />
            ))}
          </ul>
          <Image
            width={60}
            height={70}
            src="/payfrica-logo.png"
            alt="Payfrica Logo"
          />
        </div>
        <DialogTitle className="text-center">Wallet not found</DialogTitle>
        <DialogDescription className="text-center">
          No worries, please click on the button below
        </DialogDescription>
        <ConnectWalletBtn
          onWalletConnect={() => {
            props?.onWalletConnected?.();
            setOpen(false);
          }}
        >
          <Button variant="secondary" className="h-[2.5rem] cursor-pointer">
            Connect Wallet
          </Button>
        </ConnectWalletBtn>
      </DialogContent>
    </Dialog>
  );
};
