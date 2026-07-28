import React, { useState, useEffect } from 'react';
import { Bell, Trash2 } from 'lucide-react';

export interface AlertItem {
  id: string;
  productName: string;
  targetPrice: number;
  currentCheapestPrice: number;
  platformName: string;
  pincode: string;
  active: boolean;
  createdAt: string;
}

import { getApiUrl } from '../config/api';

export const AlertsManager: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    setLoading(true);
    fetch(getApiUrl('/api/alerts'))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAlerts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleDelete = (id: string) => {
    fetch(getApiUrl(`/api/alerts/${id}`), { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        setAlerts(alerts.filter((a) => a.id !== id));
      })
      .catch(() => {});
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Active Price Drop Alerts</h2>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
            {alerts.length} Active Alerts
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400">
            <div className="animate-spin w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-xs">Loading alerts...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No price drop alerts set yet. Click <strong>"🔔 Set Alert"</strong> on any product card to track price drops!
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/70 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-100 text-sm">{alert.productName}</h4>
                    <span className="bg-amber-500/20 text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30">
                      Target: ₹{alert.targetPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>Current: <strong className="text-emerald-400">₹{alert.currentCheapestPrice}</strong> ({alert.platformName})</span>
                    <span>Pin: {alert.pincode}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(alert.id)}
                  className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
