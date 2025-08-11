'use client';

import { ThirdwebProvider } from '@thirdweb-dev/react';
import { BaseSepoliaTestnet } from '@thirdweb-dev/chains';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111');

  return (
    <ThirdwebProvider
      clientId={clientId}
      activeChain={BaseSepoliaTestnet}
      supportedChains={[BaseSepoliaTestnet]}
    >
      {children}
    </ThirdwebProvider>
  );
}
