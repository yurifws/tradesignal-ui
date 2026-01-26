# Trade Signal - Web Interface 🌐

Modern web interface to interact with the Trade Signal decentralized trading signals marketplace.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 About

Web interface built with Next.js that allows users to:
- 🔗 Connect wallets (MetaMask, WalletConnect, etc)
- 📝 Create trading signals with analysis
- 🛒 Purchase access to other traders' signals
- 📊 View statistics and reputation
- 💼 Manage created and purchased signals

## ✨ Features

- **Web3 Authentication** - Connect via RainbowKit with multiple wallets
- **Personal Dashboard** - View your signals and statistics
- **Marketplace** - Browse and buy signals from other traders
- **Signal Creation** - Intuitive form with validation
- **Responsive Design** - Works on desktop and mobile
- **Dark Theme** - Modern and professional interface

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi + Viem + RainbowKit
- **State Management**: TanStack Query (React Query)
- **Navigation**: Next.js Link Component

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or another Web3 wallet

### Steps

```bash
# Clone the repository
git clone https://github.com/your-username/tradesignal-ui.git
cd tradesignal-ui

# Install dependencies
npm install

# Run in development mode
npm run dev
```

Access: `http://localhost:3000`

## 🔧 Configuration

### 1. Environment Variables

Create a `.env.local` file in the root:

```env
# WalletConnect Project ID (get free at https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 2. Configure Contract Address

Edit `src/config/contract.ts`:

```typescript
export const CONTRACT_ADDRESS = '0xYourAddressHere' as const;
```

### 3. Configure Chain

Edit `src/config/wagmi.ts` to change network:

```typescript
import { sepolia, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  chains: [sepolia], // or [mainnet] for production
  // ...
});
```

## 📁 Project Structure

```
tradesignal-ui/
├── src/
│   ├── app/                    # Next.js Pages (App Router)
│   │   ├── page.tsx           # Home
│   │   ├── create/            # Create signal
│   │   ├── browse/            # View signals
│   │   ├── my-signals/        # My signals
│   │   ├── layout.tsx         # Main layout
│   │   ├── providers.tsx      # Web3 providers
│   │   └── globals.css        # Global styles
│   │
│   └── config/                 # Configurations
│       ├── contract.ts        # Contract ABI and address
│       └── wagmi.ts           # Web3 config
│
├── public/                     # Static files
├── .env.local                 # Environment variables (create)
├── next.config.js             # Next.js config
├── tailwind.config.js         # Tailwind config
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies
```

## 🚀 Available Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Check code errors
```

## 📱 Pages

### Home (`/`)
- Hero section with project information
- Wallet connection button
- Navigation cards (when connected)
- "How It Works" section

### Create Signal (`/create`)
- Form to create new signal
- Fields: Asset, Target Price, Deadline, Direction, Fee, Analysis
- Data validation
- MetaMask integration for transaction

### Browse Signals (`/browse`)
- Grid with all active signals
- Filters and search (to implement)
- Cards with info: Asset, Price, Trader, Fee
- Buy button

### My Signals (`/my-signals`)
- Personal dashboard
- Statistics: Total, Correct, Accuracy
- List of created signals
- List of purchased signals (with unlocked analysis)

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to change theme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',  // Main color
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

### Fonts

Edit `src/app/globals.css`:

```css
body {
  font-family: 'Your Font Here', sans-serif;
}
```

## 🔐 Security

- ✅ Never commit `.env.local` (already in `.gitignore`)
- ✅ Use HTTPS in production
- ✅ Validate all user inputs
- ✅ Use secure RPC connections
- ✅ Implement rate limiting for production

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect your repo on [Vercel](https://vercel.com)
3. Configure environment variables
4. Automatic deployment!

### Netlify

```bash
npm run build
# Upload .next folder to Netlify
```

### Others

The project is compatible with any host that supports Next.js:
- AWS Amplify
- Railway
- Render
- DigitalOcean App Platform

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a branch (`git checkout -b feature/MyFeature`)
3. Commit your changes (`git commit -m 'Add MyFeature'`)
4. Push to the branch (`git push origin feature/MyFeature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 🔗 Links

- **Smart Contract**: [tradesignal-contracts](https://github.com/your-username/tradesignal-contracts)
- **Sepolia Etherscan**: https://sepolia.etherscan.io/address/0x23ae9ee257069cCcDa0157e2941D5D8ba4394B47
- **Demo**: https://tradesignal.vercel.app (if deployed)

## 📞 Support

Have questions? Open an [issue](https://github.com/your-username/tradesignal-ui/issues) or get in touch!

---

**Developed with ❤️ as a Web3 Bootcamp final project**
