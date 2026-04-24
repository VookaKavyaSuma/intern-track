# Internship Success Portal (MVP)

A full-stack MERN application for tracking internship applications and analyzing job descriptions. Built with a modular architecture ready for future AI integration.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS v4
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt

## Quick Start

### 1. Clone & Configure

```bash
git clone <your-repo-url>
cd "Internship Success Portal"
```

### 2. Backend Setup

```bash
cd server
cp .env.example .env        # then edit .env with your real values
npm install
npm run dev                  # starts on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev                  # starts on http://localhost:5173
```

### 4. Environment Variables

Copy `.env.example` to `server/.env` and fill in:

| Variable     | Description                      |
|-------------|----------------------------------|
| `PORT`      | Backend port (default: 5000)     |
| `MONGO_URI` | MongoDB connection string        |
| `JWT_SECRET`| Secret key for signing JWTs      |

## API Endpoints

### Auth
| Method | Endpoint              | Description       |
|--------|-----------------------|-------------------|
| POST   | `/api/auth/register`  | Create account    |
| POST   | `/api/auth/login`     | Login & get token |

### Jobs (Protected — requires Bearer token)
| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | `/api/jobs`         | List user's jobs         |
| POST   | `/api/jobs`         | Create a job entry       |
| PUT    | `/api/jobs/:id`     | Update a job entry       |
| DELETE | `/api/jobs/:id`     | Delete a job entry       |
| POST   | `/api/jobs/analyze` | Analyze a job description|

## Future AI Integration

The `/api/jobs/analyze` route currently returns mock data. To integrate a real AI API, edit **only** `server/services/aiService.js` — the rest of the stack remains unchanged.

## License

MIT
