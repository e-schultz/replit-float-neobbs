export interface LogEntry {
  id: number;
  timestamp: Date;
  level: string;
  message: string;
}

export interface FileEntry {
  id: number;
  name: string;
  type: string;
  locked: boolean | null;
  size: string | null;
  date: string;
  content: string | null;
  preview: string | null;
}

export interface MessageEntry {
  id: number;
  from: string;
  subject: string;
  date: string;
  unread: boolean | null;
  content: string;
}

export interface PostEntry {
  id: number;
  content: string;
  isChirp: boolean | null;
  timestamp: Date;
}

export interface ContextChirpEntry {
  id: number;
  action: string;
  timestamp: Date;
}

// Type aliases for API compatibility
export type Log = LogEntry;
export type File = FileEntry;
export type Message = MessageEntry;
export type Post = PostEntry;
export type ContextChirp = ContextChirpEntry;
