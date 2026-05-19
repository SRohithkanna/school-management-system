# School Management System (MERN Stack)

A full-stack School Management System built with React, Node.js, Express, and MongoDB.

## Live Demo
[https://your-app.vercel.app](https://your-app.vercel.app)

## Tech Stack
- **Frontend**: React.js, React Router, Recharts, React Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas)
- **Deployment**: Vercel (frontend) + Render (backend)

## Pages
1. **Home** — Landing page with feature overview
2. **Add Student** — Form to register/edit students
3. **Student Listing** — Search, filter, manage all students
4. **Student Details** — Full profile view
5. **Dashboard** — Charts and analytics

## Setup Instructions

### Prerequisites
- Node.js >= 16
- MongoDB Atlas account

### Backend
```bash
cd server
npm install
# Create .env with MONGO_URI and PORT
npm run dev
```

### Frontend
```bash
cd client
npm install
# Create .env with REACT_APP_API_URL=http://localhost:5000/api
npm start
```

## Deployment
- Backend → Render (set MONGO_URI env variable)
- Frontend → Vercel (set REACT_APP_API_URL to Render URL)

## Deployment link
https://school-management-system-rosy-chi.vercel.app/
