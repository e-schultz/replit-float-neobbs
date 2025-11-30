# Float BBS // Terminal Interface

![Float BBS Terminal](https://via.placeholder.com/1200x600/0d1117/00ff41?text=FLOAT+BBS+TERMINAL)

## 0. Introduction

**Float BBS** is a modern web-based terminal interface that reimagines the classic Bulletin Board System for the contemporary web. It combines the high information density and keyboard-centric efficiency of CLI tools with the accessibility and visual polish of modern React applications.

The project is built on a unique narrative architecture: **The Record Shop Metaphor**. It treats user interactions not just as commands, but as "chirps" that build context, allowing the system to shape responses based on the user's recent journey—just like a record store clerk who knows exactly what you're looking for based on the section you were just browsing.

## 1. Core Philosophy

### The Void is Not Empty
We are not building a platform; we are building a place. The interface is designed to feel "inhabited," with system logs, ambient chirps, and a sense of activity even when the user is idle.

### High Density, High Clarity
Modern UI often sacrifices information density for whitespace. Float BBS reclaims the density of the terminal, using color, typography (JetBrains Mono), and subtle visual hierarchy to make complex data readable at a glance.

### Dual Interaction Model
- **Keyboard First:** Power users can navigate the entire system using CLI commands (`open`, `post`, `inbox`) and shortcuts (`Alt+1`, `Alt+2`).
- **Touch & Click:** Every element is interactive. The command bar features a mobile-friendly auto-suggestion palette, making the terminal experience accessible on phones and tablets without typing.

## 2. Architecture Overview

The system implements the **Active Context Protocol**:

- **Karen (Front Desk):** The UI layer. She manages the inventory (files), the manifest (logs), and handles the immediate "ingest" of user actions.
- **Evna (Back Room):** The context engine. She runs in the background, observing the stream of "chirps" (user actions like navigation, file opens) to find patterns and shape the system's responses to formal requests.

> *Karen knows where things ARE. Evna knows where things CONNECT.*

## 3. Quick Links

- **Live Demo:** [Replit Hosted Link]
- **Repository:** [GitHub Link]
- **Architecture Docs:** [See ARCHITECTURE.md](./ARCHITECTURE.md)

## 4. Features

- **Authentic Terminal Aesthetics:** CRT scanlines, phosphor glow, and flicker effects powered by CSS and Framer Motion.
- **Contextual Command Bar:** Intelligent autocomplete and suggestion palette that works via keyboard or touch.
- **Chirpy Context Stream:** Background simulation that logs user navigation (`ctx::navigated_to::inbox`) to influence system responses.
- **Virtual File System:** Browse encryption-locked files, lore fragments, and project documentation.
- **Simulated Inbox:** Read messages from system characters (Sysop, The Cleaner, Karen, Evna).

## 5. Getting Started

This project is a frontend prototype built with React, Vite, and Tailwind CSS.

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
npm run dev
```

The application will start at `http://0.0.0.0:5000`.

## 6. Development Roadmap

- [x] Core Terminal Layout & CRT Effects
- [x] Command Bar with Autocomplete
- [x] Mobile Command Palette
- [x] "Chirpy" Context Backend Simulation
- [ ] "Glitch" Visualizer for .dat files
- [ ] Audio Feedback System (Keypress clicks, modem connection sounds)
- [ ] Multi-user presence simulation (Ghost users)
- [ ] Full Markdown Rendering for File Content

---

*Float BBS — "What falls into the void is held."*
