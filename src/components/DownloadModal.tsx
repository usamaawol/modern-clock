import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DownloadModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <DialogTitle>Install WakeWise on your phone</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm text-muted-foreground">
          <p>
            This app is a Progressive Web App. You can install it to your home screen so it behaves like a normal app.
          </p>

          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">On Android (Chrome):</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open this page in Chrome.</li>
                <li>Tap the menu (⋮) in the top‑right corner.</li>
                <li>Choose <strong>Add to Home screen</strong> or <strong>Install app</strong>.</li>
              </ol>
            </div>

            <div>
              <p className="font-medium text-foreground mb-1">On iPhone (Safari):</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open this page in Safari.</li>
                <li>Tap the <strong>Share</strong> button.</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
              </ol>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadModal;
