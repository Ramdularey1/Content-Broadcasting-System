# Content Broadcasting System Frontend

Modern React frontend for an educational content broadcasting workflow. Teachers upload scheduled media, principals approve or reject it, and students view currently active content from a public live page.

## Tech Stack

- React + Vite
- JavaScript
- React Hook Form + Zod
- Replaceable service layer with mocked API latency and errors
- Responsive CSS with reusable components

## Demo Accounts

- Principal: `principal@school.edu` / `password123`
- Teacher: `teacher@school.edu` / `password123`

## Setup

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Routes

- `/login`
- `/principal/dashboard`
- `/principal/approvals`
- `/principal/content`
- `/teacher/dashboard`
- `/teacher/upload`
- `/teacher/content`
- `/live/teacher-1`

## Notes

The API layer lives in `src/services` and can be replaced with real HTTP calls without changing page components.
