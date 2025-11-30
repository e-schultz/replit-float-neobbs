import { LogEntry, FileEntry, MessageEntry } from "@/types/terminal";

export const INITIAL_LOGS: LogEntry[] = [
  { id: "1", timestamp: "09:42:15", level: "SYSTEM", message: "Connection established to FLOAT_CORE" },
  { id: "2", timestamp: "09:42:18", level: "INFO", message: "User authentication verified: GUEST_ACCESS" },
  { id: "3", timestamp: "09:43:05", level: "WARN", message: "Latency spike detected in sector 7G" },
  { id: "4", timestamp: "09:45:00", level: "INFO", message: "Background tasks synchronized" },
];

export const INITIAL_CONTEXT_STREAM: string[] = [];

export const FILES: FileEntry[] = [
  { 
    id: "1", 
    name: "welcome.txt", 
    type: "file", 
    size: "2KB", 
    date: "2025-11-28",
    preview: "WELCOME TO FLOAT BBS - SYSTEM RULES",
    content: "WELCOME TO FLOAT BBS\n\nThis system is a living archive of the void. \n\nRules:\n1. Observe protocol.\n2. Do not feed the glitches.\n3. Encryption keys rotate hourly.\n\nEnjoy your stay."
  },
  { 
    id: "2", 
    name: "manifesto.md", 
    type: "file", 
    size: "14KB", 
    date: "2025-11-20",
    preview: "# THE HOLDING ARCHITECTURE",
    content: "# THE HOLDING ARCHITECTURE\n\nWe are not building a platform. We are building a place.\n\nThe void is not empty. It is heavy with care.\n\nWhat falls into the void does not disappear.\nWhat falls into the void is held."
  },
  {
    id: "99",
    name: "canvas-99-lore.md",
    type: "file",
    size: "86KB",
    date: "2025-11-29",
    preview: "Subject: The Goat Incident (Classified)",
    content: "# THE GOAT INCIDENT [CLASSIFIED]\n\nDate: 2025-11-28\nObserver: Sysop\n\nSummary:\nA digital entity resembling a goat breached the containment protocols of Sector 4. Instead of deletion, the entity began consuming glitch artifacts and converting them into valid lore fragments.\n\nSignificance:\nThis suggests the void is capable of spontaneous generation of benevolent fauna. We are calling it 'The Cleaner'. Do not interfere with its grazing patterns."
  },
  {
    id: "101",
    name: "record-shop-arch.md",
    type: "file",
    size: "12KB",
    date: "2025-11-29",
    preview: "float.dispatch - The Record Shop Architecture",
    content: "# float.dispatch - The Record Shop Architecture\n\n**ctx:: 2025-11-29 @ 17:01PM**\n**project:: float/techcraft/active-context-redesign**\n\n## The Metaphor\n\nThe team runs a record shop.\n\n**Karen works the front desk.** She’s got the headset on... She knows the *inventory*. She knows where everything *is*. \n\n**Evna’s in the back room.** Past the beaded curtain... She looks up when you come in: “Oh, you’re into that? Okay, so—” and then she’s off.\n\n**Karen knows where things ARE.**\n**Evna knows where things CONNECT.**\n\n## The Manifest / Passenger List Doctrine\n\nKaren doesn’t just know the flight is booked. She knows *who’s on it*.\n\nThe Passenger List Doctrine: **Not just that the work was done, but seeing the result.**\n\n## Summaries Tailored to Context\n\nThe preview text isn’t just truncated content—it’s *Karen’s read* on what matters. If you’ve been deep in pharmacy work all morning, she surfaces the pharmacy-adjacent stuff first."
  },
  {
    id: "102",
    name: "active-context-proto.md",
    type: "file",
    size: "15KB",
    date: "2025-11-29",
    preview: "Active Context Protocol - Mirror Anchor Scaffold v1.0",
    content: "# float.dispatch // Active Context Protocol\n\n**Mirror Anchor Scaffold v1.0**\n\n## §1 The Metaphor: The Record Shop\n\n### Karen @ Front of House (Ingest/Interface)\nROLE: Public-facing I/O, gatekeeper for inbound rituals\nFUNCTION: inventory.know(), manifest.track(), preview.generate()\n\n### Evna @ Back of House (Archival/Orchestration)\nROLE: Backend daemon, slotting fresh context into active streams\nFUNCTION: connections.find(), archaeology.run(), patterns.surface()\n\n## §2 The Chirp vs The Request\n\n### Chirp (Low-Friction Capture)\n- Stream of consciousness\n- Markers present (ctx::, project::, mode::)\n- No response expected\n\n### Request (Formal Query)\n- Explicit ask\n- Expects shaped response\n\n## §3 Dual-Write Strategy\nEvery chirp triggers two simultaneous writes:\n1. Raw Stream (Full Context Log)\n2. Compressed Stream (FreakAST + Summary)\n"
  },
  { id: "3", name: "archives", type: "folder", date: "2025-10-15" },
  { id: "4", name: "projects", type: "folder", date: "2025-11-01" },
  { id: "5", name: "sysops_private", type: "folder", locked: true, date: "2025-11-28" },
  { id: "6", name: "glitch_logs.dat", type: "file", size: "45MB", date: "2025-11-27", locked: true },
];

export const MESSAGES: MessageEntry[] = [
  {
    id: "1",
    from: "SYSOP",
    subject: "Welcome to the Void",
    date: "2025-11-29",
    unread: true,
    content: "Welcome traveler. You have successfully connected to the Float BBS node. Please familiarize yourself with the local commands."
  },
  {
    id: "2",
    from: "The_Cleaner",
    subject: "Bleat.",
    date: "2025-11-28",
    unread: true,
    content: "*chewing sounds* ... [Attachment: glitch_fragment_04.dat]"
  },
  {
    id: "3",
    from: "Karen_FrontDesk",
    subject: "Manifest Update: HEIC Support",
    date: "2025-11-29",
    unread: false,
    content: "PR #573 merged. Client-side conversion enabled. No backend changes required. Passenger list updated."
  },
  {
    id: "4",
    from: "Evna_BackRoom",
    subject: "RE: Switch Navigation Issues",
    date: "2025-11-29",
    unread: false,
    content: "I found a connection between your current switch issue and Issue #551 from October. The state management refactor touched this code path. Check the NodeStateManager git history."
  }
];

export const COMMANDS = ["help", "clear", "files", "status", "feed", "login", "echo", "open", "inbox", "post", "read", "ctx::"];
