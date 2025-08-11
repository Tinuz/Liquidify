import Button from '@/components/Button';
import Card from '@/components/Card';

export default function ConnectPage() {
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
        </div>
      </Card>
    </div>
  );
}
