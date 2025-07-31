import { IUseConversation } from "@/types";
import { create } from "zustand";
import { APP_CONSTANTS } from "./constant";

export const useConversation = create<IUseConversation>((set) => ({
  buy: {
    coins: [
      {
        id: "sui",
        label: "SUI",
        value: "sui",
        image: `${APP_CONSTANTS.VERCEL_AVATAR}/sui`,
      },
      {
        id: "eth",
        label: "ETH",
        value: "eth",
        image: `${APP_CONSTANTS.VERCEL_AVATAR}/eth`,
      },
      {
        id: "usdc",
        label: "USDC",
        value: "usdc",
        image: `${APP_CONSTANTS.VERCEL_AVATAR}/usdc`,
      },
      {
        id: "naira",
        label: "Naira",
        value: "naira",
        image: `${APP_CONSTANTS.VERCEL_AVATAR}/naira`,
      },
    ],
    amount: 0,
    label: "Recieve",
    selectedCoin: {
      id: "naira",
      label: "Naira",
      value: "naira",
      image: `${APP_CONSTANTS.VERCEL_AVATAR}/naira`,
    },
  },
  sell: {
    coins: [
      {
        id: "sui",
        label: "SUI",
        value: "sui",
        image: `${APP_CONSTANTS.VERCEL_AVATAR}/sui`,
      },
      {
        id: "eth",
        label: "ETH",
        value: "eth",
        image: `${APP_CONSTANTS.VERCEL_AVATAR}/eth`,
      },
      {
        id: "usdc",
        label: "USDC",
        value: "usdc",
        image: `${APP_CONSTANTS.VERCEL_AVATAR}/usdc`,
      },
      {
        id: "naira",
        label: "Naira",
        value: "naira",
        image: `${APP_CONSTANTS.VERCEL_AVATAR}/naira`,
      },
    ],
    amount: 0,
    label: "Send",
    selectedCoin: {
      id: "usdc",
      label: "USDC",
      value: "usdc",
      image: `${APP_CONSTANTS.VERCEL_AVATAR}/usdc`,
    },
  },
  active: "buy",
  edit(type, data, value) {
    set((state) => ({
      [type]: {
        ...state[type],
        [data]: value,
      },
    }));
  },
  modifyToggle(toggle) {
    set((state) => ({
      ...state,
      [toggle]: !state[toggle],
    }));
  },
}));
