# 🚀 Stellara — NASA Space Explorer

> An interactive full-stack web application that brings NASA's universe of space data to life through stunning visualisations, real-time data, and AI-powered insights.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![NASA API](https://img.shields.io/badge/NASA-Open%20APIs-E03C31?logo=nasa)

---

## 🌌 Overview

**Stellara** is a full-stack space exploration app built with React and Node.js/Express. It connects to NASA's Open APIs to let users explore the cosmos — from today's astronomy picture, to Mars rover photos, to near-Earth asteroid tracking — all wrapped in a sleek, space-themed UI with AI-powered summaries.

The backend acts as a secure proxy between the frontend and NASA's APIs, keeping the API key safe and handling data transformation before it reaches the user.

---

## ✨ Features

- 🌠 **Astronomy Picture of the Day (APOD)** — Daily space images with descriptions and date navigation
- 🔴 **Mars Rover Gallery** — Browse photos taken by Curiosity, Opportunity, and Spirit
- ☄️ **Asteroid Tracker (NeoWs)** — Visualise near-Earth objects with size and risk data
- 🌍 **EPIC Earth Imagery** — View stunning full-disc photos of Earth from space
- 🤖 **AI Insights** — Claude-powered summaries and explanations of space data
- 📊 **Data Visualisations** — Interactive charts for asteroid distances, sizes, and rover stats
- 📱 **Responsive Design** — Fully optimised for desktop, tablet, and mobile

---

## 🏗️ Project Structure

```
stellara/
├── frontend/               # React application
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API call functions
│   │   ├── utils/          # Helper functions
│   │   └── App.jsx
│   ├── .env.example
│   └── package.json
├── backend/                # Node.js + Express server
│   ├── src/
│   │   ├── routes/         # Express route handlers
│   │   ├── controllers/    # Business logic
│   │   ├── services/       # NASA API integration
│   │   ├── middleware/      # Error handling, logging
│   │   └── index.js        # Server entry point
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router, Recharts    |
| Backend    | Node.js, Express                    |
| Styling    | Tailwind CSS                        |
| AI         | Anthropic Claude API                |
| NASA APIs  | APOD, MarsRover, EPIC, NeoWs        |
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
git clone https://github.com/your-username/stellara.git
cd stellara
```

---

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NASA_API_KEY=your_nasa_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here   # optional
```

Start the backend server:

```bash
npm run dev
```

The backend will run at `http://localhost:5000`

---

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm start
```

The app will open at `http://localhost:3000`

---

## 🌍 Deployment

### Frontend → Vercel

1. Push your code to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Set the **Root Directory** to `frontend`
4. Add environment variable: `REACT_APP_API_URL=https://your-backend.onrender.com`
5. Deploy

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect the same GitHub repo
3. Set the **Root Directory** to `backend`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `node src/index.js`
6. Add environment variables: `NASA_API_KEY` and `ANTHROPIC_API_KEY`
7. Deploy

---

## 📡 API Endpoints

| Method | Endpoint                        | Description                        |
|--------|---------------------------------|------------------------------------|
| GET    | `/api/apod`                     | Astronomy Picture of the Day       |
| GET    | `/api/apod?date=YYYY-MM-DD`     | APOD for a specific date           |
| GET    | `/api/mars/photos`              | Mars Rover photos                  |
| GET    | `/api/mars/photos?rover=curiosity&sol=1000` | Filter by rover and sol |
| GET    | `/api/asteroids`                | Near-Earth objects (today)         |
| GET    | `/api/asteroids?start=YYYY-MM-DD&end=YYYY-MM-DD` | Asteroids by date range |
| GET    | `/api/epic`                     | Latest EPIC Earth images           |
| GET    | `/api/ai/summary`               | AI-generated summary of space data |

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

Copyright (c) 2025 Stellara

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
- [ ] Set up Express server with basic middleware (cors, helmet, dotenv)
- [ ] Create NASA API service layer (base URL, key injection)
- [ ] Build `/api/apod` route — single day and date range
- [ ] Build `/api/mars/photos` route with rover and sol filters
- [ ] Build `/api/asteroids` route with date range support
- [ ] Build `/api/epic` route for Earth imagery
- [ ] Add centralised error handling middleware
- [ ] Add request rate limiting to protect the NASA API key
- [ ] Add response caching (e.g. node-cache) to reduce duplicate API calls
- [ ] Add input validation and sanitisation
- [ ] Set up environment variable validation on startup
- [ ] Write Jest unit tests for routes and services
- [ ] Add logging (e.g. morgan or winston)

### 🎨 Frontend
- [ ] Scaffold React app with folder structure (pages, components, hooks, services)
- [ ] Set up React Router with routes for each NASA feature
- [ ] Build shared layout (navbar, sidebar, footer)
- [ ] Build APOD page with image display and date picker
- [ ] Build Mars Rover gallery page with rover and sol filters
- [ ] Build Asteroid Tracker page with date range selector
- [ ] Build EPIC Earth Imagery viewer
- [ ] Build global loading spinner / skeleton screens
- [ ] Build global error boundary and error states
- [ ] Add Recharts visualisations for asteroid size and distance data
- [ ] Add Recharts chart for Mars rover photo counts by sol
- [ ] Implement responsive design (mobile, tablet, desktop)
- [ ] Apply space-themed UI (dark background, star effects, typography)
- [ ] Write React Testing Library tests for key components

### 🤖 AI Features
- [ ] Set up Anthropic Claude API integration in backend
- [ ] Build `/api/ai/summary` endpoint
- [ ] Add AI-generated description for APOD images
- [ ] Add AI explanation for asteroid risk and size data
- [ ] Add AI fun facts panel for Mars rover missions
- [ ] Add a conversational "Ask about Space" input box

### 📦 DevOps & Deployment
- [ ] Add `.env.example` files for both frontend and backend
- [ ] Add `.gitignore` to exclude `.env` files and `node_modules`
- [ ] Deploy backend to Render and verify all routes work
- [ ] Deploy frontend to Vercel with correct environment variables
- [ ] Test full production flow end-to-end
- [ ] Add live demo link and screenshots to README

### 🌟 Bonus / Nice to Have
- [ ] Favourite / bookmark feature for APOD images (localStorage)
- [ ] Share button to copy a link to a specific APOD date
- [ ] Animated star background on the home page
- [ ] Dark/light mode toggle
- [ ] PWA support (offline-friendly)
- [ ] Search NASA Image & Video Library
- [ ] ISS real-time location tracker
- [ ] Keyboard accessibility audit
