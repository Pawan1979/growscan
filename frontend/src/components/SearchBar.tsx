import React, { useState } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { getApiUrl } from '../config/api';

interface SearchBarProps {
  onSearch: (query: string) => void;
  lang: 'en' | 'hi';
}

const CATEGORY_PILLS = [
  { id: 'dairy',   label: '🥛 Dairy',    query: 'Amul Milk' },
  { id: 'staples', label: '🌾 Atta',     query: 'Aashirvaad Atta' },
  { id: 'oil',     label: '🌻 Oil',      query: 'Fortune Sunflower Oil' },
  { id: 'instant', label: '🍜 Noodles',  query: 'Maggi Noodles' },
  { id: 'clean',   label: '🧺 Detergent',query: 'Surf Excel' },
  { id: 'drinks',  label: '🥤 Drinks',   query: 'Coca-Cola' },
];

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, lang }) => {
  const [query, setQuery] = useState('Amul Milk');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchSuggestions = (q: string) => {
    if (q.trim().length > 1) {
      fetch(getApiUrl(`/api/products/suggestions?q=${encodeURIComponent(q)}`))
        .then((res) => res.json())
        .then((data) => { if (Array.isArray(data)) setSuggestions(data); })
        .catch(() => {});
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) { setShowDropdown(false); onSearch(query.trim()); }
  };

  const handleSelect = (s: string) => {
    setQuery(s); setShowDropdown(false); onSearch(s);
  };

  return (
    <div className="mb-5 space-y-3">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-indigo-400 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); fetchSuggestions(e.target.value); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            placeholder={lang === 'hi' ? 'ग्रोसरी सर्च करें…' : 'Search grocery (e.g. Amul Milk)…'}
            className="w-full bg-slate-900/90 border-2 border-indigo-500/40 focus:border-indigo-500 text-slate-100 placeholder-slate-500 rounded-2xl pl-10 pr-24 py-3 text-sm font-medium focus:outline-none transition-all"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(''); setSuggestions([]); }}
              className="absolute right-20 p-1 text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          )}
          <button type="submit"
            className="absolute right-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-4 py-1.5 rounded-xl text-sm shadow transition-all">
            {lang === 'hi' ? 'खोजें' : 'Compare'}
          </button>
        </div>

        {/* Suggestions */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-40 overflow-hidden">
            {suggestions.map((s, i) => (
              <button key={i} type="button" onMouseDown={() => handleSelect(s)}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition-colors">
                <Search className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                {s}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
        {CATEGORY_PILLS.map((pill) => (
          <button key={pill.id} onClick={() => handleSelect(pill.query)}
            className="bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-700/80 whitespace-nowrap transition-all shrink-0">
            {pill.label}
          </button>
        ))}
      </div>
    </div>
  );
};
