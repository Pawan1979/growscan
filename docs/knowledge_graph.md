# GrocScan — Project Knowledge Graph (v1.0 MVP)

Welcome to the central knowledge repository for GrocScan. To keep things modular and maintainable, this knowledge graph has been split into dedicated modules.

## Modules

1. 🏗️ **[Architecture & Data Flow](./architecture.md)**
   *Contains Mermaid.js flowcharts showing exactly how the frontend, backend, NGINX, Upstash Redis, and external APIs communicate.*

2. 🚀 **[Deployment & CI/CD](./deployment.md)**
   *Contains Docker, Cloud Run, GitHub Actions pipeline rules, and a dictionary of all Environment Variables.*

3. 📡 **[API Contract & Routes](./api-routes.md)**
   *Contains the exact JSON schemas, endpoints, and request/response structures for backend services.*

4. 🐛 **[Known Bugs & Fix History](./known-bugs.md)**
   *A complete ledger of every bug encountered and exactly how it was fixed.*

---

## Developer Onboarding Checklist

If you are a new developer setting up GrocScan on a fresh machine, follow these exact steps:

1. **Clone & Install**
   ```bash
   git clone https://github.com/pawankumarshukla2030/GrocScan.git
   cd GrocScan
   npm ci --prefix backend
   npm ci --prefix frontend
   ```

2. **Environment Variables**
   - Create `backend/.env` using `backend/.env.example` as a template.
   - Create `frontend/.env` and add your `VITE_FIREBASE_*` web credentials.

3. **Firebase Setup**
   - Ensure you have a Firebase project with **Phone Authentication** enabled.
   - Add your `localhost` domain to the Firebase Authorized Domains.

4. **Run Local Dev Servers**
   - **Backend:** `npm run dev --prefix backend` (Runs on port 5000)
   - **Frontend:** `npm run dev --prefix frontend` (Runs on port 3000)

5. **Test Setup**
   - Run `npm test --prefix backend` to ensure the core pricing algorithms and normalizers pass all 22 tests.

## Critical Rules & Gotchas
- **Tailwind CSS:** The `package.json` uses `"type": "module"`. Therefore, your Tailwind and PostCSS configuration files **MUST** use the `.cjs` extension (`tailwind.config.cjs`).
- **NGINX on Cloud Run:** Must listen on port `8080` (not 80) to pass Cloud Run health checks.
- **Cross-Service Routing:** Frontend and Backend are separate services in production. Always use the `getApiUrl()` helper function in `frontend/src/config/api.ts` to make network requests.
