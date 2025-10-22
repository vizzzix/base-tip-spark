# BaseTip Spark

A decentralized tipping platform built on Base Sepolia for creators to receive on-chain support from their community.

## 🚀 Features

- **On-chain Tipping**: Send USDC tips directly to creators on Base Sepolia
- **Creator Pages**: Easy-to-setup profile pages with customizable tip amounts
- **Real-time Stats**: Track total tips, supporters, and earnings
- **Network Switching**: Automatic Base Sepolia network detection and switching
- **Responsive Design**: Mobile-first design with Base/Coinbase aesthetics
- **Local Storage**: Client-side creator data storage with on-chain integration

## 📋 Contract Addresses

- **BaseTip Contract**: `0x602306cE966CB42FA39f6463cb401e8aF1080eBD`
- **USDC Token**: `0x036cbd0b68e1b46e9bf8b3a810feb5c0138f2f7e`
- **Network**: Base Sepolia (Chain ID: 84532)
- **Explorer**: [Base Sepolia Blockscout](https://base-sepolia.blockscout.com/)

## 🛠️ Tech Stack

- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Web3**: wagmi + viem + OnchainKit
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **State Management**: React Query + localStorage

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Web3 wallet (MetaMask, Coinbase Wallet, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/base-tip-spark.git
cd base-tip-spark
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:8080](http://localhost:8080) in your browser

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to GitHub Pages.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_ONCHAINKIT_API_KEY=your_onchainkit_api_key
VITE_CHAIN_ID=84532
VITE_CONTRACT_ADDRESS=0x602306cE966CB42FA39f6463cb401e8aF1080eBD
VITE_USDC_ADDRESS=0x036cbd0b68e1b46e9bf8b3a810feb5c0138f2f7e
```

### Network Configuration

The app is configured for Base Sepolia testnet. To switch to mainnet:

1. Update `APP_CHAIN_ID` in `src/lib/config.ts` to `8453`
2. Update contract addresses to mainnet versions
3. Update RPC endpoints

## 📱 Usage

### For Creators

1. **Connect Wallet**: Connect your Web3 wallet to Base Sepolia
2. **Create Page**: Fill out your profile information
3. **Customize**: Set suggested tip amounts and social links
4. **Publish**: Your page is live at `/creator/your-slug`
5. **Receive Tips**: Tips go directly to your wallet

### For Supporters

1. **Browse Creators**: Visit the leaderboard or featured creators
2. **Connect Wallet**: Ensure you're on Base Sepolia network
3. **Send Tips**: Choose amount and add optional message
4. **Approve USDC**: First-time users need to approve USDC spending
5. **Confirm Transaction**: Tips are sent on-chain

## 🏗️ Architecture

### Smart Contracts

- **BaseTip.sol**: Main contract handling tip distribution and creator registration
- **ERC20 USDC**: Standard USDC token for payments

### Frontend Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── lib/                # Utilities and configuration
│   ├── config.ts       # App configuration
│   ├── abi.ts          # Contract ABIs
│   ├── wagmi.ts        # Web3 configuration
│   ├── creators-store.ts # Local storage management
│   └── types.ts        # TypeScript types
└── hooks/              # Custom React hooks
```

## 🔒 Security

- All transactions are on-chain and verifiable
- USDC approval is required before sending tips
- Network validation prevents wrong network transactions
- Input validation and error handling throughout

## 🚀 Deployment

### GitHub Pages

1. Build the project: `npm run build`
2. Push to GitHub repository
3. Enable GitHub Pages in repository settings
4. Set source to `gh-pages` branch or `main` branch `/docs` folder

The build script automatically copies `index.html` to `404.html` for SPA routing support.

### Other Platforms

The app can be deployed to any static hosting platform:
- Vercel
- Netlify
- AWS S3 + CloudFront
- IPFS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Base](https://base.org/) for the L2 infrastructure
- [Coinbase](https://coinbase.com/) for OnchainKit
- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [wagmi](https://wagmi.sh/) for Web3 React hooks

## 📞 Support

- GitHub Issues: [Create an issue](https://github.com/your-username/base-tip-spark/issues)
- Discord: [Join our community](https://discord.gg/your-discord)
- Twitter: [@BaseTipSpark](https://twitter.com/BaseTipSpark)

---

Built with ❤️ for the Base ecosystem