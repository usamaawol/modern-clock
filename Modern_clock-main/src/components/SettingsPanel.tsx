import { Theme } from '@/types/alarm';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Download, Info } from 'lucide-react';
import { useState } from 'react';
import { ensureAudioAllowed, playTestTone } from '@/lib/audio';

interface SettingsPanelProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const SettingsPanel = ({ theme, onThemeChange }: SettingsPanelProps) => {
  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleEnableSound = async () => {
    const ok = await ensureAudioAllowed();
    setSoundEnabled(ok);
    if (ok) {
      alert('Sound enabled — alarms should now play on this device/tab.');
    } else {
      alert('Unable to enable audio. Interact with the page and try again.');
    }
  };
  const handleInstall = async () => {
    // @ts-ignore
    const e = (window as any).__deferredPWAInstall;
    if (e) {
      try {
        // @ts-ignore
        await e.prompt();
        // @ts-ignore
        await e.userChoice;
      } catch (err) {
        console.warn('Install prompt failed', err);
      }
    } else {
      // Provide clearer instructions when PWA prompt isn't available
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1') {
        alert('Install requires a production build. Run `npm run build:web` and serve the `dist/` folder over HTTPS or open the hosted URL on your phone.');
      } else {
        alert('To install WakeWise: open your browser menu (⋮ or Share) and choose "Add to Home screen". If you do not see the option, build the app (`npm run build:web`) and serve the `dist/` folder over HTTPS so the browser recognizes the PWA.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      {/* Theme */}
      <div className="glass-card p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          Appearance
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onThemeChange('light')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              theme === 'light'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-border/80'
            }`}
          >
            <Sun className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Light</p>
          </button>
          <button
            onClick={() => onThemeChange('dark')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              theme === 'dark'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-border/80'
            }`}
          >
            <Moon className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Dark</p>
          </button>
        </div>
      </div>

      {/* Install as App */}
      <div className="glass-card p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Install App
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Install WakeWise on your device for the best experience. Works offline!
        </p>
        <Button className="w-full" id="install-btn" onClick={handleInstall}>
          <Download className="w-4 h-4 mr-2" />
          Add to Home Screen
        </Button>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          On iOS: Tap Share → Add to Home Screen
        </p>
      </div>

      {/* Sound */}
      <div className="glass-card p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Sound
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Enable audio so alarms can play tones even on browsers that require
          a user gesture to unlock sound.
        </p>
        <div className="flex gap-3">
          <Button className="flex-1" onClick={handleEnableSound}>
            {soundEnabled ? 'Sound Enabled' : 'Enable Sounds'}
          </Button>
          <Button variant="outline" onClick={async () => {
            const ok = await playTestTone();
            if (ok) {
              alert('Played test tone — you should hear it.');
            } else {
              alert('Could not play test tone. Interact with the page and try again.');
            }
          }}>
            Test Sound
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          If audio still doesn't play, try interacting with the page (tap anywhere) then retry.
        </p>
      </div>

      {/* About */}
      <div className="glass-card p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" />
          About
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p><span className="font-medium text-foreground">WakeWise</span> v1.0.0</p>
          <p>A modern alarm clock & daily planner app</p>
          <p className="pt-2">
            This is a Progressive Web App (PWA). Install it on your device for
            offline access and native-like experience.
          </p>
        </div>
      </div>
    </div>
  );
};
