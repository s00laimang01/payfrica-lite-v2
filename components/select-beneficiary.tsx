import { useMediaQuery } from "@/hooks";
import React, { FC, ReactNode, useState } from "react";
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
import { Input } from "./ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@suiet/wallet-kit";
import { cn, PayfricaLiteV2 } from "@/lib/utils";
import { Logo } from "./logo";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";
import { APP_CONSTANTS } from "@/lib/constant";
import { Button } from "./ui/button";
import { CheckCircle2, Plus } from "lucide-react";
import {
  IBank,
  IBankAccount,
  IEnterBankDetails,
  IResolveAccount,
} from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { EnterBankDetails } from "./enter-bank-details";
import { CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";

export const SelectBeneficiary: FC<{
  children: ReactNode;
  onBankSelection?: (bank: IBankAccount) => void;
}> = ({ children, onBankSelection }) => {
  const { address } = useWallet();
  const q = useQueryClient();
  const [open, setOpen] = useState(false);
  const [resolvedAccount, setResolvedAccount] = useState<IResolveAccount>();
  const [isAdding, setIsAdding] = useState(false);
  const [openPopover, setOpenPopOver] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    selectedBank: {} as IBank,
  });
  const isMobile = useMediaQuery("(max-width:767px)");

  const payfricalitev2 = new PayfricaLiteV2(address);

  const { isLoading, data, error } = useQuery({
    queryKey: [open, "banks", address],
    queryFn: () => payfricalitev2.getPreviousBanks(),
    enabled: open && !!address,
  });

  const addBeneficiary = async () => {
    try {
      if (!bankDetails.selectedBank.code) {
        toast.error("Please select a bank");
        return;
      }

      if (!bankDetails.accountNumber) {
        toast.error("Please enter an account number");
        return;
      }

      if (bankDetails.accountNumber.length !== 10) {
        toast.error("Account number must be 10 digits");
        return;
      }

      setIsAdding(true);

      await payfricalitev2.addBeneficiary({
        accountNumber: bankDetails.accountNumber,
        bankCode: bankDetails.selectedBank.code,
        bankName: bankDetails.selectedBank.name,
        accountName: resolvedAccount?.account.accountName!,
      });

      q.invalidateQueries({ queryKey: [open, "banks", address] });
      setOpenPopOver(false);
      setBankDetails({ accountNumber: "", selectedBank: {} as IBank });
      setResolvedAccount(undefined);
      toast.success("New beneficiary added successfully");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to add beneficiary, please try again"
      );
    } finally {
      setIsAdding(false);
    }
  };

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
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent className="md:rounded-2xl z-[999]">
        <ScrollArea className="min-h-[450px] md:p-0 p-3">
          <ModalHeader>
            <ModalTitle>Select Bank Account</ModalTitle>
            <ModalDescription>
              Here are list of banks you have used in the past, feel free to
              select from them
            </ModalDescription>
          </ModalHeader>
          <Input
            placeholder="Search for account by name"
            className="h-[3rem] rounded-2xl mt-2"
          />

          <div>
            {isLoading ? (
              <div className="flex h-[calc(100vh-450px)] items-center justify-center">
                <Logo className="animate-pulse" />
              </div>
            ) : !!data?.length ? (
              <div className="mt-3 grid grid-cols-3">
                <Popover open={openPopover} onOpenChange={setOpenPopOver}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex h-full py-3 flex-col gap-1.5 items-center cursor-pointer"
                    >
                      <Plus size={30} />
                      <ModalDescription>Add New</ModalDescription>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px]">
                    <CardTitle>Add New Beneficiary</CardTitle>
                    <div className="w-full flex items-end justify-end">
                      {resolvedAccount?.isResolving ? (
                        <Skeleton className="w-[8.5rem] h-6" />
                      ) : (
                        <div className="flex items-center gap-1 mt-2">
                          {resolvedAccount?.account?.accountName && (
                            <CheckCircle2
                              size={16}
                              className="text-green-500"
                            />
                          )}
                          <h2
                            className={cn(
                              resolvedAccount?.account?.accountName &&
                                "ms:text-sm text-xs text-muted-foreground font-semibold",
                              !!resolvedAccount?.resolveError &&
                                "text-destructive"
                            )}
                          >
                            {resolvedAccount?.account?.accountName ||
                              resolvedAccount?.resolveError?.message}
                          </h2>
                        </div>
                      )}
                    </div>
                    <EnterBankDetails
                      {...bankDetails}
                      onAccountNumberInput={(e) =>
                        setBankDetails({ ...bankDetails, accountNumber: e! })
                      }
                      onBankSelect={(e) => {
                        console.log(e);
                        setBankDetails({ ...bankDetails, selectedBank: e });
                      }}
                      onAccountResolve={(resolvedAccount) => {
                        setResolvedAccount({ ...resolvedAccount });
                      }}
                    />
                    <div className="flex items-end justify-end w-full mt-3">
                      <Button disabled={isAdding} onClick={addBeneficiary}>
                        Add
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                {data?.map((bank, idx) => (
                  <Button
                    onClick={() => {
                      onBankSelection?.(bank);
                      setOpen(false);
                    }}
                    variant="ghost"
                    key={idx}
                    className="flex h-fit py-3 flex-col gap-1.5 items-center cursor-pointer"
                  >
                    <Image
                      src={
                        APP_CONSTANTS.VERCEL_AVATAR +
                        `/${bank.account.accountName}`
                      }
                      alt={bank.account.accountName}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <ModalDescription className="">
                      {bank.account.accountName.split(" ")[0]}
                    </ModalDescription>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center flex-col gap-3 h-[calc(100vh-400px)]">
                <Image
                  src="/no-data.svg"
                  alt="no data"
                  width={100}
                  height={100}
                />
                <p className="text-center text-gray-500 md:text-xl text-lg">
                  No transactions found
                </p>
                <p className="text-center text-sm">
                  There is not a single transaction that matches your filter or
                  you have no transactions.
                </p>
                <Popover open={openPopover} onOpenChange={setOpenPopOver}>
                  <PopoverTrigger asChild>
                    <Button className="w-[15rem] h-[2.5rem] cursor-pointer">
                      <Plus />
                      Add Beneficiary
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px]">
                    <CardTitle>Add New Beneficiary</CardTitle>
                    <div className="w-full flex items-end justify-end">
                      {resolvedAccount?.isResolving ? (
                        <Skeleton className="w-[8.5rem] h-6" />
                      ) : (
                        <div className="flex items-center gap-1 mt-2">
                          {resolvedAccount?.account?.accountName && (
                            <CheckCircle2
                              size={16}
                              className="text-green-500"
                            />
                          )}
                          <h2
                            className={cn(
                              resolvedAccount?.account?.accountName &&
                                "ms:text-sm text-xs text-muted-foreground font-semibold",
                              !!resolvedAccount?.resolveError &&
                                "text-destructive"
                            )}
                          >
                            {resolvedAccount?.account?.accountName ||
                              resolvedAccount?.resolveError?.message}
                          </h2>
                        </div>
                      )}
                    </div>
                    <EnterBankDetails
                      {...bankDetails}
                      onAccountNumberInput={(e) =>
                        setBankDetails({ ...bankDetails, accountNumber: e! })
                      }
                      onBankSelect={(e) => {
                        console.log(e);
                        setBankDetails({ ...bankDetails, selectedBank: e });
                      }}
                      onAccountResolve={(resolvedAccount) => {
                        setResolvedAccount({ ...resolvedAccount });
                      }}
                    />
                    <div className="flex items-end justify-end w-full mt-3">
                      <Button disabled={isAdding} onClick={addBeneficiary}>
                        Add
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </ScrollArea>
        <ModalFooter>
          <ModalClose asChild>
            <Button className="h-[3rem] rounded-2xl" variant="outline">
              Close
            </Button>
          </ModalClose>
          <Button className="h-[3rem] rounded-2xl">Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
