# Directory Structure Suggestions

## Current Issues:
1. ❌ `blogApi` should be `blogs` (RESTful naming)
2. ❌ `auth/users/` has unnecessary nesting
3. ❌ Login route handles multiple actions (login, forgot-password, reset-password)
4. ❌ `constant.ts` should be `constants.ts` (plural)
5. ❌ `verifyEmail` should be `verify-email` (kebab-case consistency)
6. ❌ Missing logout route implementation
7. ❌ No middleware folder for auth middleware
8. ❌ No lib folder for shared utilities
9. ❌ No components folder

## Recommended Structure:

```
Blogs/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts          # Only login logic
│   │   │   ├── signup/
│   │   │   │   └── route.ts
│   │   │   ├── logout/
│   │   │   │   └── route.ts          # Implement logout
│   │   │   ├── forgot-password/
│   │   │   │   └── route.ts          # Separate from login
│   │   │   ├── reset-password/
│   │   │   │   └── route.ts          # Separate from login
│   │   │   └── verify-email/
│   │   │       └── route.ts          # Email verification
│   │   └── blogs/                    # Renamed from blogApi
│   │       ├── [id]/
│   │       │   └── route.ts
│   │       └── route.ts
│   ├── (auth)/                       # Route group (optional)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   └── verify-email/              # Renamed from verifyEmail
│   │       └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── lib/                               # NEW: Shared utilities
│   ├── auth.ts                        # Auth helpers (verifyToken, etc.)
│   ├── db.ts                          # Move from core/database
│   └── utils.ts                       # General utilities
│
├── middleware.ts                      # NEW: Next.js middleware for auth
│
├── components/                        # NEW: Reusable components
│   ├── ui/                            # UI components
│   └── forms/                         # Form components
│
├── core/
│   └── models/                        # Keep models here
│       ├── Blog.model.ts
│       └── User.model.ts
│
├── validators/                        # Keep validators here
│   ├── forgotPasswordSchema.ts
│   ├── loginSchema.ts
│   └── signupSchema.ts
│
├── utils/                             # Keep utilities here
│   └── mailer.ts
│
├── types/
│   └── index.d.ts
│
├── constants.ts                       # Renamed from constant.ts
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Key Improvements:

### 1. **API Routes (RESTful)**
- ✅ Separate routes for each action
- ✅ Remove unnecessary `users/` nesting
- ✅ Rename `blogApi` → `blogs`

### 2. **Naming Conventions**
- ✅ `constant.ts` → `constants.ts`
- ✅ `verifyEmail` → `verify-email`
- ✅ Consistent kebab-case for routes

### 3. **New Folders**
- ✅ `lib/` - Shared utilities and helpers
- ✅ `components/` - Reusable React components
- ✅ `middleware.ts` - Next.js middleware for auth

### 4. **Better Organization**
- ✅ Group auth pages in `(auth)/` route group (optional)
- ✅ Move database connection to `lib/db.ts`
- ✅ Create `lib/auth.ts` for auth utilities

## Migration Steps:

1. **Rename files:**
   - `constant.ts` → `constants.ts`
   - `app/verifyEmail/` → `app/verify-email/`
   - `app/api/blogApi/` → `app/api/blogs/`

2. **Restructure API routes:**
   - Split `login/route.ts` into separate routes
   - Remove `users/` folder nesting
   - Implement logout route

3. **Create new folders:**
   - `lib/` folder
   - `components/` folder
   - `middleware.ts` file

4. **Update imports:**
   - Update all import paths after restructuring
