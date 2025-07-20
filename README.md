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

## 🔐 Admin Actions

To create actions restricted to admin users, use the `adminActionClient` from `src/lib/actions.ts`. This client will verify that the user is authenticated and is present in the `AdminUser` table.

### Example Usage

```typescript
// src/actions/admin/someAdminAction.ts
import { adminActionClient } from '@/lib/actions';

export const someAdminAction = adminActionClient.action(async ({ ctx }) => {
  // This code will only execute if the user is an admin
  console.log('Admin user ID:', ctx.session.userId);
  // ... your admin logic here
});
```

### Adding an Admin User

To add an admin user, you need to manually add their user ID to the `AdminUser` table in the database. You can do this using Prisma Studio:

1.  Start Prisma Studio:
    ```bash
    npx dotenv -e .env.local -- npx prisma studio
    ```
2.  Open your browser to `http://localhost:5555`.
3.  Navigate to the `AdminUser` model.
4.  Click "Add record" and enter the `id` and `walletAddress` of the user you want to make an admin. The `id` should be the user's ID from the `User` table.

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
