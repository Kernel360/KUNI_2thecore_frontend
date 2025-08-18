import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

interface RangeCalendarProps {
  dateRange?: DateRange | undefined;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

export function RangeCalendar({
  dateRange: externalDateRange,
  onDateRangeChange,
}: RangeCalendarProps) {
  const [open, setOpen] = React.useState(false);
  const [internalDateRange, setInternalDateRange] = React.useState<
    DateRange | undefined
  >(undefined);

  // 컴포넌트 마운트 시 기본값 설정 (일주일 전부터 오늘까지)
  React.useEffect(() => {
    if (!externalDateRange && !internalDateRange) {
      const today = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);

      const defaultRange = {
        from: weekAgo,
        to: today,
      };

      if (onDateRangeChange) {
        onDateRangeChange(defaultRange);
      } else {
        setInternalDateRange(defaultRange);
      }
    }
  }, [externalDateRange, internalDateRange, onDateRangeChange]);

  const dateRange = externalDateRange ?? internalDateRange;
  const setDateRange = onDateRangeChange ?? setInternalDateRange;

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return '주행시작일 - 주행종료일';
    if (!range?.to) return range.from.toLocaleDateString();
    return `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-96 h-11 justify-between">
          {formatDateRange(dateRange)}
          <img
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
          required
        />
      </PopoverContent>
    </Popover>
  );
}
