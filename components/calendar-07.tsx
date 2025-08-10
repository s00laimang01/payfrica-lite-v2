"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";

export default function Calendar07({
  onDateSelection,
  defaultDate,
}: {
  onDateSelection?: (dateRange?: DateRange | undefined) => void;
  defaultDate?: DateRange | undefined;
}) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    defaultDate
  );

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Calendar
        mode="range"
        defaultMonth={dateRange?.from}
        selected={dateRange}
        onSelect={(e) => {
          setDateRange(e);
          onDateSelection?.(e);
        }}
        numberOfMonths={2}
        min={2}
        max={20}
        className="rounded-lg border shadow-sm"
      />
    </div>
  );
}
