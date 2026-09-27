import React, { useState, useEffect } from 'react';
import { X, Clock, Flag, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { getAllTopics } from '../../data/unitsData';
import { useProgress } from '../../context/ProgressContext';
import type { Question } from '../../types';

interface FullMockTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullMockTestModal: React.FC<FullMockTestModalProps> = ({ isOpen, onClose }) => {
  const { recordMockTestScore } = useProgress();
  const allTopics = getAllTopics();

  // Aggregate questions across all 6 units
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(90 * 60); // 90 mins
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Initialize pool of questions
  useEffect(() => {
    if (isOpen) {
      const allQ = allTopics.flatMap(t => t.questions);
      // Pick questions systematically
      setExamQuestions(allQ);
      setCurrentIdx(0);
      setAnswers({});
      setMarkedForReview([]);
      setTimeRemainingSeconds(90 * 60);
      setIsSubmitted(false);
    }
  }, [isOpen]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isSubmitted) return;

    const timer = window.setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) {
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isSubmitted]);

  if (!isOpen || examQuestions.length === 0) return null;

  const currentQ = examQuestions[currentIdx];
  const userAns = answers[currentQ.id];
  const isMulti = currentQ.type === 'multiple-select';

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;

    if (isMulti) {
      const prev = (answers[currentQ.id] as number[]) || [];
      const updated = prev.includes(optIdx) ? prev.filter(x => x !== optIdx) : [...prev, optIdx];
      setAnswers({ ...answers, [currentQ.id]: updated });
    } else {
      setAnswers({ ...answers, [currentQ.id]: optIdx });
    }
  };

  const toggleMarkReview = (qId: string) => {
    setMarkedForReview(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const calculateResults = () => {
    let correct = 0;
    examQuestions.forEach(q => {
      const ans = answers[q.id];
      if (Array.isArray(q.correctAnswer)) {
        if (
          Array.isArray(ans) &&
          ans.length === q.correctAnswer.length &&
          ans.every(val => (q.correctAnswer as number[]).includes(val))
        ) {
          correct++;
        }
      } else {
        if (ans === q.correctAnswer) correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    const score = calculateResults();
    setIsSubmitted(true);
    recordMockTestScore(score, examQuestions.length);
  };

  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const correctCount = isSubmitted ? calculateResults() : 0;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        {/* Top Exam Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                DAA Comprehensive Full Syllabus Mock Examination
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {examQuestions.length} Questions • Units I through VI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs border ${
                timeRemainingSeconds < 300
                  ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse font-bold'
                  : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              <Clock className="w-4 h-4 text-blue-400" />
              <span>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body: Question Left, Palette Right */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-4">
          {/* Question Panel */}
          <div className="lg:col-span-3 p-6 overflow-y-auto flex flex-col gap-5 border-r border-slate-800/80">
            {!isSubmitted ? (
              <>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-blue-300 font-bold">
                      Q{currentIdx + 1} of {examQuestions.length}
                    </span>
                    <span className="text-slate-500">{currentQ.type.toUpperCase()}</span>
                  </div>
                  <button
                    onClick={() => toggleMarkReview(currentQ.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition ${
                      markedForReview.includes(currentQ.id)
                        ? 'bg-amber-950 border-amber-500 text-amber-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    {markedForReview.includes(currentQ.id) ? 'Marked for Review' : 'Mark for Review'}
                  </button>
                </div>

                {/* Question Text */}
                <div className="text-slate-100 text-base font-medium leading-relaxed font-sans">
                  {currentQ.question}
                </div>

                {/* Code Snippet if any */}
                {currentQ.codeSnippet && (
                  <div className="bg-[#090d16] border border-slate-800 p-3 rounded-lg font-mono text-xs text-blue-200 overflow-x-auto">
                    <pre>{currentQ.codeSnippet}</pre>
                  </div>
                )}

                {/* Options List */}
                {currentQ.options && (
                  <div className="flex flex-col gap-2.5 pt-2">
                    {currentQ.options.map((opt, optIdx) => {
                      const isSelected = Array.isArray(userAns)
                        ? userAns.includes(optIdx)
                        : userAns === optIdx;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`text-left p-3.5 rounded-xl border text-sm transition flex items-start gap-3 ${
                            isSelected
                              ? 'bg-blue-950/90 border-blue-500 text-blue-200 font-semibold shadow'
                              : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="font-mono text-xs opacity-60 w-5 shrink-0">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              /* Performance Analytics after Exam Submission */
              <div className="flex flex-col gap-5">
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                      Exam Result Analytics
                    </span>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
                      Completed
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-bold font-mono text-white">
                      {correctCount} / {examQuestions.length}
                    </span>
                    <span className="text-emerald-400 text-lg font-mono font-semibold">
                      ({Math.round((correctCount / examQuestions.length) * 100)}% Accuracy)
                    </span>
                  </div>
                </div>

                {/* Review Question Explanation */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col gap-3">
                  <span className="text-xs font-mono text-blue-400 font-bold uppercase">
                    Q{currentIdx + 1} Review & Solution:
                  </span>
                  <p className="text-sm text-slate-200">{currentQ.question}</p>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded border border-slate-800">
                    {currentQ.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Question Palette Sidebar */}
          <div className="p-4 bg-slate-950/60 flex flex-col gap-4 overflow-y-auto">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
              <span>Question Palette</span>
              <span>
                {answeredCount}/{examQuestions.length} Done
              </span>
            </div>

            {/* Grid of question bubbles */}
            <div className="grid grid-cols-5 gap-2">
              {examQuestions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isMarked = markedForReview.includes(q.id);
                const isCurrent = currentIdx === idx;

                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-400';
                if (isCurrent) {
                  btnStyle = 'ring-2 ring-blue-500 font-bold text-white';
                }
                if (isAnswered) {
                  btnStyle = 'bg-emerald-950 border-emerald-600 text-emerald-300 font-semibold';
                }
                if (isMarked) {
                  btnStyle = 'bg-amber-950 border-amber-600 text-amber-300 font-semibold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-9 rounded-lg border text-xs font-mono flex items-center justify-center transition ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-1.5 text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-900 border border-emerald-600"></span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-900 border border-amber-600"></span>
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-900 border border-slate-800"></span>
                <span>Unattempted</span>
              </div>
            </div>

            {/* Submit Exam Button */}
            {!isSubmitted && (
              <button
                onClick={handleSubmit}
                className="mt-auto py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition shadow-lg shadow-rose-600/30"
              >
                Submit Mock Examination
              </button>
            )}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-950 border-t border-slate-800">
          <button
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-mono transition"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <button
            onClick={() => setCurrentIdx(prev => Math.min(examQuestions.length - 1, prev + 1))}
            disabled={currentIdx >= examQuestions.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-mono transition shadow-lg shadow-blue-600/30"
          >
            Next Question <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
