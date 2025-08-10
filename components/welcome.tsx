import { usePayfricaV2Store } from "@/lib/store.zustand";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { APP_CONSTANTS } from "@/lib/constant";
import { useWallet } from "@suiet/wallet-kit";
import { PayfricaLiteV2, payfricalitev2 } from "@/lib/utils";
import { AddEmail } from "./add-email";
import { Button } from "./ui/button";
import { CircleAlert } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { toast } from "sonner";

export const Welcome = () => {
  const { address } = useWallet();
  const [email, setEmail] = useState("");
  const { showWelcomeModal, setShowWelcomeModal } = usePayfricaV2Store();
  const [isLoading, setIsLoading] = useState(false);

  const payfricalitev2 = new PayfricaLiteV2(address);

  const copyAddress = () => {
    if (!address) return;

    navigator.clipboard.writeText(address!);
    toast.success("Address copied to clipboard");
  };

  const addEmail = async () => {
    try {
      if (isLoading) return;

      setIsLoading(true);

      await payfricalitev2.updateEmail(email);

      setShowWelcomeModal(false);
      toast.success("Email has been added to your account");
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
      <DialogContent className="md:max-w-lg w-[95%] p-2">
        <div
          style={{
            backgroundImage: `url(${APP_CONSTANTS.VERCEL_AVATAR}/${address})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="w-full h-[15rem] rounded-2xl flex items-center justify-center flex-col gap-2"
        >
          <DialogTitle
            style={{
              WebkitTextStroke: "2px #ef4444",
              textShadow: "4px 4px 8px rgba(0,0,0,0.3)",
            }}
            className="font-bold opacity-100 text-white titan-one-regular md:text-6xl text-4xl "
          >
            WELCOME
          </DialogTitle>
          <div
            onClick={copyAddress}
            className="py-1 px-3 rounded-full text-sm bg-white flex items-center gap-1 cursor-pointer"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleAlert size={15} className="text-primary" />
              </TooltipTrigger>
              <TooltipContent>Click to copy</TooltipContent>
            </Tooltip>
            {payfricalitev2.truncateAddress(address, 23, -11)}
          </div>
        </div>
        <div>
          <DialogTitle className="text-center text-2xl font-bold">
            It's your first time 🎊🎊
          </DialogTitle>
          <DialogDescription className="text-lg text-center">
            Please add your email address to ensure you receive important
            updates and notifications.
          </DialogDescription>
        </div>
        <AddEmail
          email={email}
          label="Add email"
          onEmailChange={setEmail}
          onEmailSubmit={addEmail}
        />
        <DialogFooter className="pb-5">
          <Button onClick={addEmail} disabled={isLoading}>
            Add email
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Remind me later</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
