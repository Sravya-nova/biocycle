import React, { useState, useEffect } from 'react';
import type { WasteBatch, ProcessReading } from '../types/biocycle';
import { getBatches, getReadings, saveBatch } from '../services/storageService';
import { StatCard } from '../components/StatCard';
import { BatchStatusBadge } from '../components/BatchStatusBadge';
import { useLanguage } from '../context/LanguageContext';
import type { NavTab } from '../components/Navbar';
import { 
  Scale, 
  CloudRain, 
  Recycle, 
  Leaf, 
  PlusCircle, 
  Sparkles,
  Thermometer,
  Droplets,
  Building2,
  Calendar,
  Layers,
  Sprout,
  ArrowRight,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

interface DashboardProps {
  setActiveTab: (tab: NavTab) => void;
  onSelectBatchForMonitor?: (batchId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, onSelectBatchForMonitor }) => {
  const { t } = useLanguage();
  const [batches, setBatches] = useState<WasteBatch[]>([]);
  const [readings, setReadings] = useState<ProcessReading[]>([]);
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    setBatches(getBatches());
    setReadings(getReadings());
  }, []);

  const handleAddSampleBatch = (type: 'banana' | 'manure' | 'leaves') => {
    let sample: WasteBatch;
    if (type === 'banana') {
      sample = {
        id: 'batch_demo_' + Date.now(),
        name: 'Fresh Banana Skins & Fruit Scraps',
        category: 'Food Scraps',
        weightKg: 120,
        moisturePercent: 74,
        cnRatio: 18,
        initialPh: 6.3,
        wasteSource: 'Household Kitchen',
        location: 'Bay 1',
        status: 'Optimal',
        processStage: 'Active monitoring',
        treatmentMethod: 'Composting',
        dateAdded: new Date().toISOString(),
        notes: '1-Click preset demo batch added for quick testing.',
        hasContaminants: false
      };
    } else if (type === 'manure') {
      sample = {
        id: 'batch_demo_' + Date.now(),
        name: 'Cow Dung & Farm Barn Slurry',
        category: 'Animal Manure',
        weightKg: 500,
        moisturePercent: 82,
        cnRatio: 17,
        initialPh: 7.4,
        wasteSource: 'Farm & Livestock',
        location: 'Digester Pit 1',
        status: 'Processing',
        processStage: 'Active monitoring',
        treatmentMethod: 'Anaerobic Digestion',
        dateAdded: new Date().toISOString(),
        notes: '1-Click preset demo batch for Biogas generation.',
        hasContaminants: false
      };
    } else {
      sample = {
        id: 'batch_demo_' + Date.now(),
        name: 'Dry Autumn Leaves & Straw',
        category: 'Yard Trimmings & Leaves',
        weightKg: 200,
        moisturePercent: 28,
        cnRatio: 60,
        initialPh: 6.8,
        wasteSource: 'Municipal Yard Waste',
        location: 'Windrow 2',
        status: 'Pending Recommendation',
        processStage: 'Not started',
        treatmentMethod: 'Composting',
        dateAdded: new Date().toISOString(),
        notes: '1-Click preset demo batch requiring moisture adjustment.',
        hasContaminants: false
      };
    }

    const updated = saveBatch(sample);
    setBatches(updated);
  };

  // DYNAMIC CALCULATIONS FROM SAVED RECORDS (NO HARDCODED TOTALS)
  const totalWasteDivertedKg = batches.reduce((acc, b) => acc + (b.weightKg || 0), 0);
  
  const totalWasteProcessedKg = batches
    .filter(b => b.status === 'Completed' || b.status === 'Harvest Ready' || b.status === 'Processing' || b.status === 'Optimal')
    .reduce((acc, b) => acc + (b.weightKg || 0), 0);

  const activeBatchesList = batches.filter(b => b.status !== 'Completed' && b.status !== 'Archived');
  const activeBatchesCount = activeBatchesList.length;

  const totalEstimatedOutputKg = Math.round(batches.reduce((acc, b) => acc + (b.weightKg * 0.48), 0));
  const totalEstimatedCarbonBenefitKg = Math.round(totalWasteDivertedKg * 1.85);

  // Process Status Chart Data
  const statusCounts: Record<string, number> = {
    'Processing': 0,
    'Optimal': 0,
    'Caution': 0,
    'Harvest Ready': 0,
    'Pending Recommendation': 0,
    'Completed': 0
  };

  batches.forEach(b => {
    const key = b.status || 'Pending Recommendation';
    statusCounts[key] = (statusCounts[key] || 0) + 1;
  });

  const processStatusChartData = Object.keys(statusCounts)
    .filter(status => statusCounts[status] > 0)
    .map(status => ({
      status,
      count: statusCounts[status]
    }));

  const STATUS_COLORS: Record<string, string> = {
    'Processing': '#3b82f6',
    'Optimal': '#10b981',
    'Caution': '#f59e0b',
    'Harvest Ready': '#14b8a6',
    'Pending Recommendation': '#a855f7',
    'Completed': '#64748b'
  };

  const recentBatches = [...batches]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 6);

  const getLatestReading = (batchId: string) => {
    const batchReadings = readings.filter(r => r.batchId === batchId);
    return batchReadings.length > 0 ? batchReadings[batchReadings.length - 1] : null;
  };

  return (
    <div className="space-y-8">
      
      {/* FIRST-TIME OPERATOR EASY GUIDED WORKFLOW BANNER */}
      {showGuide && (
        <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-emerald-950/90 via-[#0d261b] to-[#09140e] border border-emerald-600/50 space-y-6 shadow-2xl relative">
          <button
            onClick={() => setShowGuide(false)}
            className="absolute top-4 right-4 text-xs font-bold text-gray-400 hover:text-white bg-emerald-950/60 px-2 py-1 rounded"
          >
            ✕ Hide Guide
          </button>

          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Zap className="h-7 w-7" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest block">First Time Here? Simple 3-Step Guide</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">How BioCycle Works in 3 Easy Steps</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            {/* Step 1 */}
            <div className="bg-[#06140d] p-4 rounded-xl border border-emerald-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="h-6 w-6 rounded-full bg-emerald-500 text-emerald-950 font-extrabold flex items-center justify-center text-xs">1</span>
                <span className="text-gray-400 text-[10px] uppercase font-bold">Step One</span>
              </div>
              <strong className="text-sm text-white font-extrabold block">Enter Your Waste Pile</strong>
              <p className="text-gray-300 leading-relaxed">
                Tell us how many kg of banana peels, kitchen scraps, or farm dung you have.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#06140d] p-4 rounded-xl border border-emerald-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="h-6 w-6 rounded-full bg-teal-400 text-emerald-950 font-extrabold flex items-center justify-center text-xs">2</span>
                <span className="text-gray-400 text-[10px] uppercase font-bold">Step Two</span>
              </div>
              <strong className="text-sm text-white font-extrabold block">Get Simple Natural Advice</strong>
              <p className="text-gray-300 leading-relaxed">
                The smart engine recommends natural composting, worm farming, or biogas tanks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#06140d] p-4 rounded-xl border border-emerald-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="h-6 w-6 rounded-full bg-amber-400 text-emerald-950 font-extrabold flex items-center justify-center text-xs">3</span>
                <span className="text-gray-400 text-[10px] uppercase font-bold">Step Three</span>
              </div>
              <strong className="text-sm text-white font-extrabold block">Track Daily Heat & Smell</strong>
              <p className="text-gray-300 leading-relaxed">
                Log today's heat (°C), wateriness (%), and smell to get warning alerts if it's too dry or sour.
              </p>
            </div>

          </div>

          {/* 1-CLICK TRY PRESETS FOR EASY FIRST-TIME WORKFLOW */}
          <div className="pt-2 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-300">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Try Instant Sample Waste Entry (1-Click):</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => handleAddSampleBatch('banana')}
                className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 font-semibold transition-all"
              >
                + Banana Peels (120 kg)
              </button>
              <button
                onClick={() => handleAddSampleBatch('manure')}
                className="px-3 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-700/50 font-semibold transition-all"
              >
                + Cow Dung Slurry (500 kg)
              </button>
              <button
                onClick={() => handleAddSampleBatch('leaves')}
                className="px-3 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700/50 font-semibold transition-all"
              >
                + Dry Leaves (200 kg)
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Top Hero Banner */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-emerald-950/80 via-[#0d2218] to-[#09120e] border border-emerald-700/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 text-xs font-semibold">
              <Leaf className="h-3.5 w-3.5 text-emerald-400" />
              <span>{t.appTagline}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.dashboardTitle}
            </h1>
            <p className="text-sm text-gray-300">
              {t.dashboardSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('add-batch')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold rounded-xl shadow-lg shadow-emerald-950/50 transition-all text-sm"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{t.addBatchBtn}</span>
            </button>
            <button
              onClick={() => setActiveTab('recommendation')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 font-bold rounded-xl transition-all text-sm"
            >
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>{t.getRecBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* DYNAMIC CALCULATED METRICS CARDS WITH PLAIN LANGUAGE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <StatCard
          title={t.totalWasteLabel}
          value={totalWasteProcessedKg.toLocaleString()}
          unit="kg"
          subtitle={t.totalWasteDesc}
          icon={Scale}
          accentColor="emerald"
        />

        <StatCard
          title={t.activeBatchesLabel}
          value={activeBatchesCount}
          unit="piles"
          subtitle={t.activeBatchesDesc}
          icon={Recycle}
          accentColor="mint"
        />

        <StatCard
          title={t.outputYieldLabel}
          value={totalEstimatedOutputKg.toLocaleString()}
          unit="kg / L"
          subtitle={t.outputYieldDesc}
          icon={Sprout}
          accentColor="amber"
        />

        <StatCard
          title={t.wasteDivertedLabel}
          value={totalWasteDivertedKg.toLocaleString()}
          unit="kg"
          subtitle={t.wasteDivertedDesc}
          icon={Leaf}
          accentColor="blue"
        />

        <StatCard
          title={t.carbonBenefitLabel}
          value={(totalEstimatedCarbonBenefitKg / 1000).toFixed(2)}
          unit="MT CO₂e"
          subtitle={t.carbonBenefitDesc}
          icon={CloudRain}
          accentColor="emerald"
        />

      </div>

      {/* VISUAL ANALYTICS: PROCESS-STATUS CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Process Status Bar Chart */}
        <div className="lg:col-span-2 glass-panel p-6 border border-emerald-800/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Layers className="h-5 w-5 text-emerald-400" />
                <span>{t.statusChartTitle}</span>
              </h3>
              <p className="text-xs text-gray-400">Current status of all recorded piles</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-900/40 text-emerald-300 border border-emerald-800/40">
              {batches.length} Total Records
            </span>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processStatusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="status" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c1813', borderColor: '#10b981', color: '#fff', borderRadius: '8px' }}
                  formatter={(val: any) => [`${val ?? 0} piles`, 'Count']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {processStatusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="glass-panel p-6 border border-emerald-800/30 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Status Breakdown</h3>
            <p className="text-xs text-gray-400">Proportional breakdown of saved records</p>
          </div>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processStatusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="status"
                >
                  {processStatusChartData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={STATUS_COLORS[entry.status] || '#10b981'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0c1813', borderColor: '#10b981', color: '#fff', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <button
            onClick={() => setActiveTab('batch-history')}
            className="w-full text-center text-xs font-bold text-emerald-400 hover:text-emerald-300 py-1.5 flex items-center justify-center space-x-1"
          >
            <span>View History Logbook ({batches.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

      {/* RECENT WASTE BATCHES SECTION */}
      <div className="glass-panel p-6 border border-emerald-800/30 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <span>{t.recentBatchesTitle}</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/50">
                Latest {recentBatches.length}
              </span>
            </h3>
            <p className="text-xs text-gray-400">Saved waste entries sorted by collection date</p>
          </div>

          <button
            onClick={() => setActiveTab('batch-history')}
            className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-900/40 border border-emerald-700/40"
          >
            <span>{t.navHistory}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentBatches.map(batch => {
            const latestReading = getLatestReading(batch.id);

            return (
              <div 
                key={batch.id} 
                className="glass-panel p-5 border border-emerald-800/40 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 bg-[#08140e]"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-white text-base line-clamp-1">{batch.name}</h4>
                    <BatchStatusBadge status={batch.status} />
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
                    <Building2 className="h-3.5 w-3.5 text-gray-400" />
                    <span>{batch.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-300 pt-1">
                    <span>Type: <strong className="text-emerald-300">{batch.category}</strong></span>
                    <span>{t.weightLabel}: <strong className="text-white">{batch.weightKg} kg</strong></span>
                  </div>
                </div>

                {/* Sensor Mini Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-[#050e09] p-3 rounded-lg border border-emerald-900/40 text-xs">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-amber-400" />
                    <div>
                      <span className="text-gray-400 block text-[10px]">{t.heatLabel}</span>
                      <span className="font-bold text-white">
                        {latestReading ? `${latestReading.temperatureC}°C` : '--'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Droplets className="h-4 w-4 text-blue-400" />
                    <div>
                      <span className="text-gray-400 block text-[10px]">{t.wetnessLabel}</span>
                      <span className="font-bold text-white">
                        {latestReading ? `${latestReading.moisturePercent}%` : `${batch.moisturePercent}%`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="pt-2 border-t border-emerald-900/40 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{new Date(batch.dateAdded).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (onSelectBatchForMonitor) onSelectBatchForMonitor(batch.id);
                      setActiveTab('process-monitor');
                    }}
                    className="text-emerald-400 hover:text-emerald-300 font-bold"
                  >
                    {t.logReadingBtn} &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
