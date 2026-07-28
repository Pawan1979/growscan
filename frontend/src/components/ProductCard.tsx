import React, { useState } from 'react';
import { PlatformPrice } from '../types';
import { ExternalLink, Clock, Plus, Check, Info, TrendingDown } from 'lucide-react';
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
  item,
  isCheapest,
  isFastest,
  onAddToCart,
  isInCart,
  onOpenTrend,
  onOpenAlert,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className={`glass-panel p-4 rounded-2xl border transition-all relative overflow-hidden ${
        isCheapest
          ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10 bg-slate-900/90'
          : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
      }`}
    >
      {/* Top Banner Badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Brand Dot */}
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="font-extrabold text-sm text-slate-100">{item.platformName}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {isCheapest && <span className="badge-cheapest">Cheapest True Price</span>}
          {isFastest && !isCheapest && <span className="badge-fastest">Fastest Delivery</span>}
        </div>
      </div>

      {/* Product Content Body */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Left Info: Product Title & Unit metrics */}
        <div className="md:col-span-5">
          <h4 className="font-bold text-slate-100 text-base leading-tight mb-1">
            {item.productName}
          </h4>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-medium">
              {item.unit}
            </span>
            {item.unitPriceText && (
              <span className="text-indigo-300 font-medium">{item.unitPriceText}</span>
            )}
          </div>
        </div>

        {/* Middle Info: Sticker Price, MRP, Fees */}
        <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-100">₹{item.price}</span>
              {item.mrp > item.price && (
                <span className="text-xs text-slate-500 line-through">₹{item.mrp}</span>
              )}
              {item.discountPercent > 0 && (
                <span className="text-xs font-bold text-emerald-400 flex items-center">
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                  {item.discountPercent}% OFF
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <span>True Total: <strong className="text-emerald-400">₹{item.trueTotal}</strong></span>
              <button
                onClick={() => setShowModal(true)}
                className="text-indigo-400 hover:underline flex items-center gap-0.5 font-semibold ml-1"
              >
                <Info className="w-3 h-3" />
                Breakdown
              </button>
            </div>
          </div>

          {/* Delivery ETA Badge */}
          <div className="flex items-center gap-1 text-xs font-bold text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{item.etaMinutes} mins</span>
          </div>
        </div>

        {/* Right Actions: Add to Cart, Trend, Alert & Buy Link */}
        <div className="md:col-span-3 flex items-center justify-end gap-1.5 mt-2 md:mt-0 flex-wrap">
          {onOpenTrend && (
            <button
              onClick={() => onOpenTrend(item.productName)}
              title="View 30-Day Price Trend"
              className="p-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-all"
            >
              📈
            </button>
          )}

          {onOpenAlert && (
            <button
              onClick={() => onOpenAlert(item)}
              title="Set Price Drop Alert"
              className="p-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-all"
            >
              🔔
            </button>
          )}

          <button
            onClick={() => onAddToCart(item)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              isInCart
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {isInCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {isInCart ? 'In Cart' : '+ Cart'}
          </button>

          <a
            href={item.deepLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 shadow-md shadow-indigo-600/20 transition-all"
          >
            <span>Buy</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {showModal && (
        <FeeBreakdownModal item={item} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};
