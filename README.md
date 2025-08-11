# Liquidify - Invoice Tokenization Platform

A Next.js application for tokenizing invoices using blockchain technology, with Moneybird integration.

## Features

- **Moneybird Integration**: Full OAuth2 integration with real API access
- **Administration Selection**: Choose which Moneybird administration to use
- **Invoice Management**: View and manage your open and overdue invoices
- **Secure Authentication**: Server-side token storage with automatic refresh
- **Tokenization**: Transform invoices into blockchain tokens (coming soon)
- **Modern UI**: Built with Next.js, TypeScript, and TailwindCSS
- **Blockchain Ready**: Thirdweb integration for Web3 functionality

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Moneybird account with at least one administration
- Moneybird OAuth2 application (register at [Moneybird Developers](https://developer.moneybird.com/))

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

# Moneybird OAuth2 Configuration
MONEYBIRD_CLIENT_ID=your_moneybird_client_id
MONEYBIRD_CLIENT_SECRET=your_moneybird_client_secret
MONEYBIRD_REDIRECT_URI=http://localhost:3000/api/auth/moneybird/callback
MONEYBIRD_BASE_URL=https://moneybird.com

# Security (Generate a secure random string)
SESSION_SECRET=your_secure_session_secret_min_32_chars

# Blockchain Configuration (Optional for now)
ADMIN_WALLET_PRIVATE_KEY=your_wallet_private_key
THIRDWEB_CLIENT_ID=your_thirdweb_client_id
THIRDWEB_CONTRACT_ADDRESS=your_contract_address
THIRDWEB_CHAIN_ID=11155111
```

### Moneybird Setup

1. Register your application at [Moneybird Developers](https://developer.moneybird.com/)
2. Set the redirect URI to: `http://localhost:3000/api/auth/moneybird/callback`
3. Note down your Client ID and Client Secret
4. Ensure you have at least one administration in your Moneybird account
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

````

### Development

Run the development server:

```bash
npm run dev
````

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
│   │   │   ├── initiate/route.ts    # OAuth2 initiation
│   │   │   ├── callback/route.ts    # OAuth2 callback
│   │   │   └── select-admin/route.ts # Admin selection
│   │   ├── moneybird/
│   │   │   ├── administrations/route.ts # Fetch administrations
│   │   │   └── invoices/route.ts        # Fetch invoices
│   │   ├── health/
│   │   └── tokenize/
│   ├── connect/           # Moneybird connection & admin selection
│   ├── invoices/          # Invoice management page
│   ├── tokenize/          # Token creation page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # App providers
├── components/            # Reusable components
│   ├── Button.tsx
│   └── Card.tsx
├── lib/                   # Utility libraries
│   ├── session.ts         # Session management with OAuth tokens
│   └── moneybird.ts       # Moneybird API client with OAuth2
├── types/                 # TypeScript type definitions
│   └── moneybird.ts
└── styles/
    └── globals.css        # Global styles
```

## API Endpoints

### Authentication

- `GET /api/auth/moneybird/initiate` - Start Moneybird OAuth2 flow
- `GET /api/auth/moneybird/callback` - Handle OAuth2 callback
- `POST /api/auth/moneybird/select-admin` - Select administration

### Moneybird Integration

- `GET /api/moneybird/administrations` - Fetch available administrations
- `GET /api/moneybird/invoices` - Fetch invoices from selected administration

### Other

- `GET /api/health` - Health check endpoint
- `POST /api/tokenize` - Create invoice tokens (501 Not Implemented)

## OAuth2 Flow

The application implements a secure OAuth2 flow with Moneybird:

1. **Initiate**: User clicks "Connect Moneybird" → redirected to `/api/auth/moneybird/initiate`
2. **Authorization**: User authorizes on Moneybird → redirected back with code
3. **Token Exchange**: App exchanges code for access/refresh tokens
4. **Administration Selection**: User selects which administration to use
5. **Data Access**: App fetches invoices using stored tokens

### Security Features

- **CSRF Protection**: OAuth state parameter prevents cross-site attacks
- **Server-side Storage**: Tokens stored securely in encrypted cookies
- **Automatic Refresh**: Expired tokens refreshed transparently
- **Scope Validation**: Minimal required permissions (sales_invoices:read)

## Current Status

✅ **Completed (Sprint 1 & 2)**:

- Project setup with Next.js, TypeScript, TailwindCSS
- Complete UI components and pages
- **Real Moneybird OAuth2 integration**
- **Secure token storage and refresh**
- **Administration selection flow**
- **Real invoice fetching from Moneybird API**
- **Comprehensive error handling**
- Session management
- Development tooling (ESLint, Prettier, Husky)

🚧 **In Progress**:

- Enhanced invoice filtering and sorting
- Improved error recovery

❌ **Not Yet Implemented**:

- Blockchain tokenization
- Smart contract deployment
- Token trading functionality
- Invoice status updates back to Moneybird

## Error Handling

The application provides comprehensive error handling for:

- **Authentication Errors**: Expired tokens, invalid credentials
- **API Errors**: Network issues, Moneybird API failures
- **User Experience**: Clear error messages with recovery actions
- **Security**: Proper validation of OAuth state and tokens

## Development Notes

- OAuth2 flow follows security best practices
- Tokens are stored server-side only (never exposed to client)
- All Moneybird API calls include proper authentication
- Error states provide clear user guidance
- Session management handles token expiration gracefully

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

[Your License Here]
