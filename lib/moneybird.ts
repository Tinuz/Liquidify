// Moneybird API helper functions (stub implementation)
// TODO: Implement actual Moneybird API calls in Sprint 2

export interface MoneybirdInvoice {
  id: string;
  invoice_id: string;
  contact: {
    company_name: string;
  };
  due_date: string;
  total_price_incl_tax: number;
  state: string;
}

export interface MoneybirdAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class MoneybirdAPI {
  private config: MoneybirdAuthConfig;

  constructor(config: MoneybirdAuthConfig) {
    this.config = config;
  }

  /**
   * Generate OAuth authorization URL
   * TODO: Implement actual Moneybird OAuth URL generation
   */
  getAuthorizationUrl(state?: string): string {
    // Placeholder implementation - will be replaced with real Moneybird OAuth
    return `https://moneybird.com/oauth/authorize?client_id=${this.config.clientId}&redirect_uri=${this.config.redirectUri}&response_type=code&state=${state || 'default'}`;
  }

  /**
   * Exchange authorization code for access token
   * TODO: Implement actual token exchange
   */
  async exchangeCodeForToken(
    code: string
  ): Promise<{ access_token: string; administration_id: string }> {
    // Mock implementation
    return {
      access_token: 'mock_access_token_' + code,
      administration_id: 'mock_admin_id',
    };
  }

  /**
   * Fetch invoices from Moneybird
   * TODO: Implement actual API call
   */
  async getInvoices(
    accessToken: string,
    administrationId: string
  ): Promise<MoneybirdInvoice[]> {
    // Mock data for development
    return [
      {
        id: 'inv_1',
        invoice_id: 'MB-1001',
        contact: {
          company_name: 'ACME BV',
        },
        due_date: '2025-09-01',
        total_price_incl_tax: 2500.0,
        state: 'open',
      },
      {
        id: 'inv_2',
        invoice_id: 'MB-1002',
        contact: {
          company_name: 'Globex',
        },
        due_date: '2025-09-10',
        total_price_incl_tax: 5100.0,
        state: 'open',
      },
    ];
  }
}

// Default instance with environment configuration
export const moneybirdApi = new MoneybirdAPI({
  clientId: process.env.MONEYBIRD_CLIENT_ID || '',
  clientSecret: process.env.MONEYBIRD_CLIENT_SECRET || '',
  redirectUri: process.env.MONEYBIRD_REDIRECT_URI || '',
});
