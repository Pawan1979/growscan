#!/usr/bin/env font
# GrocScan GCP Cloud Run Automated Deployment Script

set -e

PROJECT_ID=$(gcloud config get-value project)
REGION="asia-south1" # Mumbai region for low Indian latency

echo "🚀 Deploying GrocScan to GCP Cloud Run (Project: $PROJECT_ID, Region: $REGION)..."

# 1. Build and Submit Backend Container Image
echo "📦 Building Backend container..."
gcloud builds submit ./backend --tag gcr.io/$PROJECT_ID/grocscan-backend:latest

# 2. Deploy Backend Service to Cloud Run
echo "☁️ Deploying Backend Service to Cloud Run..."
gcloud run deploy grocscan-backend \
  --image gcr.io/$PROJECT_ID/grocscan-backend:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5

BACKEND_URL=$(gcloud run services describe grocscan-backend --platform managed --region $REGION --format 'value(status.url)')
echo "✅ Backend deployed at: $BACKEND_URL"

# 3. Build and Submit Frontend Container Image
echo "📦 Building Frontend container..."
gcloud builds submit ./frontend --tag gcr.io/$PROJECT_ID/grocscan-frontend:latest

# 4. Deploy Frontend Service to Cloud Run
echo "☁️ Deploying Frontend Service to Cloud Run..."
gcloud run deploy grocscan-frontend \
  --image gcr.io/$PROJECT_ID/grocscan-frontend:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 256Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5

FRONTEND_URL=$(gcloud run services describe grocscan-frontend --platform managed --region $REGION --format 'value(status.url)')

echo "🎉 Deployment Complete!"
echo "--------------------------------------------------"
echo "Backend API: $BACKEND_URL"
echo "Frontend App: $FRONTEND_URL"
echo "--------------------------------------------------"
