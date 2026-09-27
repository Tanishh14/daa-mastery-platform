import React, { useState } from 'react';
import type { AlgorithmTopic } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import { ArrayVisualizer } from '../visualizers/ArrayVisualizer';
import { SearchingVisualizer } from '../visualizers/SearchingVisualizer';
import { GraphVisualizer } from '../visualizers/GraphVisualizer';
import { DPTableVisualizer } from '../visualizers/DPTableVisualizer';
import { AsymptoticVisualizer } from '../visualizers/AsymptoticVisualizer';
import { MasterTheoremSolver } from '../visualizers/MasterTheoremSolver';
import { BacktrackingVisualizer } from '../visualizers/BacktrackingVisualizer';
import { SudokuVisualizer } from '../visualizers/SudokuVisualizer';
import { FlowNetworkVisualizer } from '../visualizers/FlowNetworkVisualizer';
import { NPExplorer } from '../visualizers/NPExplorer';
import { AdversaryLowerBoundVisualizer } from '../visualizers/AdversaryLowerBoundVisualizer';
import { CodePanel } from '../CodePanel';
import { ComplexityCard } from '../ComplexityCard';
import { ProofCard } from '../ProofCard';
import { TopicQuiz } from '../TopicQuiz';
import {
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Code2,
  Gauge,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  FileEdit
} from 'lucide-react';
import { getNextTopic, getPrevTopic } from '../../data/unitsData';

interface TopicViewProps {
  topic: AlgorithmTopic;
  onSelectTopic: (slug: string) => void;
}

export const TopicView: React.FC<TopicViewProps> = ({ topic, onSelectTopic }) => {
  const { progress, markTopicCompleted, toggleTopicBookmark, saveTopicNote } = useProgress();

  const [activeTab, setActiveTab] = useState<'visualize' | 'code' | 'complexity' | 'proof' | 'quiz'>('visualize');
  const [highlightedCodeLine, setHighlightedCodeLine] = useState<number | undefined>(undefined);
  const [userNote, setUserNote] = useState<string>(progress.notes[topic.id] || '');
  const [showNoteEditor, setShowNoteEditor] = useState<boolean>(false);

  const isCompleted = progress.completedTopics.includes(topic.id);
  const isBookmarked = progress.bookmarkedTopics.includes(topic.id);

  const prevTopic = getPrevTopic(topic.slug);
  const nextTopic = getNextTopic(topic.slug);

  const handleStepChange = (_stepIdx: number, line?: number) => {
    setHighlightedCodeLine(line);
  };

  const handleSaveNote = () => {
    saveTopicNote(topic.id, userNote);
    setShowNoteEditor(false);
  };

  // Render the appropriate visualizer component
  const renderVisualizer = () => {
    switch (topic.visualizerType) {
      case 'sorting':
        return <ArrayVisualizer initialArray={topic.defaultInput as number[]} algorithmType={topic.slug} onStepChange={handleStepChange} />;
      case 'searching':
        return <SearchingVisualizer onStepChange={handleStepChange} />;
      case 'graph':
        return (
          <GraphVisualizer
            algorithmType={
              topic.slug === 'topological-sort'
                ? 'topological-sort'
                : topic.slug === 'dijkstra'
                ? 'dijkstra'
                : topic.slug === 'kruskal-prim-mst'
                ? 'kruskal'
                : 'bfs'
            }
            onStepChange={handleStepChange}
          />
        );
      case 'dp':
        return (
          <DPTableVisualizer
            algorithmType={
              topic.slug === 'matrix-chain-multiplication' ? 'mcm' : 'lcs'
            }
            onStepChange={handleStepChange}
          />
        );
      case 'asymptotic':
        return <AsymptoticVisualizer />;
      case 'master-theorem':
        return <MasterTheoremSolver />;
      case 'backtracking':
        return <BacktrackingVisualizer />;
      case 'sudoku':
        return <SudokuVisualizer />;
      case 'network-flow':
        return <FlowNetworkVisualizer />;
      case 'np-reduction':
        return <NPExplorer />;
      case 'adversary':
        return <AdversaryLowerBoundVisualizer />;
      default:
        return <ArrayVisualizer algorithmType="merge-sort" onStepChange={handleStepChange} />;
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-16">
      {/* Breadcrumb & Topic Meta Header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>DAA</span>
            <span>&gt;</span>
            <span className="text-blue-400">Unit {topic.unitNumber}</span>
            <span>&gt;</span>
            <span>{topic.category}</span>
            <span>&gt;</span>
            <span className="text-slate-200 font-semibold">{topic.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleTopicBookmark(topic.id)}
              className={`p-2 rounded-lg border transition ${
                isBookmarked
                  ? 'bg-amber-950 border-amber-600 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={() => markTopicCompleted(topic.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-sans font-medium transition ${
                isCompleted
                  ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Mastered' : 'Mark as Mastered'}</span>
            </button>
          </div>
        </div>

        {/* Title and Short Description */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {topic.title}
            </h1>
            <span className="text-xs font-mono text-purple-400 bg-purple-950/80 border border-purple-800/80 px-2.5 py-0.5 rounded">
              {topic.importance}
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {topic.shortDesc}
          </p>
        </div>
      </div>

      {/* 1. What is it? (Simple & Formal Explanations) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Simple Explanation */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-2 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Intuitive Concept (Simple)
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {topic.simpleExplanation}
          </p>
        </div>

        {/* Formal Definition */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-2 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> University Formal Definition
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
            {topic.formalDefinition}
          </p>
        </div>
      </div>

      {/* 2. Core Idea Steps */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3 shadow-lg">
        <h3 className="font-bold text-slate-100 text-sm tracking-wide uppercase font-mono">
          Core Algorithmic Steps
        </h3>
        <div className="flex flex-col gap-2">
          {topic.coreIdeaSteps.map((stepText, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
              <span className="w-5 h-5 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{stepText}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mode Navigation Tabs: VISUALIZE, CODE, COMPLEXITY, PROOF, QUIZ */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setActiveTab('visualize')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-bold transition ${
            activeTab === 'visualize'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Interactive Visualizer
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-bold transition ${
            activeTab === 'code'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Code2 className="w-4 h-4" /> Code Implementation
        </button>
        <button
          onClick={() => setActiveTab('complexity')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-bold transition ${
            activeTab === 'complexity'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Gauge className="w-4 h-4" /> Complexity Analysis
        </button>
        <button
          onClick={() => setActiveTab('proof')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-bold transition ${
            activeTab === 'proof'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Correctness Proof
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-bold transition ${
            activeTab === 'quiz'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Practice Quiz ({topic.questions.length})
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'visualize' && (
          <div className="flex flex-col gap-6">
            {renderVisualizer()}
            {/* Synchronized Code Panel right beneath the visualizer */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                Synchronized Code State Engine
              </span>
              <CodePanel code={topic.code} highlightedLine={highlightedCodeLine} />
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <CodePanel code={topic.code} highlightedLine={highlightedCodeLine} />
        )}

        {activeTab === 'complexity' && (
          <ComplexityCard complexity={topic.complexity} />
        )}

        {activeTab === 'proof' && (
          <ProofCard proof={topic.proof} />
        )}

        {activeTab === 'quiz' && (
          <TopicQuiz
            topicId={topic.id}
            topicTitle={topic.title}
            questions={topic.questions}
          />
        )}
      </div>

      {/* Dry Run Interactive Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
        <h3 className="font-bold text-slate-100 text-sm tracking-wide uppercase font-mono">
          Dry Run Walkthrough
        </h3>
        <div className="flex flex-wrap items-center justify-between text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300">
          <div>
            <span className="text-amber-400 font-bold">Sample Input: </span>
            {topic.dryRunExample.input}
          </div>
          <div>
            <span className="text-emerald-400 font-bold">Output: </span>
            {topic.dryRunExample.output}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono">
                <th className="p-3 w-16">Step</th>
                <th className="p-3">State / Variables</th>
                <th className="p-3">Algorithmic Operation & Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {topic.dryRunExample.steps.map((st, idx) => (
                <tr key={idx} className="hover:bg-slate-950/40 transition">
                  <td className="p-3 font-mono text-blue-400 font-bold">{st.iteration}</td>
                  <td className="p-3 font-mono text-amber-300 text-xs">{st.state}</td>
                  <td className="p-3 text-slate-200">{st.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exam Essentials (Key Formulas, Common Traps, Viva Q&A) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide uppercase font-mono">
            Exam Essentials & High-Yield Viva Questions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
              Key Formulas to Memorize:
            </span>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 font-mono">
              {topic.examEssentials.keyFormulas.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase">
              Common Exam Traps:
            </span>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
              {topic.examEssentials.commonTraps.map((tr, idx) => (
                <li key={idx}>{tr}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase">
            Oral Viva Questions for this Topic:
          </span>
          <div className="space-y-3">
            {topic.examEssentials.vivaQuestions.map((v, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-slate-200">
                  Q: {v.q}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  A: {v.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Personal Notes for Topic */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-blue-400" />
            <h4 className="font-bold text-slate-100 text-xs font-mono uppercase">
              Personal Study Notes & Reflections
            </h4>
          </div>
          <button
            onClick={() => setShowNoteEditor(!showNoteEditor)}
            className="text-xs text-blue-400 hover:text-blue-300 font-mono"
          >
            {showNoteEditor ? 'Cancel' : userNote ? 'Edit Note' : '+ Add Note'}
          </button>
        </div>

        {showNoteEditor ? (
          <div className="flex flex-col gap-2.5">
            <textarea
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="Write your study notes, personal mnemonics, or tricky cases..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              onClick={handleSaveNote}
              className="self-end px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition"
            >
              Save Note
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            {userNote || 'No notes added yet for this topic. Click "Add Note" to write personal reminders.'}
          </p>
        )}
      </div>

      {/* Footer Navigation (Previous / Next Topic) */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        {prevTopic ? (
          <button
            onClick={() => onSelectTopic(prevTopic.slug)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-500 font-mono">Previous Topic</span>
              <span>{prevTopic.title}</span>
            </div>
          </button>
        ) : (
          <div></div>
        )}

        {nextTopic ? (
          <button
            onClick={() => onSelectTopic(nextTopic.slug)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-lg shadow-blue-600/30"
          >
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-blue-200 font-mono">Next Topic</span>
              <span>{nextTopic.title}</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};
