import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

import { useAlarms } from '@/hooks/useAlarms';
import { useTasks } from '@/hooks/useTasks';
import { useTheme } from '@/hooks/useTheme';
import { Alarm } from '@/types/alarm';

import { CurrentTime } from '@/components/CurrentTime';
import { AlarmCard } from '@/components/AlarmCard';
import { TaskCard } from '@/components/TaskCard';
import { Dashboard } from '@/components/Dashboard';
import { Navigation } from '@/components/Navigation';
import { AddAlarmDialog } from '@/components/AddAlarmDialog';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { SimpleCalendar } from '@/components/SimpleCalendar';
import { SettingsPanel } from '@/components/SettingsPanel';
import { MathChallenge } from '@/components/MathChallenge';
import { AlarmPlayer } from '@/components/AlarmPlayer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type TabType = 'dashboard' | 'alarms' | 'planner' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddAlarm, setShowAddAlarm] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [showMathChallenge, setShowMathChallenge] = useState(false);
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  const triggeredAlarmsRef = useRef<Record<string, string>>({});

  const { alarms, addAlarm, updateAlarm, deleteAlarm, toggleAlarm, getNextAlarm } = useAlarms();
  const { tasks, addTask, deleteTask, toggleTask, getTasksForDate, getTodayTasks, getCompletionRate, setDayNote, getDayNote } = useTasks();
  const { theme, setTheme } = useTheme();

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayTasks = getTasksForDate(selectedDateStr);
  const todayTasks = getTodayTasks();
  const nextAlarm = getNextAlarm();

  // Check for alarms every second
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = format(now, 'HH:mm');
      const currentDay = now.getDay();
      const currentMinuteKey = format(now, 'yyyy-MM-dd HH:mm');

      alarms.forEach((alarm) => {
        const lastTriggeredKey = triggeredAlarmsRef.current[alarm.id];
        if (
          alarm.enabled &&
          alarm.time === currentTime &&
          (alarm.repeatDays.length === 0 || alarm.repeatDays.includes(currentDay)) &&
          lastTriggeredKey !== currentMinuteKey
        ) {
          triggeredAlarmsRef.current[alarm.id] = currentMinuteKey;
          setRingingAlarm(alarm);
          if (alarm.mathChallenge) {
            setShowMathChallenge(true);
          } else {
            toast.info(`⏰ ${alarm.label || 'Alarm'}`, {
              duration: 10000,
              action: {
                label: 'Dismiss',
                onClick: () => setRingingAlarm(null),
              },
            });
          }

          // Vibration
          if (alarm.vibration && navigator.vibrate) {
            navigator.vibrate([500, 200, 500, 200, 500]);
          }
        }
      });
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [alarms]);

  const handleEditAlarm = (alarm: Alarm) => {
    setEditingAlarm(alarm);
    setShowAddAlarm(true);
  };

  const handleSaveAlarm = (alarmData: Omit<Alarm, 'id' | 'createdAt'>) => {
    if (editingAlarm) {
      updateAlarm(editingAlarm.id, alarmData);
      toast.success('Alarm updated');
    } else {
      addAlarm(alarmData);
      toast.success('Alarm created');
    }
    setEditingAlarm(null);
  };

  const handleMathSolve = () => {
    setShowMathChallenge(false);
    setRingingAlarm(null);
    toast.success('Good morning! Have a great day!');
  };

  const handleSnooze = () => {
    if (ringingAlarm) {
      toast.info(`Snoozed for ${ringingAlarm.snoozeMinutes} minutes`);
    }
    setShowMathChallenge(false);
    setRingingAlarm(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <div className="container max-w-4xl md:max-w-3xl lg:max-w-5xl mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main column: current time + dashboard + quick actions */}
              <div className="md:col-span-2 space-y-6">
                <CurrentTime />
                <Dashboard
                  nextAlarm={nextAlarm}
                  todayTasks={todayTasks}
                  completionRate={getCompletionRate()}
                />

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => setShowAddAlarm(true)}
                    className="h-auto py-4 flex-col gap-2"
                    variant="glass"
                  >
                    <Plus className="w-6 h-6" />
                    <span>New Alarm</span>
                  </Button>
                  <Button
                    onClick={() => {
                      // When adding a task from the dashboard, always use "today"
                      setSelectedDate(new Date());
                      setShowAddTask(true);
                    }}
                    className="h-auto py-4 flex-col gap-2"
                    variant="glass"
                  >
                    <Plus className="w-6 h-6" />
                    <span>New Task</span>
                  </Button>
                </div>

                {/* Today's Tasks */}
                {todayTasks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Today's Tasks</h3>
                    <div className="space-y-3">
                      {todayTasks.slice(0, 5).map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggle={toggleTask}
                          onDelete={deleteTask}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar: notes + compact controls */}
              <aside className="space-y-4">
                <div className="glass-card p-4">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <Textarea
                    placeholder="Add notes for today..."
                    value={getDayNote(format(selectedDate, 'yyyy-MM-dd'))}
                    onChange={(e) => setDayNote(format(selectedDate, 'yyyy-MM-dd'), e.target.value)}
                    className="bg-secondary/50 resize-none"
                    rows={4}
                  />
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* Alarms Tab */}
        {activeTab === 'alarms' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Alarms</h2>
                <p className="text-muted-foreground">{alarms.length} alarm{alarms.length !== 1 ? 's' : ''}</p>
              </div>
              <Button onClick={() => setShowAddAlarm(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Add Alarm
              </Button>
            </div>

            <div className="space-y-4">
              {alarms.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <p className="text-muted-foreground">No alarms yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tap the button above or use voice command
                  </p>
                </div>
              ) : (
                alarms.map((alarm) => (
                  <AlarmCard
                    key={alarm.id}
                    alarm={alarm}
                    onToggle={toggleAlarm}
                    onDelete={deleteAlarm}
                    onEdit={handleEditAlarm}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* Planner Tab */}
        {activeTab === 'planner' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold">Daily Planner</h2>
              <p className="text-muted-foreground">Plan your day, achieve your goals</p>
            </div>

            <SimpleCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              tasks={tasks}
            />

            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {format(selectedDate, 'EEEE, MMM d')}
              </h3>
              <Button size="sm" onClick={() => setShowAddTask(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Task
              </Button>
            </div>

            <div className="space-y-3">
              {dayTasks.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <p className="text-muted-foreground">No tasks for this day</p>
                </div>
              ) : (
                dayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                ))
              )}
            </div>

            {/* Day Notes */}
            <div className="glass-card p-4">
              <h4 className="font-medium mb-2">Notes</h4>
              <Textarea
                placeholder="Add notes for this day..."
                value={getDayNote(selectedDateStr)}
                onChange={(e) => setDayNote(selectedDateStr, e.target.value)}
                className="bg-secondary/50 resize-none"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <SettingsPanel theme={theme} onThemeChange={setTheme} />
        )}
      </div>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Alarm audio player (controls synthesized audio when an alarm rings) */}
      <AlarmPlayer
        ringingAlarm={ringingAlarm}
        onStop={() => setRingingAlarm(null)}
        onSnooze={() => {
          if (ringingAlarm) {
            // Snooze for 5 minutes
            const snoozeTime = new Date();
            snoozeTime.setMinutes(snoozeTime.getMinutes() + 5);
            
            const newAlarm = {
              ...ringingAlarm,
              time: format(snoozeTime, 'HH:mm'),
              id: Date.now().toString(),
            };
            
            addAlarm(newAlarm);
            setRingingAlarm(null);
            toast.success(`Alarm snoozed until ${newAlarm.time}`);
          }
        }}
      />

      {/* Dialogs */}
      <AddAlarmDialog
        open={showAddAlarm}
        onOpenChange={(open) => {
          setShowAddAlarm(open);
          if (!open) setEditingAlarm(null);
        }}
        onSave={handleSaveAlarm}
        editingAlarm={editingAlarm}
        existingAlarms={alarms}
      />

      <AddTaskDialog
        open={showAddTask}
        onOpenChange={setShowAddTask}
        onSave={(task) => {
          addTask(task);
          // Dialog close is handled inside AddTaskDialog after successful save
        }}
        selectedDate={selectedDateStr}
      />

      <MathChallenge
        open={showMathChallenge}
        onSolve={handleMathSolve}
        onSnooze={handleSnooze}
      />
    </div>
  );
};

export default Index;
