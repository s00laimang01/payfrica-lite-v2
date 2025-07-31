import React from "react";
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

const navs = [
  {
    icon: Home,
    path: "/",
    title: "Home",
  },
  {
    icon: Settings2,
    path: "/settings",
    title: "Settings",
  },
  {
    icon: History,
    path: "/transactions",
    title: "Transactions",
  },
  {
    icon: CircleQuestionMark,
    path: "/support",
    title: "Support",
  },
];

export const NavBarMobile = () => {
  return (
    <div className="bg-white shadow-2xl px-4 py-2 rounded-full flex items-center md:hidden">
      <div className="space-x-1">
        {navs.map((nav, idx) => (
          <Button
            variant="ghost"
            className="rounded-full hover:bg-primary/70 hover:text-accent"
            size="icon"
            key={idx}
          >
            <nav.icon size={22} />
          </Button>
        ))}
      </div>
      <Separator orientation="vertical" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Image
            alt="avatar"
            src={`https://avatar.vercel.sh/s`}
            width={40}
            height={40}
            className="rounded-full ml-3"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel className="flex items-center justify-between">
            Wallet Details
            <Copy size={17} className="font-bold hover:text-primary" />
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
          <DropdownMenuItem className="text-destructive hover:text-destructive">
            <Upload size={19} className="text-destructive rotate-90" />
            Disconnect
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
