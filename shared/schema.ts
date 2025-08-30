import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, pgEnum, boolean, jsonb, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- Enums ---
export const subscriptionTierEnum = pgEnum("subscription_tier", ['free', 'hatchling', 'homesteader', 'pro']);
export const chickenStatusEnum = pgEnum("chicken_status", ['active', 'culled', 'sold', 'deceased']);

// --- Users ---
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  subscriptionTier: subscriptionTierEnum("subscription_tier").default('free').notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Blueprints ---
export const blueprints = pgTable("blueprints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  data: jsonb("data").notNull(), // Stores the entire CoopBlueprint object
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Flocks ---
export const flocks = pgTable("flocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Chickens ---
export const chickens = pgTable("chickens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  flockId: varchar("flock_id").notNull().references(() => flocks.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  breed: text("breed"),
  hatchDate: timestamp("hatch_date"),
  status: chickenStatusEnum("status").default('active').notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Egg Logs ---
export const eggLogs = pgTable("egg_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  flockId: varchar("flock_id").references(() => flocks.id, { onDelete: 'cascade' }),
  date: date("date").notNull(),
  count: integer("count").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Feed Logs ---
export const feedLogs = pgTable("feed_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  flockId: varchar("flock_id").references(() => flocks.id, { onDelete: 'cascade' }),
  date: date("date").notNull(),
  feedType: text("feed_type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(), // in kg or lbs
  cost: decimal("cost", { precision: 10, scale: 2 }), // in currency
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Health Records ---
export const healthRecords = pgTable("health_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  chickenId: varchar("chicken_id").references(() => chickens.id, { onDelete: 'cascade' }),
  date: date("date").notNull(),
  type: text("type").notNull(), // e.g., 'vaccination', 'injury', 'checkup'
  description: text("description").notNull(),
  treatment: text("treatment"),
  cost: decimal("cost", { precision: 10, scale: 2 }), // in currency
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Zod Schemas ---
// User
const baseUserSchema = {
  email: z.string().email(),
  passwordHash: z.string().min(8),
  subscriptionTier: z.enum(['free', 'hatchling', 'homesteader', 'pro']).default('free'),
};

export const insertUserSchema = createInsertSchema(users, {
  email: baseUserSchema.email,
  passwordHash: baseUserSchema.passwordHash,
  subscriptionTier: baseUserSchema.subscriptionTier,
}).omit({ id: true, createdAt: true, updatedAt: true });

// Blueprint
export const insertBlueprintSchema = createInsertSchema(blueprints, {
  name: z.string().min(1),
  data: z.record(z.any()),
}).omit({ id: true, userId: true, createdAt: true, updatedAt: true });

// Flock
export const insertFlockSchema = createInsertSchema(flocks, {
  name: z.string().min(1),
}).omit({ id: true, userId: true, createdAt: true, updatedAt: true });

// Chicken
export const insertChickenSchema = createInsertSchema(chickens, {
  name: z.string().min(1),
  status: z.enum(['active', 'culled', 'sold', 'deceased']).default('active'),
}).omit({ id: true, createdAt: true, updatedAt: true });

// Egg Log
export const insertEggLogSchema = createInsertSchema(eggLogs, {
  date: z.date(),
  count: z.number().int().positive(),
}).omit({ id: true, userId: true, createdAt: true });

// Feed Log
export const insertFeedLogSchema = createInsertSchema(feedLogs, {
  date: z.date(),
  feedType: z.string().min(1),
  amount: z.number().positive(),
  cost: z.number().nonnegative().optional(),
}).omit({ id: true, userId: true, createdAt: true });

// Health Record
export const insertHealthRecordSchema = createInsertSchema(healthRecords, {
  date: z.date(),
  type: z.string().min(1),
  description: z.string().min(1),
  cost: z.number().nonnegative().optional(),
}).omit({ id: true, userId: true, createdAt: true });

// --- Types ---
export type User = typeof users.$inferSelect;
export type NewUser = z.infer<typeof insertUserSchema>;

export type Blueprint = typeof blueprints.$inferSelect;
export type NewBlueprint = z.infer<typeof insertBlueprintSchema>;

export type Flock = typeof flocks.$inferSelect;
export type NewFlock = z.infer<typeof insertFlockSchema>;

export type Chicken = typeof chickens.$inferSelect;
export type NewChicken = z.infer<typeof insertChickenSchema>;

export type EggLog = typeof eggLogs.$inferSelect;
export type NewEggLog = z.infer<typeof insertEggLogSchema>;

export type FeedLog = typeof feedLogs.$inferSelect;
export type NewFeedLog = z.infer<typeof insertFeedLogSchema>;

export type HealthRecord = typeof healthRecords.$inferSelect;
export type NewHealthRecord = z.infer<typeof insertHealthRecordSchema>;
