# Deployment

This project has two deployable apps:

- `backend`: Express/Mongoose API
- `frontend`: React Vite storefront

## Backend

Use `backend` as the service root.

- Build command: `npm install`
- Start command: `npm start`
- Node version: `22.x`

Required environment variables:

```env
PORT=8090
CLIENT_URL=https://your-frontend-domain.com
MONGODB_URI=mongodb+srv://...
COOKIE_SECRET=replace-with-a-long-random-secret
JWT_SECRET=replace-with-a-long-random-secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

`CLIENT_URL` can contain multiple comma-separated frontend origins.

## Frontend

Use `frontend` as the static app root.

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Node version: `22.x`

Required environment variable:

```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

For local development, copy each `.env.example` file to `.env` in the same folder and update the values.
