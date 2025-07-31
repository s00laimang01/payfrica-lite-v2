import React, { FC } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { IEnterBankDetails } from "@/types";

export const EnterBankDetails: FC<IEnterBankDetails> = ({
  onBankSelect,
  selectedBank,
  onAccountNumberInput,
  accountNumber,
}) => {
  return (
    <div className="space-y-3">
      <Input
        value={accountNumber}
        onChange={(e) => {
          if (isNaN(Number(e.target.value))) return;

          onAccountNumberInput?.(e.target.value);
        }}
        className="w-full h-[3rem] mt-2"
        placeholder="Account Number To Recieve Payment"
      />
      <Select value={selectedBank} onValueChange={(e) => onBankSelect?.(e)}>
        <SelectTrigger className="w-full h-[3rem] rounded-sm data-[size=default]:h-[3rem] data-[size=sm]:h-[3rem]">
          <SelectValue placeholder="Select your bank" />
        </SelectTrigger>
        <SelectContent className="rounded-sm">
          <SelectGroup>
            <SelectLabel>Available Banks</SelectLabel>
            <SelectItem value="palmpay">Palmpay</SelectItem>
            <SelectItem value="opay">Opay</SelectItem>
            <SelectItem value="access-bank">Access Bank</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
