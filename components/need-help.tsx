import { APP_CONSTANTS } from "@/lib/constant";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { FC } from "react";

export const NeedHelp: FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-full px-3 py-2 flex items-center gap-2 shadow-lg",
        className
      )}
    >
      <div className="size-2 bg-primary animate-pulse rounded-full" />
      Need help?{" "}
      <Link
        target="_blank"
        href={`mailto:${APP_CONSTANTS.EMAIL}`}
        className="text-primary underline ml-1"
      >
        Click here
      </Link>
    </div>
  );
};
