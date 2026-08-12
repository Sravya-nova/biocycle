export type TreatmentMethod = 
  | 'Composting' 
  | 'Vermicomposting' 
  | 'Anaerobic Digestion' 
  | 'Biofertilizer Fermentation';

export type BatchStatus = 
  | 'Pending Recommendation'
  | 'Processing'
  | 'Optimal'
  | 'Caution'
  | 'Harvest Ready'
  | 'Completed'
  | 'Archived';

export type ProcessStage = 
  | 'Not started'
  | 'Active monitoring'
  | 'Maturation'
  | 'Ready for laboratory testing';

export type WasteCategory = 
  | 'Food Scraps'
  | 'Coffee Grounds'
  | 'Yard Trimmings & Leaves'
  | 'Animal Manure'
  | 'Agricultural Residue'
  | 'Sawdust & Wood Chips'
  | 'Cardboard & Paper Shreds';

export interface WasteCategoryMeta {
  name: WasteCategory;
  defaultCNRatio: number;
  defaultMoisturePercent: number;
  nitrogenRich: boolean;
  icon: string;
  description: string;
}

export type WasteSource =
  | 'Household Kitchen'
  | 'Commercial Restaurant / Dining'
  | 'Farm & Livestock'
  | 'Agricultural Processing'
  | 'Municipal Yard Waste'
  | 'Industrial Food Processing';

export interface WasteBatch {
  id: string;
  name: string;
  category: WasteCategory;
  weightKg: number;
  moisturePercent: number;
  cnRatio: number;
  initialPh: number;
  wasteSource: WasteSource;
  location: string;
  status: BatchStatus;
  processStage: ProcessStage;
  treatmentMethod?: TreatmentMethod;
  dateAdded: string; // ISO string
  notes?: string;
  hasContaminants: boolean;
  contaminantNotes?: string;
  targetHarvestDate?: string;
}

export type OdorObservation =
  | 'Earthy / Fresh Soil (Normal)'
  | 'Mild Sweet-Sour (Active Fermentation)'
  | 'Pungent Ammonia (Excess Nitrogen)'
  | 'Foul Anaerobic / H2S (Rotten Odor)'
  | 'Odorless';

export interface ProcessReading {
  id: string;
  batchId: string;
  timestamp: string; // ISO date string
  temperatureC: number;
  phLevel: number;
  moisturePercent: number;
  odorObservation: OdorObservation;
  healthStatus: 'Optimal' | 'Caution' | 'Critical';
  actionTaken?: string;
  notes?: string;
  warnings?: string[];
}

export interface RuleEvaluation {
  ruleId: string;
  ruleTitle: string;
  conditionText: string;
  isMatched: boolean;
  explanation: string;
  category: 'recommendation' | 'warning' | 'adjustment';
}

export interface RecipeAdjustment {
  amendment: string;
  amountKg: number;
  reason: string;
  type: 'add_carbon' | 'add_nitrogen' | 'add_water' | 'add_aeration' | 'adjust_ph';
}

export interface ExpectedYield {
  compostKg: number;
  biogasM3: number;
  biofertilizerLiters: number;
  co2eSavedKg: number;
}

export interface RecommendationResult {
  id: string;
  batchId: string;
  batchName: string;
  wasteType: WasteCategory;
  weightKg: number;
  moisturePercent: number;
  initialPh: number;
  wasteSource: WasteSource;
  recommendedMethod: TreatmentMethod;
  confidenceScore: number;
  primaryReason: string;
  warnings: string[];
  suggestedActions: string[];
  ruleEvaluations: RuleEvaluation[];
  recipeAdjustments: RecipeAdjustment[];
  expectedYield: ExpectedYield;
  estimatedDurationDays: number;
  keyInstructions: string[];
  createdAt: string;
}

export interface ImpactMetrics {
  totalWasteKg: number;
  co2eSavedKg: number;
  methanePreventedKg: number;
  biofertilizerProducedL: number;
  compostProducedKg: number;
  landfillDivertedM3: number;
  financialSavingsUSD: number;
}
