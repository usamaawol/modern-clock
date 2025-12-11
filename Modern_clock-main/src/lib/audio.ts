export async function ensureAudioAllowed(): Promise<boolean> {
  try {
    const Ctor = (window.AudioContext || (window as any).webkitAudioContext) as any;
    if (!Ctor) return false;
    const ctx = new Ctor();
    // try resume (some browsers require user gesture)
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // quick beep to unlock audio
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.value = 0.0001;
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.15, now + 0.01);
    osc.start(now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.stop(now + 0.2);

    // close context after short delay to free resources
    setTimeout(() => {
      try { ctx.close(); } catch (e) {}
    }, 500);

    return true;
  } catch (e) {
    console.warn('Audio allow failed', e);
    return false;
  }
}

export async function playTestTone(duration = 1500) {
  try {
    const Ctor = (window.AudioContext || (window as any).webkitAudioContext) as any;
    if (!Ctor) return false;
    const ctx = new Ctor();
    await ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 440;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.6, now + 0.02);
    osc.start(now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration / 1000);
    osc.stop(now + duration / 1000 + 0.05);

    // close after short delay
    setTimeout(() => {
      try { ctx.close(); } catch (e) {}
    }, duration + 200);

    return true;
  } catch (e) {
    console.warn('playTestTone failed', e);
    return false;
  }
}
