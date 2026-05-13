# Blogs — A Full-Stack Blogging Platform

A full-stack blogging platform where users can read, write, and publish posts. Built with Next.js, MongoDB, and JWT-based authentication including email verification.

🔗 **Live:** [www.bishesh0.com.np/blog](https://www.bishesh0.com.np/blog)

---

## Features

- **Authentication** — Sign up with email verification, login with JWT tokens, password hashing with bcryptjs
- **Blog Posts** — Create, publish, and read posts with tag support
- **Email Verification** — Account verification flow via Nodemailer + Mailtrap
- **Input Validation** — Server-side validation with Zod
- **Protected Routes** — Write and publish actions require authenticated users

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Email | Nodemailer + Mailtrap |
| Validation | Zod |
| Styling | Tailwind CSS v4 |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas account
- A Mailtrap account (for email)

### Installation

```bash
git clone https://github.com/Bishuthapa/Blogs.git
cd Blogs
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
MAILTRAP_TOKEN=your_mailtrap_token
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
├── app/              # Next.js App Router (pages + API routes)
├── components/       # Reusable UI components
├── core/
│   └── models/       # Mongoose models (Blog, User)
├── lib/              # DB connection, utilities
├── types/            # TypeScript interfaces
├── validators/       # Zod validation schemas
└── utils/            # Helper functions
```

---

## Data Models

**User** — username, email, hashed password, avatar, email verification status, password reset tokens

**Blog** — title, content, author (ref: User), tags, published status, timestamps. Indexed on `createdAt`, `published`, and `tags` for query performance.

---

## Author

**Bishu Thapa** — [GitHub](https://github.com/Bishuthapa) · [LinkedIn](https://www.linkedin.com/in/bishu-t-53b239277/) · [Portfolio](https://bishesh-thapa.com.np)