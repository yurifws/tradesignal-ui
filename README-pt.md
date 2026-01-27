# Trade Signal - Interface Web 🌐

Interface web moderna para interagir com o marketplace descentralizado de sinais de trading Trade Signal.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Sobre

Interface web construída com Next.js que permite usuários:

- 🔗 Conectar carteiras (MetaMask, WalletConnect, etc)
- 📝 Criar sinais de trading com análises
- 🛒 Comprar acesso a sinais de outros traders
- 📊 Visualizar estatísticas e reputação
- 💼 Gerenciar sinais criados e comprados

## ✨ Features

- **Autenticação Web3** - Conexão via RainbowKit com múltiplas wallets
- **Dashboard Personalizado** - Visualize seus sinais e estatísticas
- **Marketplace** - Navegue e compre sinais de outros traders
- **Criação de Sinais** - Formulário intuitivo com validação
- **Design Responsivo** - Funciona em desktop e mobile
- **Tema Dark** - Interface moderna e profissional

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Web3**: Wagmi + Viem + RainbowKit
- **State Management**: TanStack Query (React Query)
- **Navegação**: Next.js Link Component

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- MetaMask ou outra wallet Web3

### Passos

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/tradesignal-ui.git
cd tradesignal-ui

# Instale as dependências
npm install

# Rode em modo desenvolvimento
npm run dev
```

Acesse: `http://localhost:3000`

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz:

```env
# WalletConnect Project ID (obtenha grátis em https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=seu_project_id_aqui
```

### 2. Configurar Endereço do Contrato

Edite `src/config/contract.ts`:

```typescript
export const CONTRACT_ADDRESS = "0xSeuEnderecoAqui" as const;
```

### 3. Configurar Chain

Edite `src/config/wagmi.ts` para mudar a rede:

```typescript
import { sepolia, mainnet } from "wagmi/chains";

export const config = getDefaultConfig({
  chains: [sepolia], // ou [mainnet] para produção
  // ...
});
```

## 📁 Estrutura do Projeto

```
tradesignal-ui/
├── src/
│   ├── app/                    # Páginas Next.js (App Router)
│   │   ├── page.tsx           # Home
│   │   ├── create/            # Criar signal
│   │   ├── browse/            # Ver signals
│   │   ├── my-signals/        # Meus signals criados
│   │   ├── purchased/         # Signals comprados
│   │   ├── layout.tsx         # Layout principal
│   │   ├── providers.tsx      # Web3 providers
│   │   └── globals.css        # Estilos globais
│   │
│   └── config/                 # Configurações
│       ├── contract.ts        # ABI e endereço do contrato
│       └── wagmi.ts           # Config Web3
│
├── public/                     # Arquivos estáticos
├── .env.local                 # Variáveis de ambiente (criar)
├── next.config.js             # Config Next.js
├── tailwind.config.js         # Config Tailwind
├── tsconfig.json              # Config TypeScript
└── package.json               # Dependências
```

## 🚀 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento (localhost:3000)
npm run build    # Compila para produção
npm run start    # Inicia servidor de produção
npm run lint     # Verifica erros de código
```

## 📱 Páginas

### Home (`/`)

- Hero section minimalista
- Botão de conexão de wallet
- Cards de navegação (quando conectado)
- Footer com estatísticas

### Criar Signal (`/create`)

- Formulário para criar novo signal
- Campos: Asset, Target Price, Deadline, Direction, Fee, Analysis
- Validação de dados
- Integração com MetaMask para transação

### Ver Signals (`/browse`)

- Grid com todos os signals ativos
- Cards com informações: Asset, Price, Trader, Fee
- Botão de compra

### Meus Signals (`/my-signals`)

- Dashboard pessoal
- Estatísticas: Total, Corretos, Accuracy
- Lista apenas de signals criados por você

### Signals Comprados (`/purchased`)

- Lista de signals que você comprou
- Análise completa desbloqueada
- Informações do trader

## 🎨 Personalização

### Design Minimalista

O projeto usa um design system minimalista e profissional:

- **Fundo**: `#0a0e1a` (dark-900)
- **Cards**: `#111827` (gray-900)
- **Bordas**: `#1f2937` (gray-800)
- **Destaque**: Verde (Bullish), Vermelho (Bearish)
- **Botões primários**: Branco com texto preto
- **Sem gradientes**: Design limpo e corporativo

### Cores

Edite `tailwind.config.js` para mudar o tema:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',  // Cor principal
        700: '#1d4ed8',
      },
      dark: {
        900: '#0a0e1a',  // Background
        800: '#121827',
        700: '#1a2332',
      }
    },
  },
}
```

### Fontes

Edite `src/app/globals.css`:

```css
body {
  font-family: "Sua Fonte Aqui", sans-serif;
}
```

## 🔐 Segurança

- ✅ Nunca commite `.env.local` (já está no `.gitignore`)
- ✅ Use HTTPS em produção
- ✅ Valide todas as entradas do usuário
- ✅ Use conexões RPC seguras
- ✅ Implemente rate limiting para produção

## 🌐 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Conecte seu repo no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente
4. Deploy automático!

### Netlify

```bash
npm run build
# Upload da pasta .next para Netlify
```

### Outros

O projeto é compatível com qualquer host que suporte Next.js:

- AWS Amplify
- Railway
- Render
- DigitalOcean App Platform

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔗 Links

- **Smart Contract**: [tradesignal-contracts](https://github.com/seu-usuario/tradesignal-contracts)
- **Sepolia Etherscan**: https://sepolia.etherscan.io/address/0x029BcD216154cD5B488548CC21CC766E01f80db4

## 📞 Suporte

Tem dúvidas? Abra uma [issue](https://github.com/seu-usuario/tradesignal-ui/issues) ou entre em contato!

---

**Desenvolvido para projeto final do Web3 Bootcamp**
