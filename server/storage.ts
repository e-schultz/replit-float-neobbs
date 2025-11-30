import { 
  type User, 
  type InsertUser,
  type Log,
  type InsertLog,
  type ContextChirp,
  type InsertContextChirp,
  type File,
  type InsertFile,
  type Message,
  type InsertMessage,
  type Post,
  type InsertPost,
  users,
  logs,
  contextChirps,
  files,
  messages,
  posts
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Logs
  getLogs(limit?: number): Promise<Log[]>;
  createLog(log: InsertLog): Promise<Log>;

  // Context Chirps
  getContextChirps(limit?: number): Promise<ContextChirp[]>;
  createContextChirp(chirp: InsertContextChirp): Promise<ContextChirp>;

  // Files
  getFiles(): Promise<File[]>;
  getFile(id: number): Promise<File | undefined>;
  getFileByName(name: string): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;

  // Messages
  getMessages(): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<void>;

  // Posts
  getPosts(limit?: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Logs
  async getLogs(limit: number = 50): Promise<Log[]> {
    return db.select().from(logs).orderBy(desc(logs.timestamp)).limit(limit);
  }

  async createLog(log: InsertLog): Promise<Log> {
    const [newLog] = await db
      .insert(logs)
      .values(log)
      .returning();
    return newLog;
  }

  // Context Chirps
  async getContextChirps(limit: number = 20): Promise<ContextChirp[]> {
    return db.select().from(contextChirps).orderBy(desc(contextChirps.timestamp)).limit(limit);
  }

  async createContextChirp(chirp: InsertContextChirp): Promise<ContextChirp> {
    const [newChirp] = await db
      .insert(contextChirps)
      .values(chirp)
      .returning();
    return newChirp;
  }

  // Files
  async getFiles(): Promise<File[]> {
    return db.select().from(files);
  }

  async getFile(id: number): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file || undefined;
  }

  async getFileByName(name: string): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.name, name));
    return file || undefined;
  }

  async createFile(file: InsertFile): Promise<File> {
    const [newFile] = await db
      .insert(files)
      .values(file)
      .returning();
    return newFile;
  }

  // Messages
  async getMessages(): Promise<Message[]> {
    return db.select().from(messages).orderBy(desc(messages.id));
  }

  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message || undefined;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<void> {
    await db
      .update(messages)
      .set({ unread: false })
      .where(eq(messages.id, id));
  }

  // Posts
  async getPosts(limit: number = 50): Promise<Post[]> {
    return db.select().from(posts).orderBy(desc(posts.timestamp)).limit(limit);
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db
      .insert(posts)
      .values(post)
      .returning();
    return newPost;
  }
}

export const storage = new DatabaseStorage();
