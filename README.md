# AnAlgo

AnAlgo is a full-stack coding interview preparation platform built for company-wise DSA practice, progress tracking, admin question management, and AI-powered doubt support.

## Overview

The project is organized as a small monorepo with separate frontend and backend services, each with its own package configuration and runtime responsibilities.

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
- AI Assistant: Groq API
- Compiler: Judge0 API

## Project Structure

```text
analgo/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── utils/
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
├── DEPLOYMENT.md
├── README.md
├── package.json
└── node_modules/
```

## Professional Workspace Commands

From the root folder, use these commands:

```bash
npm install
npm run dev:backend
npm run dev:frontend
npm run seed
```

To run both services together:

```bash
npm run dev
```

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally or remotely

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

## Features
- Company-wise, topic-wise, and difficulty-wise question filtering
- User authentication and protected routes
- Personalized progress tracking
- Bookmarking and solved-question management
- Admin dashboard for managing questions
- Groq-powered AI chatbot
- Java code execution and submission support through Judge0

## API Highlights
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET /api/questions
- GET /api/questions/meta/filters
- POST /api/bookmarks/:questionId
- POST /api/compiler/run
- POST /api/compiler/submit/:questionId
- POST /api/chatbot

## Admin Flow
Register a user normally, then set the role to admin in MongoDB:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

## Deployment
Detailed deployment guidance is available in [DEPLOYMENT.md](DEPLOYMENT.md).

## Notes
This project is already structured as a clean two-service application, and it now includes root-level scripts for a more professional developer workflow.
