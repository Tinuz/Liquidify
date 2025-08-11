'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/Button';
import Card from '@/components/Card';

function TokenizeForm() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('invoiceId');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/tokenize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId,
          ...formData,
        }),
      });

      if (response.status === 501) {
        setMessage('Tokenization feature is not yet implemented.');
      } else if (response.ok) {
        setMessage('Token created successfully!');
        setFormData({ name: '', description: '' });
      } else {
        setMessage('An error occurred. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Tokenize Invoice
        </h1>
        <p className="text-lg text-gray-600">
          Create a blockchain token representing your invoice for trading and
          liquidity.
        </p>
        {invoiceId && (
          <p className="text-sm text-gray-500 mt-2">Invoice ID: {invoiceId}</p>
        )}
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Token Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Invoice Token MB-1001"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the token and its underlying invoice..."
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Creating Token...' : 'Create Token'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>

          {message && (
            <div
              className={`p-4 rounded-md ${
                message.includes('error') ||
                message.includes('not yet implemented')
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}

export default function TokenizePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TokenizeForm />
    </Suspense>
  );
}
