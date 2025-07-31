"use client";

import { ConnectWalletBtn } from "@/components/connect-wallet-btn";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { APP_CONSTANTS } from "@/lib/constant";
import { payfricalitev2 } from "@/lib/utils";
import { useWallet } from "@suiet/wallet-kit";
import { Copy } from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function AccountModal() {
  const router = useRouter();
  const pathname = usePathname();
  const { connected, ...wallet } = useWallet();

  // Determine if we're on the account page or a different page with the modal
  const isAccountPage = pathname === "/account";

  // Handle modal close action
  const handleCloseModal = () => {
    if (isAccountPage) {
      // If we're on the account page, navigate to home
      router.push("/");
    } else {
      // Otherwise just go back
      router.back();
    }
  };

  //Copy current account address
  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      toast.success("Address copied to clipboard");
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex items-start justify-start">
          <DialogTitle className="text-xl font-medium">
            {connected ? "Connected" : "Not Connected"}
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="w-full flex flex-col items-center justify-center space-y-2">
            <Image
              src={`${APP_CONSTANTS.VERCEL_AVATAR}/${wallet.address}`}
              alt="avatar"
              width={120}
              height={120}
              className="rounded-full"
            />
            <p className="text-lg text-primary flex items-center gap-1.5">
              {payfricalitev2.truncateAddress(wallet.address!)}
              <Copy onClick={copyAddress} size={16} />
            </p>
          </div>
          <div className="w-full p-3 bg-accent rounded-xl">
            <h2 className="font-bold">Asset(s)</h2>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Image
                  src={`${APP_CONSTANTS.VERCEL_AVATAR}/${wallet.address} asset`}
                  alt="asset"
                  width={45}
                  height={45}
                  className="rounded-full"
                />
                <div>
                  <DialogDescription>{wallet.chain?.id}</DialogDescription>
                  <DialogTitle>{wallet.chain?.name}</DialogTitle>
                </div>
              </div>
              <div className="flex flex-col">
                <DialogDescription className="text-primary text-right">
                  {(0.0001).toFixed(4)}
                </DialogDescription>
                <DialogTitle>~0.0001</DialogTitle>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="w-full">
          {connected ? (
            <Button
              variant="outline"
              className="h-[2.5rem] text-primary border-primary hover:bg-destructive hover:text-accent cursor-pointer w-full"
              onClick={() => {
                wallet.disconnect();
                handleCloseModal();
              }}
            >
              Disconnect
            </Button>
          ) : (
            <ConnectWalletBtn />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
