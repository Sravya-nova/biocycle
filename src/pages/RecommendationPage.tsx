import React, { useState, useEffect } from 'react';
import type { WasteCategory, WasteBatch, RecommendationResult, WasteSource } from '../types/biocycle';
import { getBatches } from '../services/storageService';
import { calculateRecommendation } from '../services/recommendationEngine';
import { AIWasteAssistantPanel } from '../components/AIWasteAssistantPanel';
import type { NavTab } from '../components/Navbar';
import { 
  Sparkles, 
  ShieldAlert, 
  Clock,
  Layers,
  FileCheck
} from 'lucide-react';

interface RecommendationPageProps {
  selectedBatchId?: string;
  setActiveTab?: (tab: NavTab) => void;
}

export const RecommendationPage: React.FC<RecommendationPageProps> = ({ selectedBatchId }) => {
  const [batches, setBatches] = useState<WasteBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<WasteBatch | null>(null);

  // Manual Custom Simulation Inputs State
  const [simCategory, setSimCategory] = useState<WasteCategory>('Food Scraps');
  const [simWeightKg, setSimWeightKg] = useState<number>(100);
  const [simMoisture, setSimMoisture] = useState<number>(72);
  const [simPh, setSimPh] = useState<number>(6.2);
  const [simSource, setSimSource] = useState<WasteSource>('Commercial Restaurant / Dining');

  const [activeRecommendation, setActiveRecommendation] = useState<RecommendationResult | null>(null);

  useEffect(() => {
    const loadedBatches = getBatches();
    setBatches(loadedBatches);

    if (loadedBatches.length > 0) {
      const initial = selectedBatchId 
        ? loadedBatches.find(b => b.id === selectedBatchId) || loadedBatches[0]
        : loadedBatches[0];
      setSelectedBatch(initial);
      setSimCategory(initial.category);
      setSimWeightKg(initial.weightKg);
      setSimMoisture(initial.moisturePercent);
      setSimPh(initial.initialPh);
      setSimSource(initial.wasteSource);

      const rec = calculateRecommendation(initial);
      setActiveRecommendation(rec);
    }
  }, [selectedBatchId]);

  const handleBatchSelect = (batchId: string) => {
    const b = batches.find(x => x.id === batchId);
    if (b) {
      setSelectedBatch(b);
      setSimCategory(b.category);
      setSimWeightKg(b.weightKg);
      setSimMoisture(b.moisturePercent);
      setSimPh(b.initialPh);
      setSimSource(b.wasteSource);
      setActiveRecommendation(calculateRecommendation(b));
    }
  };

  const handleReevaluate = () => {
    const tempBatch: WasteBatch = {
      id: selectedBatch ? selectedBatch.id : 'sim_batch',
      name: selectedBatch ? selectedBatch.name : 'Custom Simulated Stream',
      category: simCategory,
      weightKg: Number(simWeightKg),
      moisturePercent: Number(simMoisture),
      cnRatio: 20,
      initialPh: Number(simPh),
      wasteSource: simSource,
      location: 'Custom Simulation',
      status: 'Processing',
      processStage: 'Active monitoring',
      dateAdded: new Date().toISOString(),
      hasContaminants: false
    };

    setActiveRecommendation(calculateRecommendation(tempBatch));
  };

  const handleApplyPresetToRuleEngine = (categoryName: string, moisture: number, ph: number) => {
    setSimCategory(categoryName as WasteCategory);
    setSimMoisture(moisture);
    setSimPh(ph);

    const tempBatch: WasteBatch = {
      id: selectedBatch ? selectedBatch.id : 'sim_batch',
      name: `AI Parsed ${categoryName} Stream`,
      category: categoryName as WasteCategory,
      weightKg: Number(simWeightKg),
      moisturePercent: Number(moisture),
      cnRatio: 20,
      initialPh: Number(ph),
      wasteSource: simSource,
      location: 'AI Transfer Simulation',
      status: 'Processing',
      processStage: 'Active monitoring',
      dateAdded: new Date().toISOString(),
      hasContaminants: false
    };

    setActiveRecommendation(calculateRecommendation(tempBatch));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-emerald-950/90 via-[#0d2319] to-[#09120e] border border-emerald-700/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Biotechnology Recommendation Engine</h1>
              <p className="text-xs text-gray-300">Transparent rule-based biological process optimization and AI classification assistant</p>
            </div>
          </div>

          {/* Select Saved Batch Dropdown */}
          <div className="min-w-[240px]">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Select Batch to Evaluate</label>
            <select
              value={selectedBatch?.id || ''}
              onChange={(e) => handleBatchSelect(e.target.value)}
              className="w-full px-3 py-2 bg-[#06120d] border border-emerald-700/50 rounded-xl text-emerald-300 font-semibold text-xs focus:outline-none focus:border-emerald-500"
            >
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.weightKg} kg, pH {b.initialPh})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 1. AI WASTE ASSISTANT PANEL */}
      <AIWasteAssistantPanel onApplyPresetToRuleEngine={handleApplyPresetToRuleEngine} />

      {/* 2. TRANSPARENT RULE-BASED ENGINE SECTION */}
      <div className="space-y-6">
        
        {/* Interactive Parameter Tuner Bar */}
        <div className="glass-panel p-6 border border-emerald-800/40 bg-[#08150e] space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-900/50 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Layers className="h-5 w-5 text-emerald-400" />
              <span>Rule Engine Input Parameters</span>
            </h3>
            <button
              onClick={handleReevaluate}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-lg text-xs transition-all"
            >
              Re-run Rule Matrix
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs">
            <div>
              <label className="text-gray-400 font-bold block mb-1">Waste Type</label>
              <select
                value={simCategory}
                onChange={(e) => setSimCategory(e.target.value as WasteCategory)}
                className="w-full px-2.5 py-2 bg-[#06120d] border border-emerald-800 rounded-lg text-white font-semibold"
              >
                <option value="Food Scraps">Food Scraps</option>
                <option value="Yard Trimmings & Leaves">Yard Trimmings & Leaves</option>
                <option value="Animal Manure">Animal Manure</option>
                <option value="Coffee Grounds">Coffee Grounds</option>
                <option value="Agricultural Residue">Agricultural Residue</option>
                <option value="Sawdust & Wood Chips">Sawdust & Wood Chips</option>
                <option value="Cardboard & Paper Shreds">Cardboard & Paper Shreds</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 font-bold block mb-1">Quantity (kg)</label>
              <input
                type="number"
                value={simWeightKg}
                onChange={(e) => setSimWeightKg(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-[#06120d] border border-emerald-800 rounded-lg text-white font-semibold"
              />
            </div>

            <div>
              <label className="text-gray-400 font-bold block mb-1">Moisture: <span className="text-blue-400">{simMoisture}%</span></label>
              <input
                type="range"
                min="10"
                max="90"
                value={simMoisture}
                onChange={(e) => setSimMoisture(Number(e.target.value))}
                className="w-full accent-blue-500 mt-2"
              />
            </div>

            <div>
              <label className="text-gray-400 font-bold block mb-1">Initial pH: <span className={simPh < 5 ? 'text-red-400 font-bold' : 'text-purple-300'}>{simPh}</span></label>
              <input
                type="range"
                min="3.0"
                max="9.5"
                step="0.1"
                value={simPh}
                onChange={(e) => setSimPh(Number(e.target.value))}
                className="w-full accent-purple-500 mt-2"
              />
            </div>

            <div>
              <label className="text-gray-400 font-bold block mb-1">Source</label>
              <select
                value={simSource}
                onChange={(e) => setSimSource(e.target.value as WasteSource)}
                className="w-full px-2.5 py-2 bg-[#06120d] border border-emerald-800 rounded-lg text-white font-semibold truncate"
              >
                <option value="Household Kitchen">Household Kitchen</option>
                <option value="Commercial Restaurant / Dining">Commercial Restaurant</option>
                <option value="Farm & Livestock">Farm & Livestock</option>
                <option value="Agricultural Processing">Agricultural Processing</option>
                <option value="Municipal Yard Waste">Municipal Yard Waste</option>
              </select>
            </div>
          </div>
        </div>

        {/* RECOMMENDATION HERO RESULT */}
        {activeRecommendation && (
          <div className="space-y-6">
            
            <div className="glass-panel p-6 sm:p-8 space-y-6 border border-emerald-500/50 bg-gradient-to-br from-emerald-950/60 via-[#0b1e15] to-[#09120e]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-800/50 pb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">Primary Recommended Biotechnology</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {activeRecommendation.recommendedMethod}
                  </h2>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3.5 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-600 rounded-full font-extrabold text-xs">
                    Match Confidence: {activeRecommendation.confidenceScore}%
                  </span>
                  <span className="px-3.5 py-1.5 bg-blue-950 text-blue-300 border border-blue-600 rounded-full font-extrabold text-xs flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Est. {activeRecommendation.estimatedDurationDays} Days</span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-200 leading-relaxed font-medium">
                {activeRecommendation.primaryReason}
              </p>

              {/* Active Process Warnings */}
              {activeRecommendation.warnings.length > 0 && (
                <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl space-y-2 text-xs text-red-200">
                  <div className="flex items-center space-x-2 font-bold text-red-400 text-sm">
                    <ShieldAlert className="h-5 w-5" />
                    <span>Active Process Warnings Detected ({activeRecommendation.warnings.length}):</span>
                  </div>
                  {activeRecommendation.warnings.map((w, idx) => (
                    <p key={idx} className="pl-7">• {w}</p>
                  ))}
                </div>
              )}

              {/* Immediate Suggested Actions */}
              {activeRecommendation.suggestedActions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Suggested Corrective Actions:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {activeRecommendation.suggestedActions.map((act, idx) => (
                      <div key={idx} className="p-3 bg-[#06140e] rounded-xl border border-emerald-900/60 text-xs text-gray-200 font-medium">
                        ➜ {act}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Estimated Yield Output Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-[#06120d] p-4 rounded-xl border border-emerald-900/50">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Compost Yield</span>
                  <strong className="text-emerald-400 text-xl">{activeRecommendation.expectedYield.compostKg} kg</strong>
                </div>
                <div className="bg-[#06120d] p-4 rounded-xl border border-emerald-900/50">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Biogas Yield</span>
                  <strong className="text-amber-400 text-xl">{activeRecommendation.expectedYield.biogasM3} m³</strong>
                </div>
                <div className="bg-[#06120d] p-4 rounded-xl border border-emerald-900/50">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Biofertilizer</span>
                  <strong className="text-blue-400 text-xl">{activeRecommendation.expectedYield.biofertilizerLiters} L</strong>
                </div>
                <div className="bg-[#06120d] p-4 rounded-xl border border-emerald-900/50">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">CO₂e Benefit</span>
                  <strong className="text-mint-400 text-xl text-emerald-300">{activeRecommendation.expectedYield.co2eSavedKg} kg</strong>
                </div>
              </div>

            </div>

            {/* TRANSPARENT BIOTECHNOLOGY RULE ENGINE LOGIC INSPECTOR */}
            <div className="glass-panel p-6 border border-emerald-800/40 space-y-6">
              <div className="border-b border-emerald-900/50 pb-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileCheck className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Transparent Rule Engine Logic Inspector</h3>
                </div>
                <span className="text-xs text-gray-400">All 6 biological rules evaluated explicitly</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeRecommendation.ruleEvaluations.map(rule => (
                  <div 
                    key={rule.ruleId}
                    className={`p-4 rounded-xl border transition-all ${
                      rule.isMatched 
                        ? 'bg-[#081b12] border-emerald-500/60 shadow-lg shadow-emerald-950/40' 
                        : 'bg-[#05110b]/60 border-emerald-900/30 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold text-white">{rule.ruleTitle}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rule.isMatched ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' : 'bg-gray-900 text-gray-400 border border-gray-800'
                      }`}>
                        {rule.isMatched ? 'MATCHED (TRUE)' : 'PASSED (FALSE)'}
                      </span>
                    </div>

                    <div className="p-2 bg-[#030906] rounded text-[10px] text-emerald-400 font-mono mb-2">
                      Condition: {rule.conditionText}
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed font-medium">
                      {rule.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
