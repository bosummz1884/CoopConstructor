# Project Homestead: Planning & Architecture (v2)

This document outlines the development plan, architecture, and data models for expanding the Chicken Coop Blueprint Generator into a full-featured Homesteading Platform. It has been updated to integrate with the existing project structure.

## 1. Project Philosophy & Architecture

-   **Existing Monorepo:** We will build upon the existing `client/`, `server/`, `shared/` monorepo structure.
-   **Database Integration:** The existing `server/storage.ts` in-memory storage will be replaced by a persistent database using the Drizzle ORM schema defined in `shared/schema.ts`. This is essential for storing user data.
-   **Frontend Organization:** To manage the growing complexity, we will introduce a **Feature-Sliced Design** pattern within the `client/src/` directory. New features (like Flock Management or Egg Tracking) will be organized into their own folders under `client/src/features/`.
-   **Routing:** The client-side routing in `client/src/App.tsx` will be expanded to include authenticated routes protected by a new authentication context. A main `AppLayout.tsx` will be created to provide a consistent UI (sidebar, header) for logged-in users.

## 2. Monorepo Structure (Updated)

This reflects your current structure with proposed additions for new features.

```
/
|── client/
|   ├── src/
|   |   ├── components/
|   |   |   ├── ui/         # (Existing UI components)
|   |   |   ├── CoopForm.tsx
|   |   |   └── ...
|   |   ├── features/       # (New) Organize by feature
|   |   |   ├── auth/
|   |   |   ├── dashboard/
|   |   |   └── flock-management/
|   |   ├── layouts/        # (New) For main app layout
|   |   |   └── AppLayout.tsx
|   |   ├── pages/
|   |   |   ├── Home.tsx
|   |   |   └── ... (New pages: Dashboard.tsx, FlockPage.tsx etc.)
|   |   ├── services/
|   |   |   └── api.ts      # Add new API functions here
|   |   ├── context/
|   |   |   ├── CoopContext.tsx
|   |   |   └── AuthContext.tsx # (New)
|   |   ├── App.tsx         # Update with new routes
|   |   └── main.tsx
|
|── server/
|   ├── services/
|   |   ├── blueprintGenerator.ts
|   |   └── ...
|   ├── index.ts
|   └── routes.ts         # Add new API endpoints here
|
|── shared/
|   ├── schema.ts         # Expand Drizzle schema here
|   └── types.ts          # Add new shared types here
|
`-- package.json
```

## 3. Core Data Models (Drizzle Schema)

We will expand your existing `shared/schema.ts` file to include all necessary models for the new features.

-   **`users`** (expand existing)
-   **`subscriptions`** (new)
-   **`flocks`** (new)
-   **`chickens`** (new)
-   **`eggLogs`** (new)
-   **`feedLogs`** (new)
-   **`healthRecords`** (new)

```typescript
// In shared/schema.ts

import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, pgEnum, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- Existing User Schema (Modified for email and subscription) ---
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password").notNull(), // Renamed for clarity
  subscriptionId: varchar("subscription_id").references(() => subscriptions.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- New Schemas ---
export const subscriptionTierEnum = pgEnum("subscription_tier", ['free', 'hatchling', 'homesteader', 'pro']);

export const subscriptions = pgTable("subscriptions", {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull().references(() => users.id),
    tier: subscriptionTierEnum("tier").default('free').notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    status: text("status"), // e.g., 'active', 'canceled'
});

export const flocks = pgTable("flocks", {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull().references(() => users.id),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chickenStatusEnum = pgEnum("chicken_status", ['active', 'culled', 'sold', 'deceased']);

export const chickens = pgTable("chickens", {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    flockId: varchar("flock_id").notNull().references(() => flocks.id),
    name: text("name").notNull(),
    breed: text("breed"),
    hatchDate: timestamp("hatch_date"),
    status: chickenStatusEnum("status").default('active').notNull(),
});

export const eggLogs = pgTable("egg_logs", {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull().references(() => users.id),
    date: timestamp("date").notNull(),
    quantity: integer("quantity").notNull(),
    notes: text("notes"),
});

// (Add FeedLogs, HealthRecords schemas here as well)
```

## 4. Phased Development Plan

The phased rollout remains the same, providing a clear path from MVP to a full-featured platform.

### **Phase 1: The Core Experience (MVP & "Hatchling" Tier)**

**Goal:** Integrate user accounts and provide essential daily tracking tools.
-   **Features:**
    1.  User Authentication (Sign Up, Login, Logout)
    2.  Flock Management (Create Flocks, Add/Edit/View Chickens)
    3.  Daily Egg Log & Tracker
    4.  Basic Health Records & Feed Log
    5.  Establish Authenticated App Layout (Sidebar Navigation)

### **Phase 2: The Homesteader's Toolkit ("Homesteader" Tier)**

**Goal:** Introduce paid subscriptions, data visualization, and the first AI tool.
-   **Features:**
    1.  Subscription & Payment Integration (Stripe)
    2.  Data & Analytics Dashboard
    3.  Flock Profitability Calculator
    4.  Premium Content Library
    5.  **AI Feature:** Chicken Symptom Checker (Beta)

### **Phase 3: Automation & Pro-Level Tools ("Pro" Tier)**

**Goal:** Add advanced AI, automation, and expand the platform's scope.
-   **Features:**
    1.  Task Automation & Reminders
    2.  **AI Feature:** Feed Formulation Optimizer
    3.  **AI Feature:** Advanced Egg Production Analysis
    4.  Multi-Species Expansion (Data models and UI for Goats, etc.)

This plan provides the blueprint for evolving your application. Next is the `tasks.md` file, which breaks down the specific steps for **Phase 1**.                                                                                                                                                        