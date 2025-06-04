# 🗳️ DEVoter Voting Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql)
![thirdweb](https://img.shields.io/badge/thirdweb-7C3AED?style=for-the-badge)

**Non-custodial voting platform for web3 repositories. Vote with tokens that stay in your wallet.**

[🌐 Live Platform](https://app.devoter.xyz) • [📖 Landing Page](https://devoter.xyz) • [🔧 API Docs](https://docs.devoter.xyz/api)

</div>

---

## ⚡ Core Features

- 🔐 **Wallet Authentication** - thirdweb-powered secure login
- 📝 **Repository Submission** - Submit repos for community voting
- 🗳️ **Non-Custodial Voting** - Tokens never leave your wallet
- 📊 **Real-time Leaderboards** - Live rankings and statistics
- 📈 **Historical Data** - Track voting trends over time

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 + TypeScript | Full-stack React framework |
| PostgreSQL + Prisma | Database and ORM |
| thirdweb SDK | Voting contracts & authentication |
| decent.xyz | Multi-token support |
| Vercel | Hosting + serverless functions |

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/devoter-xyz/devoter-app
cd devoter-voting

pnpm install

# Setup database
npx dotenv -e .env.local -- npx prisma db push

# Start development
pnpm dev
```

## 🔧 Environment Variables

```env
DATABASE_URL=postgresql://username:password@localhost:5432/devoter
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
THIRDWEB_SECRET_KEY=your_secret_key
```

## 💾 Database Management

```bash
# View database in browser
npx dotenv -e .env.local -- npx prisma studio

# Run database migrations
npx dotenv -e .env.local -- npx prisma migrate dev

# Reset database (development only)
npx dotenv -e .env.local -- npx prisma migrate reset

# Run database seeder
npx dotenv -e .env.local -- ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts
```

## 🚀 Deployment

| Component | Platform | Auto-Deploy |
|-----------|----------|-------------|
| 🌐 Main App | Vercel | ✅ On push to main |
| ⏰ Cron Jobs | Vercel Functions | ✅ Configured in `vercel.json` |
| 💾 Database | Vercel PostgreSQL | ✅ Managed service |

---

<div align="center">

**Empowering Web3 Repository Discovery** 🚀

[Report Bug](https://github.com/devoter-xyz/devoter-app/issues) • [Request Feature](https://github.com/devoter-xyz/devoter-app/issues) • [Contribute](https://github.com/devoter-xyz/devoter-app/pulls)

</div>
