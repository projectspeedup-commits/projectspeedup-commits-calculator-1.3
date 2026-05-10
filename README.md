# Arsenal Economy Calculator

A specialized calculator for metallurgical production, focusing on steel grade processing costs, remnant management, and commercial profitability.

## Features

- **Profile Calculations**: Support for Round and Hexagonal profiles.
- **Remnant Logic**: Advanced tracking of remnant lengths, technical ends, and pieces per bar.
- **Economic Section**:
  - Manage Direct Costs (Прямые затраты) per ton of finished product.
  - Steel Grade Policies for different remnant pricing strategies.
- **PDF Export**: Print-ready templates for commercial offers.
- **Persistence**: Firebase integration for saving presets and history (optional for local deployment).

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd arsenal-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

The application uses Firebase for data persistence.

- In AI Studio, this is managed automatically.
- For local development, you should create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/) and provide your configuration.
- You can create a `.env.local` file based on `.env.example`.

### Development

To start the development server:

```bash
npm run dev
```

### Build

To create a production build in the `dist` folder:

```bash
npm run build
```

### Self-Hosting with PostgreSQL (Optional)

1. **Install PostgreSQL**: Ensure you have a running PostgreSQL instance.
2. **Initialize Database**:
   ```bash
   psql -U your_user -d your_db -f init.sql
   ```
3. **Configuration**: Add `DATABASE_URL` to your `.env` file:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   ```
4. **Run Server**:
   ```bash
   # Production mode
   NODE_ENV=production tsx server.ts
   ```

To manage with PM2:
```bash
pm2 start "tsx server.ts" --name "zmk-app"
```

## Technologies

- **React 18** + **Vite**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (Icons)
- **Firebase** (Firestore & Auth)
- **PostgreSQL** (Self-hosted Database)
- **Express** (Backend Server)
- **Motion** (Animations)
