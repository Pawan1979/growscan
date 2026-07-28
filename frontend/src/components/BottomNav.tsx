import React from 'react';
import { Search, ShoppingBag, Bell } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'search' | 'cart' | 'alerts';
  onTabChange: (tab: 'search' | 'cart' | 'alerts') => void;
  lang: 'en' | 'hi';
  cartCount: number;
  alertsCount?: number;
}

const TABS = [
  { id: 'search',  label: 'Search',  labelHi: 'सर्च',     icon: Search },
  { id: 'cart',    label: 'Cart',    labelHi: 'कार्ट',     icon: ShoppingBag },
  { id: 'alerts',  label: 'Alerts',  labelHi: 'अलर्ट',     icon: Bell },
] as const;

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  lang,
  cartCount,
  alertsCount = 0,
}) => {
  const badgeCount: Record<string, number> = {
    cart: cartCount,
    alerts: alertsCount,
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        {TABS.map(({ id, label, labelHi, icon: Icon }) => {
          const isActive = activeTab === id;
          const badge = badgeCount[id];

          return (
            <button
              key={id}
              onClick={() => onTabChange(id as any)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 h-full transition-all relative ${
                isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {isActive && (
                <span className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-b-full shadow-[0_2px_10px_rgba(99,102,241,0.6)]" />
              )}
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'scale-100'} transition-transform duration-300`} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full min-w-[16px] text-center border border-slate-950">
                    {badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {lang === 'hi' ? labelHi : label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
