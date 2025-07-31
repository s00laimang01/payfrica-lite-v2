import { APP_CONSTANTS } from "@/lib/constant";
import { ILogo } from "@/types";
import React, { FC } from "react";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export const Logo: FC<ILogo> = ({
  showImage = true,
  showName = true,
  isClickable = false,
}) => {
  if (isClickable) {
    return (
      <Button variant="ghost" className="cursor-pointer">
        {showImage && (
          <Image
            src="/payfrica-logo.png"
            alt="payfrica-logo"
            width={30}
            height={30}
          />
        )}
        {showName && (
          <h1 className="text-xl font-bold">{APP_CONSTANTS.appName}</h1>
        )}
        <ChevronDown />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {showImage && (
        <Image
          src="/payfrica-logo.png"
          alt="payfrica-logo"
          width={30}
          height={30}
        />
      )}
      {showName && (
        <h1 className="text-xl font-bold">{APP_CONSTANTS.appName}</h1>
      )}
    </div>
  );
};
