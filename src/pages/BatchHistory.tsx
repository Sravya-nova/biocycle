import React, { useState, useEffect } from 'react';
import type { WasteBatch } from '../types/biocycle';
import { getBatches, deleteBatch } from '../services/storageService';
import { BatchStatusBadge } from '../components/BatchStatusBadge';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Activity, 
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import type { NavTab } from '../components/Navbar';

interface BatchHistoryProps {
  setActiveTab?: (tab: NavTab) => void;
  onSelectBatchForMonitor?: (batchId: string) => void;
  onSelectBatchForRecommendation?: (batchId: string) => void;
}

export const BatchHistory: React.FC<BatchHistoryProps> = ({ 
  onSelectBatchForMonitor, 
  onSelectBatchForRecommendation 
}) => {
  const [batches, setBatches] = useState<WasteBatch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [inspectBatch, setInspectBatch] = useState<WasteBatch | null>(null);

  useEffect(() => {
    setBatches(getBatches());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this waste record?')) {
      const updated = deleteBatch(id);
      setBatches(updated);
      if (inspectBatch?.id === id) {
        setInspectBatch(null);
      }
    }
  };

  const filteredBatches = batches.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || b.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleExportCSV = () => {
    if (batches.length === 0) return;
    const headers = ['ID', 'Name', 'Category', 'Weight (kg)', 'Moisture (%)', 'Initial pH', 'Location', 'Status', 'Process Stage', 'Date Added'];
    const rows = batches.map(b => [
      b.id,
      `"${b.name}"`,
      `"${b.category}"`,
      b.weightKg,
      b.moisturePercent,
      b.initialPh,
      `"${b.location}"`,
      `"${b.status}"`,
      `"${b.processStage || 'Active monitoring'}"`,
      `"${new Date(b.dateAdded).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BioCycle_Waste_Logbook_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (batches.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(batches, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `BioCycle_Waste_Logbook_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-emerald-950/90 via-[#0e241b] to-[#09120e] border border-emerald-700/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <History className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Saved History Logbook</h1>
              <p className="text-xs text-gray-300">Complete log of all saved waste entries and processing records</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/50 rounded-xl text-xs font-bold transition-all"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/50 rounded-xl text-xs font-bold transition-all"
            >
              <Download className="h-4 w-4" />
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 border border-emerald-800/40 bg-[#08150e] flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search entries or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#06120d] border border-emerald-800/60 rounded-xl text-white text-xs placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
          <Search className="h-4 w-4 text-emerald-500 absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-1.5 text-xs text-gray-400">
            <Filter className="h-3.5 w-3.5 text-emerald-400" />
            <span>Filter:</span>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#06120d] border border-emerald-800/60 rounded-xl text-emerald-300 text-xs font-semibold focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Food Scraps">Food Scraps</option>
            <option value="Yard Trimmings & Leaves">Yard Trimmings</option>
            <option value="Animal Manure">Animal Manure</option>
            <option value="Coffee Grounds">Coffee Grounds</option>
            <option value="Sawdust & Wood Chips">Sawdust</option>
            <option value="Cardboard & Paper Shreds">Cardboard</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#06120d] border border-emerald-800/60 rounded-xl text-emerald-300 text-xs font-semibold focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Optimal">Optimal</option>
            <option value="Caution">Caution</option>
            <option value="Harvest Ready">Harvest Ready</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

      </div>

      {/* Main Data Table */}
      <div className="glass-panel p-6 border border-emerald-800/30 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300 border-collapse">
            <thead>
              <tr className="bg-[#06120d] border-b border-emerald-900/50 text-[10px] uppercase font-bold text-gray-400">
                <th className="p-3">Batch Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Weight</th>
                <th className="p-3">Moisture</th>
                <th className="p-3">pH</th>
                <th className="p-3">Location</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/30">
              {filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-400 italic">
                    No matching waste entries found in localStorage logbook.
                  </td>
                </tr>
              ) : (
                filteredBatches.map(b => (
                  <tr 
                    key={b.id} 
                    onClick={() => setInspectBatch(b)}
                    className="hover:bg-emerald-950/30 cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-bold text-white">
                      <div>{b.name}</div>
                      <div className="text-[10px] text-emerald-400 font-normal">{b.treatmentMethod || 'Unassigned'}</div>
                    </td>
                    <td className="p-3 text-gray-300">{b.category}</td>
                    <td className="p-3 font-bold text-white">{b.weightKg} kg</td>
                    <td className="p-3 font-bold text-blue-400">{b.moisturePercent}%</td>
                    <td className="p-3 font-bold text-purple-400">{b.initialPh} pH</td>
                    <td className="p-3 text-emerald-300">{b.location}</td>
                    <td className="p-3">
                      <BatchStatusBadge status={b.status} />
                    </td>
                    <td className="p-3 text-gray-400">{new Date(b.dateAdded).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectBatchForMonitor) onSelectBatchForMonitor(b.id);
                          }}
                          title="Monitor Telemetry"
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-950/50 rounded-lg"
                        >
                          <Activity className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectBatchForRecommendation) onSelectBatchForRecommendation(b.id);
                          }}
                          title="View Recommendation"
                          className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/50 rounded-lg"
                        >
                          <Sparkles className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(b.id, e)}
                          title="Delete Record"
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg"
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

      {/* Inspect Batch Details Modal */}
      {inspectBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel p-6 max-w-lg w-full border border-emerald-600/50 bg-[#0a1811] space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-900/50 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Waste Record Details</span>
                <h3 className="text-xl font-bold text-white">{inspectBatch.name}</h3>
              </div>
              <button 
                onClick={() => setInspectBatch(null)}
                className="text-gray-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-[#06120d] p-4 rounded-xl border border-emerald-900/50">
                <div>
                  <span className="text-gray-400 block text-[10px]">Category</span>
                  <strong className="text-white text-sm">{inspectBatch.category}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Quantity</span>
                  <strong className="text-emerald-400 text-sm">{inspectBatch.weightKg} kg</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Wateriness / Moisture</span>
                  <strong className="text-blue-400 text-sm">{inspectBatch.moisturePercent}%</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Sourness (pH)</span>
                  <strong className="text-purple-400 text-sm">{inspectBatch.initialPh} pH</strong>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Source:</span>
                  <strong className="text-white">{inspectBatch.wasteSource}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Location:</span>
                  <strong className="text-emerald-300">{inspectBatch.location}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Recommended Process:</span>
                  <strong className="text-emerald-400">{inspectBatch.treatmentMethod || 'Unassigned'}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Process Stage:</span>
                  <strong className="text-teal-300">{inspectBatch.processStage || 'Active monitoring'}</strong>
                </div>
              </div>

              {inspectBatch.notes && (
                <div className="p-3 bg-[#05110b] rounded-xl border border-emerald-900/50 space-y-1">
                  <span className="text-[10px] text-gray-400 block font-bold">Notes:</span>
                  <p className="text-gray-300 leading-relaxed">{inspectBatch.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setInspectBatch(null)}
                className="px-4 py-2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-bold"
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
