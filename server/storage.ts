import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";

const DEMO_STATE_FILE = path.join(process.cwd(), '.demo-state.json');

interface DemoState {
  treasuryBalance: string;
  lastUpdated: string;
  transactionCount: number;
}

function loadDemoState(): DemoState {
  try {
    if (fs.existsSync(DEMO_STATE_FILE)) {
      const data = fs.readFileSync(DEMO_STATE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('[DemoState] Could not load state, using defaults');
  }
  return { treasuryBalance: '0', lastUpdated: new Date().toISOString(), transactionCount: 0 };
}

function saveDemoState(state: DemoState): void {
  try {
    fs.writeFileSync(DEMO_STATE_FILE, JSON.stringify(state, null, 2));
    console.log('[DemoState] Saved state:', state);
  } catch (error) {
    console.error('[DemoState] Could not save state:', error);
  }
}

export function getDemoTreasuryBalance(): string {
  const state = loadDemoState();
  return state.treasuryBalance;
}

export function setDemoTreasuryBalance(balance: string): void {
  const state = loadDemoState();
  state.treasuryBalance = balance;
  state.lastUpdated = new Date().toISOString();
  saveDemoState(state);
}

export function incrementDemoTransactionCount(): number {
  const state = loadDemoState();
  state.transactionCount++;
  saveDemoState(state);
  return state.transactionCount;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
