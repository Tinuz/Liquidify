// Real Moneybird API implementation with OAuth2 flow
import { getSession } from './session';

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

export interface MoneybirdAdministration {
  id: string;
  name: string;
  language: string;
  currency: string;
}

export interface MoneybirdTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface MoneybirdAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  baseUrl: string;
}

export class MoneybirdAPI {
  private config: MoneybirdAuthConfig;

  constructor(config: MoneybirdAuthConfig) {
    this.config = config;
  }

  /**
   * Generate OAuth authorization URL with proper scopes
   */
  getAuthorizationUrl(state?: string): string {
    const scopes = ['sales_invoices', 'settings'];
    const scopeParam = scopes.join(' ');
    const stateParam = state || Math.random().toString(36).substring(2);

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
      scope: scopeParam,
      state: stateParam,
    });

    return `${this.config.baseUrl}/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<MoneybirdTokenResponse> {
    const response = await fetch(`${this.config.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token exchange failed: ${response.status} ${error}`);
    }

    return response.json();
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<MoneybirdTokenResponse> {
    const response = await fetch(`${this.config.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token refresh failed: ${response.status} ${error}`);
    }

    return response.json();
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  async getAccessToken(): Promise<string> {
    const session = await getSession();

    if (!session.mbAccessToken) {
      throw new Error('No authentication tokens found');
    }

    // Moneybird tokens currently don't expire, but check if we have expiration info
    if (session.mbTokenExpiresAt) {
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = session.mbTokenExpiresAt;

      // Only refresh if we have a refresh token and token is actually expiring soon
      if (session.mbRefreshToken && now >= expiresAt - 300) {
        try {
          const tokenResponse = await this.refreshToken(session.mbRefreshToken);

          // Update session with new tokens
          session.mbAccessToken = tokenResponse.access_token;
          session.mbRefreshToken = tokenResponse.refresh_token;
          session.mbTokenExpiresAt = tokenResponse.expires_in
            ? now + tokenResponse.expires_in
            : now + 365 * 24 * 60 * 60; // 1 year fallback
          await session.save();

          return tokenResponse.access_token;
        } catch (error) {
          console.error('Token refresh failed:', error);
          // Refresh failed, clear session
          session.mbAccessToken = undefined;
          session.mbRefreshToken = undefined;
          session.mbTokenExpiresAt = undefined;
          session.connected = false;
          await session.save();
          throw new Error('Token refresh failed, please re-authenticate');
        }
      }
    }

    return session.mbAccessToken;
  }

  /**
   * Fetch administrations from Moneybird
   */
  async getAdministrations(): Promise<MoneybirdAdministration[]> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `${this.config.baseUrl}/api/v2/administrations.json`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch administrations: ${response.status}`);
    }

    const data = await response.json();
    return data.map((admin: any) => ({
      id: admin.id,
      name: admin.name,
      language: admin.language,
      currency: admin.currency,
    }));
  }

  /**
   * Fetch open/late invoices from Moneybird
   */
  async getInvoices(administrationId: string): Promise<MoneybirdInvoice[]> {
    const accessToken = await this.getAccessToken();

    const params = new URLSearchParams({
      filter: 'state:open,late',
    });

    const response = await fetch(
      `${this.config.baseUrl}/api/v2/${administrationId}/sales_invoices.json?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch invoices: ${response.status}`);
    }

    const data = await response.json();

    // Map Moneybird response to our interface
    return data.map((invoice: any) => ({
      id: invoice.id,
      invoice_id: invoice.invoice_id,
      contact: {
        company_name: invoice.contact?.company_name || 'Unknown',
      },
      due_date: invoice.due_date,
      total_price_incl_tax: parseFloat(invoice.total_price_incl_tax || '0'),
      state: invoice.state,
    }));
  }
}

// Default instance with environment configuration
export const moneybirdApi = new MoneybirdAPI({
  clientId: process.env.MONEYBIRD_CLIENT_ID || '',
  clientSecret: process.env.MONEYBIRD_CLIENT_SECRET || '',
  redirectUri: process.env.MONEYBIRD_REDIRECT_URI || '',
  baseUrl: process.env.MONEYBIRD_BASE_URL || 'https://moneybird.com',
});
