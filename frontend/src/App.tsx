import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SearchBar } from './components/SearchBar';
import { ProductCard } from './components/ProductCard';
import { CartManager } from './components/CartManager';
import { ShareCardModal } from './components/ShareCardModal';
import { PriceHistoryModal } from './components/PriceHistoryModal';
import { PriceAlertModal } from './components/PriceAlertModal';
import { AlertsManager } from './components/AlertsManager';
import { PassSelector } from './components/PassSelector';
import { InstallPwaBanner } from './components/InstallPwaBanner';
import { LoginModal } from './components/LoginModal';
import { ComparisonResult, CartItem, PlatformPrice } from './types';
import { Share2 } from 'lucide-react';
import { getApiUrl } from './config/api';
import { auth } from './config/firebase';
import { onAuthStateChanged, User, RecaptchaVerifier } from 'firebase/auth';

export const App: React.FC = () => {
  const [pincode, setPincode] = useState('400001');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [activeTab, setActiveTab] = useState<'search' | 'cart' | 'alerts'>('search');

  const [activePasses, setActivePasses] = useState<string[]>(['swiggy_one', 'zepto_super']);

  const [currentQuery, setCurrentQuery] = useState('Amul Milk');
  const [searchResult, setSearchResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', name: 'Amul Taaza Milk 500ml', quantity: 2 },
    { id: '2', name: 'Tata Salt 1kg', quantity: 1 },
    { id: '3', name: 'Fortune Sunflower Oil 1L', quantity: 1 },
  ]);

  const [alertsCount, setAlertsCount] = useState(2);

  const [shareItem, setShareItem] = useState<{ query: string; cheapest: PlatformPrice } | null>(null);
  const [trendProduct, setTrendProduct] = useState<string | null>(null);
  const [alertItem, setAlertItem] = useState<PlatformPrice | null>(null);

  // GPS auto-detection state
  const [locationStatus, setLocationStatus] = useState<'detecting' | 'granted' | 'denied' | 'idle'>('idle');
  const [openLocationModal, setOpenLocationModal] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ── reCAPTCHA lives here in App, NOT in LoginModal ──────────────────────
  // This is the key fix: the verifier is created once and never destroyed
  // during the OTP flow, preventing the "element removed" crash.
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Track previous user to detect login transitions (null → logged in)
  const prevUserRef = useRef<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // When user transitions from null → logged in, clear the search count and re-search
  useEffect(() => {
    if (prevUserRef.current === null && user !== null) {
      localStorage.removeItem('dailySearchCount');
      handleSearch(currentQuery, activePasses);
    }
    prevUserRef.current = user;
  }, [user]);

  // Initialize reCAPTCHA once the recaptcha-container div is mounted
  useEffect(() => {
    if (recaptchaContainerRef.current && !recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
          size: 'invisible',
        });
      } catch (e) {
        console.error('Failed to init reCAPTCHA in App:', e);
      }
    }
  }, []);

  // ── Auto-detect location on first load ──────────────────────────────────
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setOpenLocationModal(true);
      return;
    }

    setLocationStatus('detecting');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const postcode: string = data?.address?.postcode?.replace(/\s/g, '') || '';
          if (postcode && /^\d{6}$/.test(postcode)) {
            setPincode(postcode);
            setLocationStatus('granted');
            // Auto-hide the success toast after 3 s
            setTimeout(() => setLocationStatus('idle'), 3000);
          } else {
            // GPS worked but couldn't get Indian pincode — ask manually
            setLocationStatus('denied');
            setOpenLocationModal(true);
          }
        } catch {
          setLocationStatus('denied');
          setOpenLocationModal(true);
        }
      },
      () => {
        // User denied or GPS unavailable
        setLocationStatus('denied');
        setOpenLocationModal(true);
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  // Register PWA Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('Service Worker registered:', reg.scope))
        .catch((err) => console.warn('Service Worker registration failed:', err));
    }
  }, []);

  const getSearchCount = () => {
    const data = localStorage.getItem('dailySearchCount');
    if (!data) return 0;
    try {
      const parsed = JSON.parse(data);
      const today = new Date().toISOString().split('T')[0];
      if (parsed.date !== today) return 0;
      return parsed.count;
    } catch {
      return 0;
    }
  };

  const incrementSearchCount = () => {
    const today = new Date().toISOString().split('T')[0];
    const count = getSearchCount() + 1;
    localStorage.setItem('dailySearchCount', JSON.stringify({ date: today, count }));
    return count;
  };

  // Perform search call to backend with active passes
  const handleSearch = async (query: string, passes: string[] = activePasses) => {
    if (!user) {
      const count = getSearchCount();
      if (count >= 3) {
        setShowLoginModal(true);
        return; // Block search
      }
      incrementSearchCount();
    }

    setCurrentQuery(query);
    setLoading(true);
    const passesParam = passes.join(',');

    let token = '';
    if (user) {
      try { token = await user.getIdToken(); } catch (e) {}
    }

    fetch(getApiUrl(`/api/compare?q=${encodeURIComponent(query)}&pin=${pincode}&passes=${passesParam}`), {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then((res) => res.json())
      .then((data) => {
        // Only store valid results — ignore error responses from the backend
        if (data?.results && Array.isArray(data.results)) {
          setSearchResult(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!authLoading) {
      handleSearch(currentQuery, activePasses);
    }
  }, [pincode, activePasses, authLoading]);

  const handleTogglePass = (passId: string) => {
    const updated = activePasses.includes(passId)
      ? activePasses.filter((p) => p !== passId)
      : [...activePasses, passId];
    setActivePasses(updated);
  };

  const handleAddToCart = (priceObj: PlatformPrice) => {
    const existing = cartItems.find((c) => c.name.toLowerCase() === priceObj.productName.toLowerCase());
    if (existing) {
      setCartItems(cartItems.map((c) => (c.id === existing.id ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setCartItems([
        ...cartItems,
        { id: Date.now().toString(), name: priceObj.productName, quantity: 1 },
      ]);
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(
      cartItems
        .map((c) => (c.id === id ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((c) => c.id !== id));
  };

  const handleAddCartItem = (name: string) => {
    setCartItems([...cartItems, { id: Date.now().toString(), name, quantity: 1 }]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20 md:pb-8">

      {/* Persistent invisible reCAPTCHA container — lives in App root, never unmounts */}
      <div ref={recaptchaContainerRef} id="recaptcha-container" style={{ display: 'none' }} />

      {/* GPS Detecting Toast */}
      {locationStatus === 'detecting' && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-indigo-600 text-white text-xs font-semibold text-center py-1.5 flex items-center justify-center gap-2">
          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Detecting your location…
        </div>
      )}

      {/* Location Granted Toast */}
      {locationStatus === 'granted' && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-emerald-600 text-white text-xs font-semibold text-center py-1.5 animate-pulse-subtle">
          📍 Location detected — showing prices for pincode {pincode}
        </div>
      )}

      {/* PWA Install Banner */}
      <InstallPwaBanner />

      {/* Top Sticky Header */}
      <Header
        pincode={pincode}
        onPincodeChange={(pin) => setPincode(pin)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'hi' : 'en')}
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t)}
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        alertsCount={alertsCount}
        openLocationModal={openLocationModal}
        onLocationModalClosed={() => setOpenLocationModal(false)}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t)}
        lang={lang}
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        alertsCount={alertsCount}
      />

      {/* Main Body Container */}
      <main className="container flex-1 mt-4 md:mt-8">
        
        {/* TAB 1: SINGLE PRODUCT SEARCH */}
        {activeTab === 'search' && (
          <div>
            <PassSelector activePasses={activePasses} onTogglePass={handleTogglePass} />
            <SearchBar onSearch={(q) => handleSearch(q, activePasses)} lang={lang} />

            {/* Results Title Banner */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span>Results for "{currentQuery}"</span>
                  <span className="text-xs font-medium text-slate-400">
                    ({searchResult?.results?.length || 0} platforms)
                  </span>
                </h2>
                {searchResult && (
                  <p className="text-xs text-slate-400">
                    Location: {searchResult.city}, {searchResult.state} ({searchResult.pincode})
                  </p>
                )}
              </div>

              {searchResult && (searchResult.results?.length || 0) > 0 && (
                <button
                  onClick={() =>
                    setShareItem({
                      query: currentQuery,
                      cheapest: searchResult.results[0],
                    })
                  }
                  className="bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Deal</span>
                </button>
              )}
            </div>

            {/* Loader */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 skeleton" />
                ))}
              </div>
            ) : (
              searchResult && Array.isArray(searchResult.results) && (
                <div className="space-y-3">
                  {searchResult.results.map((item) => {
                    const isCheapest = item.platformName === searchResult.cheapestPlatform;
                    const isFastest = item.platformName === searchResult.fastestPlatform;
                    const isInCart = cartItems.some(
                      (c) => c.name.toLowerCase() === item.productName.toLowerCase()
                    );

                    return (
                      <ProductCard
                        key={item.platformId}
                        item={item}
                        isCheapest={isCheapest}
                        isFastest={isFastest}
                        onAddToCart={handleAddToCart}
                        isInCart={isInCart}
                        onOpenTrend={(name) => setTrendProduct(name)}
                        onOpenAlert={(it) => setAlertItem(it)}
                      />
                    );
                  })}
                </div>
              )
            )}
          </div>
        )}

        {/* TAB 2: FULL CART COMPARE & SPLIT-CART OPTIMIZER */}
        {activeTab === 'cart' && (
          <CartManager
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onAddItem={handleAddCartItem}
            pincode={pincode}
          />
        )}


        {/* TAB 4: SAVED PRICE ALERTS */}
        {activeTab === 'alerts' && <AlertsManager />}
      </main>

      {/* Modals */}
      {shareItem && (
        <ShareCardModal
          productName={shareItem.query}
          cheapest={shareItem.cheapest}
          onClose={() => setShareItem(null)}
        />
      )}

      {trendProduct && (
        <PriceHistoryModal
          productName={trendProduct}
          onClose={() => setTrendProduct(null)}
        />
      )}

      {alertItem && (
        <PriceAlertModal
          item={alertItem}
          pincode={pincode}
          onClose={() => setAlertItem(null)}
          onAlertCreated={() => setAlertsCount((c) => c + 1)}
        />
      )}

      {showLoginModal && (
        <LoginModal
          appVerifier={recaptchaVerifierRef.current}
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            // Just close the modal — the user state change effect above will
            // detect the login transition and trigger the search safely
            setShowLoginModal(false);
          }}
        />
      )}

      {/* PWA App Install Banner */}
      <InstallPwaBanner />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="container">
          <p>© 2026 GrocScan — Transparent Quick Commerce Price Auditing across Blinkit, Zepto, Swiggy Instamart, BigBasket & JioMart.</p>
        </div>
      </footer>
    </div>
  );
};
