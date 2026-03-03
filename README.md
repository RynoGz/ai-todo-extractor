AI To-Do Extractor

This project is a minimal full-stack web application built as part of a technical assessment.

The application accepts natural language input (e.g. *"Remind me to go to gym tomorrow at 6pm"*), uses OpenAI (`gpt-4o-mini`) to extract structured task data, stores the result in Supabase, and displays the created tasks in the UI.

The solution focuses on clean architecture, type safety, and proper separation of concerns.

---

Tech Stack

Next.js (App Router)**
React
TypeScript
Supabase (PostgreSQL)
OpenAI (gpt-4o-mini)
Vercel (Deployment)

---

How It Works

1. User enters natural language task input.
2. The frontend sends a POST request to `/api/create-task`.
3. The API route:

   * Calls OpenAI using structured JSON schema output.
   * Validates the response using Zod.
   * Stores the structured task in Supabase.
4. Tasks are retrieved via `/api/get-tasks` and displayed.
5. Tasks persist after refresh via database loading.

All database writes happen server-side to protect credentials.

---

Database Schema

Supabase `tasks` table:

| Column      | Type               |
| ----------- | ------------------ |
| id          | uuid (primary key) |
| title       | text               |
| description | text               |
| due_date    | timestamp          |
| raw_input   | text               |
| created_at  | timestamp          |

---

Open:

```
http://localhost:3000
```

---

Project Structure

```
app/
  api/
    create-task/
    get-tasks/
components/
types/
lib/
```

* `app/api` → API routes (server-side logic)
* `components` → Reusable UI components
* `types` → TypeScript interfaces
* `lib` → OpenAI and Supabase configuration

---

Deployment

The application is deployed on Vercel and connected to the GitHub repository.

Live URL:
https://vercel.com/rynogzs-projects/ai-todo-extractor

GitHub Repository:
https://github.com/RynoGz/ai-todo-extractor

