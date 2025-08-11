import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { moneybirdApi } from '@/lib/moneybird';

export async function GET() {
  try {
    // For development/demo purposes, return mock data directly
    // In production, this would check authentication and fetch from Moneybird API

    const mockInvoices = [
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

    return NextResponse.json(mockInvoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}
