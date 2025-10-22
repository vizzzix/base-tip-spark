# BaseTip Spark

**Support your favorite creators on‐chain** — a decentralized tipping platform built on USDC on the Base Sepolia network.  
Fans can send tips to creators, and supporters earn collectible "Supporter Badges" as they show their loyalty.

## 🎯 Why BaseTip Spark

- Enables **instant on‐chain tipping** with real blockchain transparency.  
- Built on Base Sepolia: low fees, fast confirmations.  
- Supporters receive badges for showing their loyalty (Supporter → Diamond).  
- Open Source, deployable on GitHub Pages, ready for hackathon and airdrop eligibility.
- **Referral system**: Earn 5% of donations from users you refer!

## 🚀 Live Demo  
https://vizzzix.github.io/base-tip-spark/

## 🧾 Deployment Proof
BaseTip Spark is fully deployed and live on the Base Sepolia Testnet.
All smart contract functions — registration, tipping, and data reads — are verified and working on-chain.

 🔹 Smart Contract 0x602306cE966CB42FA39f6463cb401e8aF1080eBD
 📍 Network: Base Sepolia (Chain ID: 84532)
🔗https://base-sepolia.blockscout.com/address/0x602306cE966CB42FA39f6463cb401e8aF1080eBD

🔹 Example Transaction
CreatorRegistered event successfully emitted for Alice Chen
🔗https://base-sepolia.blockscout.com/tx/0x3cbde9d52608b482d35da3869fd9fb75e2e6400c545ed10ca116448acb059c7b

✅ Verified On-Chain Actions
- Contract deployed and verified on Base Sepolia
- Real creator successfully registered
- Frontend integrated with live blockchain data

## 🧩 Architecture Overview

### Smart Contract  
- Address: `0x602306cE966CB42FA39f6463cb401e8aF1080eBD` on Base Sepolia.  
- Main features:  
  - `registerCreator(name, bio, avatar)` — creators register themselves.  
  - `sendTip(creator, amount, message)` — fans tip USDC, platform fee applied.  
  - ERC-1155 badge minting based on supporter total contributions.  
  - Platform fee: 2.5% (configurable by owner).  
  - Only one registration per creator address (`require(!registeredCreators[msg.sender])`).

### Frontend  
- Built with **Vite + React + TypeScript**, UI styled with **Tailwind CSS** + Framer Motion.  
- Uses `wagmi` + `viem` for blockchain interactions.  
- Real-time loading of creators via contract events `CreatorRegistered`.  
- Slug mapping: `/creator/[slug]` routes automatically resolve to creator address.  
- Data caching via IndexedDB for offline and performance support.  
- Deployment: GitHub Pages (`gh-pages`), with SPA routing (`404.html` fallback).

## 🔧 Features

- **Creator registration and display** (avatar, bio, total tips, categories).  
- **Tipping flow**: Wallet connect (Coinbase Wallet / WalletConnect) + Demo payment system.  
- **Supporter badges** based on tiers:  
  - Supporter: $0+  
  - Fan: $500+  
  - VIP: $2,000+  
  - Champion: $5,000+  
  - Legend: $10,000+  
  - Diamond: $25,000+  
- **Referral system**: Generate referral links and earn 5% of referred users' donations.  
- **Demo mode**: Test the platform without real transactions.  
- **Transparent fee display**: "Platform fee: 2.5% (included) • Creator receives … USDC".  
- **Network check**: ensures user on Base Sepolia; prompts switch if not.  
- **Real-time updates** with live indicators.  
- **IndexedDB cache** + fallback offline mode.

## 🧪 Getting Started (Development)

```bash
git clone https://github.com/vizzzix/base-tip-spark.git
cd base-tip-spark
npm install
npm run dev          # local dev server (http://localhost:8080)
npm run build        # build for production (dist)
npm run deploy       # deploy to GitHub Pages
```

## 🧮 Smart Contract Info

**Chain**: Base Sepolia (Chain ID: 84532)  
**USDC Token**: `0x036CbD0b68E1B46E9bF8b3A810feB5c0138f2f7e` (6 decimals)  
**Platform Fee**: 2.5% (configurable by owner)

**Badge Tier Thresholds (USDC)**:
- Supporter: $0+
- Fan: $500+
- VIP: $2,000+
- Champion: $5,000+
- Legend: $10,000+
- Diamond: $25,000+

## 🎨 Demo Features

- **19 mock creators** with diverse categories (Art, Music, Dev, Gaming, Photography, etc.)
- **Demo payment system** for testing without real transactions
- **Referral system** with unique codes and earnings tracking
- **Badge progression** visualization
- **Responsive design** for all devices

## 📋 Submission for Base Batches Builder Track

**Project Name**: BaseTip Spark  
**Track**: Base Batches Builder Track – Submission Category

**Why this solves a real problem**:
- Creators currently rely on centralized platforms with opaque fees
- BaseTip Spark offers low‐fee on‐chain tipping, transparent badges, and direct creator support
- Built on Base, with open-source design ready for airdrop readiness
- **Referral system** encourages community growth and viral adoption

## 📝 Next Steps & Roadmap

- [ ] Add `getAllCreators()` in contract for bulk reads
- [ ] Integrate real card payment flow (Coinbase Commerce)
- [ ] Real badge SVGs & metadata storage (IPFS)
- [ ] Tiered analytics dashboard for creators
- [ ] Mobile PWA and dark mode
- [ ] Multi-chain support (Ethereum mainnet, Polygon)
- [ ] Creator verification system
- [ ] Social features (comments, reactions)

## 🛠️ Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Blockchain**: wagmi + viem
- **Database**: IndexedDB (client-side caching)
- **Deployment**: GitHub Pages
- **Icons**: Lucide React
- **UI Components**: shadcn/ui

## 🙏 Acknowledgements

Built by [@vizzzix](https://github.com/vizzzix) — made for the Base ecosystem hackathon.  
Licensed under MIT.
