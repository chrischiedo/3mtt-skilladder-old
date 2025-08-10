# Skill Assessment Platform Documentation

## Overview

This project is a full-stack web application designed to assess and track the technical and behavioral skills of users, particularly for 3MTT fellows. It provides a comprehensive assessment workflow, personalized recommendations, and dashboards for both users and admins.

---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Setup & Installation](#setup--installation)
- [Main Application Flow](#main-application-flow)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

---

## Tech Stack
- **Frontend:** React (Next.js), Tailwind CSS, Radix UI
- **Backend:** Next.js API routes, MongoDB, Prisma ORM
- **Authentication:** Clerk
- **Other:** Sentry (monitoring), Google Gemini API (AI features), Recharts (charts)

---

## Project Structure
```
├── app/                # Main application routes and pages
│   ├── dashboard/      # User dashboard
│   ├── ...             # Other feature routes (assessment, results, etc.)
│   └── layout.tsx      # Root layout
├── components/         # Reusable UI and logic components
├── lib/                # Utility functions and database connections
├── prisma/             # Database schema (Prisma)
├── public/             # Static assets
├── data/               # (Likely) static or seed data
├── docs/               # Project documentation
├── ...
```

---

## Key Features
- **User Authentication:** Secure sign-in/sign-up via Clerk.
- **Skill Assessment:** Multiple assessment types (technical, SFIA, RIASEC, etc.)
- **Resume Parsing:** Users can upload resumes for skill extraction.
- **Personalized Dashboard:** Users see their progress, results, and recommendations.
- **Admin Dashboard:** For managing users and viewing aggregate data.
- **Charts & Visualizations:** Progress and results visualized with charts.
- **Persistent Data:** User progress and results stored in MongoDB/PostgreSQL.

---

## Setup & Installation
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd <project-folder>
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local` and fill in the required values (see below).
4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. **Open the app:**
   - Visit `http://localhost:3000` in your browser.

---

## Main Application Flow
1. **Landing Page:**
   - Users are greeted and prompted to sign in or view instructions.
2. **Authentication:**
   - Clerk handles user authentication.
3. **Dashboard:**
   - After sign-in, users are directed to their dashboard, which displays their progress and available assessments.
4. **Assessment Workflow:**
   - Users complete a series of assessments (technical, SFIA, RIASEC, etc.).
   - Progress is tracked and stored in the database.
5. **Results & Recommendations:**
   - Upon completion, users receive personalized feedback and recommendations.
6. **Admin Features:**
   - Admins can view user data, progress, and analytics via a dedicated dashboard.

---

## Database Schema (Prisma)
- **User:** Stores user credentials (id, username, password).
- **UserDataRESUME:** Stores parsed resume data as JSON.
- **UserActionsBoolean:** Tracks which steps a user has completed (resume parsed, assessments done, etc.).

---

## Environment Variables
See `.env.example` for required variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (Clerk API key)
- `CLERK_SECRET_KEY` (Clerk secret)
- `MONGODB_URI` (MongoDB connection string)
- `API_KEY_GEMINI` (Google Gemini API key)

---

## Contributing
- Fork the repo and create a feature branch.
- Follow the existing code style and structure.
- Submit a pull request with a clear description of your changes.

---

## Changelog
- 13/01/2025: Added admin dashboard. 