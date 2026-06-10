# DEV CLASSES — Full-Stack ERP & Website Platform

A complete EdTech ERP system for DEV CLASSES coaching institute (Sikar, Rajasthan).

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Neon) / SQLite (local dev) |
| ORM | Prisma |
| Auth | JWT |
| Hosting | Vercel (frontend) + Render (backend) + Neon (DB) |

## 📁 Project Structure

```
yogesh/
├── frontend/   → Next.js app (deployed on Vercel)
└── backend/    → Express API server (deployed on Render)
```

## 🚀 Production URLs

- **Frontend**: https://devclasses.vercel.app
- **Backend API**: https://devclasses-backend.onrender.com
- **API Health**: https://devclasses-backend.onrender.com/api/health

## 🛠️ Local Development

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your local values
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your local values
npm install
npm run dev
```

## 📦 Deployment

- **Database**: [Neon](https://neon.tech) — Free PostgreSQL
- **Backend**: [Render](https://render.com) — Node.js Web Service
- **Frontend**: [Vercel](https://vercel.com) — Next.js App

## 🔐 Environment Variables

### Backend (.env)
- `DATABASE_URL` — PostgreSQL connection string from Neon
- `JWT_SECRET` — Secret key for JWT token signing
- `FRONTEND_URL` — Your Vercel frontend URL (for CORS)
- `PORT` — Server port (default: 5000)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` — Your Render backend URL

## 👨‍💼 Default Admin Credentials
- Email: `admin@devclasses.com`
- Password: `Mukesh@devclasses`
