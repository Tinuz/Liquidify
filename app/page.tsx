import Button from '@/components/Button';
import Card from '@/components/Card';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Liquidify
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transform your invoices into tradeable tokens with blockchain
          technology. Connect your Moneybird account to get started.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Connect Moneybird
          </h2>
          <p className="text-gray-600 mb-6">
            Connect your Moneybird account to access your invoices and start
            tokenizing them.
          </p>
          <Link href="/connect">
            <Button>Connect Account</Button>
          </Link>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            View Invoices
          </h2>
          <p className="text-gray-600 mb-6">
            Browse your open invoices and select which ones to tokenize for
            trading.
          </p>
          <Link href="/invoices">
            <Button variant="secondary">View Invoices</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
