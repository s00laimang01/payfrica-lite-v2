import React, { FC } from "react";
import { Separator } from "./ui/separator";
import Image from "next/image";
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
import { Button } from "./ui/button";
import {
  CircleQuestionMark,
  Copy,
  History,
  Home,
  Settings2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "@suiet/wallet-kit";
import { usePayfricaV2Store } from "@/lib/store.zustand";
import Link from "next/link";
import { cn, payfricalitev2 } from "@/lib/utils";

const navs = [
  {
    icon: Home,
    path: "/",
    title: "Home",
  },
  {
    icon: Settings2,
    path: "settings",
    title: "Settings",
  },
  {
    icon: History,
    path: "/transactions",
    title: "Transactions",
  },
  {
    icon: CircleQuestionMark,
    path: "mailto:support@payfrica.com",
    target: "_blank",

    title: "Support",
  },
];

export const NavBarMobile: FC<{}> = () => {
  const { setShowAccountInfoModal, setShowSettingsModal } =
    usePayfricaV2Store();
  const { address } = useWallet();

  const copyAddress = (addr?: string) => {
    if (!addr) return;
    navigator.clipboard.writeText(addr);
    toast.success("Address copied to clipboard");
  };

  return (
    <div className="bg-white shadow-2xl px-4 py-2 rounded-full flex items-center md:hidden">
      <div className="space-x-1">
        {navs.map((nav, idx) => (
          <Button
            asChild
            variant="ghost"
            className={cn(
              "rounded-full hover:bg-primary/70 hover:text-accent",
              payfricalitev2.isPathMatching(nav.path) &&
                "bg-primary/70 text-white"
            )}
            size="icon"
            onClick={() => {
              if (nav.path === "settings") {
                setShowSettingsModal?.(true);
              }
            }}
            key={idx}
          >
            <Link
              href={nav.path === "settings" ? location.pathname : nav.path}
              target={nav.target}
            >
              <nav.icon size={22} />
            </Link>
          </Button>
        ))}
      </div>
      <Separator orientation="vertical" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Image
            alt="avatar"
            src={`https://avatar.vercel.sh/${address}`}
            width={40}
            height={40}
            className="rounded-full ml-3"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel className="flex items-center justify-between">
            Wallet Details
            <Copy
              onClick={() => copyAddress(address)}
              size={17}
              className="font-bold hover:text-primary"
            />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex items-center justify-between">
              Network
              <DropdownMenuLabel className="font-bold text-primary">
                SUI Network
              </DropdownMenuLabel>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowAccountInfoModal(true)}
            className="text-destructive hover:text-destructive"
          >
            <Upload size={19} className="text-destructive rotate-90" />
            Disconnect
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
