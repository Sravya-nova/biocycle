import type { WasteBatch, RecommendationResult, TreatmentMethod, RecipeAdjustment, ExpectedYield, RuleEvaluation, WasteCategory } from '../types/biocycle';

export function detectWasteCategoryFromText(textInput: string, sourceInput?: string): {
  category: WasteCategory;
  explanation: string;
  confidence: number;
} {
  const combined = (textInput + ' ' + (sourceInput || '')).toLowerCase();

  if (combined.match(/\b(manure|dung|slurry|cow|cattle|bovine|horse|poultry|chicken|gobar|farm|livestock|barn)\b/i)) {
    return {
      category: 'Animal Manure',
      explanation: "Detected Animal Manure / Farm Barn Waste based on terms matching livestock manure.",
      confidence: 95
    };
  }

  if (combined.match(/\b(coffee|espresso|tea|grounds|spent|cafe)\b/i)) {
    return {
      category: 'Coffee Grounds',
      explanation: "Detected Coffee / Tea Grounds based on cafe and beverage organic residues.",
      confidence: 95
    };
  }

  if (combined.match(/\b(banana|peel|peels|vegetable|vegetables|fruit|fruits|kitchen|cabbage|spinach|apple|food|dining|canteen|restaurant|curry|rice|food scraps)\b/i)) {
    return {
      category: 'Food Scraps',
      explanation: "Detected Food Scraps (Fruit & Vegetable Scraps) from kitchen prep or dining waste.",
      confidence: 92
    };
  }

  if (combined.match(/\b(leaf|leaves|grass|yard|pruning|prunings|garden|foliage|pine|weed|lawn)\b/i)) {
    return {
      category: 'Yard Trimmings & Leaves',
      explanation: "Detected Yard Trimmings & Fallen Leaves from garden or municipal maintenance.",
      confidence: 90
    };
  }

  if (combined.match(/\b(crop|straw|husk|chaff|bagasse|stalk|paddy|wheat|corn|sugarcane|harvest|vines)\b/i)) {
    return {
      category: 'Agricultural Residue',
      explanation: "Detected Agricultural Crop Residue from farm harvest and crop processing.",
      confidence: 90
    };
  }

  if (combined.match(/\b(sawdust|wood|timber|shaving|shavings|bark|lumber|carpentry)\b/i)) {
    return {
      category: 'Sawdust & Wood Chips',
      explanation: "Detected Wood Sawdust & Timber Chips from wood cutting or carpentry.",
      confidence: 92
    };
  }

  if (combined.match(/\b(cardboard|paper|carton|shred|shredded|packaging|box|newspaper)\b/i)) {
    return {
      category: 'Cardboard & Paper Shreds',
      explanation: "Detected Cardboard & Paper Shreds from unprinted packaging scraps.",
      confidence: 90
    };
  }

  return {
    category: 'Food Scraps',
    explanation: "General organic waste stream detected. Defaulting to Food Scraps.",
    confidence: 75
  };
}

export function calculateRecommendation(batch: WasteBatch): RecommendationResult {
  const { weightKg, moisturePercent, cnRatio, category, initialPh, wasteSource, hasContaminants, name, notes } = batch;

  // Smart Category Auto-Detection from human inserted text
  const detectedCategory = detectWasteCategoryFromText(name + ' ' + (notes || ''), category || wasteSource);

  const warnings: string[] = [];
  const suggestedActions: string[] = [];
  const ruleEvaluations: RuleEvaluation[] = [];

  // Track scoring for treatment options
  const scores: Record<TreatmentMethod, number> = {
    'Composting': 50,
    'Vermicomposting': 40,
    'Anaerobic Digestion': 40,
    'Biofertilizer Fermentation': 40
  };

  // Rule 1: Fruit or vegetable waste with moisture above 60%
  const effectiveCategory: WasteCategory = detectedCategory.category || category || 'Food Scraps';
  const isFruitVeg = effectiveCategory === 'Food Scraps' || effectiveCategory === 'Agricultural Residue';
  const rule1Matched = isFruitVeg && moisturePercent > 60;
  ruleEvaluations.push({
    ruleId: 'RULE_1',
    ruleTitle: 'Fruit/Vegetable Waste High Moisture (>60%)',
    conditionText: `Category detected as ${effectiveCategory} AND Moisture (${moisturePercent}%) > 60%`,
    isMatched: rule1Matched,
    explanation: rule1Matched 
      ? `MATCHED: ${detectedCategory.explanation} Wet fruit/veg scraps provide fast methanogenic & aerobic substrate.`
      : 'NOT MATCHED: Material is not wet fruit/veg scraps or moisture is ≤ 60%.',
    category: 'recommendation'
  });

  if (rule1Matched) {
    scores['Composting'] += 30;
    scores['Anaerobic Digestion'] += 35;
  }

  // Rule 2: Dry leaves or crop residue with moisture below 40%
  const isDryWoody = effectiveCategory === 'Yard Trimmings & Leaves' || effectiveCategory === 'Agricultural Residue' || effectiveCategory === 'Sawdust & Wood Chips' || effectiveCategory === 'Cardboard & Paper Shreds';
  const rule2Matched = isDryWoody && moisturePercent < 40;
  ruleEvaluations.push({
    ruleId: 'RULE_2',
    ruleTitle: 'Dry Leaves & Crop Residue Low Moisture (<40%)',
    conditionText: `Category detected as ${effectiveCategory} AND Moisture (${moisturePercent}%) < 40%`,
    isMatched: rule2Matched,
    explanation: rule2Matched
      ? 'MATCHED: High carbon dry residue. Recommending Composting after mandatory moisture adjustment.'
      : 'NOT MATCHED: Waste is not dry plant residue with moisture < 40%.',
    category: 'recommendation'
  });

  if (rule2Matched) {
    scores['Composting'] += 40;
  }

  // Rule 3: Animal manure mixed with wet organic waste
  const isManure = effectiveCategory === 'Animal Manure';
  const rule3Matched = isManure || (wasteSource === 'Farm & Livestock' && moisturePercent > 60);
  ruleEvaluations.push({
    ruleId: 'RULE_3',
    ruleTitle: 'Animal Manure Mixed with Wet Waste',
    conditionText: `Category detected as Manure (${effectiveCategory}) OR Source is Farm with Moisture (${moisturePercent}%) > 60%`,
    isMatched: rule3Matched,
    explanation: rule3Matched
      ? 'MATCHED: Wet manure contains high methanogenic microbial activity and nitrogen. Recommending Anaerobic Digestion for optimal methane energy recovery.'
      : 'NOT MATCHED: Stream is not wet animal manure mix.',
    category: 'recommendation'
  });

  if (rule3Matched) {
    scores['Anaerobic Digestion'] += 45;
  }

  // Rule 4: pH below 5 (Acidic Material Warning)
  const rule4Matched = initialPh < 5.0;
  ruleEvaluations.push({
    ruleId: 'RULE_4',
    ruleTitle: 'Acidic Material Check (pH < 5.0)',
    conditionText: `Initial pH (${initialPh}) < 5.0`,
    isMatched: rule4Matched,
    explanation: rule4Matched
      ? 'WARNING TRIGGERED: Highly acidic material (pH < 5.0). Can inhibit beneficial compost bacteria, harm earthworms, or sour digesters.'
      : 'PASSED: pH level is above acidic threshold (pH ≥ 5.0).',
    category: 'warning'
  });

  if (rule4Matched) {
    warnings.push(`Acidic-Material Warning: Initial pH is ${initialPh} (below 5.0 threshold). Highly acidic substrate detected.`);
    suggestedActions.push('Neutralize acidity: Add agricultural lime (CaCO3), wood ash, or basic buffer material to bring pH to 6.5 - 7.5 before process start.');
  }

  // Rule 5: Moisture below 40% for Composting
  const rule5Matched = moisturePercent < 40;
  ruleEvaluations.push({
    ruleId: 'RULE_5',
    ruleTitle: 'Low Moisture Deficit (<40%)',
    conditionText: `Moisture (${moisturePercent}%) < 40%`,
    isMatched: rule5Matched,
    explanation: rule5Matched
      ? 'ACTION REQUIRED: Moisture is below 40%. Microbial activity will stall.'
      : 'PASSED: Moisture is sufficient (≥ 40%).',
    category: 'adjustment'
  });

  if (rule5Matched) {
    suggestedActions.push('Add wet green material (fresh grass, kitchen scraps) or clean water to increase moisture content to 55-65%.');
  }

  // Rule 6: Moisture above 70%
  const rule6Matched = moisturePercent > 70;
  ruleEvaluations.push({
    ruleId: 'RULE_6',
    ruleTitle: 'High Moisture Saturated (>70%)',
    conditionText: `Moisture (${moisturePercent}%) > 70%`,
    isMatched: rule6Matched,
    explanation: rule6Matched
      ? 'ACTION REQUIRED: Moisture is above 70%. High risk of anaerobic compaction and foul odors in composting.'
      : 'PASSED: Moisture is not excessively wet (≤ 70%).',
    category: 'adjustment'
  });

  if (rule6Matched) {
    suggestedActions.push('Add dry carbon-rich material (sawdust, wood chips, dry leaves, shredded cardboard) to absorb excess water and create aerobic structural pores.');
  }

  // Penalize contamination
  if (hasContaminants) {
    warnings.push('Contaminant Warning: Batch includes non-organic or high-oil risk material. Sort before biological loading.');
  }

  // C:N ratio check
  if (cnRatio < 20) {
    suggestedActions.push(`Low C:N ratio (${cnRatio}:1). Blend dry brown carbon (sawdust/leaves) to prevent ammonia odor.`);
  }

  // Determine winning treatment method
  const sorted = (Object.keys(scores) as TreatmentMethod[])
    .map(method => ({ method, score: scores[method] }))
    .sort((a, b) => b.score - a.score);

  const topMethod = sorted[0].method;

  // Primary Reason Synthesis with Detected Waste Type
  let primaryReason = `Automatically detected waste category as "${effectiveCategory}" (${detectedCategory.explanation}). Selected ${topMethod} based on biological parameters.`;
  if (rule3Matched && topMethod === 'Anaerobic Digestion') {
    primaryReason = `Detected waste as "${effectiveCategory}". Anaerobic Digestion recommended due to wet manure waste profile (${moisturePercent}% moisture). Maximizes methane biogas yield.`;
  } else if (rule1Matched && topMethod === 'Anaerobic Digestion') {
    primaryReason = `Detected waste as "${effectiveCategory}". Anaerobic Digestion recommended due to high moisture fruit/vegetable scraps (${moisturePercent}% moisture).`;
  } else if (rule1Matched && topMethod === 'Composting') {
    primaryReason = `Detected waste as "${effectiveCategory}". Aerobic Composting recommended for wet organic fruit/veg scraps (${moisturePercent}% moisture) to rapidly generate compost.`;
  } else if (rule2Matched) {
    primaryReason = `Detected waste as "${effectiveCategory}". Aerobic Composting recommended for dry carbonaceous residue (${moisturePercent}% moisture). Moisture adjustment required.`;
  }

  // Recipe adjustments
  const recipeAdjustments: RecipeAdjustment[] = [];

  if (rule5Matched) {
    recipeAdjustments.push({
      amendment: 'Clean Water or Wet Greens',
      amountKg: Math.round(weightKg * 0.2),
      reason: `Moisture is ${moisturePercent}% (Rule 5: <40%). Add water/greens to hit 60% moisture target.`,
      type: 'add_water'
    });
  }

  if (rule6Matched && topMethod === 'Composting') {
    recipeAdjustments.push({
      amendment: 'Dry Carbon-Rich Material (Sawdust/Wood Chips)',
      amountKg: Math.round(weightKg * 0.25),
      reason: `Moisture is ${moisturePercent}% (Rule 6: >70%). Add dry carbon bulking agent to absorb water.`,
      type: 'add_carbon'
    });
  }

  if (rule4Matched) {
    recipeAdjustments.push({
      amendment: 'Agricultural Lime (CaCO3) / Wood Ash',
      amountKg: Math.round(weightKg * 0.02),
      reason: `Initial pH is ${initialPh} (Rule 4: pH < 5). Buffer substrate to pH 6.8.`,
      type: 'adjust_ph'
    });
  }

  // Calculate Expected Yields
  let compostKg = 0;
  let biogasM3 = 0;
  let biofertilizerLiters = 0;
  let estimatedDurationDays = 30;

  switch (topMethod) {
    case 'Composting':
      compostKg = Math.round(weightKg * 0.48);
      estimatedDurationDays = 45;
      break;
    case 'Vermicomposting':
      compostKg = Math.round(weightKg * 0.55);
      estimatedDurationDays = 60;
      break;
    case 'Anaerobic Digestion':
      biogasM3 = Number((weightKg * 0.14).toFixed(1));
      biofertilizerLiters = Math.round(weightKg * 0.75);
      estimatedDurationDays = 25;
      break;
    case 'Biofertilizer Fermentation':
      biofertilizerLiters = Math.round(weightKg * 1.4);
      compostKg = Math.round(weightKg * 0.18);
      estimatedDurationDays = 18;
      break;
  }

  const expectedYield: ExpectedYield = {
    compostKg,
    biogasM3,
    biofertilizerLiters,
    co2eSavedKg: Number((weightKg * 1.85).toFixed(1))
  };

  const keyInstructions = [
    `Detected Waste Category: ${effectiveCategory} (${detectedCategory.confidence}% Confidence)`,
    `Verify initial pH (${initialPh}) and moisture (${moisturePercent}%). Apply rule adjustments if warnings are active.`,
    `Prepare substrate according to ${topMethod} recipe protocol.`,
    `Monitor temperature and moisture daily via the Process Telemetry Monitor.`,
    `Harvest output after ~${estimatedDurationDays} days when biological maturity is reached.`
  ];

  return {
    id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    batchId: batch.id,
    batchName: batch.name,
    wasteType: effectiveCategory,
    weightKg: batch.weightKg,
    moisturePercent: batch.moisturePercent,
    initialPh: batch.initialPh,
    wasteSource: batch.wasteSource,
    recommendedMethod: topMethod,
    confidenceScore: detectedCategory.confidence,
    primaryReason,
    warnings,
    suggestedActions,
    ruleEvaluations,
    recipeAdjustments,
    expectedYield,
    estimatedDurationDays,
    keyInstructions,
    createdAt: new Date().toISOString()
  };
}
