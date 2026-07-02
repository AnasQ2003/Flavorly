<div align="center">
  <h1>🍽️ Flavorly — Cultivate Your Kitchen</h1>

  <p>
    A full-stack recipe discovery &amp; meal planning web app built with
    <strong>React 19 · TanStack Start · TailwindCSS v4 · Node.js · Express · SQL Server</strong>
  </p>

  <p>
    <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white&style=flat-square" />
    <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square" />
    <img alt="Node.js" src="https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white&style=flat-square" />
    <img alt="Express" src="https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white&style=flat-square" />
    <img alt="SQL Server" src="https://img.shields.io/badge/SQL_Server-2019+-CC2927?logo=microsoftsqlserver&logoColor=white&style=flat-square" />
    <img alt="License" src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
  </p>
</div>

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [📸 Screenshots](#-screenshots)
- [🏗️ Project Architecture](#️-project-architecture)
- [📂 File Structure](#-file-structure)
- [⚙️ Prerequisites](#️-prerequisites)
- [🚀 Getting Started](#-getting-started)
- [🔧 Configuration](#-configuration)
- [📡 API Reference](#-api-reference)
- [🧩 Tech Stack](#-tech-stack)
- [📖 How to Use the App](#-how-to-use-the-app)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

Flavorly is a feature-rich culinary platform that gives food lovers everything they need to discover, plan, and cook amazing meals.

### 🔐 Authentication
- **Secure Sign-Up & Login** — JWT-based authentication with bcrypt password hashing
- **Remember Me** — Optional credential persistence in `localStorage` for seamless re-login
- **Route Guards** — All authenticated pages are protected; unauthenticated users are redirected to login
- **Persistent Sessions** — Auth state is persisted via Zustand + `localStorage` across page refreshes

### 🏠 Home Feed
- **Hero Carousel** — Auto-advancing full-bleed recipe banners with smooth CSS transitions
- **Trending Recipes** — Horizontally scrollable cards showing the most popular dishes
- **Quick Picks** — Curated recipes under 30 minutes
- **Personalized Greeting** — Dynamic welcome message with the logged-in user's name

### 🔍 Search & Discovery
- **Full-Text Search** — Instant fuzzy search across all recipes, blogs, and cuisines
- **Advanced Filters** — Filter by cuisine type, dietary preference, cook time, and difficulty
- **Tag-Based Browsing** — Navigate by ingredient, meal type, or health label

### 📂 Categories & Regions
- **Category Browser** — Grid layout of all cuisine categories with cover imagery
- **World Region Explorer** — Interactive region explorer (Asia, Europe, Americas, Africa, etc.)
- **Dish-Level Detail** — Deep-dive into regional dishes with origin stories

### 🍳 Recipe Details
- **Rich Recipe Pages** — Ingredients, step-by-step instructions, cook/prep time, servings
- **Nutrition Facts** — Per-serving macros (calories, protein, fat, carbs)
- **Ratings & Reviews** — Star ratings with user review display
- **Favorites Toggle** — One-tap save/unsave to personal favorites list
- **Share Button** — Native Web Share API integration

### ❤️ Favorites
- **Saved Recipes Grid** — All favorited recipes in one place
- **Offline Access** — Favorites stored locally for quick access

### 📅 Meal Planner
- **Weekly Calendar View** — Plan Breakfast, Lunch, Dinner, and Dessert for every day
- **Add Meal Dialog** — Search and assign any recipe to a meal slot
- **Add Desert** — Dedicated dessert slot per day with full recipe linking
- **Nutritional Summary** — Daily calorie total calculated automatically

### 🛒 Shopping List
- **Auto-Generated Lists** — Instantly populate shopping list from any meal plan
- **Manual Add Items** — Add custom ingredients with quantity and unit
- **Check-Off Items** — Strike through purchased items
- **Clear Completed** — Remove all checked items in one tap

### 🔔 Notifications
- **In-App Notification Centre** — All alerts, reminders, and updates in one place
- **Unread Badge** — Bell icon badge shows unread count
- **Mark All Read** — Dismiss all notifications at once

### 👤 Profile
- **Profile Screen** — Avatar, display name, bio, followers/following stats
- **Edit Profile** — Update name, bio, and profile photo (with avatar upload)
- **Share Profile** — Share profile link via the Web Share API

### ⚙️ Settings
- **Dietary Preferences** — Select from Vegetarian, Vegan, Gluten-Free, Keto, Paleo, etc.
- **Notification Preferences** — Toggle specific notification types on/off
- **Theme Toggle** — Light / Dark mode switch (persisted in localStorage)

### 🌍 Drawer Navigation
- **Side Drawer** — Swipe-accessible full navigation with user avatar and links
- **App Footer in Drawer** — Professional footer with version info and support links
- **Quick Links** — Jump to Home, Search, Meal Plan, Shopping, Notifications, Profile, Settings

### 📝 Blog
- **Blog Feed** — Curated culinary articles with cover images and reading time
- **Blog Post Detail** — Full long-form article view with rich typography

---

## 📸 Screenshots


---

### 🚀 Splash & Onboarding

| 01 · Splash Screen | 02 · Welcome | 03 · Discover | 04 · Plan |
|:---:|:---:|:---:|:---:|
| ![Splash](./screenshots/01-splash-screen.png) | ![Welcome](./screenshots/02-onboarding-welcome.png) | ![Discover](./screenshots/03-onboarding-discover.png) | ![Plan](./screenshots/04-onboarding-plan.png) |

| 05 · Shop |
|:---:|
| ![Shop](./screenshots/05-onboarding-shop.png) |

---

### 🔐 Authentication

| 06 · Login Screen | 07 · Remember Me | 08 · Sign Up |
|:---:|:---:|:---:|
| ![Login](./screenshots/06-login-screen.png) | ![Remember Me](./screenshots/07-login-remember-me.png) | ![Sign Up](./screenshots/08-signup-screen.png) |

---

### 🏠 Home Feed

| 09 · Home Feed | 10 · Hero Carousel | 11 · Trending Recipes | 12 · Quick Picks |
|:---:|:---:|:---:|:---:|
| ![Home](./screenshots/09-home-feed.png) | ![Carousel](./screenshots/10-home-hero-carousel.png) | ![Trending](./screenshots/11-home-trending-recipes.png) | ![Quick Picks](./screenshots/12-home-quick-picks.png) |

---

### 🗂️ Drawer Navigation

| 13 · Drawer Menu | 14 · Drawer Footer |
|:---:|:---:|
| ![Drawer](./screenshots/13-drawer-menu.png) | ![Drawer Footer](./screenshots/14-drawer-footer.png) |

---

### 📂 Categories

| 15 · Categories Screen | 16 · Category Detail |
|:---:|:---:|
| ![Categories](./screenshots/15-categories-screen.png) | ![Category Detail](./screenshots/16-category-detail.png) |

---

### 🍳 Recipe Details

| 17 · Recipe Overview | 18 · Ingredients | 19 · Steps |
|:---:|:---:|:---:|
| ![Top](./screenshots/17-recipe-detail-top.png) | ![Ingredients](./screenshots/18-recipe-detail-ingredients.png) | ![Steps](./screenshots/19-recipe-detail-steps.png) |

| 20 · Nutrition Facts | 21 · Reviews |
|:---:|:---:|
| ![Nutrition](./screenshots/20-recipe-detail-nutrition.png) | ![Reviews](./screenshots/21-recipe-detail-reviews.png) |

---

### 🔍 Search

| 22 · Search Screen | 23 · Search Results | 24 · Search Filters |
|:---:|:---:|:---:|
| ![Search](./screenshots/22-search-screen.png) | ![Results](./screenshots/23-search-results.png) | ![Filters](./screenshots/24-search-filters.png) |

---

### ❤️ Favorites

| 25 · Favorites Screen |
|:---:|
| ![Favorites](./screenshots/25-favorites-screen.png) |

---

### 📅 Meal Planner

| 26 · Meal Plan | 27 · Add Meal | 28 · Weekly View | 29 · Add Desert |
|:---:|:---:|:---:|:---:|
| ![Meal Plan](./screenshots/26-meal-plan-screen.png) | ![Add Meal](./screenshots/27-meal-plan-add-meal.png) | ![Weekly View](./screenshots/28-meal-plan-weekly-view.png) | ![Desert](./screenshots/29-meal-plan-add-desert.png) |

---

### 🛒 Shopping List

| 30 · Shopping List | 31 · Add Item | 32 · Checked Items |
|:---:|:---:|:---:|
| ![Shopping](./screenshots/30-shopping-list.png) | ![Add Item](./screenshots/31-shopping-list-add-item.png) | ![Checked](./screenshots/32-shopping-list-checked.png) |

---

### 🔔 Notifications

| 33 · Notifications | 34 · Unread Badge |
|:---:|:---:|
| ![Notifications](./screenshots/33-notifications-screen.png) | ![Unread](./screenshots/34-notifications-unread.png) |

---

### 👤 Profile

| 35 · Profile Screen | 36 · Edit Profile | 37 · Share Profile |
|:---:|:---:|:---:|
| ![Profile](./screenshots/35-profile-screen.png) | ![Edit](./screenshots/36-profile-edit.png) | ![Share](./screenshots/37-profile-share.png) |

---

### ⚙️ Settings

| 38 · Settings | 39 · Dietary Prefs | 40 · Notif Settings |
|:---:|:---:|:---:|
| ![Settings](./screenshots/38-settings-screen.png) | ![Dietary](./screenshots/39-settings-dietary.png) | ![Notif Settings](./screenshots/40-settings-notifications.png) |

---

### 🌍 Regions & World Cuisine

| 41 · World Map | 42 · Asia | 43 · Europe |
|:---:|:---:|:---:|
| ![World Map](./screenshots/41-region-world-map.png) | ![Asia](./screenshots/42-region-asia.png) | ![Europe](./screenshots/43-region-europe.png) |

| 44 · Americas | 45 · Dish Detail |
|:---:|:---:|
| ![Americas](./screenshots/44-region-americas.png) | ![Dish](./screenshots/45-region-dish-detail.png) |

---

### 📝 Blog

| 46 · Blog List | 47 · Blog Post Detail |
|:---:|:---:|
| ![Blog](./screenshots/46-blog-list.png) | ![Post](./screenshots/47-blog-post-detail.png) |

---

### 📜 Legal Pages

| 48 · Privacy Policy | 49 · Terms of Service |
|:---:|:---:|
| ![Privacy](./screenshots/48-privacy-policy.png) | ![Terms](./screenshots/49-terms-of-service.png) |

---

### 🌙 Dark Mode & Responsive

| 50 · Dark Mode Home | 51 · Dark Mode Recipe | 52 · Dark Mode Profile |
|:---:|:---:|:---:|
| ![Dark Home](./screenshots/50-dark-mode-home.png) | ![Dark Recipe](./screenshots/51-dark-mode-recipe.png) | ![Dark Profile](./screenshots/52-dark-mode-profile.png) |

| 53 · Tablet View | 54 · App Overview |
|:---:|:---:|
| ![Tablet](./screenshots/53-responsive-tablet-view.png) | ![Overview](./screenshots/54-app-overview.png) |

---

## 🏗️ Project Architecture

```
Flavorly/
├── backend/          # Node.js + Express REST API
│   ├── config/       # Database & JWT configuration
│   ├── database/     # SQL Server schema & seed scripts
│   ├── middleware/   # Auth middleware (JWT verification)
│   ├── routes/       # API route handlers
│   └── server.js     # Express app entry point
│
├── frontend/         # React 19 + TanStack Start SPA
│   └── src/
│       ├── assets/       # Static images and icons
│       ├── components/   # Reusable UI components
│       │   └── ui/       # shadcn/ui Radix-based primitives
│       ├── hooks/        # Custom React hooks
│       ├── lib/          # State, API, utilities, mock data
│       ├── routes/       # File-based page routes
│       └── styles.css    # Global TailwindCSS v4 stylesheet
│
└── screenshots/      # App screenshots (54 images)
```

---

## 📂 File Structure

### Frontend (`frontend/src/`)

| Path | Purpose |
|------|---------|
| `routes/__root.tsx` | Root layout wraps all pages |
| `routes/index.tsx` | Splash/landing screen |
| `routes/auth.tsx` | Login & Sign-Up forms with Remember Me |
| `routes/onboarding.tsx` | 4-step onboarding carousel |
| `routes/home.tsx` | Home feed with hero carousel |
| `routes/search.tsx` | Full-text search with filter panel |
| `routes/categories.tsx` | Category grid listing |
| `routes/category.$slug.tsx` | Dynamic category detail page |
| `routes/recipe.$id.tsx` | Dynamic recipe detail page |
| `routes/favorites.tsx` | Saved/favorited recipes |
| `routes/mealplan.tsx` | Weekly meal planner |
| `routes/shopping.tsx` | Shopping list |
| `routes/notifications.tsx` | Notification centre |
| `routes/profile.index.tsx` | Profile overview screen |
| `routes/profile.edit.tsx` | Edit profile form |
| `routes/region.$id.tsx` | Regional cuisine explorer |
| `routes/region.$id.dish.$dish.tsx` | Individual dish detail |
| `routes/blog.$id.tsx` | Blog post detail |
| `routes/settings.tsx` | App settings page |
| `routes/privacy.tsx` | Privacy policy page |
| `routes/terms.tsx` | Terms of service page |
| `lib/auth-store.ts` | Zustand auth store (JWT + user state) |
| `lib/flavor-store.ts` | Zustand global store (profile, favorites, meal plan, shopping) |
| `lib/mock-data.ts` | Seed data for recipes, blogs, regions, categories |
| `lib/route-guards.ts` | `requireAuth()` / `redirectIfAuthenticated()` helpers |
| `lib/utils.ts` | `cn()` class name utility |
| `components/AppShell.tsx` | Responsive phone-frame wrapper |
| `components/PhoneFrame.tsx` | Mobile-device chrome frame |
| `components/BottomTabBar.tsx` | Bottom navigation bar (5 tabs) |
| `components/Drawer.tsx` | Side-drawer navigation with footer |
| `components/Footer.tsx` | Professional drawer footer |
| `components/TopNav.tsx` | Page-level top navigation bar |
| `components/PageHeader.tsx` | Reusable page header with back button |
| `components/ui/` | 30+ shadcn/ui component primitives |
| `hooks/use-mobile.tsx` | `useIsMobile()` responsive hook |
| `styles.css` | TailwindCSS v4 global stylesheet + CSS variables |

### Backend (`backend/`)

| Path | Purpose |
|------|---------|
| `server.js` | Express app — middleware, routes, error handler |
| `routes/auth.js` | `POST /api/auth/register`, `POST /api/auth/login` |
| `routes/profile.js` | `GET/PUT /api/profile` — user profile CRUD |
| `routes/recipes.js` | `GET /api/recipes` — recipe listing & search |
| `routes/mealplans.js` | `GET/POST/DELETE /api/mealplans` — meal plan management |
| `routes/shopping.js` | `GET/POST/DELETE /api/shopping` — shopping list CRUD |
| `routes/notifications.js` | `GET/PATCH /api/notifications` — notification management |
| `config/` | Database pool configuration |
| `database/` | SQL schema and seed data |
| `middleware/auth.js` | JWT `verifyToken` middleware |

---

## ⚙️ Prerequisites

| Tool | Version | Download |
|------|---------|---------|
| **Node.js** | >= 20.x | [nodejs.org](https://nodejs.org) |
| **npm** | >= 10.x | Included with Node.js |
| **SQL Server** | 2019+ | [microsoft.com/sql-server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) |
| **Git** | >= 2.x | [git-scm.com](https://git-scm.com) |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AnasQ2003/Flavorly.git
cd Flavorly
```

### 2. Set Up the Database

Open **SQL Server Management Studio** and run:

```sql
CREATE DATABASE FlavorlyDB;
GO
USE FlavorlyDB;
GO
```

Then execute the schema file from SSMS:
- `backend/database/schema.sql`
- `backend/database/seed.sql` (optional sample data)

### 3. Configure the Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
DB_SERVER=localhost
DB_NAME=FlavorlyDB
DB_USER=sa
DB_PASSWORD=your_password_here
DB_PORT=1433
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
PORT=5000
```

```bash
npm install
npm run dev
```

API available at: **http://localhost:5000**

### 4. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at: **http://localhost:3000**

---

## 🔧 Configuration

### Backend Environment Variables (`.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API server port | `5000` |
| `DB_SERVER` | SQL Server hostname | `localhost` |
| `DB_NAME` | Database name | `FlavorlyDB` |
| `DB_USER` | SQL Server username | `sa` |
| `DB_PASSWORD` | SQL Server password | _(required)_ |
| `DB_PORT` | SQL Server port | `1433` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | _(required)_ |

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected endpoints require `Authorization: Bearer <token>`.

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | — | Health check |
| `POST` | `/api/auth/register` | — | Register new user |
| `POST` | `/api/auth/login` | — | Login, returns JWT |

### Profile (`/api/profile`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/profile` | ✅ | Get current user's profile |
| `PUT` | `/api/profile` | ✅ | Update name, bio, avatar |

### Recipes (`/api/recipes`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/recipes` | ✅ | List all recipes |
| `GET` | `/api/recipes/:id` | ✅ | Get single recipe |

### Meal Plans (`/api/mealplans`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/mealplans` | ✅ | Get meal plan |
| `POST` | `/api/mealplans` | ✅ | Add a meal slot |
| `DELETE` | `/api/mealplans/:id` | ✅ | Remove a meal slot |

### Shopping (`/api/shopping`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/shopping` | ✅ | Get shopping list |
| `POST` | `/api/shopping` | ✅ | Add item |
| `PATCH` | `/api/shopping/:id` | ✅ | Toggle checked |
| `DELETE` | `/api/shopping/:id` | ✅ | Remove item |
| `DELETE` | `/api/shopping/clear/completed` | ✅ | Clear checked items |

### Notifications (`/api/notifications`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/notifications` | ✅ | Get all notifications |
| `PATCH` | `/api/notifications/:id/read` | ✅ | Mark as read |
| `PATCH` | `/api/notifications/read-all` | ✅ | Mark all as read |

---

## 🧩 Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.x | UI rendering |
| TypeScript | 5.8 | Type safety |
| TanStack Router | 1.x | File-based routing + SSR |
| TanStack Query | 5.x | Server state management |
| Zustand | 5.x | Global client state |
| TailwindCSS | 4.x | Utility-first CSS |
| shadcn/ui + Radix | Latest | Accessible component primitives |
| Lucide React | 0.575 | Icon library |
| Vite | 8.x | Build tool & dev server |
| Zod | 3.x | Schema validation |
| React Hook Form | 7.x | Form state management |
| Sonner | 2.x | Toast notifications |
| date-fns | 4.x | Date formatting |
| Recharts | 2.x | Charts |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 20+ | JavaScript runtime |
| Express | 4.x | Web framework |
| mssql | 10.x | SQL Server driver |
| jsonwebtoken | 9.x | JWT auth tokens |
| bcryptjs | 2.x | Password hashing |
| multer | 1.x | File uploads |
| nodemailer | 6.x | Email notifications |
| dotenv | 16.x | Environment variables |
| cors | 2.x | CORS handling |

---

## 📖 How to Use the App

### First Time Setup
1. Open the app at `http://localhost:3000`
2. Complete the **4-step onboarding** by swiping through the intro screens
3. **Sign Up** with your name, email, and a strong password
4. **Login** — check **Remember Me** to save credentials for next time

### Discovering Recipes
- **Home** → Browse the hero carousel and trending recipes
- **Search** → Type any ingredient, cuisine, or dish name
- **Categories** → Tap a cuisine card to explore all recipes in that category
- **Regions** → Explore dishes from different world regions

### Meal Planning
1. Go to **Meal Planner** (calendar icon in bottom bar)
2. Tap **+ Add** on any meal slot (Breakfast / Lunch / Dinner / Dessert)
3. Search for a recipe in the dialog and tap to assign
4. Your daily calorie total is calculated automatically

### Shopping
1. Navigate to **Shopping List** (cart icon)
2. Add items manually with **+ Add Item**
3. Check off items as you shop
4. Tap **Clear Completed** when done

### Managing Your Profile
1. Open the **side drawer** (hamburger icon) → **Profile**
2. Tap the **pencil icon** to edit name, bio, and photo
3. Tap the **share icon** to share your profile link

### Customizing Settings
- Open **Drawer** → **Settings**
- Choose dietary preferences
- Configure notification types
- Toggle **Light / Dark mode**

---

## 🤝 Contributing

1. **Fork** the repository
2. Create a branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

### Commit Conventions

| Prefix | Use For |
|--------|---------|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation |
| `style:` | CSS/formatting |
| `refactor:` | Code restructuring |
| `chore:` | Build, deps, config |

---

## 📄 License

```
MIT License

Copyright (c) Flavorly---2026 AnasQ2003

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 👨‍💻 Author

**Anas Ahmed Qureshi.** — [@AnasQ2003](https://github.com/AnasQ2003)

---

<div align="center">
  <p>Built with ❤️ by <strong>Anas</strong></p>
  
 <div align="center">

Made with 🔥 and a lot of ☕

**⭐ If you found this useful, please star the repository!**

</div>
