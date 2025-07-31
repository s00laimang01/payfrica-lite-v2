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
        id: "usdt",
        label: "USDT",
        value: "usdt",
        image: `${APP_CONSTANTS.VERCEL_AVATAR}/usdt`,
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
        id: "usdt",
        label: "USDT",
        value: "usdt",
        image: `${APP_CONSTANTS.VERCEL_AVATAR}/usdt`,
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
