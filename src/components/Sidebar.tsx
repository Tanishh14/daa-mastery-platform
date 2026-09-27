import React, { useState } from 'react';
import { UNITS_DATA } from '../data/unitsData';
import { useProgress } from '../context/ProgressContext';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Bookmark,
  Layers,
  Sparkles,
  Split,
  GitFork,
  Workflow,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  currentTopicSlug?: string;
  onSelectTopic: (slug: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTopicSlug,
  onSelectTopic,
  isOpen
}) => {
  const { progress } = useProgress();
  // Keep active unit open by default
  const [openUnits, setOpenUnits] = useState<Record<string, boolean>>({
    'unit-1': true,
    'unit-2': true,
    'unit-3': true,
    'unit-4': true,
    'unit-5': true,
    'unit-6': true,
  });

  const toggleUnit = (unitId: string) => {
    setOpenUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const getUnitIcon = (unitNumber: number) => {
    switch (unitNumber) {
      case 1: return <Sparkles className="w-4 h-4 text-blue-400" />;
      case 2: return <Split className="w-4 h-4 text-emerald-400" />;
      case 3: return <Layers className="w-4 h-4 text-purple-400" />;
      case 4: return <GitFork className="w-4 h-4 text-amber-400" />;
      case 5: return <Workflow className="w-4 h-4 text-cyan-400" />;
      case 6: return <Cpu className="w-4 h-4 text-rose-400" />;
      default: return <Layers className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <aside
      className={`fixed lg:sticky top-[57px] left-0 z-30 h-[calc(100vh-57px)] bg-[#090d16] border-r border-slate-800/80 transition-all duration-300 overflow-y-auto flex flex-col shrink-0 ${
        isOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-72'
      }`}
    >
      {/* Sidebar Header & Unit Tree Navigation */}
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          DAA Syllabus Tree
        </span>
        <span className="text-[10px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
          6 Units
        </span>
      </div>

      <div className="p-2.5 flex flex-col gap-1.5 flex-1">
        {UNITS_DATA.map(unit => {
          const isUnitOpen = openUnits[unit.id];
          const unitCompleted = unit.topics.filter(t =>
            progress.completedTopics.includes(t.id)
          ).length;

          return (
            <div key={unit.id} className="flex flex-col">
              {/* Unit Header Button */}
              <button
                onClick={() => toggleUnit(unit.id)}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800/60 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  {getUnitIcon(unit.number)}
                  <span className="text-xs font-bold text-slate-200 group-hover:text-blue-300 transition-colors">
                    Unit {unit.number}: {unit.shortTitle.split(':')[1] || unit.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-500">
                    {unitCompleted}/{unit.topics.length}
                  </span>
                  {isUnitOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
              </button>

              {/* Topics Sub-tree */}
              {isUnitOpen && (
                <div className="pl-5 pr-1 py-1 flex flex-col gap-0.5 border-l border-slate-800 ml-4 my-0.5">
                  {unit.topics.map(topic => {
                    const isSelected = currentTopicSlug === topic.slug;
                    const isCompleted = progress.completedTopics.includes(topic.id);
                    const isBookmarked = progress.bookmarkedTopics.includes(topic.id);

                    return (
                      <button
                        key={topic.id}
                        onClick={() => onSelectTopic(topic.slug)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition group ${
                          isSelected
                            ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <span className="truncate pr-2">{topic.title}</span>

                        <div className="flex items-center gap-1 shrink-0">
                          {isBookmarked && (
                            <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400" />
                          )}
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
