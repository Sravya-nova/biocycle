import React, { useState, useEffect } from 'react';
import type { WasteBatch, ProcessReading } from '../types/biocycle';
import { getBatches, getReadings, saveBatch, deleteBatch } from '../services/storageService';
import { BatchStatusBadge } from '../components/BatchStatusBadge';
import type { NavTab } from '../components/Navbar';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  Sparkles, 
  Activity
} from 'lucide-react';

interface BatchHistoryProps {
  setActiveTab: (tab: NavTab) => void;
  onSelectBatchForRecommendation?: (batchId: string) => void;
  onSelectBatchForMonitor?: (batchId: string) => void;
}

export const BatchHistory: React.FC<BatchHistoryProps> = ({
  setActiveTab,
  onSelectBatchForRecommendation,
  onSelectBatchForMonitor
}) => {
  const [batches, setBatches] = useState<WasteBatch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedBatchForModal, setSelectedBatchForModal] = useState<WasteBatch | null>(null);

  useEffect(() => {
    setBatches(getBatches());
  }, []);

  const handleRefreshData = () => {
    setBatches(getBatches());
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete batch "${name}"?`)) {
      const updated = deleteBatch(id);
      setBatches(updated);
      if (selectedBatchForModal?.id === id) {
        setSelectedBatchForModal(null);
      }
    }
  };

  const handleStatusChange = (batch: WasteBatch, newStatus: WasteBatch['status']) => {
    const updated: WasteBatch = { ...batch, status: newStatus };
    saveBatch(updated);
    handleRefreshData();
    if (selectedBatchForModal?.id === batch.id) {
      setSelectedBatchForModal(updated);
    }
  };

  // Filtered Batches
  const filteredBatches = batches.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || b.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Export JSON or CSV
  const handleExportData = (format: 'json' | 'csv') => {
    let content = '';
    let mimeType = 'text/plain';
    let filename = `BioCycle_Batches_${Date.now()}`;

    if (format === 'json') {
      content = JSON.stringify(batches, null, 2);
      mimeType = 'application/json';
      filename += '.json';
    } else {
      const headers = ['ID', 'Name', 'Category', 'WeightKg', 'MoisturePercent', 'CNRatio', 'Location', 'Status', 'TreatmentMethod', 'DateAdded'];
      const rows = batches.map(b => [
        b.id,
        `"${b.name}"`,
        `"${b.category}"`,
        b.weightKg,
        b.moisturePercent,
        b.cnRatio,
        `"${b.location}"`,
        b.status,
        `"${b.treatmentMethod || ''}"`,
        b.dateAdded
      ].join(','));
      content = [headers.join(','), ...rows].join('\n');
      mimeType = 'text/csv';
      filename += '.csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getBatchReadings = (batchId: string): ProcessReading[] => {
    return getReadings(batchId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-emerald-950/90 via-[#0a2318] to-[#09120e] border border-emerald-700/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <History className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Batch Processing History</h1>
              <p className="text-xs text-gray-300">Complete archive and management of all active, harvested, and completed waste batches</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExportData('csv')}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-950 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900 rounded-xl text-xs font-semibold transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExportData('json')}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-950 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900 rounded-xl text-xs font-semibold transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 border border-emerald-800/30 grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search batch name or facility..."
            className="w-full pl-9 pr-4 py-2 bg-[#06120d] border border-emerald-800/50 rounded-xl text-white text-xs placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
          <Search className="h-4 w-4 text-emerald-500 absolute left-3 top-2.5" />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#06120d] border border-emerald-800/50 rounded-xl text-emerald-300 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Categories</option>
            <option value="Food Scraps">Food Scraps</option>
            <option value="Coffee Grounds">Coffee Grounds</option>
            <option value="Yard Trimmings & Leaves">Yard Trimmings & Leaves</option>
            <option value="Animal Manure">Animal Manure</option>
            <option value="Agricultural Residue">Agricultural Residue</option>
            <option value="Sawdust & Wood Chips">Sawdust & Wood Chips</option>
            <option value="Cardboard & Paper Shreds">Cardboard & Paper Shreds</option>
          </select>
          <Filter className="h-4 w-4 text-emerald-500 absolute left-3 top-2.5" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#06120d] border border-emerald-800/50 rounded-xl text-emerald-300 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending Recommendation">Pending Recommendation</option>
            <option value="Processing">Processing</option>
            <option value="Optimal">Optimal</option>
            <option value="Caution">Caution</option>
            <option value="Harvest Ready">Harvest Ready</option>
            <option value="Completed">Completed</option>
          </select>
          <Filter className="h-4 w-4 text-emerald-500 absolute left-3 top-2.5" />
        </div>

      </div>

      {/* Batches Data Table */}
      <div className="glass-panel border border-emerald-800/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#07150e] border-b border-emerald-800/40 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4">Batch Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Weight</th>
                <th className="p-4">Treatment Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date Logged</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/30 text-xs text-gray-200">
              {filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No matching waste batches found.
                  </td>
                </tr>
              ) : (
                filteredBatches.map(batch => (
                  <tr key={batch.id} className="hover:bg-emerald-950/30 transition-all">
                    <td className="p-4 font-bold text-white">
                      <div>{batch.name}</div>
                      <div className="text-[10px] text-gray-400 font-normal">{batch.location}</div>
                    </td>
                    <td className="p-4 text-emerald-300">{batch.category}</td>
                    <td className="p-4 font-semibold">{batch.weightKg} kg</td>
                    <td className="p-4">
                      {batch.treatmentMethod ? (
                        <span className="font-semibold text-emerald-300">{batch.treatmentMethod}</span>
                      ) : (
                        <span className="text-gray-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      <BatchStatusBadge status={batch.status} />
                    </td>
                    <td className="p-4 text-gray-400">
                      {new Date(batch.dateAdded).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedBatchForModal(batch)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/40"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (onSelectBatchForRecommendation) onSelectBatchForRecommendation(batch.id);
                            setActiveTab('recommendation');
                          }}
                          title="Get Recommendation"
                          className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-700/40"
                        >
                          <Sparkles className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (onSelectBatchForMonitor) onSelectBatchForMonitor(batch.id);
                            setActiveTab('process-monitor');
                          }}
                          title="Monitor Telemetry"
                          className="p-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900 text-blue-300 border border-blue-700/40"
                        >
                          <Activity className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(batch.id, batch.name)}
                          title="Delete Batch"
                          className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-700/40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch Details Modal */}
      {selectedBatchForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-panel p-6 max-w-2xl w-full border border-emerald-600/50 bg-[#0a1912] space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-emerald-900/50 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-white">{selectedBatchForModal.name}</h3>
                  <BatchStatusBadge status={selectedBatchForModal.status} />
                </div>
                <p className="text-xs text-emerald-400 font-medium">{selectedBatchForModal.location}</p>
              </div>
              <button 
                onClick={() => setSelectedBatchForModal(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#06120d] p-4 rounded-xl border border-emerald-900/40 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px]">Category</span>
                <span className="font-bold text-emerald-300">{selectedBatchForModal.category}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Total Weight</span>
                <span className="font-bold text-white">{selectedBatchForModal.weightKg} kg</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Moisture %</span>
                <span className="font-bold text-blue-400">{selectedBatchForModal.moisturePercent}%</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">C:N Ratio</span>
                <span className="font-bold text-amber-400">{selectedBatchForModal.cnRatio} : 1</span>
              </div>
            </div>

            {/* Status Change Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Update Batch Status:</span>
              <div className="flex flex-wrap gap-2">
                {(['Processing', 'Optimal', 'Caution', 'Harvest Ready', 'Completed'] as WasteBatch['status'][]).map(statusOption => (
                  <button
                    key={statusOption}
                    onClick={() => handleStatusChange(selectedBatchForModal, statusOption)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selectedBatchForModal.status === statusOption
                        ? 'bg-emerald-500 text-emerald-950 border-emerald-400 font-bold'
                        : 'bg-emerald-950/40 text-gray-300 border-emerald-800 hover:border-emerald-500'
                    }`}
                  >
                    {statusOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Telemetry Logs Preview */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Logged Telemetry Readings</h4>
              {getBatchReadings(selectedBatchForModal.id).length === 0 ? (
                <p className="text-xs text-gray-400 italic">No sensor readings logged for this batch yet.</p>
              ) : (
                <div className="space-y-2">
                  {getBatchReadings(selectedBatchForModal.id).map(rd => (
                    <div key={rd.id} className="bg-[#07130e] p-3 rounded-lg border border-emerald-900/50 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white">{new Date(rd.timestamp).toLocaleDateString()}</span>
                        <span className="text-gray-400 ml-2">
                          Temp: <strong className="text-amber-400">{rd.temperatureC}°C</strong> • Moisture: <strong className="text-blue-400">{rd.moisturePercent}%</strong> • pH: <strong className="text-purple-400">{rd.phLevel}</strong>
                        </span>
                        {rd.actionTaken && (
                          <div className="text-[11px] text-emerald-400 mt-0.5">Action: {rd.actionTaken}</div>
                        )}
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {rd.healthStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-emerald-900/50">
              <button
                onClick={() => setSelectedBatchForModal(null)}
                className="px-5 py-2 bg-emerald-950 text-emerald-300 border border-emerald-700/50 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
