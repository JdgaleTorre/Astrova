# 🚀 Astrova — NASA Space Explorer

> An interactive full-stack web application that brings NASA's universe of space data to life through stunning visualisations, real-time data, and AI-powered insights.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![NASA API](https://img.shields.io/badge/NASA-Open%20APIs-E03C31?logo=nasa)

## 🔗 Live Demo

- **Frontend:** https://astrova.josegale.com/
- **Backend API:** https://astrova-xwmj.onrender.com/

---

## 🌌 Overview

**Astrova** is a full-stack space exploration app built with React and Node.js/Express. It connects to NASA's Open APIs to let users explore the cosmos — from today's astronomy picture, to near-Earth asteroid tracking, to stunning Earth imagery — all wrapped in a sleek, space-themed UI.

The backend acts as a secure proxy between the frontend and NASA's APIs, keeping the API key safe and handling data transformation before it reaches the user.

---

## ✨ Features

- 🌠 **Astronomy Picture of the Day (APOD)** — Daily space images with descriptions and date navigation
- ☄️ **Asteroid Tracker (NeoWs)** — Visualise near-Earth objects with size and risk data
- 🌍 **EPIC Earth Imagery** — View stunning full-disc photos of Earth from space
- 📸 **NASA Image Library** — Search and explore NASA's vast collection of images, videos, and audio
- 📱 **Responsive Design** — Fully optimised for desktop, tablet, and mobile

---

## 🏗️ Project Structure

```
Astrova/
├── FrontEnd/
│   └── astrova-project/    # React + Vite application
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   ├── pages/          # Page-level components (TanStack Router)
│       │   ├── services/       # API call functions
│       │   └── utils/          # Helper functions and constants
│       ├── .env
│       └── package.json
├── BackEnd/
│   └── ts-node-express/   # Node.js + Express server
│       ├── src/
│       │   ├── routes/         # Express route handlers
│       │   ├── middleware/     # Error handling, logging
│       │   ├── config/         # Configuration
│       │   └── app.ts          # Express app setup
│       ├── .env
│       └── package.json
└── README.md
```

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, TanStack Router, TanStack Query |
| Backend    | Node.js, Express                    |
| Styling    | Tailwind CSS                        |
| NASA APIs  | APOD, EPIC, NeoWs, Images           |
| Deployment | Vercel (frontend), Render (backend) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- A NASA API key → [Get one free at api.nasa.gov](https://api.nasa.gov/)
- An Anthropic API key (optional, for AI features) → [console.anthropic.com](https://console.anthropic.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Astrova.git
cd Astrova
```

---

### 2. Set Up the Backend

```bash
cd BackEnd/ts-node-express
npm install
```

Create a `.env` file in the `BackEnd/ts-node-express/` directory:

```env
PORT=3000
NASA_API_KEY=your_nasa_api_key_here
NASA_BASE_URL=https://api.nasa.gov/
EPIC_BASE_URL=https://epic.gsfc.nasa.gov/
IMAGES_BASE_URL=https://images-api.nasa.gov/
ALLOWED_ORIGINS=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

The backend will run at `http://localhost:3000`

---

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd FrontEnd/astrova-project
npm install
```

Create a `.env` file in the `FrontEnd/astrova-project/` directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

The app will open at `http://localhost:5173`

---

## 🌍 Deployment

### Live Demo
- **Frontend:** https://astrova.josegale.com/
- **Backend API:** https://astrova-xwmj.onrender.com/

### Frontend → Vercel

1. Push your code to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Set the **Root Directory** to `FrontEnd/astrova-project`
4. Set **Build Command** to `npm run build`
5. Set **Output Directory** to `dist`
6. Add environment variable: `VITE_API_URL=https://astrova-xwmj.onrender.com`
7. Deploy

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect the same GitHub repo
3. Set the **Root Directory** to `BackEnd/ts-node-express`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `npx tsx src/server.ts`
6. Add environment variables:
   - `NASA_API_KEY`
   - `NASA_BASE_URL=https://api.nasa.gov/`
   - `EPIC_BASE_URL=https://epic.gsfc.nasa.gov/`
   - `IMAGES_BASE_URL=https://images-api.nasa.gov/`
   - `ALLOWED_ORIGINS=https://astrova.josegale.com`
7. Deploy

---

## 📡 API Endpoints

| Method | Endpoint                                     | Description                        |
|--------|---------------------------------------------|------------------------------------|
| GET    | `/api/nasa/apod`                            | Astronomy Picture of the Day       |
| GET    | `/api/nasa/apod?date=YYYY-MM-DD`           | APOD for a specific date           |
| GET    | `/api/nasa/asteroids`                      | Near-Earth objects (today)         |
| GET    | `/api/nasa/asteroids?start=YYYY-MM-DD&end=YYYY-MM-DD` | Asteroids by date range |
| GET    | `/api/nasa/epic`                           | Latest EPIC Earth images           |
| GET    | `/api/nasa/epic/dates`                     | Available EPIC dates               |
| GET    | `/api/nasa/epic/:date`                     | EPIC images for specific date      |
| GET    | `/api/nasa/images/search?q=query`           | Search NASA Image Library          |
| GET    | `/api/nasa/images/:id`                      | Get image assets by ID             |

---

## 🧪 Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

---

## 📄 License

This project is licensed under the **MIT License** — see below for details.

```
MIT License

Copyright (c) 2025 Astrova

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## ✅ To Do

### 🔧 Backend
- [x] Set up Express server with basic middleware (cors, dotenv)
- [ ] Set up Express server with helmet
- [x] Create NASA API service layer (base URL, key injection)
- [x] Build `/api/nasa/apod` route — single day and date range
- [x] Build `/api/nasa/asteroids` route with date range support
- [x] Build `/api/nasa/epic` route for Earth imagery
- [x] Build `/api/nasa/images` routes for NASA Image Library
- [x] Add centralised error handling middleware
- [ ] Add request rate limiting to protect the NASA API key
- [ ] Add response caching (e.g. node-cache) to reduce duplicate API calls
- [ ] Add input validation and sanitisation
- [ ] Set up environment variable validation on startup
- [ ] Write Jest unit tests for routes and services
- [x] Add logging middleware

### 🎨 Frontend
- [x] Scaffold React app with folder structure (pages, components, hooks, services)
- [x] Set up TanStack Router with file-based routes
- [ ] Build shared layout (navbar, sidebar, footer)
- [x] Build APOD page with image display and date picker
- [x] Build Asteroid Tracker page with date range selector
- [x] Build EPIC Earth Imagery viewer with carousel
- [x] Build NASA Image Library with search and detail pages
- [x] Build global loading spinner
- [x] Build global error boundary and error states
- [ ] Add data visualisations for asteroid statistics
- [x] Implement responsive design (mobile, tablet, desktop)
- [x] Apply space-themed UI (dark background, star effects, typography)
- [x] Write React Testing Library tests for key components

### 🤖 AI Features
- [ ] Set up Anthropic Claude API integration in backend
- [ ] Build `/api/nasa/ai/summary` endpoint
- [ ] Add AI-generated description for APOD images
- [ ] Add AI explanation for asteroid risk and size data
- [ ] Add a conversational "Ask about Space" input box

### 📦 DevOps & Deployment
- [ ] Add `.env.example` files for both frontend and backend
- [x] Add `.gitignore` to exclude `.env` files and `node_modules`
- [x] Deploy backend to Render and verify all routes work
- [x] Deploy frontend to Vercel with correct environment variables
- [x] Test full production flow end-to-end
- [x] Add live demo links to README

### 🌟 Bonus / Nice to Have
- [ ] Favourite / bookmark feature for APOD images (localStorage)
- [ ] Share button to copy a link to a specific APOD date
- [x] Animated star background on the home page
- [ ] Dark/light mode toggle
- [ ] PWA support (offline-friendly)
- [x] Search NASA Image Library
- [ ] ISS real-time location tracker
- [ ] Keyboard accessibility audit
