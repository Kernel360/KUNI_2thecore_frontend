import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

interface DoubleCalendarProps {
  startTime?: Date;
  endTime?: Date;
  onStartTimeChange?: (date: Date | undefined) => void;
  onEndTimeChange?: (date: Date | undefined) => void;
}

export function DoubleCalendar({ 
  startTime, 
  endTime, 
  onStartTimeChange, 
  onEndTimeChange 
}: DoubleCalendarProps) {
  const [startOpen, setStartOpen] = React.useState(false);
  const [endOpen, setEndOpen] = React.useState(false);

  return (
    <div className="flex flex-row gap-3">
      <Popover open={startOpen} onOpenChange={setStartOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="start-date"
            className="w-48 h-11 rounded-lg justify-between font-normal"
          >
            {startTime ? startTime.toLocaleDateString() : '주행시작일'}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={startTime}
            captionLayout="dropdown"
            onSelect={date => {
              onStartTimeChange?.(date);
              setStartOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      <Popover open={endOpen} onOpenChange={setEndOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="end-date"
            className="w-48 h-11 justify-between rounded-lg font-normal"
          >
            {endTime ? endTime.toLocaleDateString() : '주행종료일'}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={endTime}
            captionLayout="dropdown"
            onSelect={date => {
              onEndTimeChange?.(date);
              setEndOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
