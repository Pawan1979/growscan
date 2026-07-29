import React from 'react';
import { X, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PlatformPrice } from '../types';

interface FeeBreakdownModalProps {
  item: PlatformPrice;
  onClose: () => void;
}

export const FeeBreakdownModal: React.FC<FeeBreakdownModalProps> = ({ item, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="glass-panel p-6 max-w-md w-full border border-slate-700 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <h3 className="text-lg font-bold text-slate-100">{item.platformName} Cost Breakdown</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Summary */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Product</div>
            <div className="text-sm font-semibold text-slate-200">{item.productName}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Pack / Unit</div>
            <div className="text-xs font-semibold text-slate-300">{item.unit}</div>
          </div>
        </div>

        {/* Fee Line Items */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">Sticker Price</span>
            <span className="font-semibold text-slate-100">₹{item.price}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 flex items-center gap-1">
              Platform Fee
              <Info className="w-3.5 h-3.5 text-slate-500" />
            </span>
            <span className="text-slate-300">+ ₹{item.platformFee}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 flex items-center gap-1">
              Delivery Fee
              <Info className="w-3.5 h-3.5 text-slate-500" />
            </span>
            <span className="text-slate-300">
              {item.deliveryFee === 0 ? (
                <span className="text-emerald-400 font-semibold">FREE</span>
              ) : (
                `+ ₹${item.deliveryFee}`
              )}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 flex items-center gap-1">
              Handling & Rain Fee
              <Info className="w-3.5 h-3.5 text-slate-500" />
            </span>
            <span className="text-slate-300">
              {item.handlingFee === 0 ? '₹0' : `+ ₹${item.handlingFee}`}
            </span>
          </div>

          <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
            <div>
              <span className="text-base font-extrabold text-slate-100">True Final Price</span>
              <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Actual amount charged at checkout
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-emerald-400">₹{item.trueTotal}</span>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>GrocScan guarantees transparent price auditing with zero hidden fees.</span>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-sm transition-all"
        >
          Close Breakdown
        </button>
      </div>
    </div>
  );
};
