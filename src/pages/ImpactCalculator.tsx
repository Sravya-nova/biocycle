import React, { useState, useEffect } from 'react';
import { getBatches } from '../services/storageService';
import type { WasteBatch } from '../types/biocycle';
import { StatCard } from '../components/StatCard';
import { 
  Calculator, 
  CloudRain, 
  Leaf, 
  Scale, 
  Sliders, 
  Download, 
  ShieldAlert, 
  Info,
  Layers,
  Sprout
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

export const ImpactCalculator: React.FC = () => {
  const [batches, setBatches] = useState<WasteBatch[]>([]);

  // Configurable Demonstration Assumptions
  const [outputFactor, setOutputFactor] = useState<number>(0.48); // 0.48 kg output per kg waste
  const [replacementFactor, setReplacementFactor] = useState<number>(0.35); // 0.35 kg fertilizer replaced per kg output
  const [carbonFactor, setCarbonFactor] = useState<number>(1.85); // 1.85 kg CO2e benefit per kg waste diverted

  useEffect(() => {
    setBatches(getBatches());
  }, []);

  // Per-Batch Calculations using user-specified formulas:
  // - waste diverted = successfully processed waste quantity (kg)
  // - estimated output = waste quantity × output factor
  // - fertilizer replacement = estimated output × replacement factor
  // - carbon benefit = waste diverted × demonstration carbon factor
  const batchImpacts = batches.map(b => {
    const wasteDivertedKg = b.weightKg;
    const estimatedOutputKg = Number((b.weightKg * outputFactor).toFixed(1));
    const fertilizerReplacementKg = Number((estimatedOutputKg * replacementFactor).toFixed(1));
    const carbonBenefitKgCO2e = Number((wasteDivertedKg * carbonFactor).toFixed(1));

    return {
      batchId: b.id,
      batchName: b.name,
      category: b.category,
      weightKg: b.weightKg,
      treatmentMethod: b.treatmentMethod || 'Unassigned',
      status: b.status,
      wasteDivertedKg,
      estimatedOutputKg,
      fertilizerReplacementKg,
      carbonBenefitKgCO2e
    };
  });

  // Aggregated Totals
  const totalWasteDivertedKg = batchImpacts.reduce((acc, b) => acc + b.wasteDivertedKg, 0);
  const totalEstimatedOutputKg = batchImpacts.reduce((acc, b) => acc + b.estimatedOutputKg, 0);
  const totalFertilizerReplacementKg = batchImpacts.reduce((acc, b) => acc + b.fertilizerReplacementKg, 0);
  const totalCarbonBenefitKgCO2e = batchImpacts.reduce((acc, b) => acc + b.carbonBenefitKgCO2e, 0);

  // Chart Data for Per-Batch Comparison
  const chartData = batchImpacts.map(b => ({
    name: b.batchName.length > 15 ? b.batchName.substring(0, 15) + '...' : b.batchName,
    'Waste Diverted (kg)': b.wasteDivertedKg,
    'Est. Output (kg)': b.estimatedOutputKg,
    'Est. Fertilizer Replaced (kg)': b.fertilizerReplacementKg,
    'Est. Carbon Benefit (kg CO₂e)': b.carbonBenefitKgCO2e
  }));

  const handleDownloadReport = () => {
    const reportText = `
==================================================
BIOCYCLE EDUCATIONAL IMPACT ESTIMATES REPORT
==================================================
Generated Date: ${new Date().toLocaleDateString()}

DEMONSTRATION ASSUMPTIONS USED:
- Output Factor: ${outputFactor} (kg bio-output per kg waste)
- Fertilizer Replacement Factor: ${replacementFactor} (kg NPK replaced per kg bio-output)
- Demonstration Carbon Factor: ${carbonFactor} (kg CO2e benefit per kg waste diverted)

CUMULATIVE ESTIMATED RESULTS:
- Total Estimated Waste Diverted: ${totalWasteDivertedKg.toLocaleString()} kg
- Total Estimated Output (Compost/Biofertilizer): ${totalEstimatedOutputKg.toLocaleString()} kg
- Total Estimated Synthetic Fertilizer Replacement: ${totalFertilizerReplacementKg.toLocaleString()} kg NPK
- Total Estimated Carbon Benefit: ${totalCarbonBenefitKgCO2e.toLocaleString()} kg CO2e

PER-BATCH ESTIMATED BREAKDOWN:
${batchImpacts.map(b => `
• Batch: ${b.batchName} (${b.category})
  - Waste Diverted: ${b.wasteDivertedKg} kg
  - Est. Output: ${b.estimatedOutputKg} kg
  - Est. Fertilizer Replacement: ${b.fertilizerReplacementKg} kg NPK
  - Est. Carbon Benefit: ${b.carbonBenefitKgCO2e} kg CO2e
`).join('')}

DISCLAIMER:
"These values are educational estimates and must be replaced with locally validated laboratory or life-cycle data."

==================================================
BioCycle - Biological Treatment & Resource Recovery
==================================================
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BioCycle_Educational_Impact_Estimates_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-emerald-950/90 via-[#0a2318] to-[#09120e] border border-emerald-700/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Calculator className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Impact & Sustainability Calculator</h1>
              <p className="text-xs text-gray-300">Educational estimation models for waste diversion, bio-yields, fertilizer replacement, and carbon benefit</p>
            </div>
          </div>

          <button
            onClick={handleDownloadReport}
            className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl shadow-lg transition-all text-sm"
          >
            <Download className="h-4 w-4" />
            <span>Export Educational Report</span>
          </button>
        </div>
      </div>

      {/* MANDATORY DISCLAIMER BANNER */}
      <div className="glass-panel p-5 border border-amber-600/60 bg-amber-950/40 flex items-start space-x-3 text-amber-200">
        <ShieldAlert className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm uppercase tracking-wider text-amber-300">Methodological Disclaimer</h4>
          <p className="text-xs leading-relaxed font-semibold italic text-amber-100">
            “These values are educational estimates and must be replaced with locally validated laboratory or life-cycle data.”
          </p>
        </div>
      </div>

      {/* Cumulative Aggregate Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Est. Waste Diverted"
          value={totalWasteDivertedKg.toLocaleString()}
          unit="kg"
          subtitle="Processed waste quantity"
          icon={Scale}
          accentColor="emerald"
        />
        <StatCard
          title="Est. Output Yield"
          value={totalEstimatedOutputKg.toLocaleString()}
          unit="kg / L"
          subtitle="Compost & biofertilizer"
          icon={Sprout}
          accentColor="mint"
        />
        <StatCard
          title="Est. Fertilizer Replacement"
          value={totalFertilizerReplacementKg.toLocaleString()}
          unit="kg NPK"
          subtitle="Synthetic fertilizer offset"
          icon={Leaf}
          accentColor="amber"
        />
        <StatCard
          title="Est. Carbon Benefit"
          value={totalCarbonBenefitKgCO2e.toLocaleString()}
          unit="kg CO₂e"
          subtitle="GHG mitigation benefit"
          icon={CloudRain}
          accentColor="blue"
        />
      </div>

      {/* 2-COLUMN LAYOUT: ASSUMPTIONS CONTROLS (LEFT) NEXT TO CALCULATIONS & TABLE (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Demonstration Assumptions Controls */}
        <div className="glass-panel p-6 border border-emerald-800/40 space-y-6">
          <div className="border-b border-emerald-900/50 pb-3 flex items-center space-x-2">
            <Sliders className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Demonstration Assumptions</h3>
              <p className="text-xs text-gray-400">Configurable factors used for educational calculations</p>
            </div>
          </div>

          {/* 1. Output Factor */}
          <div className="space-y-2 bg-[#06120d] p-4 rounded-xl border border-emerald-900/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-300">Output Factor</span>
              <span className="font-extrabold text-emerald-400">{outputFactor} kg / kg</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.01"
              value={outputFactor}
              onChange={(e) => setOutputFactor(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="p-2 bg-[#030906] rounded text-[10px] text-gray-400 font-mono">
              Formula: estimated output = waste quantity × {outputFactor}
            </div>
          </div>

          {/* 2. Replacement Factor */}
          <div className="space-y-2 bg-[#06120d] p-4 rounded-xl border border-emerald-900/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-300">Fertilizer Replacement Factor</span>
              <span className="font-extrabold text-amber-400">{replacementFactor} NPK / kg</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.0"
              step="0.01"
              value={replacementFactor}
              onChange={(e) => setReplacementFactor(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="p-2 bg-[#030906] rounded text-[10px] text-gray-400 font-mono">
              Formula: fertilizer replacement = estimated output × {replacementFactor}
            </div>
          </div>

          {/* 3. Demonstration Carbon Factor */}
          <div className="space-y-2 bg-[#06120d] p-4 rounded-xl border border-emerald-900/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-300">Demonstration Carbon Factor</span>
              <span className="font-extrabold text-blue-400">{carbonFactor} kg CO₂e / kg</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.05"
              value={carbonFactor}
              onChange={(e) => setCarbonFactor(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="p-2 bg-[#030906] rounded text-[10px] text-gray-400 font-mono">
              Formula: carbon benefit = waste diverted × {carbonFactor}
            </div>
          </div>

          <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-800/40 text-[11px] text-emerald-300 space-y-1">
            <div className="flex items-center space-x-1 font-bold">
              <Info className="h-3.5 w-3.5" />
              <span>Assumptions Reference:</span>
            </div>
            <p className="text-[10px] text-gray-400">
              Assumptions reflect standard aerobic composting & vermicomposting mass-balance conversions (45-55% organic solid conversion).
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: Comparative Chart & Per-Batch Impact Table */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Visual Chart */}
          <div className="glass-panel p-6 border border-emerald-800/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Estimated Impact Breakdown by Batch</h3>
                <p className="text-xs text-gray-400">Comparing estimated waste diverted, bio-output, fertilizer replacement, and carbon benefit</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#09140f', borderColor: '#10b981', color: '#fff', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
                  <Bar dataKey="Waste Diverted (kg)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Est. Output (kg)" fill="#34d399" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Est. Fertilizer Replaced (kg)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Est. Carbon Benefit (kg CO₂e)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PER-BATCH DETAILED TABLE */}
          <div className="glass-panel p-6 border border-emerald-800/40 space-y-4">
            <div className="flex items-center space-x-2 border-b border-emerald-900/50 pb-3">
              <Layers className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Per-Batch Educational Impact Estimates</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300 border-collapse">
                <thead>
                  <tr className="bg-[#06120d] border-b border-emerald-900/50 text-[10px] uppercase font-bold text-gray-400">
                    <th className="p-3">Batch Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Waste Diverted (kg)</th>
                    <th className="p-3 text-right">Est. Output (kg/L)</th>
                    <th className="p-3 text-right">Est. Fertilizer Replaced (kg NPK)</th>
                    <th className="p-3 text-right">Est. Carbon Benefit (kg CO₂e)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/30">
                  {batchImpacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-400">
                        No waste batches logged yet.
                      </td>
                    </tr>
                  ) : (
                    batchImpacts.map(b => (
                      <tr key={b.batchId} className="hover:bg-emerald-950/20">
                        <td className="p-3 font-bold text-white">
                          <div>{b.batchName}</div>
                          <div className="text-[10px] text-emerald-400 font-normal">{b.treatmentMethod}</div>
                        </td>
                        <td className="p-3 text-gray-300">{b.category}</td>
                        <td className="p-3 text-right font-bold text-emerald-400">
                          {b.wasteDivertedKg.toLocaleString()} kg
                        </td>
                        <td className="p-3 text-right font-bold text-teal-300">
                          {b.estimatedOutputKg.toLocaleString()} kg
                        </td>
                        <td className="p-3 text-right font-bold text-amber-400">
                          {b.fertilizerReplacementKg.toLocaleString()} kg
                        </td>
                        <td className="p-3 text-right font-bold text-blue-400">
                          {b.carbonBenefitKgCO2e.toLocaleString()} kg CO₂e
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
