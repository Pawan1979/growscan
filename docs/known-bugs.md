# Known Bugs & Fix History

| # | Bug | Fix |
|---|---|---|
| 1 | Git push 403 (old Windows credential) | `cmdkey /delete:git:https://github.com` |
| 2 | CI action name typo | `actions/setup-node@v4` |
| 3 | `TS6133` unused React import | Remove `import React` in test files |
| 4 | Artifact Registry missing | Self-healing repo creation in workflow |
| 5 | NGINX port 80 → Cloud Run health check fail | `listen 8080` + `EXPOSE 8080` + `--port 8080` |
| 6 | NGINX crash on boot (DNS resolution) | Dynamic resolver in nginx.conf |
| 7 | Frontend search returns 0 platforms | `getApiUrl()` helper for cross-service routing |
| 8 | UI completely unstyled (plain HTML buttons) | Install Tailwind v3 via PostCSS; use `.cjs` config files |
| 9 | Blank screen after OTP verify (reCAPTCHA crash) | Move `RecaptchaVerifier` into `App.tsx` via `useRef` |
| 10| `onSuccess()` called `handleSearch` with stale closure | Added `prevUserRef` in `App.tsx` to detect auth state transition safely |
| 11| Jest `Unexpected token 'export'` (Node ESM) | Mocked `firebase-admin/auth` inside `api.test.ts` |
| 12| Blank screen on load (backend error `{error:...}`) | Added `Array.isArray(data.results)` guard and React `ErrorBoundary` |
| 13| Jest tests crashing on CI/CD (Firebase API) | Wrapped Firebase Admin init in `if (process.env.NODE_ENV !== 'test')` |
| 14| Cloud Run deployed frontend failing Firebase Auth | Injected all 6 Firebase variables as `--build-arg` in CI/CD workflow |
