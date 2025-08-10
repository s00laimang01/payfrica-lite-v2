import { ReactNode } from "react";
import { ResponseCodes } from "./lib/constant";

export interface ILogo {
  showImage?: boolean;
  showName?: boolean;
  isClickable?: boolean;
  className?: string;
}

export interface IConnectWalletBtn {
  className?: string;
  children?: any;
  onWalletConnect?: (isNewAccount?: boolean) => void;
}

export interface IAccountInfo {
  username?: string;
  className?: string;
  image?: {
    width?: number;
    height?: number;
  };
  balance?: string;
}

export interface INavbar {
  isMobile?: boolean;
}

export interface ICoin {
  value: string;
  label: string;
  id?: string;
  image?: string;
  amount?: number;
  rate?: {
    usdc?: number;
    naira?: number;
  };
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
  availableCoins?: ICoin[];
  setAvailableCoins?: (coins: ICoin[]) => void;
}

export interface IUsePayfricaStore {
  showWelcomeModal: boolean;
  setShowWelcomeModal: (value: boolean) => void;

  showAccountInfoModal: boolean;
  setShowAccountInfoModal: (prop: boolean) => void;

  user?: IUser;
  setUser?: (payload: IUser) => void;

  showAddEmailModal?: boolean;
  setShowAddEmailModal?: (value: boolean) => void;

  showSettingsModal?: boolean;
  setShowSettingsModal?: (value: boolean) => void;
}

export interface IAddEmail {
  label?: string;
  email: string;
  onEmailChange?: (email: string) => void;
  onEmailSubmit?: (email: string) => void;
}

export interface ICoinSelector {
  onCoinSelect?: (coin: ICoin) => void;
  selectedCoin?: ICoin;
  coins?: ICoin[];
  isDisabled?: boolean;
}

export interface IConversionCard {
  type: "buy" | "sell";
  showFees?: boolean;
  amount?: number;
  onAmountChange?: (amount: number) => void;
  showAmountInDollar?: boolean;
  disable?: boolean;
  disableinput?: boolean;
  disableCoinSelector?: boolean;
  onCoinSelection?: (coin: ICoin) => void;
}

export interface IWalletNotConnected {
  children?: ReactNode;
  open?: boolean;
  forceClose?: boolean;
  onWalletConnected?: () => void;
}

export interface IExchangeSessionState {
  from: ICoin;
  to: ICoin;
  amount: number;
  fromLabel: string;
  toLabel: string;
  active: "sell" | "buy";
  useFast?: boolean;
}

export interface paymentGateway {
  id: string;
  label: string;
  image: string;
  description: string;
}

export interface ISelectPaymentGateway {
  onGatewaySelection?: (gateway: paymentGateway) => void;
  gateway?: paymentGateway;
}

export interface IResolveAccount {
  account: { accountName: string; accountNumber: string };
  isResolving?: boolean;
  resolveError?: any;
}

export interface IEnterBankDetails {
  onBankSelect?: (bank: IBank) => void;
  selectedBank?: IBank;
  onAccountNumberInput?: (accountNumber?: string) => void;
  accountNumber?: string;
  onAccountResolve?: (props: IResolveAccount) => void;
}

export interface INotFound {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export interface IBank {
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: null;
  pay_with_bank: boolean;
  active: boolean;
  is_deleted: boolean;
  country: string;
  currency: string;
  type: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface apiResponse<T = any> {
  message: string;
  code: ResponseCodes;
  data: T;
}

export type transactionStatus = "pending" | "success" | "failed" | "refunded";

export interface IConfirmExchange {
  note?: string;
  status?: transactionStatus;
  transactionId: string;
  coins?: {
    from: ICoin;
    to: ICoin;
  };
  children?: ReactNode;
  open?: boolean;
  forceClose?: boolean;
  onClose?: (prop: boolean) => void;
  onTransactionUpdate?: (props: ITransaction) => void;
}

export interface ITimeStamp {
  createdAt?: string;
  updateAt?: string;
}

export interface IUser extends ITimeStamp {
  _id?: string;
  wallet: string;
  email?: string;
  kyc?: {
    isCompleted?: boolean;
    verificationMeans?: string;
    verificationDate?: Date;
    isEmailVerified?: boolean;
  };
  balance?: number;
  lastConnected?: Date;
  bankAccount?: {
    alwaysUseDefualtAccount?: boolean;
    bank?: string | IBankAccount;
  };
  preference?: {
    marketingNotifications?: boolean;
    emailNotification?: boolean;
    pushNotification?: boolean;
  };

  //methods
  hasUserCompletedKyc?: () => Promise<boolean>;
}

export interface IBankAccount extends ITimeStamp {
  user: string;
  wallet: string;
  account: {
    accountNumber: string;
    accountName: string;
    bankCode: string;
    bankName?: string;
  };
}

export interface ITransaction {
  _id?: string;
  status: transactionStatus;
  reference: string;
  amount: number;
  currency: string;
  email: string;
  paystack?: {
    accessCode?: string;
    authorizationUrl?: string;
    reference?: string | IBankAccount;
  };
  user: string;
  type: "buy" | "sell";
  from?: ICoin;
  to?: ICoin;
  createdAt?: Date;
  updatedAt?: Date;
  history?: Record<string, { note?: string; time?: string }>;
  bankUsed?: string;
}

export interface ITransactionFilters {
  limit?: number;
  offset?: number;
  status?: transactionStatus | transactionStatus[];
  type?: "buy" | "sell" | ("buy" | "sell")[];
  currency?: string | string[];
  amountMin?: number;
  amountMax?: number;
  dateFrom?: string | Date;
  dateTo?: string | Date;
  reference?: string;
  email?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface ITransactionFiltersSetters {
  setlimit?: (prop: number) => void;
  setoffset?: (prop: number) => void;
  setstatus?: (prop: transactionStatus | transactionStatus[]) => void;
  settype?: (prop: "buy" | "sell" | ("buy" | "sell")[]) => void;
  setcurrency?: (prop: string | string[]) => void;
  setamountMin?: (prop: number) => void;
  setamountMax?: (prop: number) => void;
  setdateFrom?: (prop: string | Date) => void;
  setdateTo?: (prop: string | Date) => void;
  setreference?: (prop: string) => void;
  setemail?: (prop: string) => void;
  setsortBy?: (prop: string) => void;
  setsortOrder?: (prop: "asc" | "desc") => void;
  setsearch?: (prop: string) => void;
}
