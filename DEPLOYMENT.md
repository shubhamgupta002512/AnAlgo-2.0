# Deployment Guide — AnAlgo (MERN Stack)

This guide deploys:
- **Database** → MongoDB Atlas (free tier)
- **Backend (API)** → Render (free tier)
- **Frontend (React)** → Vercel (free tier)

---

## 1. Database — MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas and create a free account.
2. Create a new **free (M0) cluster**.
3. Under **Database Access**, create a DB user with a username/password.
4. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere) — needed since Render's IP isn't static.
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/analgo?retryWrites=true&w=majority
   ```
   Replace `<username>` and `<password>` with your DB user's credentials, and set the database name to `analgo`.

Keep this connection string — you'll use it as `MONGO_URI`.

---

## 2. Backend — Render

1. Push your project to a GitHub repository (make sure `.env` is in `.gitignore` and NOT committed).
2. Go to https://render.com, sign in with GitHub.
3. Click **New → Web Service**, select your repo.
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Add Environment Variables (under the **Environment** tab):
   | Key | Value |
   |---|---|
   | `MONGO_URI` | your Atlas connection string |
   | `JWT_SECRET` | a long random string |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | your Vercel frontend URL (set after step 3, e.g. `https://analgo.vercel.app`) |
   | `PORT` | `5000` (Render sets its own PORT automatically; this is just a fallback) |
6. Click **Create Web Service**. Render will build and deploy; you'll get a URL like `https://analgo-backend.onrender.com`.
7. Once live, seed the database once by running the seed script locally with the **same** `MONGO_URI` (Atlas), or add a one-off Render Shell command: `npm run seed`.

> Note: Render's free tier spins down after inactivity — the first request after idle may take ~30-50s to wake up.

---

## 3. Frontend — Vercel

1. Go to https://vercel.com, sign in with GitHub, click **Add New → Project**, select your repo.
2. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Since the frontend calls `/api/...` and the Vite dev proxy only works locally, add a production API base URL. Two options:

   **Option A — Environment variable (recommended):**
   - In `frontend/src/api/axios.js`, change:
     ```js
     const api = axios.create({
       baseURL: import.meta.env.VITE_API_URL || '/api',
     });
     ```
   - In Vercel, add environment variable `VITE_API_URL` = `https://analgo-backend.onrender.com/api`

   **Option B — vercel.json rewrite:**
   ```json
   {
     "rewrites": [{ "source": "/api/(.*)", "destination": "https://analgo-backend.onrender.com/api/$1" }]
   }
   ```
   Place this file in `frontend/vercel.json`.

4. Click **Deploy**. You'll get a URL like `https://analgo.vercel.app`.
5. Go back to Render and update the backend's `CLIENT_URL` env var to this Vercel URL, then redeploy the backend so CORS allows it.

---

## 4. Post-Deployment Checklist
- [ ] Register a test account on the live site
- [ ] Confirm login persists (JWT stored, `/auth/me` works)
- [ ] Filter questions by company/topic/difficulty
- [ ] Bookmark a question and confirm it appears under Bookmarks
- [ ] Mark a question solved and check the Progress charts update
- [ ] Promote your account to `role: "admin"` directly in Atlas (Collections → users → edit document) and confirm `/admin` works

---

## Alternative: Single free host (Railway / Cyclic)
If you'd rather deploy backend + frontend together, platforms like **Railway** or **Cyclic** can host the Node backend and serve the built React app from Express as static files (`app.use(express.static('frontend/dist'))`). This avoids CORS entirely but requires a build step that copies `frontend/dist` into the backend before deploy.
