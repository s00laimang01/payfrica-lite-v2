"use client";

import { ConnectWalletBtn } from "@/components/connect-wallet-btn";
import { GradientText } from "@/components/gradient-text";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Marquee } from "@/components/ui/marque";
import { NavBar } from "@/components/ui/navbar";
import RotatingText from "@/components/ui/rotating-text";
import { APP_CONSTANTS } from "@/lib/constant";
import { useConversation } from "@/lib/store.zustand";
import { useWallet } from "@suiet/wallet-kit";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = () => {
  const { configuredWallets, detectedWallets, connected } = useWallet();

  const { availableCoins = [] } = useConversation();
  const availableWallets = [...configuredWallets, ...detectedWallets];

  return (
    <div className="md:max-w-6xl mx-auto p-3 pb-20">
      <NavBar />

      <div className="mt-5">
        <div className="flex justify-center text-center gap-3">
          <h2 className="md:text-6xl text-xl font-bold text-muted-foreground gap-3 opacity-30">
            {" "}
            THE NEW ERA OF{" "}
          </h2>

          <GradientText className="opacity-100 md:text-6xl text-xl font-bold">
            {" "}
            {APP_CONSTANTS.appName}
          </GradientText>
        </div>
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5 auto-rows-[minmax(200px,auto)]">
          {/* Hero card */}
          <Card className="col-span-2 md:col-span-3 lg:col-span-4 row-span-2 rounded-4xl">
            <CardHeader>
              <CardTitle className="md:text-4xl text-3xl font-medium">
                Active wallets
              </CardTitle>
              <div className="flex items-center justify-between mt-3">
                <div className="space-x-3">
                  <Button className="rounded-full">All</Button>
                </div>
                <Button variant="link">
                  View
                  <ChevronRight size={17} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex items-center flex-wrap gap-4">
              <Marquee pauseOnHover className="[--duration:20s]">
                {availableWallets
                  .splice(0, availableWallets.length / 2)
                  .map((wallet, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-accent w-[8rem] py-7 flex items-center justify-center flex-col gap-6"
                    >
                      <Image
                        src={wallet.iconUrl}
                        alt={wallet.name!}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <CardTitle className="text-center">
                        {wallet.name!}
                      </CardTitle>
                    </div>
                  ))}
              </Marquee>
              <Marquee reverse pauseOnHover className="[--duration:20s]">
                {availableWallets
                  .splice(availableWallets.length / 2, availableWallets.length)
                  .map((wallet, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-accent w-[8rem] py-7 flex items-center justify-center flex-col gap-6"
                    >
                      <Image
                        src={wallet.iconUrl}
                        alt={wallet.name!}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <CardTitle className="text-center">
                        {wallet.name!}
                      </CardTitle>
                    </div>
                  ))}
              </Marquee>
            </CardContent>
          </Card>

          {/* Side cards */}
          <Card className="col-span-2 rounded-2xl md:col-span-1 lg:col-span-2 row-span-1 md:p-0 py-4 ">
            <CardContent className="p-0 bg-primary/20 flex h-full items-center justify-center rounded-2xl md:py-0 py-4 gap-3 flex-col">
              <CardTitle className="text-5xl text-center text-white font-bold">
                Trade Anywhere
              </CardTitle>
              <Button
                variant="secondary"
                className="mt-2 bg-accent/70 text-foreground/40"
              >
                App Coming Soon
              </Button>
            </CardContent>
          </Card>
          <Card className="col-span-2 md:col-span-2 lg:col-span-2 row-span-1 md:p-0 rounded-2xl">
            <CardContent className="space-y-4 p-0 bg-accent-foreground h-full rounded-2xl flex items-center md:py-0 py-4 justify-center flex-col text-accent">
              <div className="flex items-center justify-center gap-2">
                {availableCoins.slice(0, 3).map((coin) => (
                  <Image
                    key={coin.id}
                    src={coin.image!}
                    alt={coin.label!}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ))}
              </div>
              <CardTitle className="text-3xl text-center">
                Buy & Sell Crypto in minutes
              </CardTitle>
              <div className="flex items-center justify-center">
                {connected ? (
                  <Button
                    variant="secondary"
                    className="bg-accent h-[2.5rem] w-[10rem]"
                  >
                    Trade now
                  </Button>
                ) : (
                  <ConnectWalletBtn>
                    <Button>Connect wallet</Button>
                  </ConnectWalletBtn>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bottom cards */}
          <Card className="col-span-2 md:col-span-2 lg:col-span-3 rounded-2xl">
            <CardContent className="flex gap-2 items-start rounded-2xl">
              {/*<div className="border-accent border-2">*/}{" "}
              <Image
                src="/sui-on-campus.jpg"
                alt="SUI ON CAMPUS"
                width={80}
                height={80}
                className="bg-accent border-accent border-2"
              />
              {/*</div>*/}
              <div>
                <CardTitle>
                  <Link
                    className="underline text-primary"
                    target="_blank"
                    href="https://www.suioncampus.org/"
                  >
                    SUI ON CAMPUS
                  </Link>
                </CardTitle>
                <CardDescription>
                  SUI ON CAMPUS is a community-driven initiative bringing
                  blockchain education, events, and hackathons to university
                  campuses worldwide, partnering with student organizations to
                  deliver hands-on workshops, industry expert lectures, and
                  coding sessions that teach practical DeFi and smart contract
                  development while hosting hackathons that connect students
                  with mentorship, funding opportunities, and career pathways at
                  leading Web3 companies across our global network of 150+
                  university chapters..
                </CardDescription>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2 md:col-span-2 lg:col-span-3">
            <CardContent className="flex items-center justify-center h-full gap-3">
              <CardTitle className="md:text-5xl text-3xl font-bold">
                PAYFRICA IS
              </CardTitle>
              <RotatingText
                texts={["SECURED", "FAST", "EFFICIENT"]}
                mainClassName="px-2 sm:px-2 md:px-3 bg-primary text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center text-medium rounded-lg w-fit"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
