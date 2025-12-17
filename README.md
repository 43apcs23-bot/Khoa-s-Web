# FootGear H (Shoe Store)

✅ Short: A full-stack shoe store demo app (React + Express + MongoDB) with search, filters, cart, orders, admin panel, and a demo deposit flow.

---

## Table of Contents

- ✅ Project overview
- 🧰 Tech stack
- 🚀 Features
- 🗂️ Repo structure
- ⚙️ Local setup
- ☁️ Deployment (Netlify + Railway)
- 🐞 Troubleshooting (CORS / Auth / Cookies)
- 🛠 Contributing
- 📄 License

---

## Project overview

FootGear H is an e-commerce demo application for selling shoes. It includes customer-facing pages (product listing, product detail, cart, checkout), user authentication, order management, and admin controls.

This repo contains both the frontend (CRA + React + Tailwind) and backend (Express + Mongoose). The app is designed to be deployed with a static host for frontend (Netlify) and a Node backend host (Railway or similar).

---

## Tech stack

- Frontend: React (Create React App), Redux Toolkit, Tailwind CSS, Axios
- Backend: Node.js, Express, Mongoose (MongoDB Atlas)
- Auth: JWT (cookie + Authorization fallback)
- Hosting examples: Netlify (frontend) + Railway (backend)

---

## Features

- Product listing with search, filtering and pagination
- User signup / signin with email verification
- Add to cart, checkout with demo deposit flow (offline > 1,000,000 VND requires 20% deposit, online auto-mark PAID)
- Orders list, order details, owner/admin cancel logic
- Admin endpoints to view and update orders
- UI-only shipping fee display (25,000 VND)

---

## Repo structure (high level)

- `server/` - Express backend
  - `controller/`, `routes/`, `models/`, `middleware/`
  - `app.js` (entry)
- `src/` - React frontend (CRA)
  - `components/`, `pages/`, `statemanagement/`
- `.env` (frontend env helpers) and `server/.env` (backend env example)

---

## Local setup (development)

Requirements:

- Node.js (16+ recommended)
- npm
- MongoDB connection (MongoDB Atlas or local)

Clone and install:

```bash
git clone <repo_url>
cd shoeStore
npm install
cd server
npm install
```

Run backend (dev):

```bash
cd server
npm run start   # uses nodemon to run app.js
```

Run frontend (dev):

```bash
cd ..
npm start       # runs CRA dev server
```

Frontend expects a dev API host at `REACT_APP_BASE_URL_LOCAL` by default (see `.env`).

---

## Environment variables

Backend (`server/.env` or Railway variables):

- `CONNECTION_URL` - MongoDB connection string
- `JWT_SECRET` - secret used to sign JWT
- `JWT_EXPIRES_IN` - e.g., `30d`
- `JWT_COOKIE_EXPIRES_IN` - days for cookie expiry (numeric)
- `CLIENT_URL` - frontend origin (e.g., `https://your-site.netlify.app`)
- `NODE_ENV` - set to `production` in production
- Email config: `USER`, `PASS`, `HOST`, `PORT`, `SERVICE`, `SECURE`
- `PORT` - server port (Railway sets this automatically)

Frontend (Netlify / build env, or local `.env` during development):

- `REACT_APP_BASE_URL` - **production backend host** (e.g., `https://your-backend.up.railway.app`) *no quotes, no trailing slash*
- `REACT_APP_BASE_URL_LOCAL` - usually `http://localhost:5000`
- Firebase keys and other client secrets are in `.env` (these are frontend-accessible)

Important: Netlify injects build-time env vars for the frontend; change `REACT_APP_BASE_URL` in Netlify site settings and redeploy the site for changes to take effect.

---

## Deployment (Netlify + Railway) - quick checklist

1. Backend (Railway):
   - Set env vars (`CONNECTION_URL`, `JWT_SECRET`, `CLIENT_URL=https://your-site.netlify.app`, `NODE_ENV=production`, etc.)
   - Ensure HTTPS is enabled (Railway usually provides TLS for `*.up.railway.app`).
   - Deploy and verify `app` starts and listens on the provided `PORT`.

2. Frontend (Netlify):
   - In Site settings → Build & deploy → Environment variables, add `REACT_APP_BASE_URL=https://<your-backend>.up.railway.app` (no quotes/trailing slash).
   - Redeploy the site (Netlify rebuilds the bundle with new envs).

3. Verify requests from the frontend succeed and backend responds with `Access-Control-Allow-Origin: <your site origin>` (CORS) and that cookies/Authorization headers are accepted.

---

## Troubleshooting (CORS, auth, cookies)

Common issues and checks:

- CORS "No 'Access-Control-Allow-Origin' header":
  - Ensure frontend is requesting the correct backend origin (check `REACT_APP_BASE_URL` in browser console). If it points to the frontend host itself, change it to the backend host.
  - Ensure backend `CLIENT_URL` matches the frontend origin exactly (protocol + host) or configure an allowlist (the server includes a rule to allow `*.netlify.app` if needed).
  - Use curl to inspect response headers:

```bash
curl -I -X GET 'https://<backend>/shoesPage?page=1' -H 'Origin: https://your-site.netlify.app' -v
```
Look for `Access-Control-Allow-Origin` header in the response.

- 401 errors on protected routes (e.g., `/orders`):
  - Check whether the browser sent cookie `token` (Application → Cookies) or the request includes `Authorization: Bearer <token>`.
  - The server sets an httpOnly cookie (`token`) when signing in; cross-site cookies require `sameSite='none'` and `secure=true` (production over HTTPS). Ensure `NODE_ENV=production` and the backend is served over HTTPS.
  - The client uses axios with `withCredentials=true` and also adds the Authorization header from `localStorage` as a fallback.

- Cookies not set / not sent:
  - Must use HTTPS and `secure: true`. Configure Railway to serve HTTPS and ensure backend didn't disable auto-TLS.

If you'd like temporary detailed logs for debugging, we can add middleware to log `Origin`, `Cookie`, and `Authorization` headers for the `/orders` and `/shoesPage` endpoints.

---
