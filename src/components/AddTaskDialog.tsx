import { useState, useEffect } from 'react';
import { Task } from '@/types/alarm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  selectedDate: string;
  initialTitle?: string;
}

export const AddTaskDialog = ({
  open,
  onOpenChange,
  onSave,
  selectedDate,
  initialTitle = '',
}: AddTaskDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setDescription('');
      setTime('');
      setPriority('medium');
    }
  }, [open, initialTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    const taskData: Omit<Task, 'id' | 'createdAt'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      date: selectedDate,
      time: time ? time.trim() : undefined,
      completed: false,
      priority,
    };

    onSave(taskData);
    
    // Reset form
    setTitle('');
    setDescription('');
    setTime('');
    setPriority('medium');
    
    // Close the dialog
    onOpenChange(false);
    
    // Show success message
    toast.success('Task added successfully!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/50 w-full max-w-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New Task</DialogTitle>
        </DialogHeader>

        <form id="task-form" onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label>Task Title</Label>
            <Input
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea
              placeholder="Add more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary/50 resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Time (optional)</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-3">
            <Label>Priority</Label>
            <RadioGroup
              value={priority}
              onValueChange={(v) => setPriority(v as 'low' | 'medium' | 'high')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" className="border-success text-success" />
                <Label htmlFor="low" className="text-success cursor-pointer">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" className="border-warning text-warning" />
                <Label htmlFor="medium" className="text-warning cursor-pointer">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" className="border-destructive text-destructive" />
                <Label htmlFor="high" className="text-destructive cursor-pointer">High</Label>
              </div>
            </RadioGroup>
          </div>
        </form>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="task-form"
            className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50"
            disabled={!title.trim()}
          >
            {title.trim() ? 'Add Task' : 'Enter title'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
