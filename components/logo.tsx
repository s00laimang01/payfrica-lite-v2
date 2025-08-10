import { APP_CONSTANTS, navBarLinks } from "@/lib/constant";
import { ILogo } from "@/types";
import React, { FC } from "react";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";
import { cn, payfricalitev2 } from "@/lib/utils";

export const Logo: FC<ILogo> = ({
  showImage = true,
  showName = true,
  isClickable = false,
  ...props
}) => {
  if (isClickable) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn("cursor-pointer", props.className)}
          >
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
        </PopoverTrigger>
        <PopoverContent className="flex flex-col">
          {navBarLinks.map((link, idx) => (
            <Button
              variant="ghost"
              key={idx}
              className={cn(
                "w-full",
                payfricalitev2.isPathMatching(link.path) && "bg-secondary"
              )}
            >
              <Link
                href={link.path}
                target={link.title === "Twitter" ? "__blank" : "_self"}
                className={cn("w-full flex items-start justify-start")}
              >
                {link.title}
              </Link>
            </Button>
          ))}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", props.className)}>
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
