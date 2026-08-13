import React, { useState, useEffect } from 'react';
import { getBatches } from '../services/storageService';
import type { WasteBatch } from '../types/biocycle';
import { StatCard } from '../components/StatCard';
import { useLanguage } from '../context/LanguageContext';
import { 
  Calculator, 
  CloudRain, 
  Leaf, 
  Scale, 
  Sliders, 
  Download, 
  ShieldAlert, 
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
  const { t } = useLanguage();
  const [batches, setBatches] = useState<WasteBatch[]>([]);

  // Configurable Demonstration Assumptions
  const [outputFactor, setOutputFactor] = useState<number>(0.48);
  const [replacementFactor, setReplacementFactor] = useState<number>(0.35);
  const [carbonFactor, setCarbonFactor] = useState<number>(1.85);

  useEffect(() => {
    setBatches(getBatches());
  }, []);

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

  const totalWasteDivertedKg = batchImpacts.reduce((acc, b) => acc + b.wasteDivertedKg, 0);
  const totalEstimatedOutputKg = batchImpacts.reduce((acc, b) => acc + b.estimatedOutputKg, 0);
  const totalFertilizerReplacementKg = batchImpacts.reduce((acc, b) => acc + b.fertilizerReplacementKg, 0);
  const totalCarbonBenefitKgCO2e = batchImpacts.reduce((acc, b) => acc + b.carbonBenefitKgCO2e, 0);

  const chartData = batchImpacts.map(b => ({
    name: b.batchName.length > 15 ? b.batchName.substring(0, 15) + '...' : b.batchName,
    'Waste Saved (kg)': b.wasteDivertedKg,
    'Est. Fertilizer (kg)': b.estimatedOutputKg,
    'Chemical Saved (kg)': b.fertilizerReplacementKg,
    'Clean Air (kg CO₂e)': b.carbonBenefitKgCO2e
  }));

  const handleDownloadReport = () => {
    const reportText = `
==================================================
BIOCYCLE PLAIN-LANGUAGE ESTIMATES REPORT
==================================================
Generated Date: ${new Date().toLocaleDateString()}

ESTIMATED SAVINGS & OUTPUT:
- Total Waste Kept Out of Trash: ${totalWasteDivertedKg.toLocaleString()} kg
- Total Natural Fertilizer/Gas Yield: ${totalEstimatedOutputKg.toLocaleString()} kg
- Total Chemical Fertilizer Replaced: ${totalFertilizerReplacementKg.toLocaleString()} kg
- Total Clean Air Benefit: ${totalCarbonBenefitKgCO2e.toLocaleString()} kg CO2e

${t.disclaimerBody}
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BioCycle_Estimates_${Date.now()}.txt`;
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
              <h1 className="text-2xl font-extrabold text-white">{t.impactTitle}</h1>
              <p className="text-xs text-gray-300">{t.impactSubtitle}</p>
            </div>
          </div>

          <button
            onClick={handleDownloadReport}
            className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl shadow-lg transition-all text-sm"
          >
            <Download className="h-4 w-4" />
            <span>Download Summary Report</span>
          </button>
        </div>
      </div>

      {/* DISCLAIMER BANNER */}
      <div className="glass-panel p-5 border border-amber-600/60 bg-amber-950/40 flex items-start space-x-3 text-amber-200">
        <ShieldAlert className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm uppercase tracking-wider text-amber-300">{t.disclaimerTitle}</h4>
          <p className="text-xs leading-relaxed font-semibold italic text-amber-100">
            "{t.disclaimerBody}"
          </p>
        </div>
      </div>

      {/* Cumulative Aggregate Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.wasteDivertedLabel}
          value={totalWasteDivertedKg.toLocaleString()}
          unit="kg"
          subtitle={t.wasteDivertedDesc}
          icon={Scale}
          accentColor="emerald"
        />
        <StatCard
          title={t.outputYieldLabel}
          value={totalEstimatedOutputKg.toLocaleString()}
          unit="kg / L"
          subtitle={t.outputYieldDesc}
          icon={Sprout}
          accentColor="mint"
        />
        <StatCard
          title="Chemical Fertilizer Replaced"
          value={totalFertilizerReplacementKg.toLocaleString()}
          unit="kg"
          subtitle="Savings on chemical fertilizer"
          icon={Leaf}
          accentColor="amber"
        />
        <StatCard
          title={t.carbonBenefitLabel}
          value={totalCarbonBenefitKgCO2e.toLocaleString()}
          unit="kg CO₂e"
          subtitle={t.carbonBenefitDesc}
          icon={CloudRain}
          accentColor="blue"
        />
      </div>

      {/* 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Demonstration Assumptions Controls */}
        <div className="glass-panel p-6 border border-emerald-800/40 space-y-6">
          <div className="border-b border-emerald-900/50 pb-3 flex items-center space-x-2">
            <Sliders className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold text-white">{t.assumptionsTitle}</h3>
              <p className="text-xs text-gray-400">{t.assumptionsSubtitle}</p>
            </div>
          </div>

          {/* 1. Output Factor */}
          <div className="space-y-2 bg-[#06120d] p-4 rounded-xl border border-emerald-900/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-300">Fertilizer Conversion Rate</span>
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
              Fertilizer Output = waste quantity × {outputFactor}
            </div>
          </div>

          {/* 2. Replacement Factor */}
          <div className="space-y-2 bg-[#06120d] p-4 rounded-xl border border-emerald-900/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-300">Chemical Fertilizer Saved Rate</span>
              <span className="font-extrabold text-amber-400">{replacementFactor} kg / kg</span>
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
              Chemical Saved = natural fertilizer × {replacementFactor}
            </div>
          </div>

          {/* 3. Demonstration Carbon Factor */}
          <div className="space-y-2 bg-[#06120d] p-4 rounded-xl border border-emerald-900/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-300">Clean Air Benefit Rate</span>
              <span className="font-extrabold text-blue-400">{carbonFactor} CO₂e / kg</span>
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
              Clean Air Benefit = waste saved × {carbonFactor}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Comparative Chart & Per-Batch Impact Table */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Visual Chart */}
          <div className="glass-panel p-6 border border-emerald-800/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Estimated Output Breakdown</h3>
                <p className="text-xs text-gray-400">Comparing waste saved, fertilizer yield, and clean air benefits</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#09140f', borderColor: '#10b981', color: '#fff', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
                  <Bar dataKey="Waste Saved (kg)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Est. Fertilizer (kg)" fill="#34d399" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Chemical Saved (kg)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Clean Air (kg CO₂e)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PER-BATCH DETAILED TABLE */}
          <div className="glass-panel p-6 border border-emerald-800/40 space-y-4">
            <div className="flex items-center space-x-2 border-b border-emerald-900/50 pb-3">
              <Layers className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Per-Pile Estimated Savings</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300 border-collapse">
                <thead>
                  <tr className="bg-[#06120d] border-b border-emerald-900/50 text-[10px] uppercase font-bold text-gray-400">
                    <th className="p-3">Pile Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3 text-right">Waste Saved</th>
                    <th className="p-3 text-right">Est. Fertilizer</th>
                    <th className="p-3 text-right">Chemical Saved</th>
                    <th className="p-3 text-right">Clean Air</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/30">
                  {batchImpacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-400">
                        No waste entries recorded yet.
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
