import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, TrendingUp } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  lang: 'en' | 'hi';
}

const CATEGORY_PILLS = [
  { id: 'dairy', label: '🥛 Dairy & Eggs', query: 'Amul Milk' },
  { id: 'staples', label: '🌾 Staples & Atta', query: 'Aashirvaad Atta' },
  { id: 'oil', label: '🌻 Edible Oil', query: 'Fortune Sunflower Oil' },
  { id: 'instant', label: '🍜 Instant Noodles', query: 'Maggi Noodles' },
  { id: 'clean', label: '🧺 Household & Washing', query: 'Surf Excel' },
  { id: 'drinks', label: '🥤 Cold Drinks', query: 'Coca-Cola' },
];

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, lang }) => {
  const [query, setQuery] = useState('Amul Milk');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (query.trim().length > 1) {
      fetch(`/api/products/suggestions?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setSuggestions(data);
        })
        .catch(() => {});
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      onSearch(query.trim());
    }
  };

  const handleSelectSuggestion = (s: string) => {
    setQuery(s);
    setShowDropdown(false);
    onSearch(s);
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-indigo-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={
              lang === 'hi'
                ? 'ग्रोसरी सर्च करें (उदा. अमूल दूध, टाटा नमक, मैगी)...'
                : 'Search any grocery product (e.g. Amul Milk, Tata Salt, Maggi)...'
            }
            className="w-full bg-slate-900/90 border-2 border-indigo-500/40 hover:border-indigo-500 text-slate-100 placeholder-slate-500 rounded-2xl pl-12 pr-28 py-3.5 text-base font-medium shadow-xl focus:outline-none focus:border-indigo-500 transition-all"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              className="absolute right-24 p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="absolute right-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md transition-all flex items-center gap-1"
          >
            <span>{lang === 'hi' ? 'खोजें' : 'Compare'}</span>
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-40 overflow-hidden divide-y divide-slate-800">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(s)}
                className="w-full px-4 py-3 text-left text-sm font-medium text-slate-200 hover:bg-slate-800/80 flex items-center gap-3 transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>{s}</span>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Category Quick Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          Quick:
        </span>
        {CATEGORY_PILLS.map((pill) => (
          <button
            key={pill.id}
            onClick={() => handleSelectSuggestion(pill.query)}
            className="bg-slate-800/70 hover:bg-slate-700/90 text-slate-300 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-700/80 whitespace-nowrap transition-all"
          >
            {pill.label}
          </button>
        ))}
      </div>
    </div>
  );
};
