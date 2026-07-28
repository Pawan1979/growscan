import React, { useState } from 'react';
import { PlatformPrice } from '../types';
import { ExternalLink, Clock, Plus, Check, Info, TrendingDown, Bell } from 'lucide-react';
import { FeeBreakdownModal } from './FeeBreakdownModal';

interface ProductCardProps {
  item: PlatformPrice;
  isCheapest: boolean;
  isFastest: boolean;
  onAddToCart: (item: PlatformPrice) => void;
  isInCart: boolean;
  onOpenTrend?: (productName: string) => void;
  onOpenAlert?: (item: PlatformPrice) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item, isCheapest, isFastest, onAddToCart, isInCart, onOpenTrend, onOpenAlert,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={`glass-panel p-4 rounded-2xl border transition-all relative overflow-hidden ${
      isCheapest
        ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10'
        : 'border-slate-800 hover:border-slate-700'
    }`}>

      {/* ── Row 1: Platform name + badges ── */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
          <span className="font-extrabold text-sm text-slate-100">{item.platformName}</span>
          <span className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold bg-slate-800 px-1.5 py-0.5 rounded">
            <Clock className="w-2.5 h-2.5" /> {item.etaMinutes}m
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isCheapest && <span className="badge-cheapest">Cheapest</span>}
          {isFastest && !isCheapest && <span className="badge-fastest">Fastest</span>}
        </div>
      </div>

      {/* ── Row 2: Product name + unit ── */}
      <h4 className="font-bold text-slate-100 text-sm leading-snug mb-1">{item.productName}</h4>
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
        <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-medium">{item.unit}</span>
        {item.unitPriceText && <span className="text-indigo-300 font-medium">{item.unitPriceText}</span>}
      </div>

      {/* ── Row 3: Price + Actions ── */}
      <div className="flex items-end justify-between gap-2">

        {/* Price block */}
        <div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-2xl font-extrabold text-slate-100">₹{item.price}</span>
            {item.mrp > item.price && (
              <span className="text-xs text-slate-500 line-through">₹{item.mrp}</span>
            )}
            {item.discountPercent > 0 && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" />{item.discountPercent}%
              </span>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 hover:text-indigo-400 transition-colors"
          >
            <Info className="w-3 h-3" />
            True total: <strong className="text-emerald-400">₹{item.trueTotal}</strong>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenTrend && (
            <button
              onClick={() => onOpenTrend(item.productName)}
              title="30-day price trend"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm transition-all"
            >📈</button>
          )}
          {onOpenAlert && (
            <button
              onClick={() => onOpenAlert(item)}
              title="Set price alert"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}
          <button
            onClick={() => onAddToCart(item)}
            className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              isInCart
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {isInCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {isInCart ? 'Added' : 'Cart'}
          </button>
          <a
            href={item.deepLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 shadow-md shadow-indigo-600/20 transition-all"
          >
            Buy <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {showModal && <FeeBreakdownModal item={item} onClose={() => setShowModal(false)} />}
    </div>
  );
};
