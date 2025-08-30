Project Homestead: Comprehensive Development Tasks
This is the master task list for the entire Project Homestead application. It covers all phases, from initial setup to the most advanced features. Mark tasks as complete with [x] and date all additions/completions as per the AIGuide.md.

Phase 0: Foundation & Integration (Added: 2025-08-30)
Goal: Establish project documentation and integrate the existing blueprint generator into the new user account system.

[ ] Task 0.1: Create README.md file (Added: 2025-08-30)

Action: Create a README.md at the project root with sections for Project Title, Description, Tech Stack, and How to Run.

[ ] Task 0.2: Create blueprints Database Table (Added: 2025-08-30)

Action: In shared/schema.ts, add a new Drizzle schema for blueprints. It should link to a userId and store the entire CoopBlueprint object as a JSONB field.

Action: Generate and run the database migration.

[ ] Task 0.3: Secure the Blueprint Generator (Added: 2025-08-30)

Action: The existing /api/coop endpoint in server/routes.ts must be protected by the new authentication middleware.

Action: Modify the generateBlueprint service to save the generated blueprint to the new blueprints table, associating it with the logged-in user's ID.

[ ] Task 0.4: Update Frontend to Require Login (Added: 2025-08-30)

Action: The Home.tsx page, which contains the CoopForm, should now be a protected route. Unauthenticated users should be redirected to a new landing page or the login page.

Action: Create a user dashboard where they can see a list of their previously generated blueprints.

Phase 1: The Core Experience (MVP & "Hatchling" Tier)
Goal: Build the essential user account and daily data-tracking features.

1. Backend Setup & Authentication
[ ] Task 1.1: Update Database Schema (Added: 2025-08-30)

Action: In shared/schema.ts, add Drizzle schemas for users (updated), subscriptions, flocks, chickens, eggLogs, feedLogs, and healthRecords.

Action: Set up Drizzle Kit and generate the database migration. npx drizzle-kit generate:pg.

[ ] Task 1.2: Implement Authentication Endpoints (Added: 2025-08-30)

Action: In server/routes.ts, create new endpoints for user authentication (/register, /login, /logout, /me).

Action: Create server/middleware/auth.ts for JWT verification.

[ ] Task 1.3: Update Shared Types (Added: 2025-08-30)

Action: In shared/types.ts, add interfaces for RegisterUserDto and UserProfile.

2. Frontend Authentication & Layout
[ ] Task 2.1: Create Authentication Context (Added: 2025-08-30)

[ ] Task 2.2: Create Authenticated Layout (Added: 2025-08-30)

[ ] Task 2.3: Update Router for Protected Routes (Added: 2025-08-30)

[ ] Task 2.4: Build Auth Pages & Forms (Added: 2025-08-30)

3. Feature: Flock Management
[ ] Task 3.1: Create Flock Management Backend Endpoints (Added: 2025-08-30)

[ ] Task 3.2: Create Flock Management Frontend Module (Added: 2025-08-30)

4. Feature: Data Logging (Eggs, Feed, Health)
[ ] Task 4.1: Create Data Logging Backend Endpoints (Added: 2025-08-30)

Action: In server/routes.ts, add protected endpoints for egg-logs, feed-logs, and health-records. Each should support GET (with date filtering) and POST operations.

[ ] Task 4.2: Create Data Logging Frontend Modules (Added: 2025-08-30)

Action: Create feature directories for egg-tracker, feed-tracker, and health-tracker.

Action: Each feature should have its own hooks, components (forms, lists), and be integrated into the main user dashboard.

Phase 2: The Homesteader's Toolkit ("Homesteader" Tier)
Goal: Introduce premium features, data visualization, and AI-powered tools.

[ ] Task 2.1: Integrate Subscription Payments with Stripe (Added: 2025-08-30)

Stripe is a service for handling online payments. A "webhook" is a way for Stripe to send real-time notifications to our server, like when a payment succeeds.

Action (Backend): Set up the Stripe Node.js SDK. Create endpoints to manage subscriptions (/create-checkout-session, /manage-subscription). Create a webhook endpoint (/stripe-webhook) to listen for events from Stripe and update the subscriptions table in our database.

Action (Frontend): Create a PricingPage.tsx. Build UI elements that allow users to upgrade, downgrade, or cancel their subscriptions.

[ ] Task 2.2: Build Data & Analytics Dashboard (Added: 2025-08-30)

Action (Backend): Create new endpoints that aggregate data, e.g., /api/analytics/egg-production?range=30d or /api/analytics/feed-cost.

Action (Frontend): Use recharts (already in components/ui/chart.tsx) to create visual charts for egg production over time, feed costs, and other key metrics on the dashboard page.

[ ] Task 2.3: Build Flock Profitability Calculator (Added: 2025-08-30)

Action (Backend): Create a new service and endpoint /api/calculators/profitability that takes egg sales data and feed cost data to calculate net profit.

Action (Frontend): Create a new page/feature profit-calculator with a form for users to input revenue (e.g., price per dozen eggs) and view their flock's profitability over time.

[ ] Task 2.4: Build Premium Content Library (Added: 2025-08-30)

Action (Backend): Add a premiumContent table to shared/schema.ts (with fields like title, content, videoUrl, requiredTier). Create endpoints to serve this content only to users with the appropriate subscription tier.

Action (Frontend): Build a PremiumContentPage.tsx that displays available articles and videos, showing a paywall/upgrade prompt for locked content.

[ ] Task 2.5: (AI) Build Chicken Symptom Checker (Beta) (Added: 2025-08-30)

Action (Backend): Create an endpoint /api/ai/symptom-checker. This endpoint will take a user's description of chicken symptoms and use a Generative AI API call (with a carefully crafted system prompt) to provide potential diagnoses and care suggestions.

Action (Frontend): Create a simple UI where users can describe symptoms and see the AI-generated advice. Clearly label this feature as "Beta" and include a disclaimer.

Phase 3: Automation & Pro-Level Tools ("Pro" Tier)
Goal: Solidify the platform as an indispensable assistant with automation and advanced AI.

[ ] Task 3.1: Implement Task Automation & Reminders (Added: 2025-08-30)

A "cron job" is a task that our server runs on a schedule, like once a day.

Action (Backend): Add reminders table to the database. Create a service that can schedule reminders. Implement a daily cron job (using a library like node-cron) to check for upcoming reminders and send email notifications.

Action (Frontend): Create a RemindersPage.tsx where users can create and manage reminders for tasks like vaccinations, coop cleaning, and seasonal prep.

[ ] Task 3.2: (AI) Build Feed Formulation Optimizer (Added: 2025-08-30)

Action (Backend): Create an endpoint /api/ai/feed-optimizer. This will take user goals (e.g., "maximize egg production," "reduce cost") and available ingredients, and use an AI model to suggest an optimal feed mix based on known nutritional data.

Action (Frontend): Create a UI for the feed optimizer tool, allowing users to input their goals and ingredients.

[ ] Task 3.3: (AI) Build Egg Production Forecasting (Added: 2025-08-30)

Action (Backend): Create an endpoint /api/ai/egg-forecast. This service will analyze a user's historical egg log data, chicken breeds, and ages to forecast future egg production.

Action (Frontend): Display the forecast on the analytics dashboard with a clear chart.

[ ] Task 3.4: Implement Multi-Species Expansion (Added: 2025-08-30)

Action (Database): Refactor the database schema. Make flocks more generic (e.g., animal_groups) and create separate tables for different animal types (goats, rabbits) that share common fields.

Action (Frontend): Update the UI to allow users to add and manage different types of animals, not just chickens.

[ ] Task 3.5: Implement Advanced Data Exporting (Added: 2025-08-30)

Action (Backend): Create an endpoint /api/export/all-data. This service will query all of a user's data (flocks, logs, etc.) and compile it into a CSV file for download.

Action (Frontend): Add an "Export Data" button in the user's account settings page.