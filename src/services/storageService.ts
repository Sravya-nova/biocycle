import type { WasteBatch, ProcessReading, RecommendationResult, ImpactMetrics, ProcessStage } from '../types/biocycle';
import { calculateRecommendation } from './recommendationEngine';

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api'
  : '/api';

const STORAGE_KEYS = {
  BATCHES: 'biocycle_batches_v3',
  READINGS: 'biocycle_readings_v3',
  RECOMMENDATIONS: 'biocycle_recommendations_v3',
  IMPACT_SETTINGS: 'biocycle_impact_settings_v3',
};

// Initial Seed Batches with processStage
const SEED_BATCHES: WasteBatch[] = [
  {
    id: 'batch_seed_101',
    name: 'Central Dining Hall Food Scraps',
    category: 'Food Scraps',
    weightKg: 185,
    moisturePercent: 72,
    cnRatio: 16,
    initialPh: 6.2,
    wasteSource: 'Commercial Restaurant / Dining',
    location: 'Zone A - Aerobic Compost Bay 2',
    status: 'Optimal',
    processStage: 'Active monitoring',
    treatmentMethod: 'Composting',
    dateAdded: new Date(Date.now() - 14 * 86400000).toISOString(),
    notes: 'Mixed kitchen prep waste, fruit skins, and cooked rice.',
    hasContaminants: false,
    targetHarvestDate: new Date(Date.now() + 31 * 86400000).toISOString()
  },
  {
    id: 'batch_seed_102',
    name: 'Artisan Cafe Spent Grounds',
    category: 'Coffee Grounds',
    weightKg: 65,
    moisturePercent: 62,
    cnRatio: 21,
    initialPh: 5.4,
    wasteSource: 'Commercial Restaurant / Dining',
    location: 'Zone B - Vermicompost Bin 3',
    status: 'Optimal',
    processStage: 'Maturation',
    treatmentMethod: 'Vermicomposting',
    dateAdded: new Date(Date.now() - 22 * 86400000).toISOString(),
    notes: 'Pure espresso grounds mixed with 30% shredded brown cardboard bedding.',
    hasContaminants: false,
    targetHarvestDate: new Date(Date.now() + 38 * 86400000).toISOString()
  },
  {
    id: 'batch_seed_103',
    name: 'Dairy Barn Slurry Unit #4',
    category: 'Animal Manure',
    weightKg: 820,
    moisturePercent: 84,
    cnRatio: 17,
    initialPh: 7.2,
    wasteSource: 'Farm & Livestock',
    location: 'Digester Vault - Unit 1',
    status: 'Processing',
    processStage: 'Active monitoring',
    treatmentMethod: 'Anaerobic Digestion',
    dateAdded: new Date(Date.now() - 8 * 86400000).toISOString(),
    notes: 'Bovine manure combined with whey wastewater. Producing active methane.',
    hasContaminants: false,
    targetHarvestDate: new Date(Date.now() + 17 * 86400000).toISOString()
  },
  {
    id: 'batch_seed_104',
    name: 'Greenhouse Tomato Vines & Straw',
    category: 'Agricultural Residue',
    weightKg: 290,
    moisturePercent: 55,
    cnRatio: 32,
    initialPh: 6.8,
    wasteSource: 'Agricultural Processing',
    location: 'Zone A - Aerobic Compost Bay 1',
    status: 'Harvest Ready',
    processStage: 'Ready for laboratory testing',
    treatmentMethod: 'Composting',
    dateAdded: new Date(Date.now() - 48 * 86400000).toISOString(),
    notes: 'Dark rich humic odor. Thermal cycle complete.',
    hasContaminants: false,
    targetHarvestDate: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'batch_seed_105',
    name: 'Orchard Prunings & Dry Leaves',
    category: 'Yard Trimmings & Leaves',
    weightKg: 340,
    moisturePercent: 32,
    cnRatio: 65,
    initialPh: 6.8,
    wasteSource: 'Municipal Yard Waste',
    location: 'Zone C - Windrow 1',
    status: 'Pending Recommendation',
    processStage: 'Not started',
    treatmentMethod: 'Composting',
    dateAdded: new Date(Date.now() - 2 * 86400000).toISOString(),
    notes: 'Dry branches chipped to 20mm with fall foliage.',
    hasContaminants: false
  }
];

// Initial Seed Telemetry Readings with OdorObservation
const SEED_READINGS: ProcessReading[] = [
  {
    id: 'rd_101_1',
    batchId: 'batch_seed_101',
    timestamp: new Date(Date.now() - 12 * 86400000).toISOString(),
    temperatureC: 42,
    phLevel: 6.2,
    moisturePercent: 70,
    odorObservation: 'Earthy / Fresh Soil (Normal)',
    healthStatus: 'Optimal',
    notes: 'Active thermophilic phase starting.'
  },
  {
    id: 'rd_101_2',
    batchId: 'batch_seed_101',
    timestamp: new Date(Date.now() - 8 * 86400000).toISOString(),
    temperatureC: 58,
    phLevel: 6.8,
    moisturePercent: 65,
    odorObservation: 'Earthy / Fresh Soil (Normal)',
    healthStatus: 'Optimal',
    notes: 'Peak heat recorded. Pathogens neutralising.'
  },
  {
    id: 'rd_101_3',
    batchId: 'batch_seed_101',
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    temperatureC: 52,
    phLevel: 7.2,
    moisturePercent: 61,
    odorObservation: 'Earthy / Fresh Soil (Normal)',
    healthStatus: 'Optimal',
    actionTaken: 'Turned pile for aeration.',
    notes: 'Oxygen revived post-turn.'
  },
  {
    id: 'rd_102_1',
    batchId: 'batch_seed_102',
    timestamp: new Date(Date.now() - 15 * 86400000).toISOString(),
    temperatureC: 24,
    phLevel: 6.9,
    moisturePercent: 68,
    odorObservation: 'Earthy / Fresh Soil (Normal)',
    healthStatus: 'Optimal',
    notes: 'Worms actively feeding in top bedding layer.'
  },
  {
    id: 'rd_102_2',
    batchId: 'batch_seed_102',
    timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
    temperatureC: 25,
    phLevel: 7.1,
    moisturePercent: 64,
    odorObservation: 'Earthy / Fresh Soil (Normal)',
    healthStatus: 'Optimal',
    notes: 'Granular worm castings forming.'
  }
];

export function initStorage(): void {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEYS.BATCHES)) {
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(SEED_BATCHES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.READINGS)) {
    localStorage.setItem(STORAGE_KEYS.READINGS, JSON.stringify(SEED_READINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS)) {
    const recs: RecommendationResult[] = SEED_BATCHES.map(b => calculateRecommendation(b));
    localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(recs));
  }
}

// Auto-initialize storage on module load
initStorage();

// Sync with backend API in background
async function syncBatchWithBackend(batch: WasteBatch) {
  try {
    await fetch(`${API_BASE_URL}/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        waste_type: batch.category || batch.name,
        quantity_kg: batch.weightKg,
        moisture_percent: batch.moisturePercent,
        initial_ph: batch.initialPh,
        source: batch.wasteSource,
        description: batch.notes || undefined,
        status: batch.status
      })
    });
  } catch (e) {
    // Offline fallback - ignore network error
  }
}

// BATCH CRUD
export function getBatches(): WasteBatch[] {
  initStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BATCHES);
    return data ? JSON.parse(data) : SEED_BATCHES;
  } catch (e) {
    return SEED_BATCHES;
  }
}

export function saveBatch(batch: WasteBatch): WasteBatch[] {
  const batches = getBatches();
  const index = batches.findIndex(b => b.id === batch.id);
  if (index >= 0) {
    batches[index] = batch;
  } else {
    batches.unshift(batch);
  }
  localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
  
  // Background API Sync
  syncBatchWithBackend(batch);

  return batches;
}

export function updateBatchProcessStage(batchId: string, stage: ProcessStage): WasteBatch[] {
  const batches = getBatches();
  const index = batches.findIndex(b => b.id === batchId);
  if (index >= 0) {
    batches[index].processStage = stage;
    if (stage === 'Ready for laboratory testing') {
      batches[index].status = 'Harvest Ready';
    }
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
  }
  return batches;
}

export function deleteBatch(id: string): WasteBatch[] {
  const batches = getBatches().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
  const readings = getReadings().filter(r => r.batchId !== id);
  localStorage.setItem(STORAGE_KEYS.READINGS, JSON.stringify(readings));
  return batches;
}

// PROCESS READINGS CRUD
export function getReadings(batchId?: string): ProcessReading[] {
  initStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.READINGS);
    const all: ProcessReading[] = data ? JSON.parse(data) : SEED_READINGS;
    if (batchId) {
      return all.filter(r => r.batchId === batchId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
    return all;
  } catch (e) {
    return SEED_READINGS;
  }
}

export function addReading(reading: Omit<ProcessReading, 'id'>): ProcessReading[] {
  const readings = getReadings();
  const newReading: ProcessReading = {
    ...reading,
    id: 'rd_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5)
  };
  readings.push(newReading);
  localStorage.setItem(STORAGE_KEYS.READINGS, JSON.stringify(readings));
  return readings;
}

// RECOMMENDATIONS CRUD
export function getRecommendations(): RecommendationResult[] {
  initStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveRecommendation(rec: RecommendationResult): void {
  const recs = getRecommendations();
  const idx = recs.findIndex(r => r.batchId === rec.batchId);
  if (idx >= 0) {
    recs[idx] = rec;
  } else {
    recs.unshift(rec);
  }
  localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(recs));
}

// IMPACT COMPUTATION
export function getImpactMetrics(): ImpactMetrics {
  const batches = getBatches();
  let totalWasteKg = 0;
  let biofertilizerProducedL = 0;
  let compostProducedKg = 0;

  batches.forEach(b => {
    totalWasteKg += b.weightKg;
    if (b.treatmentMethod === 'Composting' || b.treatmentMethod === 'Vermicomposting') {
      compostProducedKg += b.weightKg * 0.5;
    }
    if (b.treatmentMethod === 'Anaerobic Digestion' || b.treatmentMethod === 'Biofertilizer Fermentation') {
      biofertilizerProducedL += b.weightKg * 0.8;
    }
  });

  const co2eSavedKg = Math.round(totalWasteKg * 1.85);
  const methanePreventedKg = Math.round(totalWasteKg * 0.08);
  const landfillDivertedM3 = Number((totalWasteKg / 450).toFixed(2));
  const financialSavingsUSD = Math.round((totalWasteKg / 1000) * 85 + (compostProducedKg * 0.40) + (biofertilizerProducedL * 0.25));

  return {
    totalWasteKg,
    co2eSavedKg,
    methanePreventedKg,
    biofertilizerProducedL: Math.round(biofertilizerProducedL),
    compostProducedKg: Math.round(compostProducedKg),
    landfillDivertedM3,
    financialSavingsUSD
  };
}

export function resetStorageToDefaults(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.BATCHES);
  localStorage.removeItem(STORAGE_KEYS.READINGS);
  localStorage.removeItem(STORAGE_KEYS.RECOMMENDATIONS);
  localStorage.removeItem(STORAGE_KEYS.IMPACT_SETTINGS);
  initStorage();
}
