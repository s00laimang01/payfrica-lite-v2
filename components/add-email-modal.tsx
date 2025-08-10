import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import Image from "next/image";
import { AddEmail } from "./add-email";
import { Button } from "./ui/button";
import { useWallet } from "@suiet/wallet-kit";
import { PayfricaLiteV2 } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { usePayfricaV2Store } from "@/lib/store.zustand";

export const AddEmailModal = () => {
  const [email, setEmail] = useState("");
  const { address } = useWallet();
  const [loading, setLoading] = useState(false);
  const { setShowAddEmailModal, showAddEmailModal, user } =
    usePayfricaV2Store();

  const payfricalitev2 = new PayfricaLiteV2(address);

  const onEmailAdd = async () => {
    try {
      setLoading(true);

      await payfricalitev2.updateEmail(email);

      toast.success("Email added successfully");
    } catch (error) {
      toast.error("Failed to add email");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.email) return;

    setEmail(user.email);
  }, [user?.email]);

  return (
    <Dialog open={showAddEmailModal} onOpenChange={setShowAddEmailModal}>
      <DialogContent className="md:max-w-md z-[9999]">
        <div className="flex items-center justify-center">
          <Image
            src="/payfrica-logo.png"
            alt="payfrica-logo"
            width={80}
            height={80}
            quality={100}
          />
        </div>
        <DialogTitle className="font-normal text-2xl text-center">
          Add your email
        </DialogTitle>
        <DialogDescription className="text-center">
          Hey! we noticed you don't have an email associated with your account.
          Please add an email to receive notifications.
        </DialogDescription>
        <AddEmail
          label="Your email"
          email={email}
          onEmailChange={setEmail}
          onEmailSubmit={onEmailAdd}
        />
        <Button
          disabled={loading}
          className="w-[90%] mx-auto h-[3rem] cursor-pointer"
          onClick={onEmailAdd}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Add Email"}
        </Button>
        <DialogClose className="mx-auto" asChild>
          <Button className="w-fit cursor-pointer" variant="link">
            Continue without email
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
