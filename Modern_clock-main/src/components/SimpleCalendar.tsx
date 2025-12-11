import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/types/alarm';

interface SimpleCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  tasks: Task[];
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const SimpleCalendar = ({ selectedDate, onDateSelect, tasks }: SimpleCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startPadding = monthStart.getDay();
  const paddedDays = [...Array(startPadding).fill(null), ...days];

  const getTaskCountForDate = (date: Date): number => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(t => t.date === dateStr).length;
  };

  const hasTasksForDate = (date: Date): boolean => {
    return getTaskCountForDate(date) > 0;
  };

  return (
    <div className="glass-card p-4 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h3 className="font-semibold text-lg">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 text-xs sm:text-sm">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {paddedDays.map((day, index) => (
          <button
            key={index}
            disabled={!day}
            onClick={() => day && onDateSelect(day)}
            className={cn(
              'rounded-lg flex flex-col items-center justify-center text-sm transition-all relative h-10 sm:h-12 md:h-16',
              !day && 'invisible',
              day && !isSameMonth(day, currentMonth) && 'text-muted-foreground/50',
              day && isSameDay(day, selectedDate) && 'bg-primary text-primary-foreground font-bold',
              day && !isSameDay(day, selectedDate) && isSameDay(day, new Date()) && 'border-2 border-primary',
              day && !isSameDay(day, selectedDate) && 'hover:bg-secondary'
            )}
          >
            {day && <span className="select-none">{format(day, 'd')}</span>}
            {day && hasTasksForDate(day) && !isSameDay(day, selectedDate) && (
              <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-accent" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
