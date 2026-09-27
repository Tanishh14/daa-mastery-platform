import React, { useState } from 'react';
import { X, Sparkles, Compass, CheckCircle2, RotateCcw } from 'lucide-react';
import {
  STRATEGY_WIZARD_QUESTIONS,
  PATTERN_PRACTICE_PROBLEMS
} from '../../data/strategyWizardData';

interface StrategyWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTopic?: (slug: string) => void;
}

export const StrategyWizardModal: React.FC<StrategyWizardModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'wizard' | 'pattern'>('wizard');

  // Wizard state
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('start');
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [finalResult, setFinalResult] = useState<{
    strategy: string;
    recommendation: string;
    reasoning: string;
    sampleProblems?: string[];
  } | null>(null);

  // Pattern practice state
  const [patternProblemIdx, setPatternProblemIdx] = useState<number>(0);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [submittedPattern, setSubmittedPattern] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentQ = STRATEGY_WIZARD_QUESTIONS[currentQuestionId];
  const patternProb = PATTERN_PRACTICE_PROBLEMS[patternProblemIdx];

  const handleSelectOption = (opt: typeof currentQ['options'][0]) => {
    if (opt.resultStrategy) {
      setFinalResult({
        strategy: opt.resultStrategy,
        recommendation: opt.recommendation || '',
        reasoning: opt.reasoning || '',
        sampleProblems: opt.sampleProblems
      });
    } else if (opt.nextQuestionId) {
      setPathHistory([...pathHistory, currentQuestionId]);
      setCurrentQuestionId(opt.nextQuestionId);
    }
  };

  const handleResetWizard = () => {
    setCurrentQuestionId('start');
    setPathHistory([]);
    setFinalResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Algorithmic Strategy Decision Engine
              </h3>
              <p className="text-xs text-slate-400">
                Determine the optimal algorithmic strategy for any fresh, unseen computational problem.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setActiveTab('wizard')}
                className={`px-3 py-1.5 rounded-md transition ${
                  activeTab === 'wizard' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400'
                }`}
              >
                Strategy Advisor
              </button>
              <button
                onClick={() => setActiveTab('pattern')}
                className={`px-3 py-1.5 rounded-md transition ${
                  activeTab === 'pattern' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400'
                }`}
              >
                Pattern Practice
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {activeTab === 'wizard' ? (
            !finalResult ? (
              /* Step-by-Step Question Flow */
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Decision Step {pathHistory.length + 1}</span>
                  {pathHistory.length > 0 && (
                    <button
                      onClick={handleResetWizard}
                      className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Start Over
                    </button>
                  )}
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-100">
                    {currentQ.question}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                    {currentQ.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt)}
                      className="p-4 rounded-xl bg-slate-950/70 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-600 text-left transition flex flex-col gap-1.5 group"
                    >
                      <span className="text-sm font-semibold text-slate-200 group-hover:text-blue-300 transition">
                        {opt.label}
                      </span>
                      <span className="text-xs text-slate-400 leading-relaxed">
                        {opt.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Final Result Recommendation */
              <div className="bg-slate-950 border border-blue-900/60 rounded-xl p-6 flex flex-col gap-5 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                      Recommended Strategy:
                    </span>
                  </div>
                  <span className="text-xs font-mono text-blue-400 bg-blue-950 border border-blue-800 px-3 py-1 rounded-full">
                    {finalResult.strategy}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2 font-sans">
                    {finalResult.recommendation}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{finalResult.reasoning}</p>
                </div>

                {finalResult.sampleProblems && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
                    <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                      Canonical Syllabus Algorithms:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {finalResult.sampleProblems.map((prob, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg text-xs font-mono text-blue-300"
                        >
                          {prob}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={handleResetWizard}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition"
                  >
                    <RotateCcw className="w-4 h-4" /> Evaluate Another Problem
                  </button>
                </div>
              </div>
            )
          ) : (
            /* Pattern Recognition Practice Mode */
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>
                  Problem {patternProblemIdx + 1} of {PATTERN_PRACTICE_PROBLEMS.length}
                </span>
                <span className="text-amber-400">Recognize the Algorithmic Pattern</span>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col gap-3">
                <h4 className="text-base font-bold text-slate-100">{patternProb.title}</h4>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {patternProb.scenario}
                </p>
                <div className="text-xs font-mono text-slate-400 bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-amber-400 font-bold">Constraints: </span>
                  {patternProb.constraints}
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-semibold text-slate-300">
                  Which algorithmic strategy would you choose to solve this?
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {patternProb.options.map((opt, idx) => {
                    const isSelected = selectedStrategy === opt;
                    return (
                      <button
                        key={idx}
                        onClick={() => !submittedPattern && setSelectedStrategy(opt)}
                        disabled={submittedPattern}
                        className={`p-3 rounded-lg border text-xs sm:text-sm font-medium transition text-left ${
                          isSelected
                            ? 'bg-blue-950 border-blue-500 text-blue-200'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {!submittedPattern ? (
                <button
                  onClick={() => setSubmittedPattern(true)}
                  disabled={!selectedStrategy}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-xs ml-auto transition"
                >
                  Verify Strategy
                </button>
              ) : (
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-bold flex items-center gap-1.5 ${
                        selectedStrategy === patternProb.correctStrategy
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {selectedStrategy === patternProb.correctStrategy
                        ? 'Optimal Strategy Identified!'
                        : `Suboptimal Choice: Correct is ${patternProb.correctStrategy}`}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Target: {patternProb.recommendedAlgorithm}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {patternProb.explanation}
                  </p>

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      onClick={() => {
                        setSelectedStrategy(null);
                        setSubmittedPattern(false);
                        setPatternProblemIdx((patternProblemIdx + 1) % PATTERN_PRACTICE_PROBLEMS.length);
                      }}
                      className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 ml-auto transition"
                    >
                      Next Scenario ➔
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
