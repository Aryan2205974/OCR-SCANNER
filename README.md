# OCR-SCANNER

OCR-SCANNER (Taskify PDF AI Platform) is an intelligence platform designed to extract actionable tasks and business intelligence from procurement contracts, tenders, and PDF/Word documents using Google Gemini LLM API.

## 🚀 Deployment Instructions

This repository is pre-configured for deployment on **Netlify** (for the frontend) and **Render** (for the Python FastAPI backend).

---

### 1. Backend Deployment (Render)

Deploy the Python backend on Render as a **Web Service**:

1. **Sign Up / Log In** to [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository (`Aryan2205974/OCR-SCANNER`).
4. Configure the Web Service settings:
   - **Name:** `ocr-scanner-backend` (or your preferred name)
   - **Environment:** `Python`
   - **Region:** Choose the region closest to you or your target audience
   - **Branch:** `main`
   - **Root Directory:** *(Leave blank to build from root)*
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn backend.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
5. Click **Create Web Service**.
6. Render will build and deploy your backend. Note the URL Render assigns to you (e.g. `https://ocr-scanner-backend.onrender.com`).

---

### 2. Frontend Deployment (Netlify)

Deploy the frontend static files on Netlify:

1. **Sign Up / Log In** to [Netlify](https://www.netlify.com/).
2. Click **Add new site** -> **Import an existing project**.
3. Connect your GitHub repository (`Aryan2205974/OCR-SCANNER`).
4. Configure the build settings:
   - **Branch to deploy:** `main`
   - **Base directory:** *(Leave blank)*
   - **Build command:** *(Leave blank, no build command needed)*
   - **Publish directory:** `frontend`
5. **Set up Rewrite Proxy (Netlify Redirects):**
   - Open [netlify.toml](netlify.toml) in your code repository.
   - Replace `https://ocr-scanner-backend.onrender.com` in the redirection rule with your actual Render backend URL obtained in Step 1.
   - Commit and push the change to GitHub. Netlify will auto-deploy the change.
6. Click **Deploy site**.

Once both deployments are complete, Netlify will serve the frontend and proxy any API calls starting with `/api/` directly to your Render backend safely and without CORS errors!

---

## 💻 Local Development

To run the application locally on your computer:

### Prerequisites
- Python 3.9 or higher installed
- Node.js (optional, for package management if needed)

### Steps
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the FastAPI application:
   ```bash
   python main.py
   ```
4. Open your browser and navigate to `http://127.0.0.1:8000`. The frontend will be served directly by the backend server.
