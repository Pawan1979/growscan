# 📘 GrocScan — Complete System Integration, CI/CD & Fixes Log

This document provides a comprehensive end-to-end record of the **GrocScan** full-stack application architecture, feature implementations, GitHub Actions CI/CD setup, GCP Cloud Run configuration, and all bug fixes applied during integration.

---

## 📌 1. Repository & Architecture Overview

- **GitHub Repository**: `https://github.com/pawankumarshukla2030/GrocScan.git`
- **Main Branch**: `main`
- **GCP Project ID**: `grocscan-app-15175`
- **GCP Region**: `asia-south1` (Mumbai)
- **Frontend Stack**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Service Worker PWA.
- **Backend Stack**: Node.js 20, Express, TypeScript, Jest, Supertest, In-Memory TTL Cache & Preloader.

---

## 🌟 2. Feature Implementation Summary (Phases 1–6)

### Phase 1 — Core Price Comparison Engine
- **5-Platform Search**: Real-time price comparison across **Blinkit, Zepto, Swiggy Instamart, BigBasket, and JioMart**.
- **True Final Cost Audit**: Transparent fee breakdown modal showing `Sticker Price + Platform Fee + Delivery Fee + Handling Fee = True Final Price`.
- **Per-Unit Metric Normalizer**: Standardized pricing metrics (e.g. `₹54.00 / 100ml` or `₹28.00 / kg`).
- **Multi-Item Cart Comparison**: Full cart totals per platform with item quantity controls.
- **Split-Cart Savings Optimizer**: Evaluates cart split permutations and recommends exact extra savings (e.g., *"Order 3 items on Zepto + 2 on Blinkit to save ₹45 extra after double delivery fees"*).
- **Physical Barcode Scanner**: Laser camera modal with test barcodes (Amul Milk, Tata Salt, Surf Excel).
- **WhatsApp Share Cards**: Formatted deal card generator for sharing on WhatsApp.
- **Pincode & GPS Selector**: Location modal supporting manual pincode entry and GPS auto-detect.
- **Language Toggle**: Full UI support for English and Hindi (हिंदी).

### Phase 2 — Alerts & Price History
- **30-Day Price Trend Charts**: Interactive multi-line SVG graphs with lowest/highest price markers over 30 days.
- **Price Drop Alert Engine**: Custom target price drop threshold setting modal and saved alerts dashboard tab.

### Phase 3 — Loyalty Pass Optimizer
- **Subscription Pass Selector**: Toggle bar for **Swiggy One, Zepto Super, Blinkit Pass, and BB Star**.
- **Dynamic Fee Waivers**: Automatically waives delivery and handling fees based on active membership rules.

### Phase 4 — Progressive Web App (PWA) Support
- **Web App Manifest**: Configured standalone mobile UX, theme color (`#0b0f19`), and icons.
- **Offline Service Worker**: Cache-first for static assets and network-first for API queries.
- **Mobile Install Banner**: Floating banner prompting users to install GrocScan to home screen.

### Phase 5 — Configurable Cache TTL & Adaptive User-Search Preloader
- **Configurable TTL Environment Variables (`.env`)**:
  - `CACHE_TTL_SECONDS=21600` (6 hours in dev to minimize external API costs).
  - `PRELOAD_INTERVAL_SECONDS=21600` (6 hours preload refresh cycle).
  - `PRELOAD_POPULAR_ITEMS`: Configurable list of seed products.
- **Real-Time Adaptive Preloading**: `PreloadService.trackSearch(query)` tracks user searches in real-time and dynamically adds high-frequency searched items into the warm cache queue for 0ms query latency.

### Phase 6 — Automated Unit & Integration Test Suites
- **Backend Jest Suite** (`npm test --prefix backend`): 7 test suites, 22 unit & integration tests passing 100% (normalizer, price service, alert CRUD, geocoding, cache TTL, cart optimizer, Express API endpoints).
- **Frontend Vitest Suite** (`npm test --prefix frontend`): 3 test suites, 4 component tests passing 100% (ProductCard, PassSelector, FeeBreakdownModal).

---

## 🚀 3. CI/CD & Cloud Run Deployment Configuration

### 3.1 GitHub Actions Workflow (`.github/workflows/deploy-gcp-cicd.yml`)
1. **Stage 1 (Test & Build)**: Runs Jest tests, Vitest tests, and verifies TypeScript/Vite builds.
2. **Stage 2 (Docker Build & Push)**: Builds backend and frontend Docker containers and pushes to GCP Artifact Registry (`asia-south1-docker.pkg.dev/grocscan-app-15175/grocscan-repo`).
3. **Stage 3 (Cloud Run Deployment)**: Deploys `grocscan-backend-test` (port 5000) and `grocscan-frontend-test` (port 8080) in `asia-south1`.

### 3.2 GCP Secrets Configured in GitHub
- **`GCP_PROJECT_ID`**: Your Google Cloud Project ID (e.g. `grocscan-app-XXXXX`).
- **`GCP_SA_KEY`**: Service account JSON key for `github-cicd-deployer`.

### 3.3 Step-by-Step GCP Cloud Configuration Process (Safe & Zero Secrets Exposed)

#### Step A: Create GCP Project & Enable APIs
In [Google Cloud Shell](https://shell.cloud.google.com/), run:
```bash
# 1. Create a new GCP project
PROJECT_ID="grocscan-app-$RANDOM"
gcloud projects create $PROJECT_ID --name="GrocScan App"
gcloud config set project $PROJECT_ID

# 2. Enable Required Cloud APIs
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com
```

#### Step B: Create Docker Repository in Artifact Registry
```bash
gcloud artifacts repositories create grocscan-repo \
  --repository-format=docker \
  --location=asia-south1 \
  --description="GrocScan Docker Repository"
```

#### Step C: Create Deployment Service Account & Grant IAM Roles
```bash
# 1. Create Service Account
gcloud iam service-accounts create github-cicd-deployer --display-name="GitHub Actions Deployer"

# 2. Assign Minimal Required IAM Roles
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:github-cicd-deployer@$PROJECT_ID.iam.gserviceaccount.com" --role="roles/run.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:github-cicd-deployer@$PROJECT_ID.iam.gserviceaccount.com" --role="roles/artifactregistry.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:github-cicd-deployer@$PROJECT_ID.iam.gserviceaccount.com" --role="roles/iam.serviceAccountUser"
```

#### Step D: Generate Key & Add Secrets to GitHub (Security Rule)
```bash
# Generate key file locally in Cloud Shell
gcloud iam service-accounts keys create gcp-key.json --iam-account=github-cicd-deployer@$PROJECT_ID.iam.gserviceaccount.com
```
- **Security Rule**: Never commit `gcp-key.json` to Git or expose private keys in codebase files.
- Copy the JSON key and add it into **GitHub Repository Secrets** (`Settings ➔ Secrets and variables ➔ Actions` ➔ `GCP_SA_KEY`).

---

## 🛠️ 4. Comprehensive Bug Fixes & Resolution History

Below is the complete log of all technical issues encountered during integration and their exact resolutions:

| # | Issue Description | Root Cause | Exact Resolution |
|---|---|---|---|
| **1** | **Git Push 403 Permission Denied** | Windows Credential Manager had cached old GitHub account (`Pawan1979`). | Executed `cmdkey /delete:git:https://github.com` to clear cached login, allowing authenticated push to `pawankumarshukla2030/GrocScan`. |
| **2** | **GitHub Action Typo in CI/CD** | `deploy-gcp-cicd.yml` specified non-existent `actions/application-node@v4`. | Corrected to standard `actions/setup-node@v4`. |
| **3** | **TypeScript `tsc` Build Error (TS6133)** | Strict TypeScript compiler flagged unused `import React from 'react'` in test files. | Removed unused `React` imports across frontend test files (`ProductCard.test.tsx`, `PassSelector.test.tsx`, `FeeBreakdownModal.test.tsx`). |
| **4** | **Artifact Registry Repository Missing** | `grocscan-repo` did not exist in GCP Artifact Registry on initial push. | Added self-healing step in GitHub Actions workflow to check and auto-create `grocscan-repo` if missing. |
| **5** | **GCP Cloud Run NGINX Port Health Check Failure** | Cloud Run expects containers to listen on port `8080`, but NGINX was configured for port `80`. | Updated `frontend/nginx.conf` to `listen 8080;`, `frontend/Dockerfile` to `EXPOSE 8080`, and added `--port 8080` in Cloud Run deploy command. |
| **6** | **NGINX Container Crash on Startup** | NGINX static `proxy_pass http://backend:5000` failed DNS resolution at boot time in Cloud Run container. | Updated `frontend/nginx.conf` with dynamic resolver (`set $backend_target`), deferring DNS resolution to runtime so NGINX starts instantly. |
| **7** | **Frontend Search Result 0 Platforms (Cross-Service Routing)** | Frontend called relative `/api/compare` expecting backend on `127.0.0.1:5000` instead of separate Cloud Run backend service URL. | Created `frontend/src/config/api.ts` `getApiUrl()` helper that dynamically detects Cloud Run hostnames and directs API queries to `https://grocscan-backend-test-xxx.asia-south1.run.app`. |
| **8** | **UI Distortion / Unstyled HTML Buttons** | Tailwind CSS engine script tag was missing in `frontend/index.html`, causing utility classes to be skipped. | Added `<script src="https://cdn.tailwindcss.com"></script>` and `@tailwind` base directives in `index.html` & `index.css` to render dark-mode glassmorphism design. |

---

## ⚡ 5. Verification Commands

```bash
# Run Backend Jest Tests (22 tests)
npm test --prefix backend

# Run Frontend Vitest Tests (4 tests)
npm test --prefix frontend

# Verify Local Production Builds
npm run build --prefix backend
npm run build --prefix frontend

# Trigger Automated CI/CD Pipeline
git push origin main
```
