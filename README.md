# Liquidify - Invoice Tokenization Platform

A Next.js application for tokenizing invoices using blockchain technology, with Moneybird integration.

## Features

- **Moneybird Integration**: Connect your Moneybird account to access invoices
- **Invoice Management**: View and manage your open invoices
- **Tokenization**: Transform invoices into blockchain tokens (coming soon)
- **Modern UI**: Built with Next.js, TypeScript, and TailwindCSS
- **Blockchain Ready**: Thirdweb integration for Web3 functionality

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Moneybird account (for invoice integration)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd liquidify
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:

```bash
# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
NEXT_PUBLIC_CHAIN_ID=11155111

# Moneybird Configuration
MONEYBIRD_CLIENT_ID=your_moneybird_client_id
MONEYBIRD_CLIENT_SECRET=your_moneybird_client_secret
MONEYBIRD_REDIRECT_URI=http://localhost:3000/api/auth/moneybird/callback

# Security
SESSION_SECRET=your_secure_session_secret

# Blockchain Configuration (Optional for now)
ADMIN_WALLET_PRIVATE_KEY=your_wallet_private_key
THIRDWEB_CLIENT_ID=your_thirdweb_client_id
THIRDWEB_CONTRACT_ADDRESS=your_contract_address
THIRDWEB_CHAIN_ID=11155111
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## Project Structure

```
liquidify/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes
│   ├── api/               # API routes
│   │   ├── auth/moneybird/
│   │   ├── moneybird/invoices/
│   │   ├── health/
│   │   └── tokenize/
│   ├── connect/           # Moneybird connection page
│   ├── invoices/          # Invoice management page
│   ├── tokenize/          # Token creation page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # App providers
├── components/            # Reusable components
│   ├── Button.tsx
│   └── Card.tsx
├── lib/                   # Utility libraries
│   ├── session.ts         # Session management
│   └── moneybird.ts       # Moneybird API helpers
├── types/                 # TypeScript type definitions
│   └── moneybird.ts
└── styles/
    └── globals.css        # Global styles
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/auth/moneybird/initiate` - Start Moneybird OAuth flow
- `GET /api/auth/moneybird/callback` - Handle OAuth callback
- `GET /api/moneybird/invoices` - Fetch user invoices
- `POST /api/tokenize` - Create invoice tokens (501 Not Implemented)

## Current Status

This is the initial scaffold implementation. The following features are currently available:

✅ **Completed**:

- Project setup with Next.js, TypeScript, TailwindCSS
- Basic UI components and pages
- Mock Moneybird integration
- Session management
- API route structure
- Development tooling (ESLint, Prettier, Husky)

🚧 **Mock Implementation**:

- Moneybird OAuth flow (returns fake tokens)
- Invoice fetching (returns mock data)
- Session storage

❌ **Not Yet Implemented**:

- Real Moneybird API integration
- Blockchain tokenization
- Smart contract deployment
- Token trading functionality

## Development Notes

- The current Moneybird integration is mocked for development
- Real API integration will be implemented in Sprint 2
- Blockchain functionality is prepared but not yet active
- All sensitive operations return mock data for safety

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

[Your License Here]
