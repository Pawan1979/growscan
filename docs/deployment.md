# Deployment & CI/CD Pipeline

## GitHub Actions (`deploy-gcp-cicd.yml`)
1. **Tests:** Runs Jest (backend) and Vitest (frontend) on `ubuntu-latest`.
2. **Build:** Compiles TypeScript for both services.
3. **Docker:** Builds images and pushes them to GCP Artifact Registry (`asia-south1-docker.pkg.dev`).
4. **Cloud Run:** Deploys two separate microservices:
   - `grocscan-backend-test` (Port 5000)
   - `grocscan-frontend-test` (Port 8080)

## Environment Variables
### Backend
- `PORT`: 5000
- `QC_API_KEY`: QuickCommerce API live feed key.
- `CACHE_TTL_SECONDS`: Cache duration in seconds.
- `UPSTASH_REDIS_REST_URL` & `TOKEN`: Credentials for centralized caching.
- `FIREBASE_SERVICE_ACCOUNT`: JSON string for Firestore admin access.

### Frontend
- `VITE_FIREBASE_API_KEY`: Firebase Web API Key.
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase Auth Domain.
- `VITE_FIREBASE_PROJECT_ID`: Firebase Project ID.
- *(Injected dynamically during Docker build via `--build-arg`)*
