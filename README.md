# 💰 Zorvyn — Finance Dashboard

> A premium, interactive finance dashboard built with React, TypeScript, and Recharts.

## ✨ Highlights
- **Premium Glassmorphism UI**: Beautiful, dark-mode native interface styled precisely with Tailwind CSS v4.
- **Role-Based Access Control**: Simulated frontend `Admin` vs `Viewer` states affecting UI capabilities (add/edit transactions vs read-only).
- **Intelligent Insight Engine**: Auto-computed financial observations based on past spending behaviors.
- **Robust Local Storage**: Full CRUD capabilities mapped to Zustand and persisted flawlessly in your browser.

## 🚀 Getting Started

1. Navigate to the project root.
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the Vite development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open the localhost link in your browser.

## 🏗 Architecture
- **Framework**: `React 18` + `Vite` for extremely fast HMR and optimized builds.
- **State Management**: `Zustand` completely split into domain logic (`useTransactionStore` and `useUIStore`).
- **Styling**: `TailwindCSS v4`, relying entirely on CSS-first standard variables loaded in `index.css`.
- **Data Visualization**: `Recharts` SVG components for the Area and Bar/Donut visualizations.

## 🎯 Features Checklist
- [x] High-level financial summaries out of the box (Balance, Income, Expenses).
- [x] Complex transaction querying (Sorting, Pagination, Searching).
- [x] Add / Edit / Delete transactions seamlessly by toggling your Admin role.
- [x] Data Export configuration to fetch localized payload lists via CSV and JSON.
- [x] AI-Generated cards warning of high spending spikes and evaluating baseline averages.

## 🎨 Design Decisions
- **Why TailwindCSS v4?** The new CSS configuration engine is vastly superior for enforcing standard theme variables cleanly without messy config files.
- **Why Zustand?** Redux carries too much conceptual boilerplate for a standalone frontend interface, and Context API often leads to massive unnecessary re-render walls. Zustand provides direct hook selector targeting to guarantee performance.
- **Color Palette (Carbon Glass)**: The primary dashboard uses heavily tinted near-blacks paired against `#6C5CE7` violet accents to instill a modern, calm, and trustworthy aesthetic.

## 📊 Mock Data Strategy
Built directly into the core, Zorvyn spins up over 200+ realistic mock transactions spanning 6 months of historical activity. Real logical patterns (like Rent landing on the 1st of the month and weekend spending surges) have been structured into the generator to showcase the charts properly.
