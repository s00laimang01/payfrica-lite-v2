import { ReactNode } from "react";

export interface ILogo {
  showImage?: boolean;
  showName?: boolean;
  isClickable?: boolean;
}

export interface IConnectWalletBtn {
  className?: string;
  onWalletConnect?: () => void;
}

export interface IAccountInfo {
  username?: string;
  className?: string;
  image?: {
    width?: number;
    height?: number;
  };
}

export interface INavbar {
  isMobile?: boolean;
}

export interface ICoin {
  value: string;
  label: string;
  id?: string;
  image?: string;
}

export interface IUseConversation {
  buy: {
    coins: ICoin[];
    amount: number;
    selectedCoin?: ICoin;
    isDisabled?: boolean;
    label?: string;
  };
  sell: {
    coins: ICoin[];
    amount: number;
    selectedCoin?: ICoin;
    isDisabled?: boolean;
    label?: string;
  };
  useMax?: boolean;
  use2x?: boolean;
  active: "buy" | "sell";
  onActiveChange?: (active: "buy" | "sell") => void;
  edit?: (
    type: "buy" | "sell",
    data: keyof IUseConversation["buy"] | keyof IUseConversation["sell"],
    value: any
  ) => void;
  modifyToggle?: (value: "use2x" | "useMax") => void;
}

export interface ICoinSelector {
  onCoinSelect?: (coin: ICoin) => void;
  selectedCoin?: string;
  coins?: ICoin[];
  isDisabled?: boolean;
}

export interface IConversionCard {
  type: "buy" | "sell";
  showFees?: boolean;
  amount?: number;
  onAmountChange?: (amount: number) => void;
  showAmountInDollar?: boolean;
}

export interface IWalletNotConnected {
  children?: ReactNode;
  open?: boolean;
  onWalletConnected?: () => void;
}
