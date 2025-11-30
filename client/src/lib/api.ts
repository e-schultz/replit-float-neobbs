import type { Log, File, Message, Post, ContextChirp } from "@/types/terminal";

const API_BASE = "/api";

// Logs
export async function fetchLogs(limit: number = 50): Promise<Log[]> {
  const response = await fetch(`${API_BASE}/logs?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch logs");
  return response.json();
}

export async function createLog(level: string, message: string): Promise<Log> {
  const response = await fetch(`${API_BASE}/logs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ level, message }),
  });
  if (!response.ok) throw new Error("Failed to create log");
  return response.json();
}

// Context Chirps
export async function fetchContextChirps(limit: number = 20): Promise<ContextChirp[]> {
  const response = await fetch(`${API_BASE}/context-chirps?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch context chirps");
  return response.json();
}

export async function createContextChirp(action: string): Promise<ContextChirp> {
  const response = await fetch(`${API_BASE}/context-chirps`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  if (!response.ok) throw new Error("Failed to create context chirp");
  return response.json();
}

// Files
export async function fetchFiles(): Promise<File[]> {
  const response = await fetch(`${API_BASE}/files`);
  if (!response.ok) throw new Error("Failed to fetch files");
  return response.json();
}

export async function fetchFileByName(name: string): Promise<File> {
  const response = await fetch(`${API_BASE}/files/by-name/${name}`);
  if (!response.ok) throw new Error("Failed to fetch file");
  return response.json();
}

// Messages
export async function fetchMessages(): Promise<Message[]> {
  const response = await fetch(`${API_BASE}/messages`);
  if (!response.ok) throw new Error("Failed to fetch messages");
  return response.json();
}

export async function markMessageAsRead(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/messages/${id}/read`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("Failed to mark message as read");
}

// Posts
export async function fetchPosts(limit: number = 50): Promise<Post[]> {
  const response = await fetch(`${API_BASE}/posts?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
}

export async function createPost(content: string, isChirp: boolean): Promise<Post> {
  const response = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, isChirp }),
  });
  if (!response.ok) throw new Error("Failed to create post");
  return response.json();
}
