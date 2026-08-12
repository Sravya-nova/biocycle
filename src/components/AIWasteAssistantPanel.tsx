import React, { useState } from 'react';
import { analyzeWasteDescription, type AIWasteAssistantResult } from '../services/aiWasteAssistant';
import { 
  Bot, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Search,
  Zap,
  Info
} from 'lucide-react';

interface AIWasteAssistantPanelProps {
  onApplyPresetToRuleEngine?: (category: string, moisture: number, ph: number) => void;
}

export const AIWasteAssistantPanel: React.FC<AIWasteAssistantPanelProps> = ({ onApplyPresetToRuleEngine }) => {
  const [inputQuery, setInputQuery] = useState<string>('Wet banana peels mixed with vegetable scraps.');
  const [result, setResult] = useState<AIWasteAssistantResult | null>(() => analyzeWasteDescription('Wet banana peels mixed with vegetable scraps.'));

  const samplePresets = [
    'Wet banana peels mixed with vegetable scraps.',
    'Dry leaves, fallen pine needles, and straw bedding.',
    'Fresh horse manure mixed with damp wheat straw.',
    'Citrus lemon peels and sour espresso coffee grounds.',
    'Shredded cardboard boxes and paper packaging scraps.',
    'Random unknown industrial sludge'
  ];

  const handleAnalyze = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim()) return;
    const res = analyzeWasteDescription(inputQuery);
    setResult(res);
  };

  const handleSelectPreset = (presetText: string) => {
    setInputQuery(presetText);
    const res = analyzeWasteDescription(presetText);
    setResult(res);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 space-y-6 border border-emerald-600/40 bg-gradient-to-br from-emerald-950/70 via-[#0a1e14] to-[#09120e]">
      
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/50 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-950">
            <Bot className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-white">AI Waste Classification Assistant</h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                Natural Language Parser
              </span>
            </div>
            <p className="text-xs text-gray-300">Describe raw organic waste streams to analyze likely category, moisture tendency, and safety precautions</p>
          </div>
        </div>
      </div>

      {/* Input Form & Preset Chips */}
      <div className="space-y-3">
        <form onSubmit={handleAnalyze} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="e.g. Wet banana peels mixed with vegetable scraps..."
              className="w-full pl-10 pr-4 py-3 bg-[#06140d] border border-emerald-800/60 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500 shadow-inner"
            />
            <Search className="h-5 w-5 text-emerald-500 absolute left-3 top-3.5" />
          </div>
          <button
            type="submit"
            className="flex items-center space-x-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold rounded-xl shadow-lg transition-all text-sm shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>Analyze Waste</span>
          </button>
        </form>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-gray-400 flex items-center space-x-1">
            <Zap className="h-3 w-3 text-amber-400" />
            <span>Try Samples:</span>
          </span>
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#071910] hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/50 transition-all font-medium"
            >
              "{preset}"
            </button>
          ))}
        </div>
      </div>

      {/* MANDATORY BOUNDARY DISCLAIMER */}
      <div className="p-3.5 bg-amber-950/30 border border-amber-800/40 rounded-xl flex items-start space-x-3 text-amber-200 text-xs">
        <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Notice:</strong> This assistant provides initial classification guidance only. It does <strong>NOT</strong> claim laboratory identification, pathogen testing, fertilizer certification, or exact environmental impact. Final decision-support relies on the transparent rule-based recommendation engine below.
        </p>
      </div>

      {/* RESULT DISPLAY PANEL */}
      {result && (
        <div className="space-y-6 pt-2">
          
          {/* Uncertainty Warning Notice */}
          {result.isUncertain && (
            <div className="p-4 bg-red-950/50 border border-red-800/60 rounded-xl flex items-center space-x-3 text-red-200 text-xs">
              <AlertTriangle className="h-6 w-6 text-red-400 shrink-0" />
              <div>
                <strong className="text-red-300 text-sm block">Needs manual verification.</strong>
                <span>The text description provided is ambiguous or unrecognized. Physical laboratory sample verification and moisture testing are required.</span>
              </div>
            </div>
          )}

          {/* 5 REQUIRED RETURNED FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Likely Waste Category */}
            <div className="bg-[#06120d] p-4 rounded-xl border border-emerald-900/50 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">1. Likely Waste Category</span>
              <strong className="text-base text-white font-extrabold flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{result.likelyCategory}</span>
              </strong>
            </div>

            {/* 2. Approximate Moisture Tendency */}
            <div className="bg-[#06120d] p-4 rounded-xl border border-emerald-900/50 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">2. Approximate Moisture Tendency</span>
              <strong className="text-base text-blue-300 font-extrabold flex items-center space-x-2">
                <Info className="h-4 w-4 text-blue-400" />
                <span>{result.moistureTendency}</span>
              </strong>
            </div>

            {/* 3. Possible Biological Processes */}
            <div className="bg-[#06120d] p-4 rounded-xl border border-emerald-900/50 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">3. Possible Biological Processes</span>
              <div className="flex flex-wrap gap-1.5">
                {result.possibleProcesses.map((proc, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-md text-xs font-semibold">
                    {proc}
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Information Still Needed */}
            <div className="bg-[#06120d] p-4 rounded-xl border border-emerald-900/50 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">4. Information Still Needed</span>
              <ul className="space-y-1 text-xs text-gray-300">
                {result.informationStillNeeded.map((info, idx) => (
                  <li key={idx} className="flex items-center space-x-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* 5. Safety Warnings */}
          <div className="bg-[#06120d] p-4 rounded-xl border border-emerald-900/50 space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">5. Safety Warnings & Precautionary Directives</span>
            {result.safetyWarnings.length === 0 ? (
              <p className="text-xs text-emerald-400 font-medium">✓ No severe initial hazards detected in parsed description.</p>
            ) : (
              <div className="space-y-1.5">
                {result.safetyWarnings.map((warn, idx) => (
                  <div key={idx} className="p-2.5 bg-red-950/30 border border-red-900/50 rounded-lg text-xs text-red-200 font-medium flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{warn}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA: Transfer to Transparent Rule-Based Engine */}
          {onApplyPresetToRuleEngine && !result.isUncertain && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onApplyPresetToRuleEngine(
                  typeof result.likelyCategory === 'string' ? result.likelyCategory : 'Food Scraps',
                  result.suggestedMoisturePercent,
                  result.suggestedPh
                )}
                className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold rounded-xl shadow-lg transition-all text-xs"
              >
                <span>Apply Values to Transparent Rule Engine</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
