import type { WasteBatch, ProcessReading, RecommendationResult, ImpactMetrics, ProcessStage } from '../types/biocycle';

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api'
  : '/api';

const STORAGE_KEYS = {
  BATCHES: 'biocycle_batches_v3',
  READINGS: 'biocycle_readings_v3',
  RECOMMENDATIONS: 'biocycle_recommendations_v3',
  IMPACT_SETTINGS: 'biocycle_impact_settings_v3',
};

export function initStorage(): void {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEYS.BATCHES)) {
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.READINGS)) {
    localStorage.setItem(STORAGE_KEYS.READINGS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS)) {
    localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify([]));
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
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
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
    const all: ProcessReading[] = data ? JSON.parse(data) : [];
    if (batchId) {
      return all.filter(r => r.batchId === batchId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
    return all;
  } catch (e) {
    return [];
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
