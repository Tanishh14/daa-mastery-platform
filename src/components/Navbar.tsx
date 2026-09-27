import React from 'react';
import { useProgress } from '../context/ProgressContext';
import {
  Search,
  Flame,
  Award,
  BookOpen,
  FileText,
  Compass,
  Scale,
  BrainCircuit,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigateView: (view: 'dashboard' | 'topic' | 'cheatsheet' | 'glossary') => void;
  onOpenSearch: () => void;
  onOpenMockTest: () => void;
  onOpenViva: () => void;
  onOpenStrategy: () => void;
  onOpenComparison: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateView,
  onOpenSearch,
  onOpenMockTest,
  onOpenViva,
  onOpenStrategy,
  onOpenComparison
}) => {
  const { progress } = useProgress();

  return (
    <header className="sticky top-0 z-40 bg-[#080c14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigateView('dashboard')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-white text-base tracking-tight leading-none group-hover:text-blue-400 transition-colors">
              DAA<span className="text-blue-500">MASTERY</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 tracking-wider">
              ALGORITHMS PLATFORM
            </span>
          </div>
        </button>
      </div>

      {/* Global Search Bar Trigger */}
      <button
        onClick={onOpenSearch}
        className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 w-64 transition"
      >
        <Search className="w-4 h-4 text-slate-500" />
        <span className="truncate">Search topics, complexities...</span>
        <kbd className="ml-auto font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 border border-slate-700">
          Ctrl K
        </kbd>
      </button>

      {/* Action Navigation Tools & User Stats */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Navigation Mode Links */}
        <div className="hidden lg:flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => onNavigateView('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition ${
              currentView === 'dashboard'
                ? 'bg-blue-600/20 text-blue-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigateView('cheatsheet')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              currentView === 'cheatsheet'
                ? 'bg-blue-600/20 text-blue-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Cheat Sheet
          </button>
          <button
            onClick={() => onNavigateView('glossary')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              currentView === 'glossary'
                ? 'bg-blue-600/20 text-blue-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Glossary
          </button>
          <button
            onClick={onOpenComparison}
            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition flex items-center gap-1.5"
            title="Compare Algorithms"
          >
            <Scale className="w-3.5 h-3.5" /> Compare
          </button>
          <button
            onClick={onOpenStrategy}
            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition flex items-center gap-1.5"
            title="Strategy Advisor"
          >
            <Compass className="w-3.5 h-3.5" /> Strategy
          </button>
          <button
            onClick={onOpenViva}
            className="px-3 py-1.5 rounded-lg text-purple-400 hover:bg-purple-950/40 border border-purple-900/40 transition flex items-center gap-1.5"
            title="Viva Voce"
          >
            <BrainCircuit className="w-3.5 h-3.5" /> Viva
          </button>
          <button
            onClick={onOpenMockTest}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-md shadow-blue-600/30"
          >
            Mock Exam
          </button>
        </div>

        {/* Mobile Search Icon Button */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* User Study Streak Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/80 text-amber-400 font-mono text-xs">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span className="font-bold">{progress.streakCount}</span>
        </div>

        {/* User XP Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800/80 text-purple-400 font-mono text-xs">
          <Award className="w-4 h-4" />
          <span className="font-bold">{progress.xp} XP</span>
        </div>
      </div>
    </header>
  );
};
