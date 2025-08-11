'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/Button';
import Card from '@/components/Card';

interface Administration {
  id: string;
  name: string;
  language: string;
  currency: string;
}

function ConnectContent() {
  const searchParams = useSearchParams();
  const step = searchParams.get('step');
  const error = searchParams.get('error');

  const [administrations, setAdministrations] = useState<Administration[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load administrations if we're on the select-admin step
  useEffect(() => {
    if (step === 'select-admin') {
      loadAdministrations();
    }
  }, [step]);

  // Show error message if present
  useEffect(() => {
    if (error) {
      const errorMessages: Record<string, string> = {
        missing_code: 'Authorization code was missing',
        invalid_state: 'Invalid security state',
        token_exchange_failed: 'Failed to exchange authorization code',
        authentication_failed: 'Authentication failed',
      };
      setMessage(errorMessages[error] || `Error: ${error}`);
    }
  }, [error]);

  const loadAdministrations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/moneybird/administrations');
      if (response.ok) {
        const data = await response.json();
        setAdministrations(data);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to load administrations');
      }
    } catch (error) {
      setMessage('Failed to load administrations');
    } finally {
      setLoading(false);
    }
  };

  const selectAdministration = async () => {
    if (!selectedAdmin) {
      setMessage('Please select an administration');
      return;
    }

    setLoading(true);
    const adminData = administrations.find((a) => a.id === selectedAdmin);

    try {
      const response = await fetch('/api/auth/moneybird/select-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          administrationId: selectedAdmin,
          administrationName: adminData?.name,
        }),
      });

      if (response.ok) {
        window.location.href = '/invoices';
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to select administration');
      }
    } catch (error) {
      setMessage('Failed to select administration');
    } finally {
      setLoading(false);
    }
  };

  // Show administration selection step
  if (step === 'select-admin') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Select Administration
          </h1>
          <p className="text-lg text-gray-600">
            Choose which Moneybird administration you want to connect to.
          </p>
        </div>

        <Card>
          {loading && administrations.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading administrations...</p>
            </div>
          ) : administrations.length > 0 ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Administration
                </label>
                <select
                  value={selectedAdmin}
                  onChange={(e) => setSelectedAdmin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose an administration...</option>
                  {administrations.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name} ({admin.currency})
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={selectAdministration}
                disabled={!selectedAdmin || loading}
                className="w-full"
              >
                {loading ? 'Connecting...' : 'Continue'}
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">
                Failed to load administrations
              </p>
              <Button onClick={loadAdministrations}>Try Again</Button>
            </div>
          )}

          {message && (
            <div className="mt-4 p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
              {message}
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Show initial connection step
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Connect Your Moneybird Account
        </h1>
        <p className="text-lg text-gray-600">
          Securely connect your Moneybird account to access your invoices and
          start tokenizing them on the blockchain.
        </p>
      </div>

      <Card>
        <div className="text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-12 w-12 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Ready to Connect
          </h2>

          <p className="text-gray-600 mb-6">
            Click the button below to authenticate with Moneybird. You&apos;ll
            be redirected to Moneybird&apos;s secure login page.
          </p>

          <a href="/api/auth/moneybird/initiate">
            <Button>Connect to Moneybird</Button>
          </a>

          <p className="text-sm text-gray-500 mt-4">
            Your data is secure and we only access what you explicitly permit.
          </p>

          {message && (
            <div className="mt-4 p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
              {message}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function ConnectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConnectContent />
    </Suspense>
  );
}
