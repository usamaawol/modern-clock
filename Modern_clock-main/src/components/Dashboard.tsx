import { Alarm, Task } from '@/types/alarm';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckSquare, Bell, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DashboardProps {
  nextAlarm: Alarm | null;
  todayTasks: Task[];
  completionRate: number;
}

export const Dashboard = ({ nextAlarm, todayTasks, completionRate }: DashboardProps) => {
  const getTimeUntilAlarm = (alarm: Alarm): string => {
    const now = new Date();
    const [hours, minutes] = alarm.time.split(':').map(Number);
    const alarmTime = new Date();
    alarmTime.setHours(hours, minutes, 0, 0);

    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    const diff = alarmTime.getTime() - now.getTime();
    const hoursUntil = Math.floor(diff / (1000 * 60 * 60));
    const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hoursUntil > 0) {
      return `${hoursUntil}h ${minutesUntil}m`;
    }
    return `${minutesUntil}m`;
  };

  const completedTasks = todayTasks.filter(t => t.completed).length;
  const pendingTasks = todayTasks.filter(t => !t.completed);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {/* Next Alarm Card */}
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Next Alarm</p>
            <p className="font-semibold">
              {nextAlarm ? getTimeUntilAlarm(nextAlarm) : 'No alarms'}
            </p>
          </div>
        </div>
        {nextAlarm && (
          <div className="flex items-baseline gap-2">
            <span className="time-display text-3xl font-bold">{nextAlarm.time}</span>
            <span className="text-sm text-muted-foreground">{nextAlarm.label || 'Alarm'}</span>
          </div>
        )}
      </div>

      {/* Today's Progress Card */}
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Today's Progress</p>
            <p className="font-semibold">{completedTasks} of {todayTasks.length} tasks</p>
          </div>
        </div>
        <div className="space-y-2">
          <Progress value={completionRate} className="h-3" />
          <p className="text-right text-sm font-medium text-muted-foreground">
            {completionRate}%
          </p>
        </div>
      </div>

      {/* Upcoming Tasks Card */}
      <div className="glass-card p-6 animate-slide-up md:col-span-2 lg:col-span-1" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending Tasks</p>
            <p className="font-semibold">{pendingTasks.length} remaining</p>
          </div>
        </div>
        <div className="space-y-2 max-h-24 overflow-y-auto scrollbar-hide">
          {pendingTasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className={`w-2 h-2 rounded-full ${
                task.priority === 'high' ? 'bg-destructive' :
                task.priority === 'medium' ? 'bg-warning' : 'bg-success'
              }`} />
              <span className="truncate">{task.title}</span>
            </div>
          ))}
          {pendingTasks.length === 0 && (
            <p className="text-sm text-muted-foreground">All done for today!</p>
          )}
        </div>
      </div>
    </div>
  );
};
