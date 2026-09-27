import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen } from 'lucide-react';
import { getAllTopics } from '../../data/unitsData';
import { GLOSSARY_TERMS } from '../../data/glossaryData';
import type { AlgorithmTopic } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (slug: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic
}) => {
  const [query, setQuery] = useState('');
  const allTopics = getAllTopics();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Toggle or open handled by parent
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTopics = allTopics.filter(
    t =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase()) ||
      t.shortDesc.toLowerCase().includes(query.toLowerCase()) ||
      t.complexity.worst.toLowerCase().includes(query.toLowerCase()) ||
      t.complexity.average.toLowerCase().includes(query.toLowerCase())
  );

  const filteredGlossary = GLOSSARY_TERMS.filter(
    g =>
      g.term.toLowerCase().includes(query.toLowerCase()) ||
      g.definition.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-slate-950 border-b border-slate-800">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, complexities (e.g. 'n log n'), algorithms, formulas, or concepts..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[420px] overflow-y-auto p-4 flex flex-col gap-4">
          {/* Topics Category */}
          {filteredTopics.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold px-1">
                Topics & Algorithms ({filteredTopics.length})
              </span>
              <div className="flex flex-col gap-1.5">
                {filteredTopics.map((t: AlgorithmTopic) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTopic(t.slug);
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-blue-950/40 border border-slate-800/80 hover:border-blue-700/60 transition flex items-center justify-between group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-800 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-100 group-hover:text-blue-200">
                          {t.title}
                        </span>
                        <span className="text-xs text-slate-400 line-clamp-1">{t.shortDesc}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <span className="text-[11px] font-mono text-purple-400 font-semibold">
                        {t.complexity.worst}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Unit {t.unitNumber}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Glossary Matches */}
          {filteredGlossary.length > 0 && (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold px-1">
                Glossary Terms
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredGlossary.map((g, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 font-mono">{g.term}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{g.category}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {g.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredTopics.length === 0 && filteredGlossary.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">
              No matching algorithms, complexities, or terms found for "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span>Navigate with arrow keys • Enter to select</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
