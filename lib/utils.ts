import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class PayfricaLiteV2 {
  constructor() {}

  public truncateAddress(address = "") {
    return address?.slice(0, 6) + "..." + address?.slice(-4);
  }
}

export const payfricalitev2 = new PayfricaLiteV2();
