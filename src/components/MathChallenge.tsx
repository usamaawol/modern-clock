import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Brain } from 'lucide-react';

interface MathChallengeProps {
  open: boolean;
  onSolve: () => void;
  onSnooze: () => void;
}

const generateProblem = () => {
  const operations = ['+', '-', '×'];
  const op = operations[Math.floor(Math.random() * operations.length)];
  let a: number, b: number, answer: number;

  switch (op) {
    case '+':
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * 50) + 10;
      answer = a + b;
      break;
    case '-':
      a = Math.floor(Math.random() * 50) + 30;
      b = Math.floor(Math.random() * 30) + 1;
      answer = a - b;
      break;
    case '×':
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 12) + 2;
      answer = a * b;
      break;
    default:
      a = 10;
      b = 10;
      answer = 20;
  }

  return { problem: `${a} ${op} ${b}`, answer };
};

export const MathChallenge = ({ open, onSolve, onSnooze }: MathChallengeProps) => {
  const [challenge, setChallenge] = useState(generateProblem);
  const [userAnswer, setUserAnswer] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (open) {
      setChallenge(generateProblem());
      setUserAnswer('');
    }
  }, [open]);

  const handleSubmit = () => {
    if (parseInt(userAnswer) === challenge.answer) {
      onSolve();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setUserAnswer('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="glass-card border-border/50 w-full max-w-lg sm:max-w-md [&>button]:hidden">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 animate-ring">
            <Brain className="w-8 h-8 text-accent" />
          </div>
          <DialogTitle className="text-2xl font-bold">Wake Up!</DialogTitle>
          <p className="text-muted-foreground">Solve to dismiss the alarm</p>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="text-center">
            <div className="time-display text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">
              {challenge.problem} = ?
            </div>
          </div>

          <Input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Your answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className={`text-center text-lg sm:text-2xl h-12 sm:h-14 bg-secondary/50 transition-all ${
              shake ? 'animate-[shake_0.5s_ease-in-out] border-destructive' : ''
            }`}
            autoFocus
          />

          <div className="flex gap-3 flex-col sm:flex-row">
            <Button
              variant="outline"
              className="w-full sm:flex-1"
              onClick={onSnooze}
            >
              Snooze
            </Button>
            <Button
              className="w-full sm:flex-1"
              onClick={handleSubmit}
              disabled={!userAnswer}
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
