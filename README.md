# Receipts: A Spender's Dashboard

A premium, interactive spending dashboard built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS 4.0**.

![Dashboard Preview](https://via.placeholder.com/1280x720.png?text=Receipts+Dashboard+Preview)

## 🚀 Key Features
- **Smart Tracking**: Add expenses with categories (Food, Transport, Data, Fun, Other) and instant persistence.
- **Dynamic Analytics**: Visual breakdown of spending via Donut charts and 7-day trend Bar charts.
- **Time-Travel Filters**: Seamlessly toggle between This Week, Last Week, and All Time views.
- **Glassmorphism UI**: A high-end, translucent design system with dark mode and vibrant accents.
- **Zero-Backend**: Leverages `localStorage` for complete data privacy and instant loads.

## 🛠️ Technology Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4.0 (Alpha/Beta features like `@theme` and `@utility`)
- **Charts**: Recharts (with responsive sizing)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Logic**: date-fns

## 📦 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or pnpm

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Receipts
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📖 Documentation
Detailed technical analysis and guides are available in the `/docs` folder:
- [**01 - ELI7 Explanation**](./docs/01-explanation.md): Simple breakdown of how the code works.
- [**02 - Principles**](./docs/02-principles.md): Architectural patterns used (Derived State, Immutability).
- [**03 - Audit**](./docs/03-audit.md): Technical risks and current mitigations.
- [**04 - Cross-Check**](./docs/04-cross-check.md): Deep dive into chart data shaping.
- [**05 - Tinker**](./docs/05-tinker.md): Results of stress testing with 50+ items.
- [**06 - Lie Detector**](./docs/06-lie-detector.md): A fun code-reading challenge.

## 🔧 Troubleshooting
If your editor (VS Code) shows errors like `Unknown at rule @theme`, this is because Tailwind 4 is brand new. We've included a `.vscode/settings.json` to ignore these linting warnings. The app will build and run perfectly regardless of these editor warnings.
