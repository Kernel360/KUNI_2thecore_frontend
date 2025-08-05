'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Image from 'next/image';

export function RangeCalendarFrom() {
  const [open, setOpen] = React.useState(false);
  const [date1, setDate1] = React.useState<Date | undefined>(undefined);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" id="date1" className="w-48 justify-between">
          {date1 ? date1.toLocaleDateString() : '시작일'}
          <Image
            src="/calendar_month_24dp_434343.svg"
            alt="calendar"
            width={20}
            height={20}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0 bg-white" align="start">
        <Calendar
          mode="single"
          selected={date1}
          captionLayout="dropdown"
          onSelect={date1 => {
            setDate1(date1);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export function RangeCalendarTo() {
  const [open, setOpen] = React.useState(false);
  const [date2, setDate2] = React.useState<Date | undefined>(undefined);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" id="date2" className="w-48 justify-between">
          {date2 ? date2.toLocaleDateString() : '종료일'}
          <Image
            src="/calendar_month_24dp_434343.svg"
            alt="calendar"
            width={20}
            height={20}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0 bg-white" align="start">
        <Calendar
          mode="single"
          selected={date2}
          captionLayout="dropdown"
          onSelect={date2 => {
            setDate2(date2);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
