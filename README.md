# 🌿 BioCycle - Organic Waste Biological Treatment & Resource Recovery Platform

[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**BioCycle** is a complete, working web application that helps facility operators, farmers, and urban recyclers convert organic waste streams into optimal biological treatment solutions—including **Aerobic Composting**, **Vermicomposting**, **Anaerobic Digestion**, and **Biofertilizer Fermentation**.

The application features a **transparent rule-based biotechnology recommendation engine**, an **AI Waste Classification Assistant**, live process telemetry monitoring with **3 distinct line charts**, **educational impact simulation models**, and **zero-backend `localStorage` persistence**.

---

## ✨ Key Features & Page Overview

### 1. 📊 Operations Dashboard
- **Dynamic localStorage Analytics**: Calculates aggregate metrics dynamically without hardcoded totals (*Total waste processed, Active batch count, Estimated output yield, Landfill waste diverted, Estimated carbon benefit*).
- **Process-Status Charts**: Interactive Recharts bar and donut charts displaying batch distribution across operational statuses.
- **Recent Batches Grid**: Live snapshot of facility batches with temperature & moisture sensor indicators.
- **Zero-Data Empty State**: Helpful onboarding card when starting with fresh storage.

### 2. ➕ Add Waste Batch
- **Validated Input Logger**: Validates inputs client-side (*Quantity > 0 kg, Moisture % between 0-100%, Initial pH between 0.0-14.0*).
- **Sample Presets**: One-click sample options for *Banana Peels*, *Vegetable Waste*, *Dry Leaves*, *Animal Manure*, *Coffee Grounds*, *Sawdust*, and *Cardboard*.
- **Instant Recommendation**: Saves to `localStorage` and immediately evaluates the biotechnology rule matrix, displaying a success banner with recommended process, warnings, and projected yields.

### 3. 🔬 Transparent Biotechnology Recommendation Engine & AI Assistant
- **AI Waste Classification Assistant**: Natural language parser accepting raw stream descriptions (e.g., *"Wet banana peels mixed with vegetable scraps"*). Returns:
  1. Likely waste category
  2. Approximate moisture tendency
  3. Possible biological processes
  4. Information still needed
  5. Safety warnings
  - *Uncertainty Fallback*: Displays **“Needs manual verification”** for ambiguous inputs.
- **Transparent Logic Inspector**: Step-by-step audit card showing all 6 biological rules evaluated explicitly with boolean match badges (`TRUE`/`FALSE`), exact condition expressions, and corrective action advice.

### 4. 📈 Process Telemetry Monitor
- **Sensor Telemetry Logger**: Record daily readings (*Temperature °C, pH 0-14, Moisture %, Odor observation, Operator notes*).
- **3 Distinct Telemetry Line Charts**:
  1. *Temperature Line Chart* (°C over date)
  2. *pH Balance Line Chart* (0-14 pH over date)
  3. *Moisture Line Chart* (% hydration over date)
- **Process Stages**: Track batch progression through 4 explicit stages (*Not started*, *Active monitoring*, *Maturation*, *Ready for laboratory testing*).
- **Mandatory Agricultural Safety Disclaimer**: Prominently highlights that batch completion indicates *"Ready for laboratory testing"* and requires independent pathogen/heavy-metal testing prior to agricultural deployment.

### 5. 🧮 Impact & Sustainability Calculator
- **Per-Batch Educational Estimates**: Computes *Waste Diverted (kg)*, *Estimated Output Yield (kg/L)*, *Estimated Synthetic Fertilizer Replacement (kg NPK)*, and *Estimated Carbon Benefit (kg CO₂e)*.
- **Configurable Demonstration Assumptions**: Interactive sliders next to calculations allowing real-time adjustment of *Output Factor*, *Replacement Factor*, and *Demonstration Carbon Factor*.
- **Methodology Disclaimer**: Highlights *"These values are educational estimates and must be replaced with locally validated laboratory or life-cycle data."*

### 6. 📜 Batch History & Data Management
- Searchable, filterable table view of all logged waste batches.
- Data export in both **CSV** and **JSON** formats.
- Complete `localStorage` seed reset option.

---

## 🛠️ Technology Stack

- **Core**: React 19, TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 (Glassmorphic dark green/sustainability theme)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Data Persistence**: HTML5 `localStorage` (100% offline, zero backend/paid API dependencies)

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (comes with Node.js)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/Sravya-nova/biocycle.git
   cd biocycle
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 📦 Production Build

To compile the TypeScript project and generate minified production static assets:

```bash
npm run build
```

The output will be generated in the `dist/` directory ready for static web hosting.

---

## 🛡️ Disclaimers & Safety Compliance

- **Educational Estimations**: All environmental impact, fertilizer replacement, and biogas output calculations provided by BioCycle are educational estimates based on standard mass-balance models.
- **Agricultural Safety Rule**: Process stage completion indicates *"Ready for laboratory testing"*. BioCycle does **NOT** certify any waste batch as safe for agricultural or soil application automatically. Independent laboratory testing (for E. coli, Salmonella, heavy metals, and maturity stability) is required prior to agricultural deployment.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
