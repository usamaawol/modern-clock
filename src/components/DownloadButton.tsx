import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import DownloadModal from './DownloadModal';
import { Button } from './ui/button';
import { toast } from 'sonner';

export const DownloadButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Store the event for later use so we can trigger the prompt on button click
      setDeferredPrompt(e as any);
      // Also expose it globally for any other components if needed
      (window as any).deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleClick = async () => {
    // Prefer the stored beforeinstallprompt event for a native-like install flow
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
          toast.success('App is being installed');
        } else {
          toast.info('Installation cancelled');
        }

        // Clear the saved prompt (can only be used once)
        setDeferredPrompt(null);
        (window as any).deferredPrompt = null;
        return;
      } catch (err) {
        console.error('PWA installation failed:', err);
        toast.error('Failed to install the app');
        return;
      }
    }

    // If we don't have an install prompt (e.g. iOS Safari or unsupported browser),
    // we cannot force a real app install from the web. Show a short notice only.
    toast.info('Your browser does not support direct install. Use "Add to Home screen" from the browser menu.');
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant="outline"
        className="fixed bottom-24 right-4 z-50 flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Install App"
        title="Install App"
      >
        <Download className="w-5 h-5" />
        <span className="hidden sm:inline">Install App</span>
      </Button>

      <DownloadModal open={open} onOpenChange={setOpen} />
    </>
  );
};

export default DownloadButton;
