import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../../data/glossaryData';
import { BookMarked, Search, ArrowRight } from 'lucide-react';

interface GlossaryViewProps {
  onSelectTopic?: (slug: string) => void;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({ onSelectTopic }) => {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const categories = ['All', 'Foundations', 'Techniques', 'Graphs', 'Complexity', 'Data Structures'];

  const filtered = GLOSSARY_TERMS.filter(item => {
    const matchCat = selectedCat === 'All' || item.category === selectedCat;
    const matchQ =
      item.term.toLowerCase().includes(query.toLowerCase()) ||
      item.definition.toLowerCase().includes(query.toLowerCase()) ||
      item.example.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Design & Analysis of Algorithms Technical Glossary
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Authoritative definitions for core mathematical and algorithmic terminology.
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search glossary terms..."
            className="w-full bg-slate-950 border border-slate-700 text-xs pl-9 pr-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap ${
              selectedCat === cat
                ? 'bg-amber-600 border-amber-400 text-white font-semibold shadow'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Glossary Terms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col gap-3 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-sm font-sans tracking-wide">
                {item.term}
              </h3>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                {item.category}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {item.definition}
            </p>

            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 text-xs text-slate-400 font-mono">
              <span className="text-blue-400 font-semibold">Ex: </span>
              {item.example}
            </div>

            {item.relatedTopicSlug && onSelectTopic && (
              <button
                onClick={() => onSelectTopic(item.relatedTopicSlug!)}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium font-sans mt-auto pt-1 group"
              >
                <span>Study Related Topic</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
