import type { WasteCategoryMeta } from '../types/biocycle';

export const WASTE_CATEGORIES: Record<string, WasteCategoryMeta> = {
  'Banana Peels (Fruit Scraps)': {
    name: 'Food Scraps',
    defaultCNRatio: 15,
    defaultMoisturePercent: 75,
    nitrogenRich: true,
    icon: 'Apple',
    description: 'High potassium and sugar fruit peels. High moisture & nitrogen.'
  },
  'Vegetable Waste (Kitchen Scraps)': {
    name: 'Food Scraps',
    defaultCNRatio: 16,
    defaultMoisturePercent: 70,
    nitrogenRich: true,
    icon: 'Apple',
    description: 'Vegetable trimmings, leaves, peels. Rapidly biodegradable.'
  },
  'Dry Leaves & Straw': {
    name: 'Yard Trimmings & Leaves',
    defaultCNRatio: 60,
    defaultMoisturePercent: 30,
    nitrogenRich: false,
    icon: 'Leaf',
    description: 'Dry autumn leaves, straw, yard debris. High carbon brown material.'
  },
  'Mixed Food Waste': {
    name: 'Food Scraps',
    defaultCNRatio: 18,
    defaultMoisturePercent: 72,
    nitrogenRich: true,
    icon: 'Apple',
    description: 'General post-consumer dining room food waste and scraps.'
  },
  'Animal Manure': {
    name: 'Animal Manure',
    defaultCNRatio: 18,
    defaultMoisturePercent: 80,
    nitrogenRich: true,
    icon: 'Beef',
    description: 'Poultry, horse, or dairy barn slurry. Ideal for Anaerobic Digestion.'
  },
  'Coffee Grounds': {
    name: 'Coffee Grounds',
    defaultCNRatio: 20,
    defaultMoisturePercent: 60,
    nitrogenRich: true,
    icon: 'Coffee',
    description: 'Used espresso grounds. Excellent for vermicomposting & nitrogen enrichment.'
  },
  'Sawdust & Wood Chips': {
    name: 'Sawdust & Wood Chips',
    defaultCNRatio: 400,
    defaultMoisturePercent: 15,
    nitrogenRich: false,
    icon: 'Trees',
    description: 'Untreated wood shavings and sawdust. Very high carbon.'
  },
  'Cardboard & Paper Shreds': {
    name: 'Cardboard & Paper Shreds',
    defaultCNRatio: 350,
    defaultMoisturePercent: 10,
    nitrogenRich: false,
    icon: 'Box',
    description: 'Shredded non-glossy cardboard and paper bedding.'
  }
};
