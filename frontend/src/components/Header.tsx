import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Globe, ShoppingBag, Barcode, Bell, Search } from 'lucide-react';

interface HeaderProps {
  pincode: string;
  onPincodeChange: (newPin: string) => void;
  lang: 'en' | 'hi';
  onToggleLang: () => void;
  activeTab: 'search' | 'cart' | 'barcode' | 'alerts';
  onTabChange: (tab: 'search' | 'cart' | 'barcode' | 'alerts') => void;
  cartCount: number;
  alertsCount?: number;
  /** When true, automatically opens the location modal (e.g. when GPS was denied) */
  openLocationModal?: boolean;
  onLocationModalClosed?: () => void;
}

const TABS = [
  { id: 'search',  label: 'Search',  labelHi: 'सर्च',     icon: Search },
  { id: 'cart',    label: 'Cart',    labelHi: 'कार्ट',     icon: ShoppingBag },
  { id: 'barcode', label: 'Scan',    labelHi: 'स्कैन',     icon: Barcode },
  { id: 'alerts',  label: 'Alerts',  labelHi: 'अलर्ट',     icon: Bell },
] as const;

export const Header: React.FC<HeaderProps> = ({
  pincode, onPincodeChange, lang, onToggleLang,
  activeTab, onTabChange, cartCount, alertsCount = 0,
  openLocationModal = false, onLocationModalClosed,
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempPin, setTempPin] = useState(pincode);
  const [detecting, setDetecting] = useState(false);
  const [pinError, setPinError] = useState('');

  // Auto-open modal when parent signals GPS was denied
  useEffect(() => {
    if (openLocationModal) {
      setTempPin(pincode);
      setPinError('Location permission denied — please enter your pincode manually.');
      setShowLocationModal(true);
      onLocationModalClosed?.();
    }
  }, [openLocationModal]);

  const handleSavePin = () => {
    if (tempPin.length === 6 && /^\d{6}$/.test(tempPin)) {
      onPincodeChange(tempPin);
      setPinError('');
      setShowLocationModal(false);
    } else {
      setPinError('Please enter a valid 6-digit pincode');
    }
  };

  const handleDetectGPS = () => {
    setDetecting(true);
    setPinError('');

    if (!('geolocation' in navigator)) {
      setPinError('GPS not supported on this browser.');
      setDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse-geocode using OpenStreetMap Nominatim (free, no API key)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const postcode: string = data?.address?.postcode?.replace(/\s/g, '') || '';

          if (postcode && /^\d{6}$/.test(postcode)) {
            setTempPin(postcode);
            onPincodeChange(postcode);
            setShowLocationModal(false);
          } else {
            // Postcode exists but non-Indian format — use coords-based fallback
            setPinError(`Detected location but couldn't resolve an Indian pincode. Enter manually.`);
          }
        } catch {
          setPinError('Could not resolve location. Please enter pincode manually.');
        } finally {
          setDetecting(false);
        }
      },
      (err) => {
        setDetecting(false);
        if (err.code === err.PERMISSION_DENIED) {
          setPinError('Location permission denied. Please enter pincode manually.');
        } else {
          setPinError('Could not get location. Please enter pincode manually.');
        }
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  const badgeCount: Record<string, number> = {
    cart: cartCount,
    alerts: alertsCount,
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">

        {/* ── Brand Row ── */}
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-lg shadow-lg shadow-indigo-500/30 shrink-0">
              🛒
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-extrabold tracking-tight gradient-text leading-none">GrocScan</h1>
                <span className="bg-indigo-500/20 text-indigo-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-indigo-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
                {lang === 'hi' ? 'भारत का स्मार्ट ग्रोसरी स्कैनर' : "India's Smartest Price Comparator"}
              </p>
            </div>
          </div>

          {/* Location + Lang */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setTempPin(pincode); setShowLocationModal(true); }}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all"
            >
              <MapPin className="w-3 h-3 text-pink-400 shrink-0" />
              <span>{pincode}</span>
            </button>
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all"
            >
              <Globe className="w-3 h-3 text-indigo-400 shrink-0" />
              <span>{lang === 'hi' ? 'EN' : 'हिं'}</span>
            </button>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="flex border-t border-slate-800/60">
          {TABS.map(({ id, label, labelHi, icon: Icon }) => {
            const isActive = activeTab === id;
            const badge = badgeCount[id];
            return (
              <button
                key={id}
                onClick={() => onTabChange(id as any)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-bold transition-all relative ${
                  isActive
                    ? 'text-indigo-400 bg-indigo-500/10'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-b" />
                )}
                <span className="relative">
                  <Icon className="w-4 h-4" />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-slate-950 font-black text-[8px] px-1 rounded-full min-w-[14px] text-center">
                      {badge}
                    </span>
                  )}
                </span>
                <span>{lang === 'hi' ? labelHi : label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Location Modal ── */}
      {showLocationModal && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowLocationModal(false); }}>
          <div className="glass-panel p-5 w-full max-w-sm border border-slate-700 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-pink-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Set Delivery Location</h3>
                <p className="text-[10px] text-slate-400">Availability & fees vary by pincode</p>
              </div>
            </div>

            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Enter 6-digit Pincode</label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={6}
              value={tempPin}
              onChange={(e) => {
                setTempPin(e.target.value.replace(/\D/g, ''));
                setPinError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSavePin()}
              placeholder="e.g. 400001"
              className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 text-slate-100 rounded-xl px-4 py-3 text-base font-semibold focus:outline-none transition-all mb-1"
              autoFocus
            />
            {pinError && <p className="text-xs text-red-400 mb-2">{pinError}</p>}

            <div className="text-center my-3 text-xs text-slate-600">— or —</div>

            <button
              onClick={handleDetectGPS}
              disabled={detecting}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold py-2.5 rounded-xl text-sm border border-slate-700 transition-all mb-4"
            >
              <Navigation className={`w-4 h-4 ${detecting ? 'animate-spin' : ''}`} />
              {detecting ? 'Detecting…' : 'Auto-detect via GPS'}
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setShowLocationModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePin}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-sm shadow-lg shadow-indigo-600/30"
              >
                Save Location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
