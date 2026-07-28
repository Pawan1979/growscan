import React, { useState } from 'react';
import { X, Bell, CheckCircle2 } from 'lucide-react';
import { getApiUrl } from '../config/api';
import { PlatformPrice } from '../types';

interface PriceAlertModalProps {
  item: PlatformPrice;
  pincode: string;
  onClose: () => void;
  onAlertCreated: () => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  item,
  pincode,
  onClose,
  onAlertCreated,
}) => {
  const [targetPrice, setTargetPrice] = useState(Math.round(item.price * 0.9));
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    fetch(getApiUrl('/api/alerts'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productName: item.productName,
        targetPrice: Number(targetPrice),
        currentCheapestPrice: item.price,
        platformName: item.platformName,
        pincode,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setSubmitting(false);
        setSuccess(true);
        onAlertCreated();
        setTimeout(() => {
          onClose();
        }, 1500);
      })
      .catch(() => setSubmitting(false));
  };

  return (
    <div className="modal-backdrop">
      <div className="glass-panel p-6 max-w-md w-full border border-slate-700 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-slate-100">Set Price Drop Alert</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-slate-100">Price Alert Set!</h4>
            <p className="text-xs text-slate-400">
              We will alert you as soon as {item.productName} drops below ₹{targetPrice}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <div className="text-slate-400">Product</div>
                <div className="font-bold text-slate-200">{item.productName}</div>
              </div>
              <div className="text-right">
                <div className="text-slate-400">Current Best</div>
                <div className="font-bold text-emerald-400">₹{item.price}</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Price (₹)
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                min={1}
                max={item.price}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-base font-bold focus:outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Alert triggers when price drops at least {Math.round(((item.price - targetPrice) / item.price) * 100)}% below current price.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email / Phone for Notification (Optional)
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g. user@example.com or 9876543210"
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              <span>{submitting ? 'Setting Alert...' : 'Create Alert'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
