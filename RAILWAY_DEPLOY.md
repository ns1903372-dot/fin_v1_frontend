# Railway Deployment

This repo should be deployed to Railway as two services in the same project.

## 1. Backend service

- Create a new service from this repo.
- Set **Root Directory** to `/`
- Set **Config as Code file** to `/railway.backend.toml`
- Keep the builder on Dockerfile.

Recommended environment variables:

- `PORT` = `8000`
- `APP_ENV` = `production`
- `DEBUG` = `False`
- `LOG_LEVEL` = `INFO`
- `CORS_ORIGINS` = `https://<your-frontend-domain>`

Optional service variables if you add backing services later:

- `DATABASE_URL`
- `MONGODB_URL`
- `REDIS_URL`

## 2. Frontend service

- Create a second service from the same repo.
- Set **Root Directory** to `/frontend`
- Set **Config as Code file** to `/frontend/railway.toml`

Required environment variables:

- `BACKEND_URL` = `https://<your-backend-domain>`

Optional:

- `NEXT_PUBLIC_API_URL`

Leave `NEXT_PUBLIC_API_URL` unset if you want the browser to use the built-in Next.js proxy routes at `/api/backend/*`.

## 3. Custom domains

- Assign the backend its Railway domain first.
- Copy that value into the frontend service as `BACKEND_URL`.
- Then assign the frontend custom/public domain.

## 4. Why this setup

- The frontend keeps browser requests same-origin through Next.js API routes.
- Railway only needs one private backend URL in the frontend service.
- Backend deploys no longer depend on local port `8000`; they honor Railway's injected `PORT`.
