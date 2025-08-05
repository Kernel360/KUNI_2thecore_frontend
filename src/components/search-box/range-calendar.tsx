'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Image from 'next/image';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

export function RangeCalendar() {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined
  );

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return '렌트시작일 - 렌트종료일';
    if (!range?.to) return range.from.toLocaleDateString();
    return `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-96 h-11 justify-between">
          {formatDateRange(dateRange)}
          <Image
            src="/calendar_month_24dp_434343.svg"
            alt="calendar"
            width={20}
            height={20}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0 bg-white"
        align="center"
      >
        <Calendar
          mode="range"
          selected={dateRange}
          captionLayout="dropdown"
          onSelect={setDateRange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
