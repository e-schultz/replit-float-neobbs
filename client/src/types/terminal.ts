export interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "SYSTEM";
  message: string;
}

export interface FileEntry {
  id: string;
  name: string;
  type: "file" | "folder" | "link";
  locked?: boolean;
  size?: string;
  date: string;
  content?: string;
  preview?: string;
}

export interface MessageEntry {
  id: string;
  from: string;
  subject: string;
  date: string;
  unread: boolean;
  content: string;
}
