import React, { useState } from 'react';
import { CHEAT_SHEET_DATA } from '../../data/cheatSheetData';
import { FileText, Search } from 'lucide-react';

export const CheatSheetView: React.FC = () => {
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = CHEAT_SHEET_DATA.map(section => ({
    ...section,
    items: section.items.filter(
      item =>
        item.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
        item.formula.toLowerCase().includes(filterQuery.toLowerCase()) ||
        item.notes.toLowerCase().includes(filterQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              DAA Quick Revision Formula Sheet & Asymptotic Compendium
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              High-yield formulas, Master Theorem cases, recurrences, and complex sorting bounds for fast review.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter formulas..."
            className="w-full bg-slate-950 border border-slate-700 text-xs pl-9 pr-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((sec, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3.5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-sm tracking-wide">
                {sec.title}
              </h3>
              <span className="text-[11px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                {sec.category}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {sec.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-lg flex flex-col gap-1 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 font-sans">
                      {item.name}
                    </span>
                    {item.complexity && (
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {item.complexity}
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-xs text-amber-300 font-semibold bg-slate-900/90 px-2 py-1 rounded">
                    {item.formula}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{item.notes}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
