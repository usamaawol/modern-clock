import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export const CurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const tick = () => setTime(new Date());
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full text-center animate-fade-in" aria-label="Current time">
      <div
        className="time-display font-bold tracking-tight gradient-text mb-1"
        style={{
          // responsive sizes via Tailwind classes but keep inline fallback
        }}
        aria-live="polite"
      >
        <span className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl">{format(time, 'HH:mm')}</span>
      </div>

      {/* Seconds are less important on very small screens */}
      <div className="time-display text-sm sm:text-lg md:text-2xl text-muted-foreground font-light mt-1">
        <span className="hidden xs:inline sm:inline md:inline lg:inline">{format(time, 'ss')}</span>
      </div>

      <div className="text-sm sm:text-base md:text-lg text-muted-foreground mt-3">
        {format(time, 'EEEE, MMMM d, yyyy')}
      </div>
    </section>
  );
};
