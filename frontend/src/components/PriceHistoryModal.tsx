import React, { useState, useEffect } from 'react';
import { X, TrendingDown, Calendar } from 'lucide-react';

interface PriceHistoryData {
  productName: string;
  basePrice: number;
  dates: string[];
  series: {
    platformId: string;
    platformName: string;
    color: string;
    points: number[];
  }[];
  lowestPrice: number;
  highestPrice: number;
}

interface PriceHistoryModalProps {
  productName: string;
  onClose: () => void;
}

import { getApiUrl } from '../config/api';

export const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({ productName, onClose }) => {
  const [data, setData] = useState<PriceHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePlatform, setActivePlatform] = useState<string>('all');

  useEffect(() => {
    fetch(getApiUrl(`/api/products/history?q=${encodeURIComponent(productName)}`))
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productName]);

  return (
    <div className="modal-backdrop">
      <div className="glass-panel p-6 max-w-2xl w-full border border-slate-700 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-lg font-bold text-slate-100">30-Day Price Trend</h3>
              <p className="text-xs text-slate-400">{productName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-xs font-medium">Loading 30-day historical prices...</p>
          </div>
        ) : (
          data && (
            <div className="space-y-4">
              
              {/* Summary Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">Lowest Recorded</div>
                  <div className="text-base font-extrabold text-emerald-400">₹{data.lowestPrice}</div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">Highest Recorded</div>
                  <div className="text-base font-extrabold text-pink-400">₹{data.highestPrice}</div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">Average MRP</div>
                  <div className="text-base font-extrabold text-slate-200">
                    ₹{Math.round(data.basePrice * 1.12)}
                  </div>
                </div>
              </div>

              {/* Platform Selector Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setActivePlatform('all')}
                  className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
                    activePlatform === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Platforms
                </button>
                {data.series.map((s) => (
                  <button
                    key={s.platformId}
                    onClick={() => setActivePlatform(s.platformId)}
                    className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                      activePlatform === s.platformId
                        ? 'bg-slate-700 text-white border border-slate-500'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.platformName}
                  </button>
                ))}
              </div>

              {/* SVG Trend Line Chart Canvas */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 relative">
                <svg viewBox="0 0 500 180" className="w-full h-48 overflow-visible">
                  {/* Grid Lines */}
                  {[30, 75, 120, 155].map((y, idx) => (
                    <line
                      key={idx}
                      x1="0"
                      y1={y}
                      x2="500"
                      y2={y}
                      stroke="#1e293b"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Lines for each platform */}
                  {data.series
                    .filter((s) => activePlatform === 'all' || activePlatform === s.platformId)
                    .map((s) => {
                      const minP = data.lowestPrice - 2;
                      const maxP = data.highestPrice + 5;
                      const range = maxP - minP;

                      const pointsStr = s.points
                        .map((pt, idx) => {
                          const x = (idx / (s.points.length - 1)) * 480 + 10;
                          const y = 160 - ((pt - minP) / range) * 130;
                          return `${x},${y}`;
                        })
                        .join(' ');

                      return (
                        <g key={s.platformId}>
                          <polyline
                            fill="none"
                            stroke={s.color}
                            strokeWidth={activePlatform === s.platformId ? '3' : '2'}
                            strokeOpacity={activePlatform === 'all' ? '0.85' : '1'}
                            points={pointsStr}
                          />
                        </g>
                      );
                    })}
                </svg>

                {/* X Axis Dates */}
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2 px-1">
                  <span>{data.dates[0]}</span>
                  <span>{data.dates[10]}</span>
                  <span>{data.dates[20]}</span>
                  <span>{data.dates[29]} (Today)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Historical data updated daily from platform APIs
                </span>
                <span className="font-semibold text-emerald-400">Lowest: ₹{data.lowestPrice}</span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
