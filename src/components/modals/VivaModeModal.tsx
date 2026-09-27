import React, { useState } from 'react';
import { X, Mic, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { VIVA_QUESTIONS } from '../../data/interviewQuestionsData';

interface VivaModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VivaModeModal: React.FC<VivaModeModalProps> = ({ isOpen, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentQ = VIVA_QUESTIONS[currentIdx];

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIdx(prev => (prev + 1) % VIVA_QUESTIONS.length);
  };

  const handlePrev = () => {
    setShowAnswer(false);
    setCurrentIdx(prev => (prev - 1 + VIVA_QUESTIONS.length) % VIVA_QUESTIONS.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                DAA Oral Examination & Viva Voce Mode
              </h3>
              <p className="text-xs text-slate-400">
                Rigorous interview flashcards with professor-level model explanations.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>
              Question {currentIdx + 1} of {VIVA_QUESTIONS.length}
            </span>
            <span className="text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2.5 py-0.5 rounded">
              {currentQ.category}
            </span>
          </div>

          {/* Oral Question */}
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex flex-col gap-3">
            <span className="text-xs font-mono uppercase text-slate-500 font-semibold tracking-wider">
              Examiner Query:
            </span>
            <h4 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              "{currentQ.question}"
            </h4>
          </div>

          {/* Reveal Button */}
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="py-4 rounded-xl border border-dashed border-slate-700 hover:border-blue-500 hover:bg-blue-950/20 text-slate-400 hover:text-blue-300 font-mono text-xs flex items-center justify-center gap-2 transition"
            >
              <Eye className="w-4 h-4" /> Click to Reveal Model Viva Answer
            </button>
          ) : (
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex flex-col gap-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
                  Model Answer:
                </span>
                <button
                  onClick={() => setShowAnswer(false)}
                  className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs font-mono"
                >
                  <EyeOff className="w-3.5 h-3.5" /> Hide
                </button>
              </div>

              {/* Short answer summary */}
              <div className="bg-emerald-950/30 border border-emerald-900/50 p-3 rounded-lg text-xs sm:text-sm text-emerald-200 font-medium leading-relaxed font-sans">
                {currentQ.shortAnswer}
              </div>

              {/* Deep explanation */}
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {currentQ.deepExplanation}
              </div>

              {/* Key phrases expected by professors */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Key Technical Phrases to Mention:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentQ.keyPhrases.map((phrase, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-900 border border-slate-700/80 px-2 py-0.5 rounded text-[11px] font-mono text-amber-300"
                    >
                      ✓ {phrase}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-t border-slate-800">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono transition shadow-lg shadow-rose-600/30"
          >
            Next Question <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
