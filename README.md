# Zorvyn -- Personal Finance Dashboard

Zorvyn is a feature-rich, single-page financial dashboard built with React 19 and TypeScript. It provides users with a complete view of their personal finances through interactive charts, real-time transaction management, AI-driven spending insights, and a fully themeable interface that works seamlessly across desktop and mobile devices.

The project was designed to demonstrate production-grade front-end engineering: clean architecture, thoughtful state management, responsive design, and polished user experience, all without a backend dependency.

---

## Table of Contents

- [Live Demo Access](#live-demo-access)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Architecture and Design Decisions](#architecture-and-design-decisions)
- [Feature Breakdown](#feature-breakdown)
- [State Management](#state-management)
- [Theming System](#theming-system)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Configuration](#configuration)
- [Data Layer](#data-layer)

---

## Live Demo Access

The application is protected by a login screen. Use the following credentials to access the dashboard:

| Field    | Value |
|----------|-------|
| Username | `abc` |
| Password | `123` |

The login page includes an "Evaluator Access" panel with auto-fill buttons so you do not need to type these manually.

---

## Core Features

- **Dashboard Overview** -- At-a-glance financial summary with animated KPI cards (Total Balance, Total Income, Total Expenses, Savings Rate), a configurable balance trend chart, categorical spending breakdown with donut visualization, budget goal trackers with circular progress indicators, and a recent transactions feed.

- **Transaction Management** -- Full CRUD operations on transactions with a sortable, paginated data table. Supports multi-criteria filtering (search, type, category, date range), inline editing via modal forms, and data export in both CSV and JSON formats.

- **Financial Insights** -- An insight engine that analyzes transaction data to surface actionable intelligence: highest spending category detection, best saving month identification, average daily spend calculation, and month-over-month spending acceleration alerts. Accompanied by an interactive income-vs-expenses bar chart for monthly comparison.

- **Settings and Preferences** -- Editable user profile, multi-currency support (USD, EUR, GBP, JPY, INR), linked bank account management, configurable budget limits per category, notification preferences, and security toggles.

- **Role-Based Access Control** -- A header-level role switcher that toggles between "Admin" and "Viewer" modes. Admin mode exposes write operations (add, edit, delete transactions), while Viewer mode restricts the interface to read-only.

- **Dark and Light Themes** -- A complete dual-theme system driven by CSS custom properties. Theme preference persists across sessions via local storage.

- **Responsive Design** -- Desktop layout features a collapsible sidebar with full navigation. On mobile viewports, the sidebar is replaced by a fixed bottom navigation bar with safe-area inset support for modern devices.

- **Welcome Tour** -- A multi-slide onboarding modal that greets first-time users and introduces the platform. The tour state persists so it only appears once.

- **Toast Notifications** -- A global notification system that surfaces user feedback for settings changes, profile saves, and bank account operations. Toasts auto-dismiss after three seconds and support stacking.

- **Animated Numbers** -- Summary card values use a custom `useAnimatedNumber` hook with exponential easing to smoothly count up from zero on render, giving the dashboard a polished, alive feel.

---

## Technology Stack

| Layer             | Technology           | Version  | Purpose                                                  |
|-------------------|----------------------|----------|----------------------------------------------------------|
| UI Framework      | React                | 19.2     | Component-based rendering with hooks                     |
| Language          | TypeScript           | 5.9      | Static type safety across the entire codebase            |
| Build Tool        | Vite                 | 8.0      | Fast HMR dev server and optimized production bundling    |
| Styling           | Tailwind CSS         | 4.2      | Utility-first CSS with custom theme configuration        |
| State Management  | Zustand              | 5.0      | Lightweight, hook-based global state with persistence    |
| Routing           | React Router DOM     | 7.13     | Client-side routing with nested layouts and guards       |
| Charts            | Recharts             | 3.8      | Declarative SVG charting (Area, Pie, Bar)                |
| Date Utilities    | date-fns             | 4.1      | Immutable date formatting and manipulation               |
| Icons             | Lucide React         | 1.7      | Tree-shakeable SVG icon library                          |
| Linting           | ESLint               | 9.39     | Code quality enforcement with React-specific plugins     |
| Fonts             | Inter, JetBrains Mono| --       | Custom sans-serif and monospace typography via CSS        |

---

## Project Structure

```
_production/
|-- index.html                        # HTML entry point
|-- package.json                      # Dependencies and scripts
|-- vite.config.ts                    # Vite + React + Tailwind plugin config with @ alias
|-- tsconfig.json                     # TypeScript project references
|-- tsconfig.app.json                 # App-specific TS config with strict mode
|-- tsconfig.node.json                # Node-specific TS config for Vite
|-- eslint.config.js                  # ESLint flat config
|-- public/
|   |-- favicon.svg                   # Browser tab icon
|   |-- icons.svg                     # SVG sprite sheet
|   |-- zorvynimg.png                 # Brand logo (public)
|-- src/
    |-- main.tsx                      # React DOM entry, mounts <App />
    |-- App.tsx                       # Root component with route definitions
    |-- App.css                       # Legacy scaffold styles (unused in production)
    |-- index.css                     # Global design tokens, theme variables, utilities
    |-- assets/
    |   |-- hero.png                  # Decorative hero image
    |   |-- zorvynimg.png             # Brand logo (imported in components)
    |   |-- react.svg                 # Framework logo asset
    |   |-- vite.svg                  # Build tool logo asset
    |-- types/
    |   |-- index.ts                  # Shared TypeScript interfaces and type aliases
    |-- data/
    |   |-- mockData.ts               # Seed dataset (~40KB of realistic transactions)
    |-- store/
    |   |-- authStore.ts              # Authentication state (login/logout)
    |   |-- useTransactionStore.ts    # Transaction CRUD, filtering, sorting, pagination
    |   |-- useUIStore.ts             # Theme, role, currency, profile, budget goals
    |-- hooks/
    |   |-- useAnimatedNumber.ts      # Exponential-ease number animation hook
    |-- utils/
    |   |-- formatters.ts             # Currency, date, percentage, and string formatters
    |   |-- insightEngine.ts          # Algorithmic spending analysis and insight generation
    |   |-- exportData.ts             # CSV and JSON export with browser download triggers
    |-- components/
    |   |-- layout/
    |   |   |-- DashboardLayout.tsx   # Shell layout: sidebar + header + outlet + mobile nav
    |   |   |-- Sidebar.tsx           # Collapsible desktop navigation with user profile
    |   |   |-- Header.tsx            # Top bar with search, theme toggle, role switcher
    |   |   |-- MobileNav.tsx         # Fixed bottom tab bar for mobile viewports
    |   |   |-- ProtectedRoute.tsx    # Auth guard that redirects unauthenticated users
    |   |   |-- ThemeToggle.tsx       # Dark/light mode switch button
    |   |-- ui/
    |       |-- Badge.tsx             # Status/role badge component with variants
    |       |-- Button.tsx            # Polymorphic button with size and variant props
    |       |-- Card.tsx              # Glass-morphism card container
    |       |-- Input.tsx             # Styled input with optional icon slot
    |       |-- Select.tsx            # Custom styled select dropdown
    |       |-- Toast.tsx             # Global toast notification system
    |       |-- WelcomeTour.tsx       # Multi-slide onboarding modal
    |-- features/
        |-- auth/
        |   |-- LoginPage.tsx         # Login form with evaluator credential panel
        |-- dashboard/
        |   |-- DashboardPage.tsx     # Dashboard page composition
        |   |-- SummaryCards.tsx       # Four animated KPI cards
        |   |-- BalanceTrend.tsx      # Area chart with 1M/3M/6M time range toggle
        |   |-- SpendingBreakdown.tsx  # Donut chart + ranked category list
        |   |-- BudgetGoals.tsx       # Circular SVG progress indicators per category
        |   |-- RecentTransactions.tsx # Latest 5 transactions with navigation link
        |-- transactions/
        |   |-- TransactionsPage.tsx  # Transaction view with export and add controls
        |   |-- TransactionTable.tsx  # Sortable, paginated table with inline actions
        |   |-- TransactionFilters.tsx# Multi-field filter bar (search, type, category, dates)
        |   |-- TransactionForm.tsx   # Modal form for adding/editing transactions
        |-- insights/
        |   |-- InsightsPage.tsx      # Insight cards grid + monthly comparison chart
        |   |-- InsightCard.tsx       # Individual insight display with typed icons
        |   |-- MonthlyComparison.tsx # Grouped bar chart (income vs expenses by month)
        |-- settings/
            |-- SettingsPage.tsx      # Full settings interface with all preference panels
```

---

## Architecture and Design Decisions

### Feature-Based Organization

The source code follows a feature-sliced directory structure rather than a flat component-based approach. Each feature (dashboard, transactions, insights, settings, auth) is self-contained in its own directory under `src/features/`. Shared primitives live in `src/components/ui/`, and layout scaffolding lives in `src/components/layout/`. This separation means a developer working on the insights page never needs to touch files outside of `src/features/insights/` and the shared utilities.

### Zustand with Persistence

State management uses Zustand instead of Redux or Context API. Zustand was chosen for three reasons:
1. It eliminates boilerplate. There are no action types, reducers, or provider wrappers.
2. It integrates directly with React hooks, so components subscribe to exactly the state slices they need.
3. The `persist` middleware is used on both the UI store and the transaction store to write state to `localStorage`. This means theme preference, currency selection, profile data, budget goals, and all transaction records survive full page reloads without any backend.

The `partialize` option is configured on each store to persist only the data that matters and exclude ephemeral state like `activeModal` or the current filter configuration.

### Design Token System

Instead of hardcoding colors throughout the application, the entire visual language is driven by CSS custom properties defined in `src/index.css`. The root element defines a light-mode palette, and a `[data-theme='dark']` attribute override provides the dark-mode palette. Tailwind's `@theme` directive maps these variables to utility classes like `text-text-primary`, `bg-bg-surface`, and `border-border-default`.

This architecture means adding a new theme is a single block of CSS variable overrides. No component code needs to change.

### Glass Morphism and Micro-Animations

The UI makes deliberate use of glassmorphism via a `.glass-panel` utility class that applies a blurred, semi-transparent background. Cards throughout the application use this treatment to create depth against the base background.

Entry animations are applied using Tailwind's `animate-in` utilities with staggered `animationDelay` values, so dashboard cards cascade into view rather than appearing all at once. The `useAnimatedNumber` hook uses `requestAnimationFrame` with an exponential ease-out function (`1 - 2^(-10x)`) to smoothly interpolate numeric values from zero to their target.

### Internationalization-Ready Currency Formatting

The `formatCurrency` utility uses the browser's native `Intl.NumberFormat` API with locale-aware configuration for each supported currency. Switching currencies in settings instantly reformats every monetary value across the entire application because all components read the currency from the global Zustand store and pass it through this formatter.

---

## Feature Breakdown

### Login and Authentication

The login page uses a split-panel layout. The left panel contains the credential form, and the right panel displays evaluator access information with auto-fill buttons. Authentication state is managed by a minimal Zustand store (`authStore.ts`) that tracks a boolean `isAuthenticated` flag. The `ProtectedRoute` component wraps all dashboard routes and redirects unauthenticated users to `/login`, preserving the intended destination via React Router's `location.state`.

### Dashboard

The dashboard page assembles five distinct widgets into a responsive grid layout:

- **SummaryCards** renders four KPI tiles (Total Balance, Total Income, Total Expenses, Savings Rate). Each value is passed through the `useAnimatedNumber` hook so figures count up smoothly on load. Cards use left-border color coding and themed icon backgrounds.

- **BalanceTrend** renders a Recharts `AreaChart` with a gradient fill. It computes a running balance by iterating backwards through sorted transactions. A segmented control allows switching between 30-day, 90-day, and 180-day windows. The Y-axis formats values in compact notation (e.g., "$45k"), and a styled tooltip shows the exact balance on hover.

- **SpendingBreakdown** renders a donut `PieChart` of the top five expense categories, paired with a scrollable ranked list below it. Each category row shows a color-coded icon, the percentage share, and the formatted total. The card spans two rows in the grid so it sits alongside both the balance trend and the budget goals.

- **BudgetGoals** renders circular SVG progress rings for each configured budget category. The ring color switches from accent blue to error red when spending exceeds the limit. Percentage labels are centered inside the rings, and the spent/limit values are displayed below.

- **RecentTransactions** shows the five most recent transactions with type indicators, date, category badges, and signed amounts. A "View All" link navigates to the full transactions page.

### Transactions

The transactions page provides a full data management interface:

- **TransactionFilters** offers five filter dimensions: free-text search against descriptions, type dropdown (all/income/expense), category dropdown, and a from/to date range pair. An active-filter indicator appears with a "Reset" button when any filter is engaged.

- **TransactionTable** applies the current filters and sort configuration to produce a derived dataset using `useMemo`. The table supports click-to-sort on all four columns (date, description, category, amount) with ascending/descending toggle and visual sort indicators. Pagination is implemented with configurable page size, showing "X to Y of Z results" text and previous/next controls. In admin mode, each row exposes edit and delete action buttons.

- **TransactionForm** renders as a full-screen modal overlay with backdrop blur. It supports both creation and editing modes. In edit mode, the form pre-populates from the existing transaction. Validation ensures a description is present, the amount is a positive number, and a date is selected. The form includes 14 category options spanning income and expense types.

- **Data Export** allows one-click download of the full transaction dataset as either a `.csv` or `.json` file, with filenames auto-stamped with the current date.

### Insights

The insight engine (`src/utils/insightEngine.ts`) performs four analyses on the raw transaction data:

1. **Highest Spending Category** -- Aggregates expenses by category, identifies the largest, and flags a warning if it exceeds 30% of total spending.
2. **Best Saving Month** -- Finds the month with the highest positive difference between income and expenses.
3. **Average Daily Spend** -- Calculates the mean daily expenditure across the full date range of expense records.
4. **Spending Acceleration** -- Compares the current month's expenses against the previous month and flags an alert if spending has increased by more than 10%.

Each insight is rendered as a card with a typed icon (positive/negative/warning/neutral), a description, and a formatted value.

The **MonthlyComparison** chart renders income and expenses as a grouped bar chart. Bars use rounded top corners and cap at a maximum width of 40px for visual consistency regardless of the number of data points.

### Settings

The settings page is divided into a two-column layout on larger screens:

- **Left column** contains the Personal Profile form (name and email with a save button that triggers a toast) and the Linked Accounts panel (showing connected banks with unlink capability and an "Add Bank" action).

- **Right column** houses Preferences (currency selector), Budget Limits (editable numeric inputs per category that update the Zustand store in real time), Security (two-factor auth toggle), and Notifications (transaction alert and weekly summary toggles).

All toggle switches are custom-built with smooth CSS transitions. Every settings change provides immediate visual feedback through the toast notification system.

---

## State Management

The application uses three Zustand stores:

### authStore

Manages the authentication lifecycle. Contains a single `isAuthenticated` boolean with `login()` and `logout()` actions. This store is intentionally not persisted so that refreshing the page requires re-authentication.

### useTransactionStore

Manages the transaction dataset and all operations on it. Persisted to `localStorage` under the key `zorvyn-transactions`, but only the transactions array is persisted -- filters, sort configuration, and pagination state reset on reload. Provides actions for:
- `addTransaction` -- Prepends a new transaction with a generated ID
- `updateTransaction` -- Merges partial updates into an existing record
- `deleteTransaction` -- Removes a transaction by ID
- `setFilter` -- Updates a single filter dimension and resets pagination to page 1
- `resetFilters` -- Restores all filters to defaults
- `setSort` -- Toggles sort direction on a column
- `setPage` / `setPageSize` -- Pagination controls

### useUIStore

Manages all user preferences, UI state, and profile data. Persisted to `localStorage` under the key `zorvyn-ui-storage`. Contains:
- Theme and sidebar collapse state
- User role (admin/viewer)
- Currency preference
- Profile name and email
- Notification preferences
- Linked bank accounts array
- Budget goals array with category, limit, and spent fields
- Welcome tour completion flag

The store's `onRehydrateStorage` callback ensures the correct `data-theme` attribute is applied to the document root immediately after state is loaded from storage, preventing a flash of incorrect theme on startup.

---

## Theming System

The theming system is built on two layers:

**Layer 1: CSS Custom Properties** (defined in `src/index.css`)

The `:root` selector defines the light mode palette with 14 semantic variables covering backgrounds, borders, text hierarchy, accent colors, semantic status colors, and glass panel backgrounds. The `[data-theme='dark']` selector overrides all 14 variables with dark mode values.

**Layer 2: Tailwind Theme Mapping** (defined via `@theme` directive)

The `@theme` block maps CSS variables to Tailwind's color system, creating utility classes like `bg-bg-base`, `text-text-primary`, and `border-border-default`. This means every component uses semantic color names rather than raw hex values, and the entire palette swaps atomically when the theme attribute changes.

Custom utility classes include:
- `.glass-panel` -- Applies backdrop blur and semi-transparent background
- `.premium-scrollbar` -- Styles native scrollbars to match the theme
- `.safe-area-bottom` -- Adds padding for iOS safe area insets

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Installation

```bash
# Clone the repository and navigate to the production directory
cd _production

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

This starts the Vite development server with hot module replacement. The application will be available at `http://localhost:5173` by default.

### Production Build

```bash
npm run build
```

This runs the TypeScript compiler for type checking and then produces an optimized production bundle in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for final verification before deployment.

---

## Available Scripts

| Script          | Command                   | Description                                                     |
|-----------------|---------------------------|-----------------------------------------------------------------|
| `dev`           | `vite`                    | Starts the development server with HMR                          |
| `build`         | `tsc -b && vite build`    | Type-checks and builds for production                           |
| `lint`          | `eslint .`                | Runs ESLint across the entire codebase                          |
| `preview`       | `vite preview`            | Serves the production build locally                             |

---

## Configuration

### Path Aliases

The project uses the `@` alias to reference the `src/` directory. This is configured in both `vite.config.ts` (for bundler resolution) and `tsconfig.app.json` (for TypeScript resolution). Import paths like `@/store/useUIStore` resolve to `src/store/useUIStore.ts`.

### Tailwind CSS v4

This project uses Tailwind CSS v4, which replaces the traditional `tailwind.config.js` file with CSS-native configuration via the `@theme` directive in `src/index.css`. The Tailwind Vite plugin (`@tailwindcss/vite`) handles processing.

### TypeScript

The project uses TypeScript 5.9 in strict mode with the following compiler options:
- Strict null checks and strict function types enabled
- Module resolution set to `bundler` for Vite compatibility
- JSX set to `react-jsx` for automatic runtime
- Path aliases configured for the `@` prefix

---

## Data Layer

The application operates entirely on client-side mock data. The seed dataset in `src/data/mockData.ts` contains a comprehensive set of realistic transactions spanning multiple months, covering income sources (salary, freelance, investment returns) and expense categories (housing, groceries, utilities, transportation, entertainment, dining, shopping, healthcare, subscriptions, education).

All transaction mutations (add, edit, delete) are persisted to the browser's `localStorage` through the Zustand persist middleware. Clearing local storage or opening the application in a private browsing window will restore the original seed data.

There is no backend API. The architecture is specifically designed so that introducing one later would only require swapping the mock data import in the transaction store with async fetch calls, leaving every component and utility function untouched.
