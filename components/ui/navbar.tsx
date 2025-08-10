"use client";

import React, { FC, Suspense, useEffect, useState } from "react";
import { Logo } from "../logo";
import { navBarLinks, ResponseCodes } from "@/lib/constant";
import Link from "next/link";
import { ConnectWalletBtn } from "../connect-wallet-btn";
import { AccountInfo } from "../account-info";
import { INavbar } from "@/types";
import { NavBarMobile } from "../navbar-mobile";
import { Balance } from "../balance";
import { useAccountBalance, useWallet } from "@suiet/wallet-kit";
import { useMediaQuery } from "@/hooks";
import { Button } from "./button";
import { payfricalitev2, PayfricaLiteV2 } from "@/lib/utils";
import { useConversation, usePayfricaV2Store } from "@/lib/store.zustand";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const NavbarLinks = () => {
  return (
    <ul className="flex items-center gap-5">
      {navBarLinks.map((link, idx) => (
        <li
          key={idx}
          className="hover:font-bold hover:text-primary text-accent-foreground/80"
        >
          <Link
            href={link.path}
            target={link.title === "Twitter" ? "__blank" : ""}
          >
            {link.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

// Component that uses useSearchParams - wrapped in its own component
const NavBarContent: FC<INavbar> = () => {
  const isMobile = useMediaQuery("(max-width:767px)");
  const { connected: isWalletConnected, address } = useWallet();
  const [hasProcessedConnection, setHasProcessedConnection] = useState(false);
  const { setShowWelcomeModal } = usePayfricaV2Store();
  const { availableCoins } = useConversation();
  const { balance = 0 } = useAccountBalance();
  const [userBalance, setUserBalance] = useState(0);

  // This is now safely wrapped in Suspense
  const query = useSearchParams();

  const findCoin = (coinId: string) => {
    const coin = availableCoins?.find((coin) => coin.id === coinId);
    return coin || availableCoins?.[0];
  };

  const { isLoading, data: balanceData } = useQuery({
    queryKey: ["exchange-rate", Number(balance), query.get("coinId")],
    queryFn: () =>
      payfricalitev2.calculateExchange(
        "usdc",
        findCoin(query.get("coinId") || "usdc")?.id || "usdc",
        Number(balance) / Math.pow(10, 6)
      ),
    enabled: isWalletConnected && !!Number(balance),
  });

  // This will trigger when the user successfully connects their wallet address
  // OR when the page loads and wallet is already connected
  const createUser = async () => {
    try {
      if (!address) return;

      const payfricalitev2 = new PayfricaLiteV2(address);
      const res = await payfricalitev2.createUser();

      // User is a first timer, show a welcome modal
      if (res.code === ResponseCodes.SUCCESS) {
        setShowWelcomeModal?.(true);
      }

      if (res.code === ResponseCodes.ALREADY_EXIST && !res.data.email) {
        // Show a modal for the user to add their email address
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  //Setting the user balance
  useEffect(() => {
    if (isLoading || !balanceData) return;
    setUserBalance(balanceData.to.amount || 0);
  }, [isLoading, balanceData]);

  useEffect(() => {
    // Only process if wallet is connected, address is available, and we haven't processed this connection yet
    if (isWalletConnected && address && !hasProcessedConnection) {
      setHasProcessedConnection(true);
      createUser();
    }

    // Reset the flag when wallet is disconnected
    if (!isWalletConnected) {
      setHasProcessedConnection(false);
    }
  }, [isWalletConnected, address, hasProcessedConnection]);

  return (
    <nav className="container mx-auto pt-7 flex items-center justify-between p-3">
      <Logo isClickable={isWalletConnected || isMobile} />

      {/* Desktop ToolBar */}
      <div className="hidden md:block">
        {isWalletConnected ? (
          <AccountInfo
            balance={payfricalitev2.formatCurrency(
              userBalance,
              query?.get("coinId") === "usdc" ? "USD" : "NGN"
            )}
          />
        ) : (
          <NavbarLinks />
        )}
      </div>

      {/* Mobile ToolBar */}
      <div className="fixed bottom-5 w-full left-0 z-[100]">
        <div className="w-full flex items-center justify-center">
          {isWalletConnected && <NavBarMobile />}
        </div>
      </div>

      {isWalletConnected ? (
        <Balance
          balance={payfricalitev2.formatCurrency(
            userBalance,
            query?.get("coinId") === "usdc" ? "USD" : "NGN"
          )}
        />
      ) : (
        <ConnectWalletBtn>
          <Button className={"cursor-pointer"}>Connect Wallet</Button>
        </ConnectWalletBtn>
      )}
    </nav>
  );
};

// Fallback component for loading state
const NavBarFallback = () => {
  const isMobile = useMediaQuery("(max-width:767px)");

  return (
    <nav className="container mx-auto pt-7 flex items-center justify-between p-3">
      <Logo isClickable={isMobile} />

      {/* Desktop fallback */}
      <div className="hidden md:block">
        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-md"></div>
      </div>

      {/* Connect wallet button fallback */}
      <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-md"></div>
    </nav>
  );
};

// Main NavBar component with proper Suspense boundary
export const NavBar: FC<INavbar> = () => {
  return (
    <Suspense fallback={<NavBarFallback />}>
      <NavBarContent />
    </Suspense>
  );
};
