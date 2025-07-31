import { ISelectPaymentGateway } from "@/types";
import { useMediaQuery } from "@uidotdev/usehooks";
import React, { FC, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import { availablePaymentProviders } from "@/lib/constant";
import { Checkbox } from "./ui/checkbox";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const SelectPaymentGateway: FC<ISelectPaymentGateway> = ({
  onGatewaySelection,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:767px)");

  const Modal = isMobile ? Drawer : Dialog;
  const ModalTrigger = isMobile ? DrawerTrigger : DialogTrigger;
  const ModalContent = isMobile ? DrawerContent : DialogContent;
  const ModalHeader = isMobile ? DrawerHeader : DialogHeader;
  const ModalTitle = isMobile ? DrawerTitle : DialogTitle;
  const ModalDescription = isMobile ? DrawerDescription : DialogDescription;
  const ModalClose = isMobile ? DrawerClose : DialogClose;
  const ModalFooter = isMobile ? DrawerFooter : DialogFooter;

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button
          className="w-full h-[3rem] rounded-sm mt-4 cursor-pointer font-medium flex items-center justify-between px-4 transition-all hover:bg-primary/90"
          variant="default"
        >
          <span>SELECT PAYMENT PROVIDER</span>
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </ModalTrigger>
      <ModalContent className="z-[999]">
        <ModalHeader className="pb-4">
          <ModalTitle className="text-xl font-semibold">
            Select Payment Provider
          </ModalTitle>
          <ModalDescription className="text-sm text-muted-foreground mt-1">
            Choose your preferred payment method
          </ModalDescription>
        </ModalHeader>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 p-3">
          {availablePaymentProviders.map((gateway) => (
            <Button
              key={gateway.id}
              variant="outline"
              className={cn(
                "h-auto min-h-[4rem] w-full justify-start p-3 hover:bg-muted/50 hover:border-primary/30 transition-all group",
                gateway.id === props.gateway?.id ? "bg-primary/5" : ""
              )}
              onClick={() => {
                onGatewaySelection?.(gateway);
                setOpen(false);
              }}
            >
              <div className="flex items-center w-full gap-3">
                <div className="flex-shrink-0 p-1">
                  <Image
                    src={gateway.image}
                    alt={gateway.id}
                    width={40}
                    height={40}
                    className="object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex flex-col items-start flex-grow overflow-hidden">
                  <span className="text-base font-medium text-left">
                    {gateway.label}
                  </span>
                  <span className="text-sm text-muted-foreground line-clamp-2 text-left w-full">
                    {gateway.description}
                  </span>
                </div>
                <Checkbox
                  checked={gateway.id === props?.gateway?.id}
                  className="ml-2 h-5 w-5"
                />
              </div>
            </Button>
          ))}
        </div>
        <ModalFooter className="flex flex-col">
          <ModalClose asChild>
            <Button variant="outline">Go Back</Button>
          </ModalClose>
          <Button>Continue</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
