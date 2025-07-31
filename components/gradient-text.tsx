import React from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
  via?: string;
}

export const GradientText = ({
  children,
  className,
  from = "from-primary",
  to = "to-primary",
  via,
}: GradientTextProps) => {
  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        from,
        to,
        via && `via-${via}`,
        className
      )}
    >
      {children}
    </span>
  );
};
