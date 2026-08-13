import React, { useState, useEffect } from 'react';
import type { WasteBatch, ProcessReading, ProcessStage, OdorObservation } from '../types/biocycle';
import { getBatches, getReadings, addReading, updateBatchProcessStage } from '../services/storageService';
import { BatchStatusBadge } from '../components/BatchStatusBadge';
import { useLanguage } from '../context/LanguageContext';
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  FlaskConical, 
  AlertTriangle, 
  PlusCircle, 
  ShieldAlert,
  Wind,
  Clock,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

interface ProcessMonitorProps {
  selectedBatchId?: string;
}

export const ProcessMonitor: React.FC<ProcessMonitorProps> = ({ selectedBatchId }) => {
  const { t } = useLanguage();
  const [batches, setBatches] = useState<WasteBatch[]>([]);
  const [activeBatch, setActiveBatch] = useState<WasteBatch | null>(null);
  const [readings, setReadings] = useState<ProcessReading[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);

  // Form State for new reading
  const [readingDate, setReadingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [tempC, setTempC] = useState<number>(55);
  const [phLevel, setPhLevel] = useState<number>(6.8);
  const [moisturePercent, setMoisturePercent] = useState<number>(62);
  const [odor, setOdor] = useState<OdorObservation>('Earthy / Fresh Soil (Normal)');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    const loadedBatches = getBatches();
    setBatches(loadedBatches);

    if (loadedBatches.length > 0) {
      const initial = selectedBatchId
        ? loadedBatches.find(b => b.id === selectedBatchId) || loadedBatches[0]
        : loadedBatches[0];
      setActiveBatch(initial);
      setReadings(getReadings(initial.id));
    }
  }, [selectedBatchId]);

  const handleBatchSelect = (batchId: string) => {
    const found = batches.find(b => b.id === batchId);
    if (found) {
      setActiveBatch(found);
      setReadings(getReadings(found.id));
    }
  };

  const handleStageChange = (newStage: ProcessStage) => {
    if (!activeBatch) return;
    const updatedList = updateBatchProcessStage(activeBatch.id, newStage);
    setBatches(updatedList);
    const updated = updatedList.find(b => b.id === activeBatch.id);
    if (updated) setActiveBatch(updated);
  };

  const handleAddReadingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBatch) return;

    const generatedWarnings: string[] = [];

    if (tempC > 65) {
      generatedWarnings.push('Too Hot (>65°C): Heap is getting too hot! Turn the pile with a fork immediately to cool it.');
    } else if (tempC < 35 && activeBatch.processStage === 'Active monitoring') {
      generatedWarnings.push('Too Cool (<35°C): Heap is cooling down too early. Add fresh green food scraps or water.');
    }

    if (phLevel < 5.0) {
      generatedWarnings.push(`Too Sour (pH ${phLevel}): Very acidic. Add wood ash or agricultural lime to fix it.`);
    } else if (phLevel > 8.5) {
      generatedWarnings.push(`Too Alkaline (pH ${phLevel}): Smells strong like ammonia. Mix in dry brown leaves.`);
    }

    if (moisturePercent < 40) {
      generatedWarnings.push('Too Dry (<40%): The heap needs water. Sprinkle water or wet food scraps.');
    } else if (moisturePercent > 70) {
      generatedWarnings.push('Too Wet (>70%): Too much water! Add dry sawdust, dry leaves, or straw.');
    }

    if (odor === 'Foul Anaerobic / H2S (Rotten Odor)') {
      generatedWarnings.push('Stinking Rotten Odor: Needs fresh air! Turn the heap with a garden fork.');
    } else if (odor === 'Pungent Ammonia (Excess Nitrogen)') {
      generatedWarnings.push('Strong Ammonia Smell: Add dry brown carbon materials like leaves or cardboard.');
    }

    let healthStatus: 'Optimal' | 'Caution' | 'Critical' = 'Optimal';
    if (generatedWarnings.length > 0) {
      healthStatus = generatedWarnings.some(w => w.includes('Too Hot') || w.includes('Stinking') || w.includes('Too Sour')) ? 'Critical' : 'Caution';
    }

    addReading({
      batchId: activeBatch.id,
      timestamp: new Date(readingDate).toISOString(),
      temperatureC: Number(tempC),
      phLevel: Number(phLevel),
      moisturePercent: Number(moisturePercent),
      odorObservation: odor,
      healthStatus,
      notes: notes.trim() || undefined,
      warnings: generatedWarnings
    });

    setReadings(getReadings(activeBatch.id));
    setShowLogModal(false);
    setNotes('');
  };

  const latestReading = readings.length > 0 ? readings[readings.length - 1] : null;

  const chartData = readings.map(r => ({
    date: new Date(r.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    temperature: r.temperatureC,
    pH: r.phLevel,
    moisture: r.moisturePercent
  }));

  const activeWarnings = latestReading?.warnings || [];

  const stageBadges: Record<ProcessStage, string> = {
    'Not started': 'bg-gray-900 text-gray-400 border-gray-800',
    'Active monitoring': 'bg-blue-950 text-blue-400 border-blue-800 animate-pulse',
    'Maturation': 'bg-amber-950 text-amber-300 border-amber-800',
    'Ready for laboratory testing': 'bg-teal-950 text-teal-300 border-teal-600'
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-emerald-950/90 via-[#0b2419] to-[#09120e] border border-emerald-700/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Activity className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">{t.monitorTitle}</h1>
              <p className="text-xs text-gray-300">{t.monitorSubtitle}</p>
            </div>
          </div>

          {/* Select Saved Waste Batch */}
          <div className="min-w-[240px]">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t.selectBatchPrompt}</label>
            <select
              value={activeBatch?.id || ''}
              onChange={(e) => handleBatchSelect(e.target.value)}
              className="w-full px-3 py-2 bg-[#06120d] border border-emerald-700/50 rounded-xl text-emerald-300 font-semibold text-xs focus:outline-none focus:border-emerald-500"
            >
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.treatmentMethod || 'Unassigned'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!activeBatch ? (
        <div className="glass-panel p-12 text-center text-gray-400">
          <p>No waste pile selected.</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Top Bar: Batch Info & Process Stage Controls */}
          <div className="glass-panel p-5 border border-emerald-800/40 bg-[#08150e] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-extrabold text-white">{activeBatch.name}</h2>
                  <BatchStatusBadge status={activeBatch.status} />
                </div>
                <p className="text-xs text-gray-400">
                  Location: <strong className="text-emerald-300">{activeBatch.location}</strong> • Method: <strong className="text-white">{activeBatch.treatmentMethod || 'Pending'}</strong> • Added: <strong className="text-gray-300">{new Date(activeBatch.dateAdded).toLocaleDateString()}</strong>
                </p>
              </div>

              <button
                onClick={() => setShowLogModal(true)}
                className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold rounded-xl shadow-lg transition-all text-sm"
              >
                <PlusCircle className="h-4 w-4" />
                <span>{t.logReadingBtn}</span>
              </button>
            </div>

            {/* Current Process Stage Control */}
            <div className="pt-3 border-t border-emerald-900/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">{t.currentStageLabel}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${stageBadges[activeBatch.processStage || 'Active monitoring']}`}>
                  {activeBatch.processStage || 'Active monitoring'}
                </span>
              </div>

              {/* Stage Transition Selector */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-gray-400">{t.updateStageLabel}</span>
                <select
                  value={activeBatch.processStage || 'Active monitoring'}
                  onChange={(e) => handleStageChange(e.target.value as ProcessStage)}
                  className="px-3 py-1 bg-[#06120d] border border-emerald-700/50 rounded-lg text-emerald-300 text-xs font-semibold focus:outline-none"
                >
                  <option value="Not started">Not started</option>
                  <option value="Active monitoring">Active monitoring</option>
                  <option value="Maturation">Maturation</option>
                  <option value="Ready for laboratory testing">Ready for testing</option>
                </select>
              </div>
            </div>

          </div>

          {/* Mandatory Safety Notice */}
          <div className="glass-panel p-4 border border-amber-700/50 bg-amber-950/30 flex items-start space-x-3 text-amber-200 text-xs">
            <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold uppercase tracking-wide text-amber-300">{t.safetyNoticeTitle}</h4>
              <p>{t.safetyNoticeBody}</p>
            </div>
          </div>

          {/* Latest Reading Summary Card */}
          <div className="glass-panel p-6 border border-emerald-800/40 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/50 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">{t.latestReadingTitle}</h3>
              </div>
              {latestReading && (
                <span className="text-xs text-gray-400">
                  Checked on {new Date(latestReading.timestamp).toLocaleDateString()}
                </span>
              )}
            </div>

            {!latestReading ? (
              <p className="text-xs text-gray-400 italic">No daily check logged for this pile yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#06120d] p-4 rounded-xl border border-emerald-900/50">
                  <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-semibold mb-1">
                    <Thermometer className="h-4 w-4" />
                    <span>{t.heatLabel}</span>
                  </div>
                  <span className="text-2xl font-extrabold text-white">{latestReading.temperatureC}</span>
                  <span className="text-xs text-amber-400 font-bold ml-1">°C</span>
                </div>

                <div className="bg-[#06120d] p-4 rounded-xl border border-emerald-900/50">
                  <div className="flex items-center space-x-1.5 text-purple-400 text-xs font-semibold mb-1">
                    <FlaskConical className="h-4 w-4" />
                    <span>{t.sournessLabel}</span>
                  </div>
                  <span className={`text-2xl font-extrabold ${latestReading.phLevel < 5 ? 'text-red-400' : 'text-white'}`}>
                    {latestReading.phLevel}
                  </span>
                  <span className="text-xs text-purple-400 font-bold ml-1">pH</span>
                </div>

                <div className="bg-[#06120d] p-4 rounded-xl border border-emerald-900/50">
                  <div className="flex items-center space-x-1.5 text-blue-400 text-xs font-semibold mb-1">
                    <Droplets className="h-4 w-4" />
                    <span>{t.wetnessLabel}</span>
                  </div>
                  <span className="text-2xl font-extrabold text-white">{latestReading.moisturePercent}</span>
                  <span className="text-xs text-blue-400 font-bold ml-1">%</span>
                </div>

                <div className="bg-[#06120d] p-4 rounded-xl border border-emerald-900/50">
                  <div className="flex items-center space-x-1.5 text-teal-400 text-xs font-semibold mb-1">
                    <Wind className="h-4 w-4" />
                    <span>{t.smellLabel}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-300 block line-clamp-2 mt-1">
                    {latestReading.odorObservation}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Active Warnings Cards */}
          {activeWarnings.length > 0 && (
            <div className="glass-panel p-5 border border-red-800/50 bg-red-950/30 space-y-3">
              <div className="flex items-center space-x-2 text-red-400 font-bold text-sm uppercase tracking-wide">
                <AlertTriangle className="h-5 w-5" />
                <span>Warnings & Things to Fix:</span>
              </div>
              <div className="space-y-2">
                {activeWarnings.map((warn, idx) => (
                  <div key={idx} className="p-3 bg-[#150a0a] rounded-lg border border-red-900/40 text-xs text-red-200 font-medium">
                    ⚠️ {warn}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* THREE DISTINCT LINE CHARTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Temperature Line Chart */}
            <div className="glass-panel p-5 border border-emerald-800/40 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-900/50 pb-2">
                <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-sm">
                  <Thermometer className="h-4 w-4" />
                  <span>{t.tempChartTitle}</span>
                </div>
                <span className="text-[10px] text-gray-400">Target: 50-65°C</span>
              </div>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={10} domain={[10, 80]} />
                    <Tooltip contentStyle={{ backgroundColor: '#09140f', borderColor: '#f59e0b', color: '#fff', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="temperature" name="Heat (°C)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. pH Line Chart */}
            <div className="glass-panel p-5 border border-emerald-800/40 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-900/50 pb-2">
                <div className="flex items-center space-x-1.5 text-purple-400 font-bold text-sm">
                  <FlaskConical className="h-4 w-4" />
                  <span>{t.phChartTitle}</span>
                </div>
                <span className="text-[10px] text-gray-400">Target: 6.5-7.8</span>
              </div>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={10} domain={[3, 10]} />
                    <Tooltip contentStyle={{ backgroundColor: '#09140f', borderColor: '#a855f7', color: '#fff', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="pH" name="Sourness (pH)" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. Moisture Line Chart */}
            <div className="glass-panel p-5 border border-emerald-800/40 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-900/50 pb-2">
                <div className="flex items-center space-x-1.5 text-blue-400 font-bold text-sm">
                  <Droplets className="h-4 w-4" />
                  <span>{t.moistureChartTitle}</span>
                </div>
                <span className="text-[10px] text-gray-400">Target: 55-65%</span>
              </div>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={10} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#09140f', borderColor: '#3b82f6', color: '#fff', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="moisture" name="Wateriness (%)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Reading Log Table */}
          <div className="glass-panel p-6 border border-emerald-800/30 space-y-4">
            <div className="flex items-center space-x-2 border-b border-emerald-900/50 pb-3">
              <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Daily Check History Logbook</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead>
                  <tr className="bg-[#06120d] border-b border-emerald-900/50 text-[10px] uppercase font-bold text-gray-400">
                    <th className="p-3">Date</th>
                    <th className="p-3">Heat (°C)</th>
                    <th className="p-3">Sourness (pH)</th>
                    <th className="p-3">Wateriness (%)</th>
                    <th className="p-3">Smell / Odor</th>
                    <th className="p-3">Condition</th>
                    <th className="p-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/30">
                  {readings.map(rd => (
                    <tr key={rd.id} className="hover:bg-emerald-950/20">
                      <td className="p-3 font-semibold text-white">
                        {new Date(rd.timestamp).toLocaleDateString()}
                      </td>
                      <td className="p-3 font-bold text-amber-400">{rd.temperatureC}°C</td>
                      <td className="p-3 font-bold text-purple-400">{rd.phLevel}</td>
                      <td className="p-3 font-bold text-blue-400">{rd.moisturePercent}%</td>
                      <td className="p-3 text-emerald-300">{rd.odorObservation}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rd.healthStatus === 'Optimal' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {rd.healthStatus}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400 max-w-xs truncate">{rd.notes || '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Log Reading Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-panel p-6 max-w-md w-full border border-emerald-600/50 bg-[#0a1811] space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-900/50 pb-3">
              <h3 className="text-lg font-bold text-white">Record Today's Check</h3>
              <button 
                onClick={() => setShowLogModal(false)}
                className="text-gray-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReadingSubmit} className="space-y-4">
              
              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={readingDate}
                  onChange={(e) => setReadingDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#06120d] border border-emerald-800 rounded-lg text-white text-sm"
                />
              </div>

              {/* Temperature & pH */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Heat (°C) *</label>
                  <input
                    type="number"
                    required
                    value={tempC}
                    onChange={(e) => setTempC(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#06120d] border border-emerald-800 rounded-lg text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Sourness (pH) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    required
                    value={phLevel}
                    onChange={(e) => setPhLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#06120d] border border-emerald-800 rounded-lg text-white text-sm"
                  />
                </div>
              </div>

              {/* Moisture */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Wateriness (%) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={moisturePercent}
                  onChange={(e) => setMoisturePercent(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#06120d] border border-emerald-800 rounded-lg text-white text-sm"
                />
              </div>

              {/* Odor Observation */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Smell / Odor *</label>
                <select
                  value={odor}
                  onChange={(e) => setOdor(e.target.value as OdorObservation)}
                  className="w-full px-3 py-2 bg-[#06120d] border border-emerald-800 rounded-lg text-white text-sm font-semibold"
                >
                  <option value="Earthy / Fresh Soil (Normal)">Fresh Earth Smell (Good)</option>
                  <option value="Mild Sweet-Sour (Active Fermentation)">Mild Sweet-Sour Smell (Fermenting)</option>
                  <option value="Pungent Ammonia (Excess Nitrogen)">Strong Ammonia Smell (Too Much Green)</option>
                  <option value="Foul Anaerobic / H2S (Rotten Odor)">Stinking Rotten Smell (Needs Air)</option>
                  <option value="Odorless">No Smell</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Heap turning notes, worm activity..."
                  className="w-full px-3 py-2 bg-[#06120d] border border-emerald-800 rounded-lg text-white text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-lg text-xs"
                >
                  Save Check
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
