# Architecture & Technical Specification

## 1. Technical Stack

- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS (Utility-first)
- **Animation:** Framer Motion (Complex UI transitions)
- **Icons:** Lucide React
- **Typography:** JetBrains Mono (Primary), Share Tech Mono (Headers)
- **State Management:** React Context + Local State (Prototype Phase)

## 2. Component Structure

The application follows a layout-based architecture centered around the `TerminalLayout`.

```
client/src/
├── components/
│   ├── layout/
│   │   └── terminal-layout.tsx  # CRT effects, grid background, responsive wrapper
│   ├── terminal/
│   │   ├── command-bar.tsx      # Input handling, autocomplete, suggestion palette
│   │   ├── status-panel.tsx     # Sidebar with system stats (uptime, memory, etc.)
│   │   ├── post-editor.tsx      # Modal for composing requests/chirps
│   │   └── ascii-header.tsx     # Responsive ASCII art branding
│   └── ui/                      # Reusable atomic components (Tabs, ScrollArea, etc.)
├── pages/
│   └── home.tsx                 # Main controller, holds state for Logs, Files, Context
└── data/
    └── mock-data.ts             # Static data definitions for the simulation
```

## 3. The Active Context Protocol

The core logic that differentiates Float BBS from a standard static site is the **Active Context Protocol**, implemented via the "Chirpy Context Stream".

### 3.1. The Actors

1.  **The User:** Interacts via clicks, taps, or text commands.
2.  **Karen (The Interface):** Immediate feedback. Updates the DOM, shows toasts, switches tabs.
3.  **Evna (The Simulation):** Asynchronous logic. Observes the user's actions and "injects" meaning.

### 3.2. The Chirp Stream (`contextStream`)

Every significant interaction generates a "Chirp" string stored in a rolling array:

```typescript
// Format: ctx::{action} @ {timestamp}
"ctx::navigated_to::inbox @ 10:42:05"
"ctx::opened::file(manifesto.md) @ 10:42:15"
"ctx::exec::status @ 10:42:30"
```

### 3.3. Request Shaping

When a user submits a formal request (via the Post Editor), the system does not just send the text. It bundles the recent `contextStream`.

*Logic Flow:*
1.  User submits "What is the status?"
2.  `handlePostSubmit` captures the text.
3.  System checks `contextStream`.
4.  If user recently viewed `manifesto.md`, Evna might append a note about that file to the simulated response.
5.  Response is logged to the main feed.

## 4. Design System

### Color Palette
- **Matrix Green:** `#00FF41` (Primary, Success, Active)
- **Amber Alert:** `#FF6B35` (Secondary, Warnings, Inbox)
- **Terminal Black:** `#0D1117` (Background)
- **Muted Grey:** `#888888` (Inactive, Timestamps)

### Visual Effects
- **Scanlines:** A CSS overlay with repeating linear gradients and pointer-events: none.
- **Glow:** Text shadows (`text-shadow: 0 0 10px currentColor`) applied to active elements.
- **Flicker:** Subtle keyframe animations on the main container to simulate CRT instability.

## 5. Data Model

Currently, the system runs on `mock-data.ts`.

- **LogEntry:** System events displayed in the main feed.
- **FileEntry:** Virtual files with permission bits (`locked: boolean`).
- **MessageEntry:** Email-like objects for the Inbox.

## 6. Future Scalability

To graduate from Mockup to Full-Stack:
1.  **Persistence:** Move `logs` and `contextStream` to a Postgres database.
2.  **Auth:** Implement real user sessions using the existing Passport scaffolding.
3.  **Real-time:** Use WebSockets (`ws`) to push "glitch" events and messages from other users live.
4.  **LLM Integration:** Replace the random `Evna` responses with an actual LLM call that takes the `contextStream` as the system prompt to generate context-aware replies.
