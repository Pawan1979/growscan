import React, { useState, useEffect } from 'react';
import { CartItem, CartComparisonResult } from '../types';
import { Trash2, Plus, Minus, Sparkles, ShoppingBag } from 'lucide-react';

interface CartManagerProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (name: string) => void;
  pincode: string;
}

export const CartManager: React.FC<CartManagerProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onAddItem,
  pincode,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [comparison, setComparison] = useState<CartComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCartComparison = () => {
    if (cartItems.length === 0) {
      setComparison(null);
      return;
    }
    setLoading(true);
    fetch('/api/cart/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems.map((c) => ({ name: c.name, quantity: c.quantity })),
        pincode,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setComparison(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCartComparison();
  }, [cartItems, pincode]);

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      onAddItem(newItemName.trim());
      setNewItemName('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Cart Builder Input */}
      <div className="glass-panel p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">Multi-Item Grocery Cart</h2>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
            {cartItems.reduce((acc, i) => acc + i.quantity, 0)} Total Items
          </span>
        </div>

        {/* Add item bar */}
        <form onSubmit={handleAddNew} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add item to cart (e.g. Tata Salt 1kg, Butter 500g)..."
            className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-1 shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        {/* Cart Item List Chips */}
        {cartItems.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">
            Your cart is empty. Add grocery items above or search products to compare total cart costs!
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800"
              >
                <span className="font-semibold text-slate-200 text-sm">{item.name}</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-bold text-slate-100">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Comparison Results */}
      {loading ? (
        <div className="glass-panel p-8 text-center text-slate-400 space-y-2">
          <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm font-medium">Calculating cart totals across all 5 platforms...</p>
        </div>
      ) : (
        comparison && (
          <div className="space-y-6">
            
            {/* Split Cart Recommendation Banner */}
            {comparison.splitCartOption.recommended && (
              <div className="bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-pink-900/60 border-2 border-purple-500/50 p-5 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-purple-500 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Split-Cart Recommendation
                      </span>
                      <span className="text-emerald-400 font-extrabold text-sm">
                        Save ₹{comparison.splitCartOption.savingsAmount} EXTRA
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 font-medium mb-3">
                      {comparison.splitCartOption.explanation}
                    </p>

                    {/* Split Details Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {comparison.splitCartOption.splits.map((s, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs"
                        >
                          <div className="font-bold text-slate-100 flex items-center gap-2 mb-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: s.color }}
                            />
                            {s.platformName} (Order {s.itemNames.length} items)
                          </div>
                          <div className="text-slate-400 mb-1">Items: {s.itemNames.join(', ')}</div>
                          <div className="font-semibold text-emerald-400">Total: ₹{s.total}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Single Platform Cart Totals Table / Cards */}
            <div>
              <h3 className="text-base font-bold text-slate-200 mb-3 flex items-center gap-2">
                Single Checkout Totals
                <span className="text-xs font-normal text-slate-400">
                  (Includes all delivery & platform fees)
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {comparison.singlePlatformTotals.map((plat) => {
                  const isWinningSingle = plat.platformName === comparison.cheapestSinglePlatform;

                  return (
                    <div
                      key={plat.platformId}
                      className={`glass-panel p-4 rounded-xl border transition-all ${
                        isWinningSingle
                          ? 'border-emerald-500/60 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                          : 'border-slate-800 bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: plat.color }}
                          />
                          <span className="font-bold text-slate-100 text-sm">{plat.platformName}</span>
                        </div>
                        {isWinningSingle && (
                          <span className="badge-cheapest text-xs">Cheapest</span>
                        )}
                      </div>

                      <div className="space-y-1 text-xs text-slate-400 mb-3">
                        <div className="flex justify-between">
                          <span>Items Subtotal:</span>
                          <span className="text-slate-200 font-medium">₹{plat.itemSubtotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Platform & Delivery Fees:</span>
                          <span className="text-slate-200 font-medium">
                            ₹{plat.platformFee + plat.deliveryFee + plat.handlingFee}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
                        <span className="text-xs font-bold text-slate-300">Grand Total</span>
                        <span className="text-lg font-extrabold text-emerald-400">
                          ₹{plat.grandTotal > 99000 ? 'N/A' : plat.grandTotal}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
