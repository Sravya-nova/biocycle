import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import type { NavTab } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { AddWasteBatch } from './pages/AddWasteBatch';
import { RecommendationPage } from './pages/RecommendationPage';
import { ProcessMonitor } from './pages/ProcessMonitor';
import { ImpactCalculator } from './pages/ImpactCalculator';
import { BatchHistory } from './pages/BatchHistory';
import { initStorage } from './services/storageService';
import { Sprout, Leaf, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedBatchId, setSelectedBatchId] = useState<string | undefined>(undefined);
  const [dataRefreshKey, setDataRefreshKey] = useState<number>(0);

  useEffect(() => {
    initStorage();
  }, []);

  const handleResetData = () => {
    setDataRefreshKey(prev => prev + 1);
  };

  const handleSelectBatchForRecommendation = (batchId: string) => {
    setSelectedBatchId(batchId);
    setActiveTab('recommendation');
  };

  const handleSelectBatchForMonitor = (batchId: string) => {
    setSelectedBatchId(batchId);
    setActiveTab('process-monitor');
  };

  return (
    <div key={dataRefreshKey} className="min-h-screen bg-[#09120e] text-emerald-50 flex flex-col justify-between selection:bg-emerald-500 selection:text-emerald-950">
      
      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {activeTab === 'dashboard' && (
          <Dashboard 
            setActiveTab={setActiveTab} 
            onSelectBatchForMonitor={handleSelectBatchForMonitor}
          />
        )}

        {activeTab === 'add-batch' && (
          <AddWasteBatch 
            setActiveTab={setActiveTab} 
            onBatchAdded={(batch) => setSelectedBatchId(batch.id)}
          />
        )}

        {activeTab === 'recommendation' && (
          <RecommendationPage 
            setActiveTab={setActiveTab} 
            selectedBatchId={selectedBatchId}
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
            onSelectBatchForRecommendation={(batchId) => handleSelectBatchForRecommendation(batchId)}
            onSelectBatchForMonitor={handleSelectBatchForMonitor}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#060e0a] border-t border-emerald-900/40 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-white">BioCycle Platform</span>
              <p className="text-[11px] text-gray-500">Biological Waste Conversion & Sustainability Intelligence</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-emerald-400/80">
            <span className="flex items-center space-x-1">
              <Leaf className="h-3.5 w-3.5 text-emerald-400" />
              <span>Composting</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Sprout className="h-3.5 w-3.5 text-emerald-400" />
              <span>Vermicomposting</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Anaerobic Digestion</span>
            </span>
          </div>

          <div className="text-right text-[11px] text-gray-500">
            <span>Offline localStorage Enabled • Local Runtime</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
