import type { WasteCategory } from '../types/biocycle';

export interface AIWasteAssistantResult {
  query: string;
  likelyCategory: WasteCategory | string;
  moistureTendency: string;
  possibleProcesses: string[];
  informationStillNeeded: string[];
  safetyWarnings: string[];
  isUncertain: boolean;
  uncertaintyMessage?: string;
  suggestedMoisturePercent: number;
  suggestedPh: number;
}

export function analyzeWasteDescription(input: string): AIWasteAssistantResult {
  const query = input.trim();
  const lower = query.toLowerCase();

  // Uncertainty Check: Very short or non-organic ambiguous queries
  if (lower.length < 4 || (!lower.includes('peel') && !lower.includes('scrap') && !lower.includes('leaf') && 
      !lower.includes('leaves') && !lower.includes('manure') && !lower.includes('waste') && 
      !lower.includes('coffee') && !lower.includes('fruit') && !lower.includes('veg') && 
      !lower.includes('straw') && !lower.includes('sawdust') && !lower.includes('grass') &&
      !lower.includes('food') && !lower.includes('organic') && !lower.includes('slurry') &&
      !lower.includes('cardboard') && !lower.includes('paper'))) {
    return {
      query,
      likelyCategory: 'Unknown / Ambiguous',
      moistureTendency: 'Uncertain (Needs manual verification)',
      possibleProcesses: ['Needs manual verification'],
      informationStillNeeded: [
        'Exact organic material composition',
        'Quantity in kilograms',
        'Initial pH measurement',
        'Moisture content percentage (%)'
      ],
      safetyWarnings: [
        'Needs manual verification: Unrecognized waste text input. Inspect for non-biodegradable plastics or chemical contaminants.'
      ],
      isUncertain: true,
      uncertaintyMessage: 'Needs manual verification',
      suggestedMoisturePercent: 55,
      suggestedPh: 6.5
    };
  }

  let likelyCategory: WasteCategory = 'Food Scraps';
  let moistureTendency = 'High Moisture (>65%)';
  let suggestedMoisturePercent = 70;
  let suggestedPh = 6.2;
  const possibleProcesses: string[] = [];
  const informationStillNeeded: string[] = [];
  const safetyWarnings: string[] = [];

  // Keyword Matching Rules
  const isManure = lower.includes('manure') || lower.includes('dung') || lower.includes('barn') || lower.includes('poultry') || lower.includes('cow') || lower.includes('horse') || lower.includes('slurry');
  const isLeavesYard = lower.includes('leaf') || lower.includes('leaves') || lower.includes('straw') || lower.includes('yard') || lower.includes('grass') || lower.includes('branch') || lower.includes('pruning');
  const isCoffee = lower.includes('coffee') || lower.includes('grounds') || lower.includes('espresso');
  const isWood = lower.includes('sawdust') || lower.includes('wood') || lower.includes('shaving') || lower.includes('chip');
  const isPaper = lower.includes('cardboard') || lower.includes('paper');

  const mentionsWet = lower.includes('wet') || lower.includes('slush') || lower.includes('juicy') || lower.includes('watery') || lower.includes('soaked');
  const mentionsDry = lower.includes('dry') || lower.includes('crisp') || lower.includes('desiccated') || lower.includes('withered');

  // Category determination
  if (isManure) {
    likelyCategory = 'Animal Manure';
    moistureTendency = mentionsDry ? 'Moderate Moisture (50-60%)' : 'High Moisture (>75%)';
    suggestedMoisturePercent = mentionsDry ? 55 : 80;
    suggestedPh = 7.4;
    possibleProcesses.push('Anaerobic Digestion (Primary)', 'Thermophilic Composting (with dry carbon addition)');
    safetyWarnings.push('Pathogen Precaution: Fecal coliforms may be present. Maintain thermal heat >55°C for at least 72 hours.');
  } else if (isLeavesYard) {
    likelyCategory = 'Yard Trimmings & Leaves';
    moistureTendency = mentionsWet ? 'Moderate Moisture (55-65%)' : 'Low Moisture (<35%)';
    suggestedMoisturePercent = mentionsWet ? 60 : 30;
    suggestedPh = 6.8;
    possibleProcesses.push('Aerobic Composting', 'Mulching & Soil Cover');
    if (!mentionsWet) {
      safetyWarnings.push('Moisture Deficit: Dry brown leaves slow decomposition. Add green nitrogen or water.');
    }
  } else if (isCoffee) {
    likelyCategory = 'Coffee Grounds';
    moistureTendency = 'Moderate to High Moisture (55-65%)';
    suggestedMoisturePercent = 60;
    suggestedPh = 5.5;
    possibleProcesses.push('Vermicomposting (Worm Farm Bedding)', 'Aerobic Composting');
    safetyWarnings.push('Mild Acidity: Spent grounds have a slightly acidic pH (~5.5). Blend with carbonaceous bedding.');
  } else if (isWood) {
    likelyCategory = 'Sawdust & Wood Chips';
    moistureTendency = 'Low Moisture (<20%)';
    suggestedMoisturePercent = 18;
    suggestedPh = 6.2;
    possibleProcesses.push('Carbon Bulking Agent for High-N Waste', 'Mushroom Substrate');
    safetyWarnings.push('Extreme High C:N Ratio (~400:1): Will cause nitrogen immobilization if applied uncomposted.');
  } else if (isPaper) {
    likelyCategory = 'Cardboard & Paper Shreds';
    moistureTendency = 'Very Low Moisture (<15%)';
    suggestedMoisturePercent = 12;
    suggestedPh = 7.0;
    possibleProcesses.push('Vermicomposting Carbon Bedding', 'Compost Carbon Amendment');
  } else {
    likelyCategory = 'Food Scraps';
    moistureTendency = mentionsDry ? 'Moderate Moisture (45-55%)' : 'High Moisture (>70%)';
    suggestedMoisturePercent = mentionsDry ? 50 : 75;
    suggestedPh = lower.includes('citrus') || lower.includes('tomato') ? 4.8 : 6.2;
    possibleProcesses.push('Aerobic Composting', 'Anaerobic Digestion', 'Black Soldier Fly Larvae (BSFL) Farming');
  }

  // Acidic keyword check
  if (lower.includes('citrus') || lower.includes('lemon') || lower.includes('orange') || lower.includes('vinegar') || lower.includes('sour') || lower.includes('pickle') || lower.includes('acid')) {
    suggestedPh = 4.5;
    safetyWarnings.push('Acidic-Material Warning: Acidic organic matter detected (pH < 5.0). May inhibit beneficial bacterial activity.');
  }

  // Information Still Needed list
  informationStillNeeded.push(
    'Exact Batch Weight in kilograms (kg)',
    'Verified Laboratory pH Measurement',
    'Actual Moisture Content (%) via moisture meter or oven-dry test',
    'Physical Contaminant Safety Verification (plastic, glass, metal inspection)'
  );

  return {
    query,
    likelyCategory,
    moistureTendency,
    possibleProcesses,
    informationStillNeeded,
    safetyWarnings,
    isUncertain: false,
    suggestedMoisturePercent,
    suggestedPh
  };
}
