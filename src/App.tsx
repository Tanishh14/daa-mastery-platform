import { useState, useEffect } from 'react';
import { ProgressProvider } from './context/ProgressContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { RevisionDashboard } from './components/views/RevisionDashboard';
import { TopicView } from './components/views/TopicView';
import { CheatSheetView } from './components/views/CheatSheetView';
import { GlossaryView } from './components/views/GlossaryView';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { FullMockTestModal } from './components/modals/FullMockTestModal';
import { VivaModeModal } from './components/modals/VivaModeModal';
import { StrategyWizardModal } from './components/modals/StrategyWizardModal';
import { AlgorithmComparisonModal } from './components/modals/AlgorithmComparisonModal';
import { getTopicBySlug, getAllTopics } from './data/unitsData';

function AppContent() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'topic' | 'cheatsheet' | 'glossary'>('dashboard');
  const [selectedTopicSlug, setSelectedTopicSlug] = useState<string>('merge-sort');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Modals
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [mockTestModalOpen, setMockTestModalOpen] = useState<boolean>(false);
  const [vivaModalOpen, setVivaModalOpen] = useState<boolean>(false);
  const [strategyModalOpen, setStrategyModalOpen] = useState<boolean>(false);
  const [comparisonModalOpen, setComparisonModalOpen] = useState<boolean>(false);

  // Keyboard shortcut Ctrl+K / Cmd+K for global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTopic = (slug: string) => {
    setSelectedTopicSlug(slug);
    setCurrentView('topic');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentTopic = getTopicBySlug(selectedTopicSlug) || getAllTopics()[0];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigateView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenMockTest={() => setMockTestModalOpen(true)}
        onOpenViva={() => setVivaModalOpen(true)}
        onOpenStrategy={() => setStrategyModalOpen(true)}
        onOpenComparison={() => setComparisonModalOpen(true)}
      />

      <div className="flex-1 flex w-full">
        {/* Unit Navigation Sidebar */}
        <Sidebar
          currentTopicSlug={currentView === 'topic' ? selectedTopicSlug : undefined}
          onSelectTopic={handleSelectTopic}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(prev => !prev)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentView === 'dashboard' && (
            <RevisionDashboard
              onSelectTopic={handleSelectTopic}
              onOpenMockTest={() => setMockTestModalOpen(true)}
              onOpenViva={() => setVivaModalOpen(true)}
              onOpenStrategy={() => setStrategyModalOpen(true)}
            />
          )}

          {currentView === 'topic' && (
            <TopicView topic={currentTopic} onSelectTopic={handleSelectTopic} />
          )}

          {currentView === 'cheatsheet' && <CheatSheetView />}

          {currentView === 'glossary' && (
            <GlossaryView onSelectTopic={handleSelectTopic} />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectTopic={handleSelectTopic}
      />

      <FullMockTestModal
        isOpen={mockTestModalOpen}
        onClose={() => setMockTestModalOpen(false)}
      />

      <VivaModeModal
        isOpen={vivaModalOpen}
        onClose={() => setVivaModalOpen(false)}
      />

      <StrategyWizardModal
        isOpen={strategyModalOpen}
        onClose={() => setStrategyModalOpen(false)}
        onNavigateToTopic={handleSelectTopic}
      />

      <AlgorithmComparisonModal
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}
