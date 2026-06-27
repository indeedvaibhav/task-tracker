# ⚡ TaskFlow — MERN Task Tracker

A full-stack task management application built with MongoDB, Express.js, React.js, and Node.js.

**Live Demo:** [your-frontend.vercel.app](https://your-frontend.vercel.app)  
**API:** [your-backend.onrender.com](https://your-backend.onrender.com)

---

## Features

- **Full CRUD** — Create, read, update, delete tasks
- **Status Management** — Click any status badge to cycle through pending → in-progress → completed
- **Priority Levels** — High / Medium / Low with color indicators
- **Due Dates** — Overdue and due-today warnings
- **Live Filtering** — Filter by status, priority, and search by title
- **Sorting** — Sort by newest, oldest, due date, or priority
- **Stats Dashboard** — Live task counts by status
- **Form Validation** — Client + server-side validation
- **Toast Notifications** — Feedback on every action
- **Responsive UI** — Works on all screen sizes

---

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React 18 + Vite         |
| Backend  | Node.js + Express.js    |
| Database | MongoDB + Mongoose      |
| Styling  | CSS Modules             |
| Deploy   | Vercel + Render         |

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/task-tracker.git
cd task-tracker
```

### 2. Backend setup
```bash
cd server
cp .env.example .env
# Add your MONGO_URI to .env
npm install
npm run dev
```

### 3. Frontend setup
```bash
cd client
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## API Reference

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | /api/tasks        | Get all tasks (filterable)|
| GET    | /api/tasks/:id    | Get single task          |
| POST   | /api/tasks        | Create a task            |
| PUT    | /api/tasks/:id    | Update a task            |
| DELETE | /api/tasks/:id    | Delete a task            |
| GET    | /api/tasks/stats  | Get task counts by status|

### Query Parameters (GET /api/tasks)
- `status` — pending | in-progress | completed
- `priority` — low | medium | high
- `sort` — newest | oldest | dueDate | priority
- `search` — search by title (case-insensitive)

### Task Schema
```json
{
  "title": "string (required, max 100)",
  "description": "string (optional, max 500)",
  "status": "pending | in-progress | completed",
  "priority": "low | medium | high",
  "dueDate": "ISO 8601 date (optional)"
}
```

---

## Deployment

### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo, set root directory to `server`
4. Build command: `npm install`
5. Start command: `node index.js`
6. Add environment variables:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `CLIENT_URL` — your Vercel frontend URL
7. Deploy!

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo, set root directory to `client`
3. Framework preset: **Vite**
4. Add environment variable:
   - `VITE_API_URL` — your Render backend URL + `/api`
5. Deploy!

---

## Project Structure

```
task-tracker/
├── server/
│   ├── controllers/
│   │   └── taskController.js   # CRUD logic
│   ├── middleware/
│   │   └── errorHandler.js     # Global error handling
│   ├── models/
│   │   └── Task.js             # Mongoose schema
│   ├── routes/
│   │   └── tasks.js            # Express routes + validation
│   ├── .env.example
│   ├── index.js                # Entry point
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StatsBar.jsx    # Task count summary
│   │   │   ├── FilterBar.jsx   # Search, filter, sort
│   │   │   ├── TaskCard.jsx    # Individual task card
│   │   │   ├── TaskModal.jsx   # Create/edit modal
│   │   │   └── EmptyState.jsx  # Empty list UI
│   │   ├── context/
│   │   │   └── TaskContext.jsx # Global state management
│   │   ├── utils/
│   │   │   └── api.js          # Axios instance
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

Built for COLL-EDGE CONNECT Full Stack Developer Intern Assignment.
