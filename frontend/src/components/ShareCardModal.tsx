import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageSquare } from 'lucide-react';
import { PlatformPrice } from '../types';

interface ShareCardModalProps {
  productName: string;
  cheapest: PlatformPrice;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  productName,
  cheapest,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const shareText = `🛒 *GrocScan Deal Alert!*
Price for *${productName}* (${cheapest.unit}):
🏆 Cheapest on *${cheapest.platformName}* at *₹${cheapest.price}* (True Final: ₹${cheapest.trueTotal} incl. fees).
⚡ ETA: ${cheapest.etaMinutes} mins.

Compare prices on GrocScan — India's Smartest Grocery Scanner!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="modal-backdrop">
      <div className="glass-panel p-6 max-w-md w-full border border-slate-700 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-100">Share Deal via WhatsApp</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Mock Preview */}
        <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 p-4 rounded-2xl mb-4 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
          {shareText}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
