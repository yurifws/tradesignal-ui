import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// Configuração do Wagmi + RainbowKit
export const config = getDefaultConfig({
  appName: 'Trade Signal',  
  projectId: '676f3e2eea65c179eac396659ccc9910', 
  chains: [sepolia],
  ssr: true,
});