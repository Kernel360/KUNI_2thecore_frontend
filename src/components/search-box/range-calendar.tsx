'use client';

import * as React from 'react';
import { DateRange } from 'react-day-picker';

import { Calendar } from '@/components/ui/calendar';

export function RangeCalendar() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2025, 6, 5), // July 5, 2025
    to: new Date(2025, 7, 23), // August 3, 2025
  });

  return (
    <Calendar
      mode="range"
      defaultMonth={date?.from}
      numberOfMonths={2}
      selected={date}
      onSelect={setDate}
      className="rounded-lg border shadow-sm"
    />
  );
}
