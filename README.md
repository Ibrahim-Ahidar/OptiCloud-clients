# OptiCloud Client

React frontend for OptiCloud — optical clinic management system.

## Deploy to Vercel

1. Import this repo on [vercel.com](https://vercel.com)
2. Framework preset: **Vite**
3. Add environment variable:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-api.onrender.com/api` |

4. Deploy

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5175` (proxies `/api` to `http://localhost:5000`).

## Related repos

- API: [OptiCloud-Server](https://github.com/Ibrahim-Ahidar/OptiCloud-Server)
