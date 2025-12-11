import { Alarm } from '@/types/alarm';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, Bell, Vibrate, Brain } from 'lucide-react';

interface AlarmCardProps {
  alarm: Alarm;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (alarm: Alarm) => void;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const AlarmCard = ({ alarm, onToggle, onDelete, onEdit }: AlarmCardProps) => {
  const [hours, minutes] = alarm.time.split(':');
  const hour = parseInt(hours);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  return (
    <div className={`glass-card p-5 transition-all duration-300 animate-scale-in ${
      alarm.enabled ? 'opacity-100 border-primary/30' : 'opacity-60'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="time-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              {displayHour.toString().padStart(2, '0')}:{minutes}
            </span>
            <span className="text-sm sm:text-base md:text-lg font-medium text-muted-foreground">{period}</span>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1">{alarm.label || 'Alarm'}</p>
          
          <div className="flex gap-1 mt-3">
            {DAYS.map((day, index) => (
              <span
                key={index}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  alarm.repeatDays.includes(index)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {day}
              </span>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            {alarm.vibration && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Vibrate className="w-3 h-3" /> Vibrate
              </span>
            )}
            {alarm.mathChallenge && (
              <span className="flex items-center gap-1 text-xs text-accent">
                <Brain className="w-3 h-3" /> Math
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Bell className="w-3 h-3" /> {alarm.snoozeMinutes}m snooze
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <Switch
            checked={alarm.enabled}
            onCheckedChange={() => onToggle(alarm.id)}
          />
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(alarm)}
              className="hover:bg-secondary"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(alarm.id)}
              className="hover:bg-destructive/20 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
