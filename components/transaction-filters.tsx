import { useMediaQuery } from "@/hooks";
import { ITransactionFilters, IUser, transactionStatus } from "@/types";
import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
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
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { useConversation, usePayfricaV2Store } from "@/lib/store.zustand";
import { Button } from "./ui/button";
import { cn, payfricalitev2 } from "@/lib/utils";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Calendar07 from "./calendar-07";
import { format } from "date-fns";
import {
  Minus,
  Mail,
  Settings2,
  Calendar,
  DollarSign,
  Activity,
  ArrowUpDown,
  Hash,
} from "lucide-react";
import { Slider } from "./ui/slider";

export const TransactionFilters: FC<{
  transactionFilters?: ITransactionFilters;
  setTransactionFilters?: Dispatch<
    SetStateAction<ITransactionFilters | undefined>
  >;
  children: ReactNode;
  user?: IUser;
}> = ({ transactionFilters, ...props }) => {
  const { user, setShowAddEmailModal } = usePayfricaV2Store();
  const { availableCoins = [] } = useConversation();
  const isMobile = useMediaQuery("(max-width:767px)");
  const [isOpen, setIsOpen] = useState(false);
  const [shallowCopy, setShallowCopy] = useState({
    ...transactionFilters,
    sortBy: "createdAt",
    currency: "naira",
    limit: 10,
    offset: 0,
    dateFrom: user?.createdAt ? new Date(user?.createdAt!) : new Date(),
    dateTo: new Date(),
    amountMax: 900000,
    amountMin: 10000,
  });

  const allowedSortBy = [
    { key: "createdAt", label: "Date Created", icon: Calendar },
    { key: "amount", label: "Amount", icon: DollarSign },
    { key: "status", label: "Status", icon: Activity },
    { key: "type", label: "Type", icon: ArrowUpDown },
    { key: "currency", label: "Currency", icon: DollarSign },
    { key: "updatedAt", label: "Last Updated", icon: Calendar },
  ];

  const transactionStatuses: {
    key: transactionStatus;
    label: string;
    color: string;
  }[] = [
    {
      key: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    },
    {
      key: "success",
      label: "Success",
      color: "bg-green-100 text-green-700 hover:bg-green-200",
    },
    {
      key: "failed",
      label: "Failed",
      color: "bg-red-100 text-red-700 hover:bg-red-200",
    },
    {
      key: "refunded",
      label: "Refunded",
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    },
  ];

  const transactionTypes: {
    key: "buy" | "sell";
    label: string;
    color: string;
  }[] = [
    {
      key: "buy",
      label: "Buy",
      color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    },
    {
      key: "sell",
      label: "Sell",
      color: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    },
  ];

  const Modal = isMobile ? Drawer : Dialog;
  const ModalTrigger = isMobile ? DrawerTrigger : DialogTrigger;
  const ModalContent = isMobile ? DrawerContent : DialogContent;
  const ModalHeader = isMobile ? DrawerHeader : DialogHeader;
  const ModalTitle = isMobile ? DrawerTitle : DialogTitle;
  const ModalDescription = isMobile ? DrawerDescription : DialogDescription;
  const ModalClose = isMobile ? DrawerClose : DialogClose;
  const ModalFooter = isMobile ? DrawerFooter : DialogFooter;

  const resetFilters = () => {
    const resetOptions = {
      sortBy: "createdAt",
      currency: "naira",
      limit: 10,
      offset: 0,
      dateFrom: new Date(user?.createdAt!),
      dateTo: new Date(),
      amountMax: 900000,
      amountMin: 10000,
    };
    setShallowCopy(resetOptions);
    props?.setTransactionFilters?.(resetOptions);
    setIsOpen(false);
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild className="cursor-pointer">
        {props.children}
      </ModalTrigger>
      <ModalContent className="z-[999] max-w-2xl">
        <ScrollArea className="h-[520px] md:max-h-[600px]">
          <ModalHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <ModalTitle className="text-xl font-semibold">
                  Transaction Filters
                </ModalTitle>
                <ModalDescription className="text-sm text-muted-foreground">
                  Customize your transaction view with advanced filtering
                  options
                </ModalDescription>
              </div>
            </div>
          </ModalHeader>

          <Separator className="mb-6" />

          <div className="md:px-0 px-3 pb-6 space-y-6">
            {/* Account Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Account Information
                </h3>
              </div>
              <div className="flex items-center gap-3 p-1">
                <Input
                  className="rounded-xl h-12 font-medium bg-muted/50"
                  value={user?.email || "You have not added your email address"}
                  readOnly
                />
                {!user?.email && (
                  <Button
                    onClick={() => setShowAddEmailModal?.(true)}
                    className="h-12 px-6 rounded-xl font-medium"
                  >
                    Add Email
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3 flex flex-col">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Amount Selection
                </h3>
              </div>
              <div className="flex flex-col items-center gap-3 p-1">
                <Slider
                  min={1000}
                  max={1000000}
                  defaultValue={[shallowCopy.amountMin, shallowCopy.amountMax]}
                  onValueChange={(value) => {
                    setShallowCopy({
                      ...shallowCopy,
                      amountMin: value[0],
                      amountMax: value[1],
                    });
                  }}
                />
                <div className="flex items-center gap-3">
                  {payfricalitev2.formatCurrency(
                    shallowCopy.amountMin || 10000,
                    "NGN"
                  )}{" "}
                  <Minus size={17} />{" "}
                  {payfricalitev2.formatCurrency(
                    shallowCopy.amountMax || 1000000,
                    "NGN"
                  )}
                </div>
              </div>
            </div>

            {/* Date Range Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Date Range
                </h3>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 w-full justify-between text-left font-normal rounded-xl border-dashed hover:bg-muted/50"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(shallowCopy.dateFrom!, "MMM do, yyyy")} -{" "}
                      {format(shallowCopy.dateTo!, "MMM do, yyyy")}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar07
                    defaultDate={{
                      from: shallowCopy.dateFrom as Date,
                      to: shallowCopy.dateTo as Date,
                    }}
                    onDateSelection={(dateRange) => {
                      setShallowCopy({
                        ...shallowCopy,
                        dateFrom: !!dateRange?.from
                          ? dateRange?.from!
                          : new Date(new Date().getDate() - 3),
                        dateTo: !!dateRange?.to ? dateRange?.to! : new Date(),
                      });
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Sort By Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                    Sort By
                  </h3>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  {allowedSortBy.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Button
                        key={item.key}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-10 justify-start gap-2 text-xs rounded-lg transition-all",
                          shallowCopy.sortBy === item.key
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "hover:bg-muted/50"
                        )}
                        onClick={() =>
                          setShallowCopy({ ...shallowCopy, sortBy: item.key })
                        }
                      >
                        <IconComponent className="h-3 w-3" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Currency Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                    Currency
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {availableCoins.map((item) => (
                    <Button
                      key={item.id}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-10 justify-start gap-2 text-xs rounded-lg transition-all",
                        shallowCopy.currency === item.id
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "hover:bg-muted/50"
                      )}
                      onClick={() =>
                        setShallowCopy({ ...shallowCopy, currency: item.id! })
                      }
                    >
                      <DollarSign className="h-3 w-3" />
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pagination Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Pagination
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Items per page
                  </Label>
                  <Input
                    className="h-10 rounded-lg"
                    placeholder="10"
                    value={shallowCopy.limit || ""}
                    onChange={(e) => {
                      if (isNaN(Number(e.target.value))) return;
                      setShallowCopy({
                        ...shallowCopy,
                        limit: Number(e.target.value),
                      });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Skip items
                  </Label>
                  <Input
                    className="h-10 rounded-lg"
                    placeholder="0"
                    value={shallowCopy.offset || ""}
                    onChange={(e) => {
                      if (isNaN(Number(e.target.value))) return;
                      setShallowCopy({
                        ...shallowCopy,
                        offset: Number(e.target.value),
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Transaction Status
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {transactionStatuses.map((item) => (
                  <Button
                    key={item.key}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-9 px-4 text-xs font-medium rounded-2xl border-2 transition-all",
                      shallowCopy.status === item.key
                        ? "bg-primary text-white border-primary shadow-sm"
                        : item.color
                    )}
                    onClick={() =>
                      setShallowCopy({
                        ...shallowCopy,
                        status:
                          shallowCopy.status === item.key
                            ? undefined
                            : item.key,
                      })
                    }
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Transaction Type Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Transaction Type
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {transactionTypes.map((item) => (
                  <Button
                    key={item.key}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-9 px-6 text-xs font-medium rounded-2xl border-2 transition-all",
                      shallowCopy.type?.includes(item.key)
                        ? "bg-primary text-white border-primary shadow-sm"
                        : item.color
                    )}
                    onClick={() =>
                      setShallowCopy({
                        ...shallowCopy,
                        type: shallowCopy.type?.includes(item.key)
                          ? undefined
                          : item.key,
                      })
                    }
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <Separator />
        <ModalFooter className="flex-row gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="flex-1 h-11 rounded-xl"
          >
            Reset Filters
          </Button>
          <ModalClose asChild>
            <Button variant="outline" className="flex-1 h-11 rounded-xl">
              Cancel
            </Button>
          </ModalClose>
          <Button
            onClick={() => {
              props?.setTransactionFilters?.(shallowCopy);
              setIsOpen(false);
            }}
            className="flex-1 h-11 rounded-xl font-medium shadow-sm"
          >
            Apply Filters
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
