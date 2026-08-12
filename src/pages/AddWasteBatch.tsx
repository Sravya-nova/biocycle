import React, { useState } from 'react';
import type { WasteCategory, WasteBatch, WasteSource, RecommendationResult } from '../types/biocycle';
import { WASTE_CATEGORIES } from '../data/categories';
import { saveBatch, saveRecommendation } from '../services/storageService';
import { calculateRecommendation } from '../services/recommendationEngine';
import type { NavTab } from '../components/Navbar';
import { 
  PlusCircle, 
  Scale, 
  Droplets, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert,
  FlaskConical,
  Building2,
  Calendar,
  Info
} from 'lucide-react';

interface AddWasteBatchProps {
  setActiveTab: (tab: NavTab) => void;
  onBatchAdded?: (batch: WasteBatch) => void;
}

export const AddWasteBatch: React.FC<AddWasteBatchProps> = ({ setActiveTab, onBatchAdded }) => {
  // Form State
  const [wasteTypeOption, setWasteTypeOption] = useState<string>('Banana Peels (Fruit Scraps)');
  const [weightKg, setWeightKg] = useState<number>(100);
  const [moisturePercent, setMoisturePercent] = useState<number>(75);
  const [initialPh, setInitialPh] = useState<number>(6.5);
  const [wasteSource, setWasteSource] = useState<WasteSource>('Household Kitchen');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('Zone A - Aerobic Compost Bay 1');

  // Validation Error Messages State
  const [errors, setErrors] = useState<{ weight?: string; moisture?: string; ph?: string }>({});

  // Generated Result State upon submission
  const [submittedResult, setSubmittedResult] = useState<{
    batch: WasteBatch;
    recommendation: RecommendationResult;
  } | null>(null);

  const handleWasteTypeChange = (optionKey: string) => {
    setWasteTypeOption(optionKey);
    const meta = WASTE_CATEGORIES[optionKey];
    if (meta) {
      setMoisturePercent(meta.defaultMoisturePercent);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { weight?: string; moisture?: string; ph?: string } = {};

    if (weightKg <= 0 || isNaN(weightKg)) {
      newErrors.weight = 'Quantity must be greater than 0 kg.';
    }

    if (moisturePercent < 0 || moisturePercent > 100 || isNaN(moisturePercent)) {
      newErrors.moisture = 'Moisture percentage must be between 0% and 100%.';
    }

    if (initialPh < 0 || initialPh > 14 || isNaN(initialPh)) {
      newErrors.ph = 'Initial pH must be between 0.0 and 14.0.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const categoryMeta = WASTE_CATEGORIES[wasteTypeOption];
    const category: WasteCategory = categoryMeta ? categoryMeta.name : 'Food Scraps';
    const cnRatio = categoryMeta ? categoryMeta.defaultCNRatio : 20;

    const newBatch: WasteBatch = {
      id: 'batch_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      name: `${wasteTypeOption} Batch`,
      category,
      weightKg: Number(weightKg),
      moisturePercent: Number(moisturePercent),
      cnRatio,
      initialPh: Number(initialPh),
      wasteSource,
      location: location.trim() || 'Bay 1',
      status: 'Processing',
      processStage: 'Active monitoring',
      dateAdded: new Date(date).toISOString(),
      notes: description.trim() || undefined,
      hasContaminants: false
    };

    // 1. Save Batch to localStorage
    saveBatch(newBatch);

    // 2. Immediately Generate Recommendation using the biotechnology engine
    const recommendation = calculateRecommendation(newBatch);

    // Update batch status & harvest date with recommendation
    newBatch.treatmentMethod = recommendation.recommendedMethod;
    newBatch.targetHarvestDate = new Date(Date.now() + recommendation.estimatedDurationDays * 86400000).toISOString();
    saveBatch(newBatch);

    // 3. Save Recommendation to localStorage
    saveRecommendation(recommendation);

    // 4. Set Success Result
    setSubmittedResult({
      batch: newBatch,
      recommendation
    });

    if (onBatchAdded) {
      onBatchAdded(newBatch);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-emerald-950/90 via-[#0e241b] to-[#09120e] border border-emerald-700/30">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <PlusCircle className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Add Waste Batch</h1>
            <p className="text-xs text-gray-300">Log incoming organic waste stream and trigger immediate biological recommendation</p>
          </div>
        </div>
      </div>

      {submittedResult ? (
        /* Success Message & Immediate Recommendation Display */
        <div className="glass-panel p-6 sm:p-8 space-y-6 border border-emerald-500/50 bg-gradient-to-br from-emerald-950/60 via-[#0a1e14] to-[#09120e]">
          
          <div className="flex items-center space-x-3 border-b border-emerald-800/50 pb-4">
            <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">Batch Logged & Recommendation Generated</span>
              <h2 className="text-xl font-bold text-white">
                {submittedResult.batch.name} ({submittedResult.batch.weightKg} kg)
              </h2>
            </div>
          </div>

          {/* Immediate Recommendation Summary Card */}
          <div className="bg-[#071710] p-6 rounded-2xl border border-emerald-600/50 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Recommended Treatment:</span>
                <span className="text-lg font-extrabold text-white px-3 py-1 bg-emerald-900/80 rounded-lg border border-emerald-600">
                  {submittedResult.recommendation.recommendedMethod}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-700">
                Match Score: {submittedResult.recommendation.confidenceScore}%
              </span>
            </div>

            <p className="text-xs text-gray-200 leading-relaxed font-medium">
              {submittedResult.recommendation.primaryReason}
            </p>

            {/* Active Warnings if any */}
            {submittedResult.recommendation.warnings.length > 0 && (
              <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl space-y-1 text-xs text-red-200">
                <div className="flex items-center space-x-1.5 font-bold text-red-400">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Active Warnings:</span>
                </div>
                {submittedResult.recommendation.warnings.map((w, idx) => (
                  <p key={idx}>• {w}</p>
                ))}
              </div>
            )}

            {/* Suggested Actions */}
            {submittedResult.recommendation.suggestedActions.length > 0 && (
              <div className="space-y-1.5 text-xs text-emerald-200">
                <span className="font-bold text-emerald-300 flex items-center space-x-1">
                  <Info className="h-4 w-4 text-emerald-400" />
                  <span>Immediate Suggested Actions:</span>
                </span>
                {submittedResult.recommendation.suggestedActions.map((act, idx) => (
                  <div key={idx} className="bg-[#05110b] p-2.5 rounded-lg border border-emerald-900/60 text-gray-300">
                    ➜ {act}
                  </div>
                ))}
              </div>
            )}

            {/* Output Yields Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
              {submittedResult.recommendation.expectedYield.compostKg > 0 && (
                <div className="bg-[#05110b] p-3 rounded-lg border border-emerald-900/50">
                  <span className="text-gray-400 block text-[10px]">Compost Yield</span>
                  <strong className="text-emerald-400 text-base">{submittedResult.recommendation.expectedYield.compostKg} kg</strong>
                </div>
              )}
              {submittedResult.recommendation.expectedYield.biogasM3 > 0 && (
                <div className="bg-[#05110b] p-3 rounded-lg border border-emerald-900/50">
                  <span className="text-gray-400 block text-[10px]">Biogas Yield</span>
                  <strong className="text-amber-400 text-base">{submittedResult.recommendation.expectedYield.biogasM3} m³</strong>
                </div>
              )}
              {submittedResult.recommendation.expectedYield.biofertilizerLiters > 0 && (
                <div className="bg-[#05110b] p-3 rounded-lg border border-emerald-900/50">
                  <span className="text-gray-400 block text-[10px]">Biofertilizer</span>
                  <strong className="text-blue-400 text-base">{submittedResult.recommendation.expectedYield.biofertilizerLiters} L</strong>
                </div>
              )}
              <div className="bg-[#05110b] p-3 rounded-lg border border-emerald-900/50">
                <span className="text-gray-400 block text-[10px]">Est. Duration</span>
                <strong className="text-white text-base">{submittedResult.recommendation.estimatedDurationDays} Days</strong>
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap justify-end gap-4 pt-2">
            <button
              onClick={() => setActiveTab('recommendation')}
              className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl shadow-lg transition-all text-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span>Inspect Full Rule Logic Tracing</span>
            </button>
            <button
              onClick={() => {
                setSubmittedResult(null);
                setWeightKg(100);
              }}
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-950 text-emerald-300 border border-emerald-700/50 rounded-xl hover:bg-emerald-900 transition-all text-sm font-semibold"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Another Batch</span>
            </button>
          </div>

        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-panel p-6 space-y-6 border border-emerald-800/30">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. Waste Type Dropdown */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Waste Type Sample Options *
                </label>
                <select
                  value={wasteTypeOption}
                  onChange={(e) => handleWasteTypeChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#07130e] border border-emerald-800/50 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                >
                  <option value="Banana Peels (Fruit Scraps)">Banana Peels (Fruit Scraps)</option>
                  <option value="Vegetable Waste (Kitchen Scraps)">Vegetable Waste (Kitchen Scraps)</option>
                  <option value="Dry Leaves & Straw">Dry Leaves & Straw</option>
                  <option value="Mixed Food Waste">Mixed Food Waste</option>
                  <option value="Animal Manure">Animal Manure</option>
                  <option value="Coffee Grounds">Coffee Grounds</option>
                  <option value="Sawdust & Wood Chips">Sawdust & Wood Chips</option>
                  <option value="Cardboard & Paper Shreds">Cardboard & Paper Shreds</option>
                </select>
                <p className="text-[11px] text-gray-400">
                  {WASTE_CATEGORIES[wasteTypeOption]?.description}
                </p>
              </div>

              {/* 2. Quantity in Kilograms */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Quantity (kilograms) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    placeholder="e.g. 100"
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#07130e] border rounded-xl text-white focus:outline-none text-sm ${
                      errors.weight ? 'border-red-500 focus:border-red-400' : 'border-emerald-800/50 focus:border-emerald-500'
                    }`}
                  />
                  <Scale className="h-4 w-4 text-emerald-500 absolute left-3 top-3" />
                </div>
                {errors.weight && (
                  <p className="text-xs text-red-400 font-semibold">{errors.weight}</p>
                )}
              </div>

              {/* 3. Moisture Percentage */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="font-bold text-gray-300 uppercase tracking-wider">Moisture Percentage (%) *</label>
                  <span className="font-extrabold text-blue-400">{moisturePercent}%</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={moisturePercent}
                    onChange={(e) => setMoisturePercent(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#07130e] border rounded-xl text-white text-sm focus:outline-none ${
                      errors.moisture ? 'border-red-500 focus:border-red-400' : 'border-emerald-800/50 focus:border-emerald-500'
                    }`}
                  />
                  <Droplets className="h-4 w-4 text-blue-400 absolute left-3 top-3" />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={moisturePercent}
                  onChange={(e) => setMoisturePercent(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer mt-1"
                />
                {errors.moisture && (
                  <p className="text-xs text-red-400 font-semibold">{errors.moisture}</p>
                )}
              </div>

              {/* 4. Initial pH */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="font-bold text-gray-300 uppercase tracking-wider">Initial pH *</label>
                  <span className={`font-extrabold ${initialPh < 5 ? 'text-red-400 font-extrabold' : 'text-purple-300'}`}>
                    {initialPh} pH {initialPh < 5 ? '(Acidic Warning)' : ''}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="14"
                    step="0.1"
                    value={initialPh}
                    onChange={(e) => setInitialPh(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#07130e] border rounded-xl text-white text-sm focus:outline-none ${
                      errors.ph ? 'border-red-500 focus:border-red-400' : 'border-emerald-800/50 focus:border-emerald-500'
                    }`}
                  />
                  <FlaskConical className="h-4 w-4 text-purple-400 absolute left-3 top-3" />
                </div>
                <input
                  type="range"
                  min="0"
                  max="14"
                  step="0.1"
                  value={initialPh}
                  onChange={(e) => setInitialPh(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer mt-1"
                />
                {errors.ph && (
                  <p className="text-xs text-red-400 font-semibold">{errors.ph}</p>
                )}
              </div>

              {/* 5. Source */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">Source *</label>
                <div className="relative">
                  <select
                    value={wasteSource}
                    onChange={(e) => setWasteSource(e.target.value as WasteSource)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#07130e] border border-emerald-800/50 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                  >
                    <option value="Household Kitchen">Household Kitchen</option>
                    <option value="Commercial Restaurant / Dining">Commercial Restaurant / Dining</option>
                    <option value="Farm & Livestock">Farm & Livestock</option>
                    <option value="Agricultural Processing">Agricultural Processing</option>
                    <option value="Municipal Yard Waste">Municipal Yard Waste</option>
                    <option value="Industrial Food Processing">Industrial Food Processing</option>
                  </select>
                  <Building2 className="h-4 w-4 text-emerald-500 absolute left-3 top-3" />
                </div>
              </div>

              {/* 6. Date */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">Date *</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#07130e] border border-emerald-800/50 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <Calendar className="h-4 w-4 text-emerald-500 absolute left-3 top-3" />
                </div>
              </div>

            </div>

            {/* Optional Facility Location */}
            <div className="space-y-2 pt-2 border-t border-emerald-900/40">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">Processing Bay / Facility Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Zone A - Aerobic Compost Bay 1"
                className="w-full px-4 py-2 bg-[#07130e] border border-emerald-800/50 rounded-xl text-white text-xs placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* 7. Optional Description / Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">Optional Description & Source Notes</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Supplier notes, moisture origin, pre-shredding particle size..."
                className="w-full px-4 py-2.5 bg-[#07130e] border border-emerald-800/50 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl shadow-lg transition-all text-sm"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>Save Batch & Generate Immediate Recommendation</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
