import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios, { AxiosInstance } from "axios";
import {
  apiResponse,
  IBank,
  IBankAccount,
  ICoin,
  ITransaction,
  ITransactionFilters,
  IUser,
} from "@/types";
import { number } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class PayfricaLiteV2 {
  private payfricaV2Api: AxiosInstance;
  private walletAddr?: string;

  constructor(wallet = "") {
    this.walletAddr = wallet;
    this.payfricaV2Api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        "x-wallet-address": wallet,
      },
    });
  }

  public truncateAddress(address = "", start = 6, end = -4) {
    return address?.slice(0, start) + "..." + address?.slice(end);
  }

  formatCurrency(
    amount: number,
    currency: string = "USD",
    options?: {
      locale?: string;
      compact?: boolean;
      decimals?: number;
      showSymbol?: boolean;
    }
  ): string {
    const {
      locale,
      compact = false,
      decimals,
      showSymbol = true,
    } = options || {};

    // Currency to locale mapping
    const localeMap: Record<string, string> = {
      USD: "en-US",
      NGN: "en-NG",
      EUR: "en-DE",
      GBP: "en-GB",
      JPY: "ja-JP",
      CAD: "en-CA",
      AUD: "en-AU",
      CHF: "de-CH",
      CNY: "zh-CN",
      INR: "en-IN",
    };

    // Currencies that don't use decimals
    const noDecimalCurrencies = ["JPY", "KRW"];

    const targetLocale = locale || localeMap[currency.toUpperCase()] || "en-US";
    const currencyCode = currency.toUpperCase();
    const defaultDecimals = noDecimalCurrencies.includes(currencyCode) ? 0 : 2;

    try {
      return new Intl.NumberFormat(targetLocale, {
        style: showSymbol ? "currency" : "decimal",
        currency: showSymbol ? currencyCode : undefined,
        minimumFractionDigits: decimals ?? defaultDecimals,
        maximumFractionDigits: decimals ?? defaultDecimals,
        notation: compact ? "compact" : "standard",
        compactDisplay: compact ? "short" : undefined,
      }).format(amount);
    } catch (error) {
      // Fallback with manual symbols
      const symbols: Record<string, string> = {
        USD: "$",
        NGN: "₦",
        EUR: "€",
        GBP: "£",
        JPY: "¥",
        CAD: "C$",
        AUD: "A$",
        CHF: "CHF",
        CNY: "¥",
        INR: "₹",
      };

      const symbol = showSymbol
        ? symbols[currencyCode] || currencyCode + " "
        : "";
      const formatted = amount.toLocaleString("en-US", {
        minimumFractionDigits: decimals ?? defaultDecimals,
        maximumFractionDigits: decimals ?? defaultDecimals,
      });

      return `${symbol}${formatted}`;
    }
  }

  public generateTransactionId() {
    const now = new Date();

    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const parts = formatter.formatToParts(now);

    const dateParts: Record<string, any> = {};
    for (const part of parts) {
      if (part.type !== "literal") {
        dateParts[part.type] = part.value;
      }
    }
    const formattedDate =
      dateParts.year +
      dateParts.month +
      dateParts.day +
      dateParts.hour +
      dateParts.minute;

    const randomSuffix = Math.random().toString(36).substring(2, 5);
    const requestId = formattedDate + randomSuffix;

    return requestId;
  }

  public async getAvailableBanks() {
    const res = await this.payfricaV2Api.get<apiResponse<IBank[]>>(
      "/available-banks"
    );
    return res.data.data;
  }

  public async resolveAccount(accountNumber: string, bankCode: string) {
    const q = new URLSearchParams({
      accountNumber,
      bankCode,
    });

    const res = await this.payfricaV2Api.get<
      apiResponse<{ accountNumber: string; accountName: string }>
    >(`/resolve-account?${q.toString()}`);

    return res.data.data;
  }

  public async initiateCharge(payload?: {
    transactionId: string;
    amount: number;
    from: string;
    type: "buy" | "sell";
  }) {
    const res = await this.payfricaV2Api.post<
      apiResponse<{ address: string; transaction: ITransaction; session: null }>
    >(`/charge/initiate`, payload);

    return res.data.data;
  }

  public async verifyCharge(transactionReference: string) {
    const q = new URLSearchParams({
      reference: transactionReference,
    });
    const res = await this.payfricaV2Api.get<apiResponse<ITransaction>>(
      `/charge/verify?${q.toString()}`,
      {}
    );

    return res.data.data;
  }

  public async getCoins() {
    const res = await this.payfricaV2Api.get<apiResponse<ICoin[]>>(
      `/coins/available`
    );

    return res.data.data;
  }

  public async calculateExchange(from: string, to: string, amount: number) {
    const q = new URLSearchParams({
      amount: String(amount),
    });

    const res = await this.payfricaV2Api.get<
      apiResponse<{ from: ICoin; to: ICoin; exchangeRate: number }>
    >(`/coins/${from}/exchange/${to}?${q.toString()}`);

    return res.data.data;
  }

  public async createUser() {
    const res = await this.payfricaV2Api.post<apiResponse<IUser>>(
      `/user/create`,
      { wallet: this.walletAddr }
    );

    return res.data;
  }

  public async updateEmail(email: string) {
    const res = await this.payfricaV2Api.post<apiResponse<IUser>>(
      `/user/me/update-email`,
      { email }
    );

    return res.data;
  }

  public async getMe() {
    const res = await this.payfricaV2Api.get<apiResponse<IUser>>(`/user/me`);

    return res.data.data;
  }

  public async getPreviousBanks() {
    const res = await this.payfricaV2Api.get<apiResponse<IBankAccount[]>>(
      `/user/me/banks`
    );

    return res.data.data;
  }

  public async placeWithdrawal(payload: {
    from: string;
    to: string;
    account?: {
      accountName?: string;
      accountNumber?: string;
      bankCode?: string;
      bankName?: string;
    };
    amount: number;
  }) {
    const res = await this.payfricaV2Api.post<apiResponse<ITransaction>>(
      "/withdraw",
      payload
    );

    return res.data;
  }

  public async getTransactions(filter?: ITransactionFilters) {
    const {
      limit = 10,
      offset = 0,
      status,
      type,
      currency,
      amountMin,
      amountMax,
      dateFrom,
      dateTo,
      reference,
      email,
      sortBy,
      sortOrder,
      search,
    } = filter || {};

    const q = new URLSearchParams();

    q.append("limit", limit.toString());
    q.append("offset", offset.toString());

    if (status)
      q.append("status", Array.isArray(status) ? status.join(",") : status);
    if (type) q.append("type", Array.isArray(type) ? type.join(",") : type);
    if (currency)
      q.append(
        "currency",
        Array.isArray(currency) ? currency.join(",") : currency
      );
    if (amountMin !== undefined) q.append("amountMin", amountMin.toString());
    if (amountMax !== undefined) q.append("amountMax", amountMax.toString());
    if (dateFrom) q.append("dateFrom", dateFrom.toString());
    if (dateTo) q.append("dateTo", dateTo.toString());
    if (reference) q.append("reference", reference);
    if (email) q.append("email", email);
    if (sortBy) q.append("sortBy", sortBy);
    if (sortOrder) q.append("sortOrder", sortOrder);
    if (search) q.append("search", search);

    const res = await this.payfricaV2Api.get<
      apiResponse<{
        transactions: ITransaction[];
        totalTransaction: number;
        pagination: {
          totalPages: number;
          currentPage: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }>
    >(`/transactions?${q.toString()}`);

    return res.data;
  }

  public async getTransaction(reference: string) {
    const res = await this.payfricaV2Api.get<apiResponse<ITransaction>>(
      `/transactions/${reference}`
    );
    return res.data.data;
  }

  public async addBeneficiary(payload?: {
    accountNumber: string;
    bankCode: string;
    bankName: string;
    accountName: string;
  }) {
    const res = await this.payfricaV2Api.post<apiResponse<IBankAccount>>(
      `/user/me/banks/add`,
      payload
    );

    return res.data.data;
  }

  isPathMatching(pathname = "") {
    if (!pathname) return false;

    const _pathname = window.location.pathname;

    return _pathname === pathname;
  }

  public async updatePreference(payload?: IUser["preference"]) {
    const res = await this.payfricaV2Api.patch<apiResponse<IUser>>(
      `/user/me/update-preference`,
      payload
    );

    return res.data.data;
  }
}

export const payfricalitev2 = new PayfricaLiteV2();
