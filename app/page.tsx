import { BuyNdSellCard } from "@/components/buy-nd-sell-card";
import { Footer } from "@/components/footer";
import { GradientText } from "@/components/gradient-text";
import { Logo } from "@/components/logo";
import ShiningButton from "@/components/shining-button";
import { Boxes } from "@/components/ui/background-boxes";
import { NavBar } from "@/components/ui/navbar";
import { Separator } from "@/components/ui/separator";
import { APP_CONSTANTS } from "@/lib/constant";
import { Linkedin, Mail, SendIcon, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div className="overflow-hidden">
      <NavBar />
      <div className="relative">
        <div className="container mx-auto px-3 relative w-full pb-20">
          {/* Background */}
          <Boxes />

          <div className="z-10 relative w-full">
            <div className="w-full mt-5">
              <div className="flex items-center justify-center">
                <ShiningButton />
              </div>
              <h2 className="text-center md:text-7xl text-4xl w-[85%] mx-auto mt-3">
                A Secure and Trusted{" "}
                <GradientText to="to-red-300">Gateway</GradientText> to Crypto
              </h2>
              <p className="text-center leading-4 text-sm md:text-lg w-[85%] mx-auto mt-5">
                <GradientText>Payfrica</GradientText> provides secure and
                reliable payment solutions for businesses and individuals —
                supporting select digital assets
              </p>
              <div className="flex items-center justify-center w-full mt-14">
                <BuyNdSellCard />
              </div>
              <Separator className="mt-8" />
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
