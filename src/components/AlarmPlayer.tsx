import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Volume2, VolumeX, X } from 'lucide-react';

interface AlarmPlayerProps {
  ringingAlarm: any | null;
  onStop: () => void;
  onSnooze?: () => void;
}

// Simple synthesized alarm using WebAudio API (no external file required)
export const AlarmPlayer = ({ ringingAlarm, onStop, onSnooze }: AlarmPlayerProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const pulseInterval = useRef<number | null>(null);

  const ensureContext = async () => {
    if (!ctxRef.current) {
      const Ctor = (window.AudioContext || (window as any).webkitAudioContext) as any;
      if (!Ctor) return null;
      ctxRef.current = new Ctor();
    }
    try { await ctxRef.current.resume(); } catch (e) {}
    return ctxRef.current;
  };

  const startTone = async () => {
    const ctx = await ensureContext();
    if (!ctx) return;

    if (oscRef.current) return; // already started

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 440;
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    oscRef.current = osc;
    gainRef.current = gain;

    // pulse volume to create an urgent ringtone
    let up = true;
    pulseInterval.current = window.setInterval(() => {
      try {
        const g = gainRef.current;
        if (!g) return;
        const now = ctx.currentTime;
        if (up) {
          g.gain.cancelScheduledValues(now);
          g.gain.setValueAtTime(0.0001, now);
          g.gain.exponentialRampToValueAtTime(0.6, now + 0.05);
          up = false;
        } else {
          g.gain.cancelScheduledValues(now);
          g.gain.setValueAtTime(0.6, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
          up = true;
        }
        // change frequency slightly for variation
        if (oscRef.current) {
          oscRef.current.frequency.setValueAtTime(440 + (Math.random() * 220), now);
        }
      } catch (e) {}
    }, 800) as unknown as number;
  };

  const stopTone = () => {
    try {
      if (pulseInterval.current != null) {
        clearInterval(pulseInterval.current);
        pulseInterval.current = null;
      }
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch (e) {}
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      if (gainRef.current) {
        try { gainRef.current.disconnect(); } catch (e) {}
        gainRef.current = null;
      }
      if (ctxRef.current) {
        try { ctxRef.current.suspend(); } catch (e) {}
      }
    } catch (e) {}
  };

  // Toggle mute state
  const toggleMute = () => {
    if (gainRef.current) {
      if (isMuted) {
        gainRef.current.gain.value = 0.6;
      } else {
        gainRef.current.gain.value = 0.0001;
      }
      setIsMuted(!isMuted);
    }
  };

  // Handle stop alarm
  const handleStop = () => {
    stopTone();
    onStop();
  };

  useEffect(() => {
    if (ringingAlarm) {
      startTone();
      if (ringingAlarm.vibration && navigator.vibrate) {
        try { navigator.vibrate([600,200,600]); } catch(e) {}
      }
      // Reset mute state when new alarm starts
      setIsMuted(false);
    } else {
      stopTone();
      if (navigator.vibrate) try { navigator.vibrate(0); } catch(e) {}
    }

    return () => {
      stopTone();
      if (navigator.vibrate) try { navigator.vibrate(0); } catch(e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ringingAlarm]);

  if (!ringingAlarm) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background p-6 rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Alarm!</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleStop}
            className="text-foreground hover:bg-foreground/10"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-4xl font-bold mb-2">{ringingAlarm.time}</p>
          <p className="text-muted-foreground">{ringingAlarm.label || 'Alarm'}</p>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={toggleMute}
            className="gap-2"
          >
            {isMuted ? (
              <>
                <VolumeX className="h-5 w-5" />
                <span>Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="h-5 w-5" />
                <span>Mute</span>
              </>
            )}
          </Button>
          
          <Button
            variant="default"
            size="lg"
            onClick={handleStop}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <span>Stop</span>
          </Button>
        </div>

        {onSnooze && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={onSnooze}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Snooze for 5 minutes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlarmPlayer;
