import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

export function DoubleCalendar() {
  const [startOpen, setStartOpen] = React.useState(false);
  const [endOpen, setEndOpen] = React.useState(false);

  // 일주일 전을 기본 시작일로 설정
  const getWeekAgo = () => {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    return weekAgo;
  };

  const [startTime, setStartTime] = React.useState<Date | undefined>(
    getWeekAgo()
  );
  const [endTime, setEndTime] = React.useState<Date | undefined>(new Date());

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
              setStartTime(date);
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
              setEndTime(date);
              setEndOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
