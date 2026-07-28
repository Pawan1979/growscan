import React, { useState } from 'react';
import { MapPin, Navigation, Globe, ShoppingBag, Barcode, Bell } from 'lucide-react';

interface HeaderProps {
  pincode: string;
  onPincodeChange: (newPin: string) => void;
  lang: 'en' | 'hi';
  onToggleLang: () => void;
  activeTab: 'search' | 'cart' | 'barcode' | 'alerts';
  onTabChange: (tab: 'search' | 'cart' | 'barcode' | 'alerts') => void;
  cartCount: number;
  alertsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  pincode,
  onPincodeChange,
  lang,
  onToggleLang,
  activeTab,
  onTabChange,
  cartCount,
  alertsCount = 0,
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempPin, setTempPin] = useState(pincode);
  const [detecting, setDetecting] = useState(false);

  const handleSavePin = () => {
    if (tempPin.length === 6) {
      onPincodeChange(tempPin);
      setShowLocationModal(false);
    } else {
      alert('Please enter a valid 6-digit pincode');
    }
  };

  const handleDetectGPS = () => {
    setDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            onPincodeChange('400001'); // Mumbai Central default resolution
            setDetecting(false);
            setShowLocationModal(false);
          }, 800);
        },
        () => {
          alert('GPS permission denied. Using 400001 (Mumbai).');
          onPincodeChange('400001');
          setDetecting(false);
          setShowLocationModal(false);
        }
      );
    } else {
      onPincodeChange('400001');
      setDetecting(false);
      setShowLocationModal(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 rounded-none mb-6">
      <div className="container py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
            🛒
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight gradient-text">GrocScan</h1>
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30">
                v1.0 MVP
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {lang === 'hi' ? 'भारत का सबसे स्मार्ट ग्रोसरी स्कैनर' : "India's Smartest Quick Commerce Comparison"}
            </p>
          </div>
        </div>

        {/* Location & Utilities */}
        <div className="flex items-center gap-2">
          
          {/* Location Selector Button */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition-all"
          >
            <MapPin className="w-3.5 h-3.5 text-pink-400" />
            <span>Pin: {pincode}</span>
          </button>

          {/* Hindi / English Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="border-t border-slate-800 bg-slate-900/60 px-4 py-2">
        <div className="container flex items-center justify-center sm:justify-start gap-2">
          
          <button
            onClick={() => onTabChange('search')}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
              activeTab === 'search'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            🔍 {lang === 'hi' ? 'प्रोडक्ट सर्च' : 'Single Search'}
          </button>

          <button
            onClick={() => onTabChange('cart')}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all relative ${
              activeTab === 'cart'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'hi' ? 'फुल कार्ट कंपेयर' : 'Full Cart Compare'}</span>
            {cartCount > 0 && (
              <span className="bg-emerald-500 text-slate-950 font-extrabold text-xs px-1.5 py-0.2 rounded-full min-w-5 text-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('barcode')}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
              activeTab === 'barcode'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Barcode className="w-4 h-4 text-pink-400" />
            <span>{lang === 'hi' ? 'बारकोड स्कैनर' : 'Barcode Scanner'}</span>
          </button>

          <button
            onClick={() => onTabChange('alerts')}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all relative ${
              activeTab === 'alerts'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? 'प्राइस अलर्ट' : 'Price Alerts'}</span>
            {alertsCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-extrabold text-xs px-1.5 py-0.2 rounded-full min-w-5 text-center">
                {alertsCount}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="modal-backdrop">
          <div className="glass-panel p-6 max-w-md w-full border border-slate-700 shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-100 mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-500" />
              Set Delivery Location
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Quick commerce availability and fees change based on your location pincode.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Enter Pincode</label>
                <input
                  type="text"
                  maxLength={6}
                  value={tempPin}
                  onChange={(e) => setTempPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 400001"
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-base font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Or auto-detect via GPS</span>
                <button
                  onClick={handleDetectGPS}
                  disabled={detecting}
                  className="flex items-center gap-1 text-indigo-400 font-semibold hover:underline"
                >
                  <Navigation className={`w-3.5 h-3.5 ${detecting ? 'animate-spin' : ''}`} />
                  {detecting ? 'Detecting...' : 'Detect My Location'}
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePin}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-sm shadow-lg shadow-indigo-600/30"
                >
                  Save Pincode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
