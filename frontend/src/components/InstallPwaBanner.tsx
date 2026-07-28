import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export const InstallPwaBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA prompt');
        }
        setDeferredPrompt(null);
      });
    } else {
      alert('To install GrocScan on mobile: Open browser menu (⋮ or Share) and tap "Add to Home Screen"');
    }
  };

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 max-w-md z-50 animate-bounce-in">
      <div className="glass-panel p-4 border border-indigo-500/40 bg-slate-900/95 shadow-2xl flex items-center justify-between gap-3 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-lg shrink-0 shadow-md">
            📱
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-xs">Install GrocScan Mobile App</h4>
            <p className="text-[11px] text-slate-400">
              Add to Home Screen for 1-tap quick price comparison.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 shadow-md shadow-indigo-600/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
