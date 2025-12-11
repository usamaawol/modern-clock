import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';

export const PWAPrompt = () => {
    const { canInstall, install, isInstalled } = usePWA();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show prompt after a delay if installable
        const timer = setTimeout(() => {
            setIsVisible(canInstall);
        }, 2000);

        return () => clearTimeout(timer);
    }, [canInstall]);

    if (!isVisible || isInstalled) {
        return null;
    }

    const handleInstall = async () => {
        await install();
        setIsVisible(false);
    };

    return (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 animate-slide-up">
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <Download className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Install App
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Get faster access with the app installed
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={handleInstall}
                        className="flex-1 bg-blue-500 hover:bg-blue-600"
                    >
                        Install
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setIsVisible(false)}
                        className="flex-1"
                    >
                        Later
                    </Button>
                </div>
            </div>
        </div>
    );
};
