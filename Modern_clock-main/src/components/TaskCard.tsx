import { Task } from '@/types/alarm';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: 'border-l-success',
  medium: 'border-l-warning',
  high: 'border-l-destructive',
};

export const TaskCard = ({ task, onToggle, onDelete }: TaskCardProps) => {
  return (
    <div
      className={cn(
        'glass-card p-4 border-l-4 transition-all duration-300 animate-scale-in',
        priorityColors[task.priority],
        task.completed && 'opacity-50'
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="mt-1 h-5 w-5 rounded-md border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        
        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-medium transition-all',
            task.completed && 'line-through text-muted-foreground'
          )}>
            {task.title}
          </p>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {task.description}
            </p>
          )}
          
          {task.time && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-2">
              <Clock className="w-3 h-3" />
              {task.time}
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(task.id)}
          className="hover:bg-destructive/20 hover:text-destructive shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
