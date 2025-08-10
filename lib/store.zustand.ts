import {
  ITransactionFilters,
  ITransactionFiltersSetters,
  IUseConversation,
  IUsePayfricaStore,
} from "@/types";
import { create } from "zustand";
import { APP_CONSTANTS } from "./constant";

export const useConversation = create<IUseConversation>((set) => ({
  buy: {
    coins: [],
    amount: 0,
    label: "Recieve",
    selectedCoin: {
      id: "usdc",
      label: "USDC",
      value: "usdc",
      image: `${APP_CONSTANTS.VERCEL_AVATAR}/usdc`,
    },
  },
  sell: {
    coins: [],
    amount: 0,
    label: "Pay",
    selectedCoin: {
      id: "naira",
      label: "NAIRA",
      value: "naira",
      image: `${APP_CONSTANTS.VERCEL_AVATAR}/naira`,
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
  onActiveChange(active) {
    set((state) => ({
      ...state,
      active,
    }));
  },
  availableCoins: [
    {
      id: "none",
      label: "None",
      value: "none",
      image: APP_CONSTANTS.VERCEL_AVATAR + "/none",
    },
  ],
  setAvailableCoins(coins) {
    set((state) => ({
      ...state,
      availableCoins: coins,
    }));
  },
}));

export const usePayfricaV2Store = create<IUsePayfricaStore>((set) => ({
  showWelcomeModal: false,
  setShowWelcomeModal: (value) => set({ showWelcomeModal: value }),
  showAccountInfoModal: false,
  setShowAccountInfoModal: (value) => set({ showAccountInfoModal: value }),
  user: undefined,
  setUser: (user) => set({ user }),
  showAddEmailModal: false,
  setShowAddEmailModal: (value) => set({ showAddEmailModal: value }),
  showSettingsModal: false,
  setShowSettingsModal: (value) => set({ showSettingsModal: value }),
}));
