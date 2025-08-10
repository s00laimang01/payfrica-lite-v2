"use client";

import { cn } from "@/lib/utils";
import { INotFound } from "@/types";
import { FC } from "react";
import { Button } from "./ui/button";
import { CardDescription } from "./ui/card";
import Link from "next/link";

export const NotFound: FC<INotFound> = ({
  title = "PAGE NOT FOUND",
  description = "The page you are looking for does not exist or has been deleted",
  children = (
    <Button asChild className="h-[3rem] rounded-sm w-[10rem] cursor-pointer">
      <Link href={"/"}>Head Home</Link>
    </Button>
  ),
  ...props
}) => {
  return (
    <div
      className={cn(
        "space-y-3 flex items-center justify-center flex-col",
        props.className
      )}
    >
      <h2 className="md:text-5xl text-3xl">{title}</h2>
      <CardDescription className="md:max-w-[50%] w-[80%] text-center">
        {description}
      </CardDescription>
      {children}
    </div>
  );
};
