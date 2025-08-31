import { pgTable, text, timestamp, uuid, integer, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

import type { InferInsertModel } from 'drizzle-orm';


// Enums
export const subscriptionTier = pgEnum('subscription_tier', ['free', 'hatchling', 'homesteader', 'pro']);
export const chickenStatus = pgEnum('chicken_status', ['active', 'culled', 'sold', 'deceased']);

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  subscriptionTier: subscriptionTier('subscription_tier').default('free'),
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Blueprints Table
export const blueprints = pgTable('blueprints', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  data: jsonb('data').notNull(),
  isPublic: boolean('is_public').default(false),
  userId: uuid('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Flocks Table
export const flocks = pgTable('flocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  location: text('location'),
  userId: uuid('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Chickens Table
export const chickens = pgTable('chickens', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  breed: text('breed'),
  hatchDate: timestamp('hatch_date'),
  status: chickenStatus('status').default('active'),
  flockId: uuid('flock_id').references(() => flocks.id),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Egg Logs Table
export const eggLogs = pgTable('egg_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: timestamp('date').notNull(),
  count: integer('count').notNull(),
  notes: text('notes'),
  flockId: uuid('flock_id').references(() => flocks.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Feed Logs Table
export const feedLogs = pgTable('feed_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: timestamp('date').notNull(),
  feedType: text('feed_type').notNull(),
  amount: text('amount').notNull(),
  cost: integer('cost'),
  notes: text('notes'),
  flockId: uuid('flock_id').references(() => flocks.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Health Records Table
export const healthRecords = pgTable('health_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: text('type').notNull(),
  date: timestamp('date').notNull(),
  description: text('description').notNull(),
  treatment: text('treatment'),
  cost: integer('cost'),
  notes: text('notes'),
  chickenId: uuid('chicken_id').references(() => chickens.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Types
export const insertUserSchema = createInsertSchema(users);
export type NewUser = InferInsertModel<typeof users>;

export const insertBlueprintSchema = createInsertSchema(blueprints);
export type NewBlueprint = InferInsertModel<typeof blueprints>;

export const insertFlockSchema = createInsertSchema(flocks);
export type NewFlock = InferInsertModel<typeof flocks>;

export const insertChickenSchema = createInsertSchema(chickens);
export type NewChicken = InferInsertModel<typeof chickens>;

export const insertEggLogSchema = createInsertSchema(eggLogs);
export type NewEggLog = InferInsertModel<typeof eggLogs>;

export const insertFeedLogSchema = createInsertSchema(feedLogs);
export type NewFeedLog = InferInsertModel<typeof feedLogs>;

export const insertHealthRecordSchema = createInsertSchema(healthRecords);
export type NewHealthRecord = InferInsertModel<typeof healthRecords>;