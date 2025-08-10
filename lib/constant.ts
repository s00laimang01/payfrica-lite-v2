import { paymentGateway } from "@/types";

export enum APP_CONSTANTS {
  appName = "PAYFRICA",
  VERCEL_AVATAR = "https://avatar.vercel.sh",
  EMAIL = "payfrica@support.com",
  TWITTER = "https://x.com/Payfrica_Sui?t=5uWVvJEovQXsMcsEjZk8Eg&s=09",
  TELEGRAM = "https://t.me/+Q5Smor3P92YwNzJk",
}

export enum ResponseCodes {
  ALREADY_EXIST = "1111",
  SUCCESS = "0000",
  SERVER_ERROR = "1102",
  VALIDATION_ERROR = "1103",
  MISSING_RESOURCES = "1101",
  KYC_NEEDED = "1010",
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
    path: "https://x.com/Payfrica_Sui?t=5uWVvJEovQXsMcsEjZk8Eg&s=09",
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

export const howItWorks = [
  {
    id: "1",
    title: "Connect Your Wallet",
    description:
      "Link your preferred crypto wallet securely to the platform. You stay in full control of your funds at all times — no middlemen involved.",
  },
  {
    id: "2",
    title: "Trade Directly with Others",
    description:
      "Browse buy and sell offers from real people. Choose the best deal, agree on terms, and complete the trade directly with another user — no agents or third-party approvals needed.",
  },
  {
    id: "3",
    title: "Receive Payment Instantly",
    description:
      "Once both sides confirm the trade, funds are released instantly. Whether it’s crypto or local currency, you get paid directly and securely without unnecessary delays.",
  },
];
