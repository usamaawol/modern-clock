import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onClick: () => void;
  transcript?: string;
}

export const VoiceButton = ({
  isListening,
  isSupported,
  onClick,
  transcript,
}: VoiceButtonProps) => {
  if (!isSupported) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50" role="group" aria-label="Voice commands">
      <div className="relative">
        {isListening && transcript && (
          <div className="absolute bottom-full right-0 mb-3 max-w-xs animate-fade-in">
            <div className="glass-card p-3 rounded-xl text-sm">
              <p className="text-muted-foreground">{transcript || 'Listening...'}</p>
            </div>
          </div>
        )}
        
        <Button
          onClick={onClick}
          size="icon-lg"
          className={cn(
            'rounded-full shadow-elevated transition-all duration-300',
            isListening
              ? 'bg-destructive hover:bg-destructive/90 animate-pulse-glow'
              : 'bg-accent hover:bg-accent/90'
          )}
          aria-pressed={isListening}
          aria-label={isListening ? 'Stop voice recognition' : 'Start voice recognition'}
        >
          {isListening ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>
        
        {isListening && (
          <span aria-hidden className="absolute -inset-2 rounded-full border-2 border-destructive/50 animate-ping" />
        )}
      </div>
    </div>
  );
};
