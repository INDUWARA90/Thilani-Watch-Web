# Thilani Watch Web

Basic MERN project scaffold with a Vite React frontend and an Express/MongoDB backend.

## Project Structure

```text
backend/
  server.js
  src/config/db.js
  src/controllers/watchController.js
  src/models/Watch.js
  src/routes/watchRoutes.js
frontend/
  src/App.jsx
  vite.config.js
```

## Setup

```bash
npm run install:all
Copy-Item backend/.env.example backend/.env
```

Update `backend/.env` if your MongoDB URI is different.

## Run

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## API

```text
GET    /api/health
GET    /api/watches
POST   /api/watches
GET    /api/watches/:id
PUT    /api/watches/:id
DELETE /api/watches/:id
```
