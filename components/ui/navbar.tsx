import React, { FC } from "react";
import { Logo } from "../logo";
import { navBarLinks } from "@/lib/constant";
import Link from "next/link";
import { ConnectWalletBtn } from "../connect-wallet-btn";
import { AccountInfo } from "../account-info";
import { INavbar } from "@/types";
import { NavBarMobile } from "../navbar-mobile";
import { Balance } from "../balance";

const NavbarLinks = () => {
  return (
    <ul className="flex items-center gap-5">
      {navBarLinks.map((link, idx) => (
        <li
          key={idx}
          className="hover:font-bold hover:text-primary text-accent-foreground/80"
        >
          <Link href={link.path}>{link.title}</Link>
        </li>
      ))}
    </ul>
  );
};

export const NavBar: FC<INavbar> = ({ isMobile = true }) => {
  const isWalletConnected = true;

  if (isMobile) {
  }

  return (
    <nav className="container mx-auto pt-7 flex items-center justify-between p-3">
      <Logo isClickable={isWalletConnected} />
      {/* Desktop ToolBar */}
      <div className="hidden md:block">
        {isWalletConnected ? <AccountInfo /> : <NavbarLinks />}
      </div>
      {/* Mobile ToolBar */}
      <div className="fixed bottom-5 w-full left-0 z-[100]">
        <div className="w-full flex items-center justify-center">
          {isWalletConnected && <NavBarMobile />}
        </div>
      </div>
      {isWalletConnected ? <Balance /> : <ConnectWalletBtn />}
    </nav>
  );
};
