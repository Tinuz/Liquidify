// Moneybird API types

export interface MoneybirdContact {
  id: string;
  company_name: string;
  firstname?: string;
  lastname?: string;
  email?: string;
}

export interface MoneybirdInvoice {
  id: string;
  invoice_id: string;
  contact: MoneybirdContact;
  invoice_date: string;
  due_date: string;
  total_price_excl_tax: number;
  total_price_incl_tax: number;
  state: 'draft' | 'open' | 'late' | 'paid' | 'cancelled';
  currency: string;
  reference?: string;
  language?: string;
}

export interface MoneybirdAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface MoneybirdAdministration {
  id: string;
  name: string;
  language: string;
  currency: string;
}

export interface MoneybirdError {
  error: string;
  error_description?: string;
}
