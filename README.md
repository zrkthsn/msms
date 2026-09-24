# Mantash Stock Management System (MSMS) 🏍️💨

An industrial-grade motorcycle dealership and inventory management web dashboard built with **React**, **TypeScript**, **Tailwind CSS v4**, and **Lucide React**.

Designed for high-performance motorcycle dealerships, apparel gear hubs, and spare parts warehouse distribution.

---

## 🌟 Key Features

### 1. Dashboard & Operations
- **Live KPI Metrics**: Real-time Total Stock Valuation, Available Showroom Units, Low Stock Alert counters, and Monthly Sales conversion.
- **Capital Distribution**: Segmented asset valuation breakdown across Motorcycle Fleets, Helmets & Rider Gear, and Spare Parts.
- **Live Activity Feed**: Timestamped ledger tracking sales, shipments, depot transfers, and threshold triggers.
- **Quick Action Workflows**: One-click modal launches and CSV manifest spreadsheet export.

### 2. Deep Inventory Domain Models
- **Motorcycles (New & Pre-Owned)**:
  - VIN / Chassis Number (with 1-click clipboard copy)
  - Brand, Model, Year, Condition (New vs. Used)
  - Displacement (CC), Factory Livery / Color, Mileage
  - Cost Price, Selling Price, Gross Profit Margin calculation
  - Status indicators: `In Stock`, `Reserved`, `Sold`
  - Toggle between **Table View** and **Showroom Card Grid**
- **Helmets & Rider Gear**:
  - SKU, Brand, Model, Category (Full Face, Modular, Riding Jackets, Racing Suits)
  - Sizing Matrix: `XS`, `S`, `M`, `L`, `XL`
  - Safety Certifications: `DOT`, `ECE`, `DOT & ECE`, `FIM & ECE`
  - Current stock & minimum safety alert thresholds
- **Spare Parts & Fluids**:
  - Manufacturer Part Numbers
  - Classification: Exhaust Systems, Brakes & Hydraulics, Performance Tires, Synthetic Fluids, Electrical
  - Warehouse Bay, Row, and Bin locations (e.g. `Bay 2 - Row A - Bin 05`)
  - Compatibility cross-reference for superbike models

### 3. Search, Filters & Threshold Automation
- **System Search**: Fast query matching across Brand, Model, VIN, Part Number, and SKU with keyboard shortcut (`Cmd + K` / `Ctrl + K`).
- **Granular Filters**: Condition filter (All, New, Used) and Stock Status (In Stock, Low Stock, Out of Stock, Reserved, Sold).
- **Threshold Alerts Drawer**: Notifications flyout listing critical items needing immediate restock with one-click `+10 Restock` triggers.
- **Stock Adjustment Modal**: Audit logging with quantity change, adjustment reasons, and notes.

### 4. High-Contrast Industrial Aesthetics
- Dark slate & charcoal palette with electric amber/orange highlights.
- Modern typography pairing Inter with Chakra Petch and JetBrains Mono.
- Reactive toast notification system for instant feedback.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/zrkthsn/msms.git
cd msms

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to explore the dashboard.

### Building for Production

```bash
npm run build
```

---

## 📂 Project Structure

```
MSMS/
├── src/
│   ├── types/
│   │   └── inventory.ts             # Domain models (Motorcycle, Helmet, Part, Log, Location)
│   ├── context/
│   │   └── InventoryContext.tsx     # Centralized state provider, search, modals, toasts
│   ├── mockData/
│   │   └── initialInventory.ts      # Sample catalog with realistic superbike models & parts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx          # Nav links, count badges, branch indicator
│   │   │   ├── Topbar.tsx           # Global search (Cmd+K), branch switcher, notification bell
│   │   │   └── NotificationsDrawer.tsx # Critical low-stock threshold drawer
│   │   ├── dashboard/
│   │   │   ├── DashboardView.tsx    # Master dashboard composite view
│   │   │   ├── KpiCards.tsx         # Valuation, count, alert KPI metric cards
│   │   │   ├── QuickActions.tsx     # Workflow buttons + CSV manifest generator
│   │   │   ├── RecentActivityTable.tsx # Live inventory movement history
│   │   │   ├── StockDistributionChart.tsx # Asset allocation distribution
│   │   │   └── LowStockBanner.tsx   # Prominent threshold warning ribbon
│   │   ├── inventory/
│   │   │   ├── MainInventoryTable.tsx # Master inventory table with search & filtering
│   │   │   ├── MotorcycleCardGrid.tsx # Showroom fleet card grid view
│   │   │   ├── AddItemModal.tsx     # 3-step registration modal for bikes, gear, and parts
│   │   │   ├── AdjustStockModal.tsx # Quantity increment/decrement modal with audit reason
│   │   │   └── ItemDetailsModal.tsx # Deep inspection modal with VIN copy & specifications
│   │   ├── categories/
│   │   │   └── CategoriesView.tsx   # Visual category taxonomies
│   │   ├── settings/
│   │   │   └── SettingsView.tsx     # Dealership bays, threshold settings, and data reset
│   │   └── common/
│   │       └── ToastContainer.tsx   # Notification popups
│   ├── App.tsx                      # Root component
│   ├── index.css                    # Tailwind v4 setup & custom tokens
│   └── main.tsx                     # Entrypoint
├── package.json
└── vite.config.ts
```

---

## 📄 License
MIT
