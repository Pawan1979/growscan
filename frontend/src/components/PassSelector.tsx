import React from 'react';
import { Crown, Check } from 'lucide-react';

export interface PassOption {
  id: string;
  name: string;
  color: string;
  perk: string;
}

export const PASS_OPTIONS: PassOption[] = [
  { id: 'swiggy_one', name: 'Swiggy One', color: '#fc8019', perk: 'Free Instamart delivery > ₹149' },
  { id: 'zepto_super', name: 'Zepto Super', color: '#8224e3', perk: 'Free delivery > ₹99 + 0 handling fee' },
  { id: 'blinkit_pass', name: 'Blinkit Pass', color: '#f7c72c', perk: 'Free delivery > ₹99' },
  { id: 'bb_star', name: 'BB Star', color: '#84c225', perk: 'Free delivery > ₹199' },
];

interface PassSelectorProps {
  activePasses: string[];
  onTogglePass: (passId: string) => void;
}

export const PassSelector: React.FC<PassSelectorProps> = ({ activePasses, onTogglePass }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Loyalty Pass Savings Optimizer</span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">
          Toggle your active subscriptions for automatic fee waivers
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PASS_OPTIONS.map((pass) => {
          const isActive = activePasses.includes(pass.id);

          return (
            <button
              key={pass.id}
              onClick={() => onTogglePass(pass.id)}
              className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-800 border-amber-500/60 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-slate-100 mb-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pass.color }} />
                  {pass.name}
                </span>
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isActive ? 'bg-amber-500 text-slate-950 font-black' : 'border border-slate-700 text-transparent'
                  }`}
                >
                  <Check className="w-3 h-3" />
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">{pass.perk}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
