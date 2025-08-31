import { type NewUser, users } from "@shared/schema";
import type { InferSelectModel } from 'drizzle-orm';
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<InferSelectModel<typeof users> | undefined>;
  getUserByUsername(username: string): Promise<InferSelectModel<typeof users> | undefined>;
  createUser(user: NewUser): Promise<InferSelectModel<typeof users>>;
}

export class MemStorage implements IStorage {
  private users: Map<string, InferSelectModel<typeof users>>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<InferSelectModel<typeof users> | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(email: string): Promise<InferSelectModel<typeof users> | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: NewUser): Promise<InferSelectModel<typeof users>> {
    const id = randomUUID();
    const user: InferSelectModel<typeof users> = { 
      ...insertUser, 
      id, 
      subscriptionTier: insertUser.subscriptionTier ?? 'free',  // Provide default 'free' if undefined
      stripeCustomerId: insertUser.stripeCustomerId ?? null,    // Ensure null if undefined
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
