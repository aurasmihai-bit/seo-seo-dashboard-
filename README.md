# GEO·SEO Auditor

Dashboard web pentru audit GEO + SEO powered by Claude AI.

## Deploy pe Vercel

### 1. Push pe GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USER/REPO.git
git push -u origin main
```

### 2. Import pe Vercel

1. Mergi la [vercel.com](https://vercel.com) → **New Project**
2. Importă repository-ul GitHub
3. La **Environment Variables** adaugă:
   - `ANTHROPIC_API_KEY` = cheia ta API de la [console.anthropic.com](https://console.anthropic.com)
4. Click **Deploy**

## Development local

```bash
cp .env.example .env.local
# Editează .env.local și adaugă ANTHROPIC_API_KEY
npm install
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000).

## Stack

- **Next.js 14** (App Router)
- **Claude claude-sonnet-4-20250514** via Anthropic API
- Fără dependențe UI externe — CSS pur
