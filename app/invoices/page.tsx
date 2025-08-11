'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';

interface Invoice {
  id: string;
  invoice_id: string;
  contact: {
    company_name: string;
  };
  due_date: string;
  total_price_incl_tax: number;
  state: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/moneybird/invoices');

      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      } else {
        const errorData = await response.json();

        if (response.status === 401) {
          if (errorData.error.includes('Not connected')) {
            setError('not_connected');
          } else {
            setError('authentication_expired');
          }
        } else if (response.status === 400) {
          setError('no_administration');
        } else {
          setError('fetch_failed');
        }
      }
    } catch (err) {
      setError('network_error');
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = () => {
    switch (error) {
      case 'not_connected':
        return {
          title: 'Not Connected',
          message: 'You need to connect your Moneybird account first.',
          action: { text: 'Connect Moneybird', href: '/connect' },
        };
      case 'authentication_expired':
        return {
          title: 'Authentication Expired',
          message: 'Your Moneybird connection has expired. Please reconnect.',
          action: { text: 'Reconnect', href: '/connect' },
        };
      case 'no_administration':
        return {
          title: 'No Administration Selected',
          message: 'Please select a Moneybird administration to continue.',
          action: {
            text: 'Select Administration',
            href: '/connect?step=select-admin',
          },
        };
      case 'fetch_failed':
        return {
          title: 'Failed to Load Invoices',
          message: 'There was an error loading your invoices from Moneybird.',
          action: { text: 'Try Again', onClick: loadInvoices },
        };
      case 'network_error':
        return {
          title: 'Network Error',
          message: 'Please check your internet connection and try again.',
          action: { text: 'Retry', onClick: loadInvoices },
        };
      default:
        return null;
    }
  };

  const errorInfo = getErrorMessage();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Invoices</h1>
        <p className="text-lg text-gray-600">
          Manage and tokenize your open invoices from Moneybird.
        </p>
      </div>

      {loading ? (
        <Card>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading your invoices...</p>
          </div>
        </Card>
      ) : error && errorInfo ? (
        <Card>
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {errorInfo.title}
            </h3>
            <p className="text-gray-600 mb-6">{errorInfo.message}</p>
            {errorInfo.action.href ? (
              <Link href={errorInfo.action.href}>
                <Button>{errorInfo.action.text}</Button>
              </Link>
            ) : (
              <Button onClick={errorInfo.action.onClick}>
                {errorInfo.action.text}
              </Button>
            )}
          </div>
        </Card>
      ) : invoices.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Open Invoices
            </h3>
            <p className="text-gray-600 mb-6">
              You don&apos;t have any open or late invoices in your selected
              administration.
            </p>
            <Button onClick={loadInvoices}>Refresh</Button>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoice_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.contact.company_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      €{invoice.total_price_incl_tax.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          invoice.state === 'open'
                            ? 'bg-yellow-100 text-yellow-800'
                            : invoice.state === 'late'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {invoice.state}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/tokenize?invoiceId=${invoice.id}`}>
                        <Button variant="secondary">Tokenize</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
