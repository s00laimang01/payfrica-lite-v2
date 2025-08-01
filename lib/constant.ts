import { paymentGateway } from "@/types";

export enum APP_CONSTANTS {
  appName = "PAYFRICA",
  VERCEL_AVATAR = "https://avatar.vercel.sh",
}

export const navBarLinks = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "About Us",
    path: "/about-us",
  },
  {
    title: "How it works",
    path: "/how-it-works",
  },
  {
    title: "Twitter",
    path: "/twitter",
  },
];

export const availableCoins = [
  {
    id: "sui",
    name: "SUI",
    image: `${APP_CONSTANTS.VERCEL_AVATAR}/sui`,
  },
  {
    id: "eth",
    name: "ETH",
    image: `${APP_CONSTANTS.VERCEL_AVATAR}/eth`,
  },
  {
    id: "usdt",
    name: "USDT",
    image: `${APP_CONSTANTS.VERCEL_AVATAR}/usdt`,
  },
  {
    id: "naira",
    name: "Naira",
    image: `${APP_CONSTANTS.VERCEL_AVATAR}/naira`,
  },
];

export const availablePaymentProviders: paymentGateway[] = [
  {
    id: "paystack",
    description:
      "Paystack is a digital payment gateway that allows users to send and receive money in real-time.",
    image: "/paystack.svg",
    label: "Paystack",
  },
];
