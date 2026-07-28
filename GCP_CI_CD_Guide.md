# 🚀 GrocScan — Step-by-Step GCP Cloud Run CI/CD Deployment Guide

This guide walks you through setting up automated **GitHub Actions CI/CD** to deploy **GrocScan** to **Google Cloud Run** for testing whenever you push code.

---

## 🏗️ Architecture Overview

```
[Git Push to main/staging]
           │
           ▼
[GitHub Actions CI/CD Pipeline]
   ├── 🧪 1. Runs Backend Jest Unit & Integration Tests
   ├── 🧪 2. Runs Frontend Vitest Component Tests
   ├── 📦 3. Compiles Backend & Frontend Bundles
   ├── 🐳 4. Builds & Pushes Docker Containers to GCP Artifact Registry
   └── ☁️ 5. Deploys Services to Cloud Run (Mumbai Region: asia-south1)
```

---

## 📌 Step 1: One-Time GCP Setup (5 Minutes)

### 1.1 Enable Required Google Cloud APIs
Open [Google Cloud Shell](https://shell.cloud.google.com/) or run in your local terminal authenticated with `gcloud`:

```bash
# Set your GCP Project ID
gcloud config set project YOUR_GCP_PROJECT_ID

# Enable Cloud Run, Artifact Registry, and Cloud Build APIs
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com
```

### 1.2 Create Docker Artifact Registry Repository
Create a repository named `grocscan-repo` in region `asia-south1` (Mumbai):

```bash
gcloud artifacts repositories create grocscan-repo \
  --repository-format=docker \
  --location=asia-south1 \
  --description="Docker repository for GrocScan test images"
```

---

## 🔑 Step 2: Create GCP Service Account for GitHub Actions

Create a dedicated Service Account with minimal deployment permissions:

```bash
# 1. Create Service Account
gcloud iam service-accounts create github-cicd-deployer \
  --display-name="GitHub Actions Deployment Account"

# 2. Grant Cloud Run Admin Role
gcloud projects add-iam-policy-binding YOUR_GCP_PROJECT_ID \
  --member="serviceAccount:github-cicd-deployer@YOUR_GCP_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

# 3. Grant Artifact Registry Writer Role
gcloud projects add-iam-policy-binding YOUR_GCP_PROJECT_ID \
  --member="serviceAccount:github-cicd-deployer@YOUR_GCP_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

# 4. Grant Service Account User Role
gcloud projects add-iam-policy-binding YOUR_GCP_PROJECT_ID \
  --member="serviceAccount:github-cicd-deployer@YOUR_GCP_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# 5. Generate JSON Key File
gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=github-cicd-deployer@YOUR_GCP_PROJECT_ID.iam.gserviceaccount.com
```

---

## 🔐 Step 3: Add GitHub Repository Secrets

1. Open your GitHub Repository on GitHub.com ➔ **Settings** ➔ **Secrets and variables** ➔ **Actions**.
2. Click **New repository secret** and add the following two secrets:

| Secret Name | Value to Paste |
|---|---|
| **`GCP_PROJECT_ID`** | Your Google Cloud Project ID (e.g. `grocscan-test-12345`) |
| **`GCP_SA_KEY`** | Paste the entire contents of the generated `gcp-key.json` file |

*(After pasting, delete `gcp-key.json` from your local machine to keep your key secure).*

---

## ⚡ Step 4: Trigger Automated Deployment

Whenever you push your code to GitHub:

```bash
git add .
git commit -m "Deploying GrocScan testing build"
git push origin main
```

### What Happens Automatically:
1. GitHub Actions triggers [.github/workflows/deploy-gcp-cicd.yml](file:///c:/Users/pawan/projects/antigravity/GrocScan/.github/workflows/deploy-gcp-cicd.yml).
2. Runs all 8 backend Jest tests and 4 frontend Vitest tests.
3. If all tests pass, builds Docker images and pushes to GCP Artifact Registry.
4. Deploys backend API to `https://grocscan-backend-test-xxx.a.run.app` and frontend PWA to `https://grocscan-frontend-test-xxx.a.run.app`.

---

## 💰 Cost Analysis for Testing
- **Cloud Run Free Tier**: Includes 2,000,000 requests/month + 180,000 vCPU-seconds/month.
- **Estimated Monthly Cost**: **₹0 (100% Free)** with `$300` new account credit for testing!
