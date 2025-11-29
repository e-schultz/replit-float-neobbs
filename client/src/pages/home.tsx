import React, { useState, useEffect } from "react";
import { TerminalLayout } from "@/components/layout/terminal-layout";
import { CommandBar } from "@/components/terminal/command-bar";
import { StatusPanel } from "@/components/terminal/status-panel";
import { AsciiHeader } from "@/components/terminal/ascii-header";
import { TerminalText } from "@/components/ui/terminal-text";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Folder, Lock, AlertTriangle, X, Maximize2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mock Data Types
interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "SYSTEM";
  message: string;
}

interface FileEntry {
  id: string;
  name: string;
  type: "file" | "folder" | "link";
  locked?: boolean;
  size?: string;
  date: string;
  content?: string;
}

// Mock Data
const INITIAL_LOGS: LogEntry[] = [
  { id: "1", timestamp: "09:42:15", level: "SYSTEM", message: "Connection established to FLOAT_CORE" },
  { id: "2", timestamp: "09:42:18", level: "INFO", message: "User authentication verified: GUEST_ACCESS" },
  { id: "3", timestamp: "09:43:05", level: "WARN", message: "Latency spike detected in sector 7G" },
  { id: "4", timestamp: "09:45:00", level: "INFO", message: "Background tasks synchronized" },
];

const FILES: FileEntry[] = [
  { 
    id: "1", 
    name: "welcome.txt", 
    type: "file", 
    size: "2KB", 
    date: "2025-11-28",
    content: "WELCOME TO FLOAT BBS\n\nThis system is a living archive of the void. \n\nRules:\n1. Observe protocol.\n2. Do not feed the glitches.\n3. Encryption keys rotate hourly.\n\nEnjoy your stay."
  },
  { 
    id: "2", 
    name: "manifesto.md", 
    type: "file", 
    size: "14KB", 
    date: "2025-11-20",
    content: "# THE HOLDING ARCHITECTURE\n\nWe are not building a platform. We are building a place.\n\nThe void is not empty. It is heavy with care.\n\nWhat falls into the void does not disappear.\nWhat falls into the void is held."
  },
  { id: "3", name: "archives", type: "folder", date: "2025-10-15" },
  { id: "4", name: "projects", type: "folder", date: "2025-11-01" },
  { id: "5", name: "sysops_private", type: "folder", locked: true, date: "2025-11-28" },
  { id: "6", name: "glitch_logs.dat", type: "file", size: "45MB", date: "2025-11-27", locked: true },
];

const COMMANDS = ["help", "clear", "files", "status", "feed", "login", "echo", "open"];

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [activeTab, setActiveTab] = useState<"feed" | "files">("feed");
  const [viewingFile, setViewingFile] = useState<FileEntry | null>(null);
  const { toast } = useToast();

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "1") setActiveTab("feed");
      if (e.altKey && e.key === "2") setActiveTab("files");
      if (e.key === "Escape" && viewingFile) setViewingFile(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewingFile]);

  // Live Logs Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const messages = [
          "Packet intercepted from external node",
          "Memory heap optimization complete",
          "Scanning frequency range 20-20000Hz",
          "User query processing...",
          "Cache invalidated",
          "Re-indexing sector 4"
        ];
        const newLog: LogEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          level: "INFO",
          message: messages[Math.floor(Math.random() * messages.length)]
        };
        setLogs(prev => [newLog, ...prev].slice(0, 50));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleFileClick = (file: FileEntry) => {
    if (file.locked) {
      toast({
        title: "Access Denied",
        description: "Encrypted file. Decryption key required.",
        variant: "destructive",
      });
      return;
    }
    if (file.type === "folder") {
      toast({
        title: "Directory Navigation",
        description: `Entering ${file.name}... (Mock: Empty directory)`,
      });
      return;
    }
    setViewingFile(file);
  };

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");
    
    const addLog = (msg: string, level: LogEntry["level"] = "SYSTEM") => {
      setLogs(prev => [{
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        level,
        message: msg
      }, ...prev]);
    };

    addLog(`> ${cmd}`);

    switch (command) {
      case "help":
        addLog("Available commands: help, clear, files, status, feed, open [filename], echo [msg]");
        break;
      case "clear":
        setLogs([]);
        break;
      case "files":
      case "ls":
        setActiveTab("files");
        addLog("Listing directory contents...");
        break;
      case "status":
      case "feed":
        setActiveTab("feed");
        addLog("Switched to System Feed");
        break;
      case "open":
        if (!args) {
          addLog("Usage: open [filename]", "WARN");
        } else {
          const file = FILES.find(f => f.name.toLowerCase() === args.toLowerCase());
          if (file) {
            handleFileClick(file);
            addLog(`Opening ${file.name}...`);
          } else {
            addLog(`File not found: ${args}`, "ERROR");
          }
        }
        break;
      case "echo":
        addLog(args, "INFO");
        break;
      default:
        addLog(`Unknown command: ${command}`, "ERROR");
        toast({
          title: "Error",
          description: "Command not recognized",
          variant: "destructive",
        });
    }
  };

  return (
    <TerminalLayout className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 h-screen max-h-screen overflow-hidden">
      
      {/* Main Content Column */}
      <div className="flex flex-col h-full overflow-hidden relative">
        <AsciiHeader />

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mb-4 border-b border-border pb-2 shrink-0">
          <TabButton active={activeTab === "feed"} onClick={() => setActiveTab("feed")}>
            LIVE_FEED <span className="text-[10px] text-muted-foreground ml-1 font-normal">[ALT+1]</span>
          </TabButton>
          <TabButton active={activeTab === "files"} onClick={() => setActiveTab("files")}>
            DIRECTORY <span className="text-[10px] text-muted-foreground ml-1 font-normal">[ALT+2]</span>
          </TabButton>
          <TabButton active={false} onClick={() => toast({ title: "Access Denied", description: "You do not have clearance for this sector." })}>
            RESTRICTED
          </TabButton>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 relative bg-card/20 border border-border/50 backdrop-blur-sm overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-2 opacity-50 pointer-events-none">
            <div className="w-3 h-3 bg-primary animate-pulse rounded-full" />
          </div>

          {activeTab === "feed" && (
            <ScrollArea className="flex-1 p-4 font-mono text-sm md:text-base">
              <div className="space-y-2">
                <div className="mb-6 border border-dashed border-secondary/50 p-4 bg-secondary/5">
                  <h3 className="text-secondary font-bold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> MESSAGE OF THE DAY
                  </h3>
                  <TerminalText speed={20} className="text-secondary-foreground">
                    Welcome to the float. This is your home now. Things are beautifully chaotic here.
                    We build things, we break things, we reclaim things.
                  </TerminalText>
                </div>

                <AnimatePresence initial={false}>
                  {logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3 group hover:bg-white/5 p-1 rounded transition-colors"
                    >
                      <span className="text-muted-foreground shrink-0 text-xs mt-1 select-none">
                        [{log.timestamp}]
                      </span>
                      <span className={cn(
                        "text-xs font-bold px-1 rounded shrink-0 w-16 text-center select-none mt-0.5",
                        log.level === "INFO" && "bg-primary/20 text-primary",
                        log.level === "WARN" && "bg-secondary/20 text-secondary",
                        log.level === "ERROR" && "bg-destructive/20 text-destructive",
                        log.level === "SYSTEM" && "bg-accent/20 text-accent",
                      )}>
                        {log.level}
                      </span>
                      <span className="break-all text-foreground/90">{log.message}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}

          {activeTab === "files" && (
            <ScrollArea className="flex-1 p-4 font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FILES.map((file) => (
                  <div 
                    key={file.id}
                    onClick={() => handleFileClick(file)}
                    className={cn(
                      "border border-border p-4 hover:bg-primary/5 hover:border-primary transition-all cursor-pointer group relative overflow-hidden",
                      file.locked && "opacity-60 hover:border-destructive hover:bg-destructive/5"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      {file.type === "folder" ? (
                        <Folder className={cn("w-8 h-8", file.locked ? "text-destructive" : "text-accent")} />
                      ) : (
                        <FileText className="w-8 h-8 text-primary" />
                      )}
                      {file.locked && <Lock className="w-4 h-4 text-destructive" />}
                    </div>
                    <div className="font-bold text-lg truncate mb-1 group-hover:text-primary transition-colors">
                      {file.name}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{file.date}</span>
                      {file.size && <span>{file.size}</span>}
                    </div>
                    
                    {/* Hover effect corner */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-transparent group-hover:border-r-primary transition-all duration-300" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <CommandBar onCommand={handleCommand} suggestions={COMMANDS} />
      </div>

      {/* Right Panel - Status */}
      <div className="hidden md:block h-full overflow-hidden">
        <StatusPanel />
      </div>

      {/* File Viewer Modal */}
      <AnimatePresence>
        {viewingFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-card border border-primary shadow-[0_0_30px_rgba(0,255,65,0.15)] relative flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between p-3 border-b border-primary/30 bg-primary/10">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="font-bold text-primary tracking-wider">{viewingFile.name.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={() => setViewingFile(null)} className="hover:text-primary hover:bg-primary/20 p-1 rounded transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewingFile(null)} className="hover:text-destructive hover:bg-destructive/20 p-1 rounded transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {viewingFile.content || "File content corrupted or empty."}
              </ScrollArea>

              <div className="p-2 border-t border-border text-xs text-muted-foreground flex justify-between bg-card/50">
                <span>SIZE: {viewingFile.size}</span>
                <span>ACCESS: READ-ONLY</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </TerminalLayout>
  );
}

const TabButton = ({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 text-sm font-bold border-t-2 transition-all relative overflow-hidden group",
      active 
        ? "border-primary text-primary bg-primary/10" 
        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5"
    )}
  >
    <span className="relative z-10">{children}</span>
    {active && (
      <motion.div 
        layoutId="activeTab"
        className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent z-0" 
      />
    )}
  </button>
);
