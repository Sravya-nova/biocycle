import { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar, type NavTab } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { AddWasteBatch } from './pages/AddWasteBatch';
import { RecommendationPage } from './pages/RecommendationPage';
import { ProcessMonitor } from './pages/ProcessMonitor';
import { ImpactCalculator } from './pages/ImpactCalculator';
import { BatchHistory } from './pages/BatchHistory';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedBatchId, setSelectedBatchId] = useState<string | undefined>(undefined);

  const handleSelectBatchForMonitor = (batchId: string) => {
    setSelectedBatchId(batchId);
    setActiveTab('process-monitor');
  };

  const handleSelectBatchForRecommendation = (batchId: string) => {
    setSelectedBatchId(batchId);
    setActiveTab('recommendation');
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#07130e] text-emerald-50 font-sans selection:bg-emerald-500 selection:text-emerald-950 flex flex-col">
        {/* Sticky Header Navbar */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'dashboard' && (
            <Dashboard 
              setActiveTab={setActiveTab} 
              onSelectBatchForMonitor={handleSelectBatchForMonitor}
            />
          )}

          {activeTab === 'add-batch' && (
            <AddWasteBatch 
              setActiveTab={setActiveTab} 
              onBatchAdded={(newBatch) => {
                setSelectedBatchId(newBatch.id);
              }}
            />
          )}

          {activeTab === 'recommendation' && (
            <RecommendationPage 
              selectedBatchId={selectedBatchId}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'process-monitor' && (
            <ProcessMonitor 
              selectedBatchId={selectedBatchId}
            />
          )}

          {activeTab === 'impact-calculator' && (
            <ImpactCalculator />
          )}

          {activeTab === 'batch-history' && (
            <BatchHistory 
              setActiveTab={setActiveTab}
              onSelectBatchForMonitor={handleSelectBatchForMonitor}
              onSelectBatchForRecommendation={handleSelectBatchForRecommendation}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="glass-panel mt-12 border-t border-emerald-900/40 py-6 text-center text-xs text-gray-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white text-sm">BioCycle</span>
              <span>• Plain Language Organic Waste Conversion Helper</span>
            </div>
            <p>© 2026 BioCycle. Designed for accessibility, multi-language support & offline use.</p>
          </div>
        </footer>
      </div>
    </LanguageProvider>
  );
}

export default App;
