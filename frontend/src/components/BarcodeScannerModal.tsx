import React, { useState } from 'react';
import { X, Barcode, Camera, Zap, CheckCircle2 } from 'lucide-react';
import { ProductDetail } from '../types';

interface BarcodeScannerModalProps {
  onClose: () => void;
  pincode: string;
}

const SAMPLE_BARCODES = [
  { label: 'Amul Milk 500ml', code: '8901262010054' },
  { label: 'Tata Salt 1kg', code: '8901058000021' },
  { label: 'Fortune Sunflower Oil', code: '8906007280011' },
  { label: 'Surf Excel Powder', code: '8901030855555' },
];

import { getApiUrl } from '../config/api';

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ onClose, pincode }) => {
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProductDetail | null>(null);

  const handleScanCode = (codeToScan: string) => {
    setLoading(true);
    fetch(getApiUrl(`/api/barcode/${codeToScan}?pin=${pincode}`))
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <div className="modal-backdrop">
      <div className="glass-panel p-6 max-w-lg w-full border border-slate-700 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Barcode className="w-5 h-5 text-pink-400" />
            <h3 className="text-lg font-bold text-slate-100">Live Barcode Scanner</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Simulation Scanner Viewport */}
        {!result ? (
          <div className="space-y-4">
            <div className="relative w-full h-48 bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 flex items-center justify-center">
              <div className="laser-line" />
              <div className="text-center z-10 p-4">
                <Camera className="w-8 h-8 text-slate-500 mx-auto mb-2 animate-bounce" />
                <p className="text-xs text-slate-400 font-medium">
                  Point camera at product barcode...
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  (Or click sample test barcodes below)
                </p>
              </div>
            </div>

            {/* Manual EAN / Barcode Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter Barcode Number (e.g. 8901262010054)"
                className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleScanCode(manualCode || '8901262010054')}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5" />
                Scan
              </button>
            </div>

            {/* Quick Test Barcodes */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-400 mb-2">Test Instant Barcodes:</div>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_BARCODES.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleScanCode(item.code)}
                    className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium p-2 rounded-xl border border-slate-700 text-left transition-all flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <Barcode className="w-3.5 h-3.5 text-pink-400 shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Scanned Result View */
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-2xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs text-emerald-300 font-bold">Product Identified!</div>
                <div className="text-sm font-extrabold text-slate-100">{result.name}</div>
                <div className="text-xs text-slate-400">
                  Brand: {result.brand} | Pack: {result.unit}
                </div>
              </div>
            </div>

            <div className="text-xs font-bold text-slate-300">Scanned Real-Time Prices:</div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {result.currentPrices.map((p) => (
                <div
                  key={p.platformId}
                  className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="font-bold text-slate-200">{p.platformName}</span>
                  </div>
                  <div className="font-bold text-emerald-400">₹{p.trueTotal}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setResult(null)}
                className="flex-1 bg-slate-800 text-slate-300 font-bold py-2 rounded-xl text-xs"
              >
                Scan Another Item
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-xl text-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
