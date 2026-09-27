import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import type { CodeImplementations } from '../types';

interface CodePanelProps {
  code: CodeImplementations;
  highlightedLine?: number;
}

export const CodePanel: React.FC<CodePanelProps> = ({ code, highlightedLine }) => {
  const [activeLang, setActiveLang] = useState<'cpp' | 'java' | 'python'>('cpp');
  const [copied, setCopied] = useState<boolean>(false);

  const currentCode = code[activeLang] || '';
  const lines = currentCode.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/90 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveLang('cpp')}
              className={`px-3 py-1 rounded-md transition ${
                activeLang === 'cpp'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              C++
            </button>
            <button
              onClick={() => setActiveLang('java')}
              className={`px-3 py-1 rounded-md transition ${
                activeLang === 'java'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Java
            </button>
            <button
              onClick={() => setActiveLang('python')}
              className={`px-3 py-1 rounded-md transition ${
                activeLang === 'python'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Python
            </button>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-md border border-slate-700 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      {/* Code Display with Line Numbers and Active Step Highlighting */}
      <div className="p-4 font-mono text-xs overflow-x-auto max-h-[380px] leading-relaxed select-text bg-[#090d16]">
        {lines.map((lineText, idx) => {
          const lineNum = idx + 1;
          const isHighlighted = highlightedLine === lineNum;

          return (
            <div
              key={idx}
              className={`flex items-start gap-4 px-2 py-0.5 rounded transition-colors duration-150 ${
                isHighlighted
                  ? 'bg-blue-950/80 border-l-4 border-blue-400 text-blue-100 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/30'
              }`}
            >
              <span
                className={`w-6 text-right select-none text-[11px] shrink-0 ${
                  isHighlighted ? 'text-blue-400 font-bold' : 'text-slate-600'
                }`}
              >
                {lineNum}
              </span>
              <pre className="overflow-visible font-mono">{lineText || ' '}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};
