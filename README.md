# Billing Software — Frontend

React + Vite + Tailwind CSS frontend for the Billing Software Management system.

## Features

- Dashboard with live stats (products, customers, bills, revenue) and low-stock alerts
- Product Management — add, edit, delete, view with stock badges
- Customer Management — add, edit, delete, view
- Create Bill — select customer, add multiple products with quantity, live subtotal/discount/tax/total calculation, client-side stock checks before submitting
- Billing History — list all bills, view full invoice detail with print support
- Toast notifications for every success/error
- Form validation matching backend rules, with inline error messages
- Loading and empty states on every page
- Fully responsive layout with a fixed sidebar

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- React Router v6
- Axios
- react-hot-toast
- lucide-react (icons)

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

## Deploying to Vercel

1. Push this frontend folder to GitHub (as its own repo, or as a subfolder — see note below).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. If this frontend lives in a subfolder (e.g. `frontend/` inside a monorepo), set **Root Directory** to `frontend` in the Vercel project settings.
4. Framework preset: Vite (auto-detected).
5. Add an environment variable in the Vercel dashboard:
   - `VITE_API_URL` = your deployed backend's URL + `/api` (e.g. `https://your-backend.onrender.com/api`)
6. Deploy.

`vercel.json` is already included to handle client-side routing (so refreshing `/products` or `/billing-history/:id` doesn't 404).

**Important:** Your backend must also be deployed somewhere reachable over the internet (Render, Railway, Cyclic, etc.) before the Vercel frontend can talk to it — `localhost` URLs won't work once deployed. Also make sure your backend's CORS config allows requests from your Vercel domain.

## Folder Structure

```
frontend/
├── src/
│   ├── api/              # Axios calls per resource (products, customers, bills)
│   ├── components/        # Reusable UI (Sidebar, Modal, ConfirmDialog, Spinner, PageState, PageHeader)
│   ├── pages/              # One file per route (Dashboard, Products, Customers, CreateBill, BillingHistory, BillDetail)
│   ├── App.jsx             # Routes
│   ├── main.jsx            # Entry point
│   └── index.css           # Tailwind + shared utility classes
├── index.html
├── vite.config.js
├── tailwind.config.js
├── vercel.json
└── .env.example
```

## Notes

- All API calls go through `src/api/client.js`, which normalizes error messages so every page can just read `err.message`.
- Stock checks happen both client-side (in `CreateBill.jsx`, for immediate feedback) and server-side (the source of truth) — the backend will always reject overselling even if the frontend check is somehow bypassed.
