# Billing Software — Frontend

React + Vite + Tailwind CSS frontend for the Billing Software Management system, with an automated CI/CD pipeline via GitHub Actions.

![Frontend CI/CD](https://github.com/Somilgupta07/billing-software-frontend/actions/workflows/ci-cd.yml/badge.svg)

## Features

- Dashboard with live stats (products, customers, bills, revenue) and low-stock alerts
- Product Management — add, edit, delete, view with stock badges
- Customer Management — add, edit, delete, view
- Create Bill — select customer, add multiple products with quantity, live subtotal/discount/tax/total calculation, client-side stock checks before submitting
- Billing History — list all bills, view full invoice detail with print support
- Toast notifications for every success/error
- Form validation matching backend rules, with inline error messages
- Loading and empty states on every page
- Fully responsive layout — collapsible sidebar drawer on mobile, adaptive grids and tables
- Automated CI/CD pipeline: every push is built and checked before it's allowed to deploy

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- React Router v6
- Axios
- react-hot-toast
- lucide-react (icons)
- GitHub Actions (CI/CD)

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Point this at your backend's URL — `http://localhost:5000/api` for local dev, or your deployed backend URL in production.

## Run locally

```bash
npm run dev
```

Opens at `http://localhost:5173`. Make sure your backend server is running first.

## Build for production

```bash
npm run build
```

Output goes to `dist/`.

## Folder Structure

```
frontend/
├── .github/
│   └── workflows/
│       └── ci-cd.yml       # CI/CD pipeline definition
├── src/
│   ├── api/                 # Axios calls per resource (products, customers, bills)
│   ├── components/           # Reusable UI (Sidebar, Topbar, Modal, ConfirmDialog, Spinner, PageState, PageHeader)
│   ├── pages/                 # One file per route (Dashboard, Products, Customers, CreateBill, BillingHistory, BillDetail)
│   ├── App.jsx                # Routes + responsive layout
│   ├── main.jsx                # Entry point
│   └── index.css                # Tailwind + shared utility classes
├── index.html
├── vite.config.js
├── tailwind.config.js
├── vercel.json                  # SPA routing + disables Vercel's auto-deploy on main
└── .env.example
```

---

## CI/CD Pipeline

This project deploys through an automated two-stage pipeline instead of relying on the hosting platform's default "deploy on every push" behavior. The goal: **broken code never reaches production**, because the deploy step only runs after the build step succeeds.

### How it works

```
git push to main
      │
      ▼
┌─────────────┐      passes       ┌──────────────┐
│  build job   │ ───────────────▶ │  deploy job   │ ──▶ triggers Vercel via
│ (npm ci +    │                  │ (needs: build)│     deploy hook
│  npm run     │                  │  only on main │
│  build)      │                  └──────────────┘
└─────────────┘
      │ fails
      ▼
   deploy job is SKIPPED — nothing goes live
```

Defined in [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml):

1. **`build` job** — runs on every push and pull request targeting `main`. Installs dependencies with `npm ci` and runs `npm run build`. If any file has a syntax error, a broken import, or anything that would fail to compile, this step fails here — before Vercel ever sees it.
2. **`deploy` job** — depends on `build` via `needs: build`, and only runs on pushes to `main` (not on pull requests). It calls a Vercel Deploy Hook URL, which tells Vercel to build and publish the latest commit.

Vercel's own automatic Git deployments are disabled for the `main` branch (via `git.deploymentEnabled: { "main": false }` in `vercel.json`), so **the only way `main` gets deployed is through this pipeline** — not through Vercel listening to pushes directly.

### Required GitHub Secrets

Configured under repo **Settings → Secrets and variables → Actions**:

| Secret | Purpose |
|---|---|
| `VERCEL_DEPLOY_HOOK` | URL from Vercel → Project Settings → Git → Deploy Hooks. Triggers a production deploy when called. |
| `VITE_API_URL` | Backend API URL, injected at build time so the production build points at the live backend instead of localhost. |

### Verifying the pipeline

1. Push a change → check the **Actions** tab → confirm `build` runs first, then `deploy` runs only after `build` succeeds.
2. Check Vercel's **Deployments** tab → a new deployment should appear shortly after the `deploy` job completes.
3. To confirm the gate actually blocks bad code: introduce a syntax error, push it, and confirm `build` fails (red ✗) while `deploy` shows as **skipped**, not run — and that no new deployment appears on Vercel for that push.

---

## Deploying to Vercel (initial setup)

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — Vite is auto-detected.
3. Add environment variable `VITE_API_URL` = your deployed backend URL + `/api`.
4. Create a **Deploy Hook** (Settings → Git → Deploy Hooks) and add it as the `VERCEL_DEPLOY_HOOK` secret in your GitHub repo.
5. Add `git.deploymentEnabled: { "main": false }` to `vercel.json` (already included) so only the pipeline controls production deploys.
6. Push to `main` — the GitHub Actions pipeline takes it from there.

**Important:** your backend must be deployed and reachable over the internet before the frontend can talk to it — `localhost` URLs won't resolve once deployed. Also confirm your backend's CORS settings allow requests from your Vercel domain.

## Notes

- All API calls go through `src/api/client.js`, which normalizes error messages so every page can just read `err.message`.
- Stock checks happen both client-side (in `CreateBill.jsx`, for immediate feedback) and server-side (the source of truth) — the backend will always reject overselling even if the frontend check is somehow bypassed.
- If you fork or rename this repo, update the badge URL at the top of this file to match your new GitHub username/repo name.
