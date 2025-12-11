import { useState, useEffect } from 'react';
import { Alarm } from '@/types/alarm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ensureAudioAllowed, playTestTone } from '@/lib/audio';

interface AddAlarmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (alarm: Omit<Alarm, 'id' | 'createdAt'>) => void;
  editingAlarm?: Alarm | null;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AddAlarmDialog = ({
  open,
  onOpenChange,
  onSave,
  editingAlarm,
  existingAlarms = [],
}: AddAlarmDialogProps & { existingAlarms?: Alarm[] }) => {
  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('');
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [snoozeMinutes, setSnoozeMinutes] = useState(5);
  const [vibration, setVibration] = useState(true);
  const [mathChallenge, setMathChallenge] = useState(false);

  useEffect(() => {
    if (editingAlarm) {
      setTime(editingAlarm.time);
      setLabel(editingAlarm.label);
      setRepeatDays(editingAlarm.repeatDays);
      setSnoozeMinutes(editingAlarm.snoozeMinutes);
      setVibration(editingAlarm.vibration);
      setMathChallenge(editingAlarm.mathChallenge);
    } else {
      setTime('07:00');
      setLabel('');
      setRepeatDays([]);
      setSnoozeMinutes(5);
      setVibration(true);
      setMathChallenge(false);
    }
  }, [editingAlarm, open]);

  const toggleDay = (day: number) => {
    setRepeatDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const isDuplicateTime = () => {
    if (editingAlarm) {
      // If editing, only check against other alarms
      return existingAlarms.some(
        alarm => alarm.time === time && alarm.id !== editingAlarm.id
      );
    }
    // For new alarms, check against all existing alarms
    return existingAlarms.some(alarm => alarm.time === time);
  };

  const handleSave = () => {
    if (isDuplicateTime()) return;
    
    onSave({
      time,
      label,
      enabled: true,
      repeatDays,
      snoozeMinutes,
      tone: 'default',
      vibration,
      mathChallenge,
    });
    onOpenChange(false);
  };
  
  const isSaveDisabled = isDuplicateTime();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/50 w-full max-w-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editingAlarm ? 'Edit Alarm' : 'New Alarm'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Time Picker */}
          <div className="flex justify-center">
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="time-display text-3xl sm:text-4xl md:text-5xl font-bold text-center h-auto py-3 bg-transparent border-none focus-visible:ring-0 [&::-webkit-calendar-picker-indicator]:hidden"
            />
          </div>

          {/* Label */}
          <div className="space-y-2">
            <Label>Label</Label>
            <Input
              placeholder="Wake up, Meeting..."
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="bg-secondary/50"
            />
          </div>

          {/* Repeat Days */}
          <div className="space-y-2">
            <Label>Repeat</Label>
            <div className="flex gap-2">
              {DAYS.map((day, index) => (
                <button
                  key={index}
                  onClick={() => toggleDay(index)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                    repeatDays.includes(index)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  {day.charAt(0)}
                </button>
              ))}
            </div>
          </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button variant="secondary" className="flex-1" onClick={async () => {
                const ok = await playTestTone();
                if (!ok) {
                  // fall back to enabling audio
                  await ensureAudioAllowed();
                }
              }}>
                Test Sound
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSave}
                disabled={isSaveDisabled}
                title={isSaveDisabled ? 'An alarm with this time already exists' : ''}
              >
                {editingAlarm ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>

          {/* Vibration */}
          <div className="flex items-center justify-between">
            <Label>Vibration</Label>
            <Switch checked={vibration} onCheckedChange={setVibration} />
          </div>

          {/* Math Challenge */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Math Challenge</Label>
              <p className="text-xs text-muted-foreground">Solve a problem to dismiss</p>
            </div>
            <Switch checked={mathChallenge} onCheckedChange={setMathChallenge} />
          </div>
      </DialogContent>
    </Dialog>
  );
};
