# 🍳 Virtual Chef — Project Documentation

## Project Overview

Virtual Chef is a full-stack recipe suggestion web application where users can input ingredients they have and get matched recipes. Chefs can publish and manage their recipes, and admins oversee the entire platform.

---

## Application Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PUBLIC USER FLOW                             │
│                                                                     │
│   Visit Homepage ──► See 3D Word Cloud Background                   │
│        │                                                            │
│        ▼                                                            │
│   Enter Ingredients (min 4) ──► Click "Get Recipes"                 │
│        │                                                            │
│        ▼                                                            │
│   Backend matches ingredients against published recipes             │
│   (scoring: match count, coverage ≥70%, extra ≤5)                   │
│        │                                                            │
│        ▼                                                            │
│   View Matched Recipes with Match Score ──► Click Recipe Card       │
│        │                                                            │
│        ▼                                                            │
│   Recipe Detail Page (ingredients, instructions, chef info)         │
│                                                                     │
│   Optional: Use /search page for filtered browsing                  │
│             (category, sort by time/date/title, pagination)         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                             │
│                                                                     │
│   Signup ──► Enter name, email, password (8+ chars, upper+lower     │
│              +number), confirm password, agree to terms              │
│        │                                                            │
│        ▼                                                            │
│   Backend creates user (role: chef by default)                      │
│   Password hashed with bcrypt (12 rounds)                           │
│   JWT token generated (expires in 7 days)                           │
│        │                                                            │
│        ▼                                                            │
│   Token + user data stored in localStorage                          │
│   Axios interceptor auto-attaches token to all API requests         │
│        │                                                            │
│        ▼                                                            │
│   Redirect to /chef/dashboard (chef) or /admin/dashboard (admin)    │
│                                                                     │
│   Login ──► Email + Password ──► Backend verifies credentials       │
│        │    Checks: user exists, password matches, account active   │
│        ▼                                                            │
│   Same token flow as signup                                         │
│                                                                     │
│   Logout ──► Clears localStorage (token + user)                     │
│              Redirects to /auth/login                                │
│                                                                     │
│   401 Response ──► Axios interceptor auto-clears session            │
│                    and redirects to login                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        CHEF FLOW                                    │
│                                                                     │
│   Chef Dashboard ──► View all my recipes in a table                 │
│        │              (title, category, prep/cook time, status)      │
│        │                                                            │
│        ├──► Add New Recipe                                          │
│        │      Enter: title, ingredients (chip-based input),         │
│        │      instructions, image upload (JPEG/PNG/GIF/WebP, ≤5MB)  │
│        │      Optional: category, prep time, cook time, servings    │
│        │      ──► FormData sent via multipart/form-data             │
│        │      ──► Multer saves image to /uploads/ folder            │
│        │      ──► Recipe created in MongoDB                         │
│        │                                                            │
│        ├──► Edit Recipe                                             │
│        │      Pre-fills form with existing data                     │
│        │      Ownership check (chefId must match logged-in user)    │
│        │      Old image deleted from disk if new one uploaded       │
│        │                                                            │
│        ├──► Delete Recipe                                           │
│        │      Confirmation dialog ──► Deletes from DB + disk image  │
│        │                                                            │
│        └──► Edit Profile                                            │
│               Update name, email, bio                               │
│               Email uniqueness check                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        ADMIN FLOW                                   │
│                                                                     │
│   Admin Dashboard ──► View stats:                                   │
│        │    Total Recipes, Total Chefs, Active Users, Avg Rating    │
│        │    Recent Recipes table, Top Chefs, Recipes per Month      │
│        │                                                            │
│        ├──► Manage All Recipes                                      │
│        │      Search by title/chef name                             │
│        │      Paginated table (10 per page)                         │
│        │      Delete any recipe (with confirmation)                 │
│        │                                                            │
│        ├──► Manage Chefs                                            │
│        │      Search by name/email                                  │
│        │      View: name, email, bio, recipe count, join date       │
│        │      Toggle active/inactive status                         │
│        │      Delete chef (cascades: deletes all their recipes      │
│        │      and associated images)                                │
│        │                                                            │
│        └──► Admin Profile                                           │
│               Same as chef profile editing                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack — What We Used and Why

### Backend

| Technology | Version | Why We Used It |
|---|---|---|
| **Node.js** | — | JavaScript runtime for the server. Lets us use one language (JS) across the entire stack, simplifying development. Non-blocking I/O makes it great for handling many concurrent API requests. |
| **Express.js** | 5.2.1 | Minimal, flexible web framework. Provides routing, middleware support, and easy REST API creation without unnecessary overhead. Express 5 brings improved error handling and async support. |
| **MongoDB** | — | NoSQL document database. Recipes and users are naturally document-shaped (nested arrays for ingredients, flexible fields). Schema-less nature allows rapid iteration without migrations. |
| **Mongoose** | 9.2.1 | ODM (Object Data Modeling) for MongoDB. Provides schema validation, type casting, query building, and middleware hooks (like pre-save password hashing). Makes MongoDB feel structured without losing flexibility. |
| **JWT (jsonwebtoken)** | 9.0.3 | Stateless authentication. Token-based auth means no server-side session storage needed. The server just verifies the token signature on each request, making it scalable and simple. |
| **bcryptjs** | 3.0.3 | Password hashing library. Uses salt rounds (12) to create one-way hashes, so even if the database is compromised, passwords can't be reversed. Pure JS implementation (no native dependencies). |
| **Multer** | 2.0.2 | Middleware for handling `multipart/form-data` (file uploads). Handles recipe image uploads with disk storage, file type validation, size limits (5MB), and unique filename generation. |
| **CORS** | 2.8.6 | Enables Cross-Origin Resource Sharing. Required because the frontend (port 5173) and backend (port 5000) run on different origins during development. |
| **dotenv** | 17.3.1 | Loads environment variables from `.env` file. Keeps sensitive config (DB URI, JWT secret, API URLs) out of source code. |
| **nodemon** | 3.1.14 | Dev dependency that auto-restarts the server on file changes. Speeds up the development feedback loop. |

### Frontend

| Technology | Version | Why We Used It |
|---|---|---|
| **React** | 19.2.0 | Component-based UI library. Enables building reusable UI components (RecipeCard, Sidebar, Header), efficient re-rendering via virtual DOM, and a rich ecosystem. React 19 brings improved performance. |
| **Vite** | 7.3.1 | Build tool and dev server. Instant hot module replacement (HMR), fast cold starts using native ES modules, and optimized production builds. Much faster than Webpack for development. |
| **React Router** | 7.13.1 | Client-side routing. Enables SPA navigation without full page reloads. Supports nested routes, route parameters (`/recipe/:id`), protected routes, and programmatic navigation. |
| **Material UI (MUI)** | 7.3.8 | Pre-built React component library. Provides consistent, accessible UI components (Tables, Dialogs, TextFields, Buttons, etc.) out of the box, reducing custom CSS work significantly. |
| **Axios** | 1.13.6 | HTTP client for API calls. Provides interceptors (auto-attach JWT token, handle 401 redirects), request/response transformation, and cleaner syntax than fetch. |
| **React Hook Form** | 7.71.2 | Form state management. Used in Login/Signup forms. Minimizes re-renders, provides built-in validation, and handles form state without controlled component boilerplate. |
| **Three.js + React Three Fiber** | 0.183.2 / 9.5.0 | 3D graphics library. Powers the interactive 3D word cloud on the homepage, creating an immersive visual experience with floating ingredient words in a rotating sphere. |
| **@react-three/drei** | 10.7.7 | Helper components for React Three Fiber. Provides `Billboard` (text always faces camera) and `Text` (3D text rendering) used in the word cloud. |
| **Lucide React** | 0.577.0 | Icon library. Provides clean, consistent icons (Trash2, Edit, Plus, etc.) used throughout the chef and admin dashboards. Lightweight alternative to larger icon packs. |
| **Emotion** | 11.14.0 | CSS-in-JS library. Required by MUI for styling. Enables the `sx` prop for inline styling with theme support. |

### Database Design

**Users Collection:**
- Stores chefs and admins in a single collection with a `role` field
- Password excluded from queries by default (`select: false`)
- `isActive` flag allows soft-disabling accounts without deletion

**Recipes Collection:**
- Stores `chefId` as ObjectId reference for population (joining chef details)
- `chefName` denormalized for quick display without joins
- Indexed on `ingredients`, `chefId`, and `title` (text index) for query performance
- `isPublished` flag supports draft/published workflow

---

## Main Features

### 1. Ingredient-Based Recipe Suggestion (Core Feature)
Users enter ingredients they have at home (minimum 4). The algorithm:
- Fetches all published recipes (capped at 500)
- Scores each recipe by counting matched ingredients (fuzzy substring matching)
- Filters: at least 1 match, max 5 extra ingredients, ≥70% recipe coverage
- Sorts by most matches first, then fewest missing ingredients
- Returns results with a match score (e.g., "3/5")

### 2. 3D Interactive Word Cloud
The homepage features a Three.js-powered rotating sphere of 300+ ingredient words. Words are arranged on a spherical surface, slowly rotate, and turn red on hover. Creates a visually striking landing experience.

### 3. Role-Based Access Control (RBAC)
Three distinct user experiences:
- **Public users**: Browse recipes, search by ingredients, view recipe details
- **Chefs**: Full CRUD on their own recipes, profile management, collapsible sidebar dashboard
- **Admins**: Platform-wide management (all recipes, all chefs, dashboard stats, activate/deactivate chefs)

### 4. Recipe Management (Chef Dashboard)
- Add recipes with title, ingredients (chip-based input), instructions, image upload, category, prep/cook time, servings
- Edit existing recipes with pre-filled forms
- Delete with confirmation dialog
- Published/Draft status toggle
- Ownership enforcement (chefs can only modify their own recipes)

### 5. Image Upload System
- Multer handles multipart file uploads
- Validates file type (JPEG, PNG, GIF, WebP) and MIME type
- 5MB size limit
- Unique filenames prevent collisions (`recipe-{timestamp}-{random}.ext`)
- Old images cleaned up on edit/delete
- Served as static files from `/uploads/`

### 6. Admin Dashboard & Analytics
- Stats cards: Total Recipes, Total Chefs, Active Users
- Recent recipes table
- Top 5 chefs by recipe count (MongoDB aggregation)
- Recipes per month trend (last 6 months aggregation)
- Search and paginated management tables for recipes and chefs

### 7. Chef Account Management (Admin)
- View all chefs with recipe counts
- Toggle active/inactive status (deactivated chefs can't log in)
- Delete chef cascades: removes all their recipes and associated images

### 8. Authentication System
- JWT-based stateless auth with 7-day expiry
- bcrypt password hashing (12 salt rounds)
- Frontend form validation (React Hook Form) with password strength indicator
- Auto-redirect on 401 responses
- Protected routes on both frontend (ProtectedRoute component) and backend (protect + authorize middleware)

### 9. Responsive Design
- Mobile hamburger menu with drawer navigation
- Collapsible sidebar (state persisted in localStorage)
- Responsive grid layouts across all pages
- Mobile-optimized forms and tables

### 10. Recipe Search & Filtering
- Search page with ingredient-based search
- Category filtering (Quick & Easy, Breakfast, Lunch, Dinner, etc.)
- Sort options: Newest, Oldest, Quickest, Longest, Title A-Z
- Client-side pagination (12 per page)

---

## Project Structure

```
virtual-chef/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── multer.js          # File upload configuration
│   ├── controllers/
│   │   ├── authController.js  # Login, Register, Profile
│   │   ├── chefController.js  # Recipe CRUD (chef-owned)
│   │   ├── adminController.js # Platform management
│   │   └── recipeController.js # Public recipe endpoints
│   ├── middleware/
│   │   ├── auth.js            # JWT verify + role authorization
│   │   └── errorHandler.js    # Central error handling
│   ├── models/
│   │   ├── User.js            # User schema (chef/admin)
│   │   └── Recipe.js          # Recipe schema
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth/*
│   │   ├── chefRoutes.js      # /api/chef/*
│   │   ├── adminRoutes.js     # /api/admin/*
│   │   └── recipeRoutes.js    # /api/recipes/*
│   ├── uploads/               # Stored recipe images
│   ├── server.js              # Express app entry point
│   └── .env                   # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         # Public navbar
│   │   │   ├── Footer.jsx         # Site footer
│   │   │   ├── SearchBar.jsx      # Ingredient input + recipe results
│   │   │   ├── Sidebar.jsx        # Collapsible dashboard nav
│   │   │   ├── ChefHeader.jsx     # Dashboard top bar
│   │   │   ├── ProtectedRoute.jsx # Auth + role guard
│   │   │   └── WordCloud3D.jsx    # Three.js ingredient cloud
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state
│   │   ├── services/
│   │   │   └── api.js            # Axios instance + API functions
│   │   ├── pages/
│   │   │   ├── auth/    Login.jsx, Signup.jsx
│   │   │   ├── user/    UserDashboard.jsx, RecipeSearch.jsx, RecipeDetail.jsx
│   │   │   ├── chef/    ChefDashboard.jsx, AddRecipePage.jsx, ChefProfile.jsx
│   │   │   └── admin/   AdminDashboard.jsx, AdminRecipes.jsx, AdminChefs.jsx, AdminProfile.jsx
│   │   ├── layouts/
│   │   │   └── AuthLayout.jsx    # Shared auth page layout
│   │   ├── App.jsx               # Route definitions
│   │   └── main.jsx              # React entry point
│   ├── vite.config.js            # Vite config with API proxy
│   └── .env                      # Frontend env variables
```

---

## API Endpoints Summary

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/login` | No | — | Login with email/password |
| POST | `/api/auth/register` | No | — | Register new user |
| GET | `/api/auth/me` | Yes | Any | Get current user |
| PUT | `/api/auth/update-profile` | Yes | Any | Update profile |
| POST | `/api/recipes/suggest` | No | — | Get recipe suggestions by ingredients |
| GET | `/api/recipes/:id` | No | — | Get recipe details |
| GET | `/api/chef/my-recipes` | Yes | Chef/Admin | Get chef's recipes |
| POST | `/api/chef/recipes` | Yes | Chef/Admin | Create recipe (with image) |
| PUT | `/api/chef/recipes/:id` | Yes | Chef/Admin | Update recipe |
| DELETE | `/api/chef/recipes/:id` | Yes | Chef/Admin | Delete own recipe |
| GET | `/api/admin/dashboard` | Yes | Admin | Dashboard stats |
| GET | `/api/admin/recipes` | Yes | Admin | All recipes (paginated) |
| DELETE | `/api/admin/recipes/:id` | Yes | Admin | Delete any recipe |
| GET | `/api/admin/chefs` | Yes | Admin | All chefs (paginated) |
| DELETE | `/api/admin/chefs/:id` | Yes | Admin | Delete chef + their recipes |
| PATCH | `/api/admin/chefs/:id/toggle-status` | Yes | Admin | Activate/deactivate chef |
