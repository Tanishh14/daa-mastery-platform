import React, { useState } from 'react';
import type { Question } from '../types';
import { useProgress } from '../context/ProgressContext';
import { HelpCircle, CheckCircle2, XCircle, Award } from 'lucide-react';

interface TopicQuizProps {
  topicId: string;
  topicTitle: string;
  questions: Question[];
}

export const TopicQuiz: React.FC<TopicQuizProps> = ({ topicId, topicTitle, questions }) => {
  const { progress, recordQuizScore } = useProgress();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | number[] | string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const existingScore = progress.quizScores[topicId];

  const handleSelectOption = (questionId: string, optIdx: number, isMulti: boolean) => {
    if (submitted) return;

    if (isMulti) {
      const prev = (selectedAnswers[questionId] as number[]) || [];
      const updated = prev.includes(optIdx) ? prev.filter(x => x !== optIdx) : [...prev, optIdx];
      setSelectedAnswers({ ...selectedAnswers, [questionId]: updated });
    } else {
      setSelectedAnswers({ ...selectedAnswers, [questionId]: optIdx });
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      const userAns = selectedAnswers[q.id];
      if (Array.isArray(q.correctAnswer)) {
        if (
          Array.isArray(userAns) &&
          userAns.length === q.correctAnswer.length &&
          userAns.every(val => (q.correctAnswer as number[]).includes(val))
        ) {
          score++;
        }
      } else {
        if (userAns === q.correctAnswer) {
          score++;
        }
      }
    });
    return score;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setSubmitted(true);
    recordQuizScore(topicId, finalScore, questions.length);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const currentScore = submitted ? calculateScore() : existingScore ? existingScore.score : 0;
  const isAllAnswered = questions.every(q => selectedAnswers[q.id] !== undefined);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-6">
      {/* Quiz Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="font-bold text-slate-100 text-base">
              Topic Mastery Assessment: {topicTitle}
            </h3>
            <span className="text-xs text-slate-400">
              {questions.length} questions • Concept, Complexity, Dry Run & Debugging
            </span>
          </div>
        </div>

        {existingScore && (
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg font-mono text-xs">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">Best Score:</span>
            <span className="text-emerald-400 font-bold">
              {existingScore.score} / {existingScore.total}
            </span>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-8">
        {questions.map((q, qIdx) => {
          const userAns = selectedAnswers[q.id];
          const isMulti = q.type === 'multiple-select';
          let isCorrect = false;

          if (submitted) {
            if (Array.isArray(q.correctAnswer)) {
              isCorrect =
                Array.isArray(userAns) &&
                userAns.length === q.correctAnswer.length &&
                userAns.every(val => (q.correctAnswer as number[]).includes(val));
            } else {
              isCorrect = userAns === q.correctAnswer;
            }
          }

          return (
            <div
              key={q.id}
              className={`p-5 rounded-xl border flex flex-col gap-4 transition-colors ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-950/20 border-emerald-900/60'
                    : 'bg-rose-950/20 border-rose-900/60'
                  : 'bg-slate-950/70 border-slate-800/80'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-300">
                    Q{qIdx + 1}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800/70 text-slate-400 border border-slate-700">
                    {q.type.toUpperCase()}
                  </span>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                      q.difficulty === 'Easy'
                        ? 'text-emerald-400'
                        : q.difficulty === 'Medium'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>

                {submitted && (
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                    {isCorrect ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct (+20 XP)
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Question Body */}
              <div className="text-slate-100 text-sm font-medium leading-relaxed whitespace-pre-line font-sans">
                {q.question}
              </div>

              {/* Code Snippet if present */}
              {q.codeSnippet && (
                <div className="bg-[#090d16] border border-slate-800 p-3 rounded-lg font-mono text-xs text-blue-200 overflow-x-auto">
                  <pre>{q.codeSnippet}</pre>
                </div>
              )}

              {/* Options */}
              {q.options && (
                <div className="flex flex-col gap-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = Array.isArray(userAns)
                      ? userAns.includes(optIdx)
                      : userAns === optIdx;

                    const isActualCorrect = Array.isArray(q.correctAnswer)
                      ? q.correctAnswer.includes(optIdx)
                      : q.correctAnswer === optIdx;

                    let optStyle =
                      'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (submitted) {
                      if (isActualCorrect) {
                        optStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                      } else if (isSelected && !isActualCorrect) {
                        optStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 line-through';
                      } else {
                        optStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50';
                      }
                    } else if (isSelected) {
                      optStyle = 'bg-blue-950/90 border-blue-500 text-blue-200 font-semibold shadow';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx, isMulti)}
                        disabled={submitted}
                        className={`text-left p-3 rounded-lg border text-xs sm:text-sm font-sans flex items-start gap-3 transition-all ${optStyle}`}
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

              {/* Deep Explanation Accordion / Banner after Submission */}
              {submitted && (
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg flex flex-col gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-400 font-mono font-bold uppercase tracking-wider text-[11px]">
                    Detailed Technical Explanation:
                  </div>
                  <p className="text-slate-200 leading-relaxed">{q.explanation}</p>

                  {/* Why distractors fail */}
                  {q.whyWrong && (
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800/80">
                      <span className="text-rose-400 font-semibold font-mono text-[11px]">
                        Why other choices fail:
                      </span>
                      {Object.entries(q.whyWrong).map(([key, reason]) => (
                        <div key={key} className="text-slate-400 text-xs pl-2 border-l border-slate-700">
                          <span className="font-mono text-slate-300">
                            Option {String.fromCharCode(65 + parseInt(key, 10))}:{' '}
                          </span>
                          {reason}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Common Trap */}
                  {q.commonTrap && (
                    <div className="bg-amber-950/30 border border-amber-900/50 p-2.5 rounded text-amber-200 flex items-start gap-2">
                      <span className="font-bold shrink-0">⚠️ Exam Trap:</span>
                      <span>{q.commonTrap}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission & Score Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!isAllAnswered}
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition ml-auto"
          >
            Submit Answers & Check Mastery
          </button>
        ) : (
          <div className="w-full flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-slate-300 text-sm font-medium">Your Score:</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {currentScore} / {questions.length} (
                {Math.round((currentScore / questions.length) * 100)}%)
              </span>
            </div>
            <button
              onClick={handleRetake}
              className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              Retake Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
