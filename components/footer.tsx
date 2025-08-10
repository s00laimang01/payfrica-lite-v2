import { APP_CONSTANTS } from "@/lib/constant";
import { Mail, SendIcon, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Logo } from "./logo";

export const Footer = () => {
  return (
    <div className="flex items-center justify-between mt-10">
      <div className="flex gap-1">
        <Logo showName={false} />
        <p className="text-left text-sm">
          Bridging the gap, Empowering transactions
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link target="_blank" href={APP_CONSTANTS.TWITTER}>
          <Twitter size={22} className="text-accent-foreground/50" />
        </Link>
        <Link target="_blank" href={`mailto:${APP_CONSTANTS.EMAIL}`}>
          <Mail size={22} className="text-accent-foreground/50" />
        </Link>
        <Link target="_blank" href={APP_CONSTANTS.TELEGRAM}>
          <SendIcon size={22} className="text-accent-foreground/50" />
        </Link>
      </div>
    </div>
  );
};
