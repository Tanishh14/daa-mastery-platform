import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { UNITS_DATA, getAllTopics } from '../../data/unitsData';
import {
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  AlertTriangle,
  PlayCircle
} from 'lucide-react';

interface RevisionDashboardProps {
  onSelectTopic: (slug: string) => void;
  onOpenMockTest: () => void;
  onOpenViva: () => void;
  onOpenStrategy: () => void;
}

export const RevisionDashboard: React.FC<RevisionDashboardProps> = ({
  onSelectTopic,
  onOpenMockTest,
  onOpenViva,
  onOpenStrategy
}) => {
  const { progress } = useProgress();
  const allTopics = getAllTopics();

  // Progress metrics
  const totalTopicsCount = allTopics.length;
  const completedCount = progress.completedTopics.length;
  const progressPct = Math.round((completedCount / totalTopicsCount) * 100);

  // Calculate questions solved and accuracy from quizScores
  let totalSolved = 0;
  let totalCorrect = 0;
  Object.values(progress.quizScores).forEach(q => {
    totalCorrect += q.score;
    totalSolved += q.total;
  });
  const accuracy = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 84;

  // Weak topics detection: quiz score < 75% or not completed
  const weakTopics = allTopics.filter(t => {
    const qScore = progress.quizScores[t.id];
    if (qScore && qScore.score / qScore.total < 0.75) return true;
    return false;
  });

  // Recommended next topic: first uncompleted topic
  const recommendedNext =
    allTopics.find(t => !progress.completedTopics.includes(t.id)) || allTopics[0];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-12">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 border border-blue-800 px-2.5 py-0.5 rounded-full">
              DAA PROGRESS COCKPIT
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Active Session
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Master Design & Analysis of Algorithms
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Interactive syllabus curriculum covering all 6 units: Complexity, Recursion, Dynamic Programming, Greedy, Network Flow, and NP-Completeness.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          <button
            onClick={onOpenMockTest}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/30"
          >
            <PlayCircle className="w-4 h-4" /> Full Mock Exam
          </button>
          <button
            onClick={onOpenViva}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
          >
            <BrainCircuit className="w-4 h-4 text-purple-400" /> Viva Voce
          </button>
          <button
            onClick={onOpenStrategy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
          >
            Strategy Wizard
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3.5 shadow-md">
          <div className="p-3 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400 uppercase font-sans">Topics Mastered</span>
            <span className="text-xl font-bold text-white mt-0.5">
              {completedCount} <span className="text-xs text-slate-500">/ {totalTopicsCount}</span>
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3.5 shadow-md">
          <div className="p-3 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400 uppercase font-sans">Accuracy</span>
            <span className="text-xl font-bold text-emerald-400 mt-0.5">{accuracy}%</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3.5 shadow-md">
          <div className="p-3 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30">
            <Flame className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400 uppercase font-sans">Study Streak</span>
            <span className="text-xl font-bold text-amber-400 mt-0.5">
              {progress.streakCount} <span className="text-xs text-slate-400">Days</span>
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3.5 shadow-md">
          <div className="p-3 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400 uppercase font-sans">Experience XP</span>
            <span className="text-xl font-bold text-purple-400 mt-0.5">{progress.xp}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Unit Progress on Left, Recommendation & Weak Areas on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Unit Breakdown */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-slate-100 text-base">
              Unit-Wise Syllabus Progress
            </h3>
            <span className="text-xs font-mono text-blue-400 font-semibold">
              Overall: {progressPct}% Complete
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {UNITS_DATA.map(unit => {
              const unitTopics = unit.topics;
              const unitCompleted = unitTopics.filter(t =>
                progress.completedTopics.includes(t.id)
              ).length;
              const unitPct = Math.round((unitCompleted / unitTopics.length) * 100);

              return (
                <div
                  key={unit.id}
                  className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-2.5 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-slate-800 text-blue-400 text-xs font-mono font-bold flex items-center justify-center">
                        {unit.number}
                      </span>
                      <span className="text-sm font-semibold text-slate-200">
                        {unit.title}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {unitPct}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${unitPct}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>
                      {unitCompleted} of {unitTopics.length} topics completed
                    </span>
                    <button
                      onClick={() => onSelectTopic(unitTopics[0].slug)}
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-sans font-medium"
                    >
                      Open Unit ➔
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Recommendation, Weak Topics & Badges */}
        <div className="flex flex-col gap-6">
          {/* Recommended Next Topic Card */}
          {recommendedNext && (
            <div className="bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-blue-900/60 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-bold">
                🎯 Recommended Next Topic
              </span>
              <div>
                <h4 className="text-base font-bold text-white">{recommendedNext.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {recommendedNext.shortDesc}
                </p>
              </div>
              <button
                onClick={() => onSelectTopic(recommendedNext.slug)}
                className="mt-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-between shadow-lg shadow-blue-600/30 transition group"
              >
                <span>Start Learning Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Weak Topics / Revision Queue */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-slate-100 text-xs uppercase tracking-wider">
                  Targeted Revision Queue
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {weakTopics.length > 0 ? `${weakTopics.length} Focus Areas` : 'Optimal'}
              </span>
            </div>

            {weakTopics.length > 0 ? (
              <div className="flex flex-col gap-2">
                {weakTopics.map(wt => (
                  <button
                    key={wt.id}
                    onClick={() => onSelectTopic(wt.slug)}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-amber-600/60 text-left transition flex items-center justify-between group"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300">
                        {wt.title}
                      </span>
                      <span className="text-[10px] text-slate-500">Unit {wt.unitNumber}</span>
                    </div>
                    <span className="text-xs text-amber-400 font-mono">Revise ➔</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 leading-relaxed p-3 bg-slate-950 rounded-lg border border-slate-800">
                ✓ All attempted topic quizzes are currently performing with high accuracy! Continue exploring new units.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
