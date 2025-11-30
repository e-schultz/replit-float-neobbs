import React, { useState, useEffect } from "react";
import { TerminalLayout } from "@/components/layout/terminal-layout";
import { CommandBar } from "@/components/terminal/command-bar";
import { StatusPanel } from "@/components/terminal/status-panel";
import { AsciiHeader } from "@/components/terminal/ascii-header";
import { PostEditor } from "@/components/terminal/post-editor";
import { TerminalText } from "@/components/ui/terminal-text";
import { TabButton } from "@/components/ui/tab-button";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Folder, Lock, AlertTriangle, X, Inbox, Mail, MessageSquare, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { FileEntry, MessageEntry } from "@/types/terminal";
import { COMMANDS } from "@/data/mock-data";
import { useLogs, useFiles, useMessages, useCreateLog, useCreateContextChirp, useCreatePost, useMarkMessageAsRead, useContextChirps } from "@/hooks/use-terminal-data";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"feed" | "files" | "inbox">("feed");
  const [viewingFile, setViewingFile] = useState<FileEntry | null>(null);
  const [readingMessage, setReadingMessage] = useState<MessageEntry | null>(null);
  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
  const { toast } = useToast();

  // React Query hooks
  const { data: logs = [], isLoading: logsLoading } = useLogs();
  const { data: files = [], isLoading: filesLoading } = useFiles();
  const { data: messages = [], isLoading: messagesLoading } = useMessages();
  const { data: contextChirps = [] } = useContextChirps();
  const createLogMutation = useCreateLog();
  const createChirpMutation = useCreateContextChirp();
  const createPostMutation = useCreatePost();
  const markAsReadMutation = useMarkMessageAsRead();

  // Helper to log user actions as context chirps
  const logContext = (action: string) => {
    createChirpMutation.mutate(action);
    
    // Occasionally trigger Evna enrichment based on context
    if (Math.random() > 0.7) {
        setTimeout(() => {
            const responses = [
                `Evna: Noting pattern in user activity: [${action}]`,
                `Evna: Cross-referencing [${action}] with archive...`,
                `Evna: Updating user vector based on recent navigation.`,
            ];
            addLog(responses[Math.floor(Math.random() * responses.length)], "SYSTEM");
        }, 1500);
    }
  };

  const handleTabChange = (tab: "feed" | "files" | "inbox") => {
    setActiveTab(tab);
    logContext(`navigated_to::${tab}`);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "1") handleTabChange("feed");
      if (e.altKey && e.key === "2") handleTabChange("files");
      if (e.altKey && e.key === "3") handleTabChange("inbox");
      if (e.key === "Escape") {
        if (viewingFile) logContext(`closed::file(${viewingFile.name})`);
        if (readingMessage) logContext(`closed::message(${readingMessage.id})`);
        setViewingFile(null);
        setReadingMessage(null);
        setIsPostEditorOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewingFile, readingMessage]);

  const addLog = (msg: string, level: string = "SYSTEM") => {
    createLogMutation.mutate({ level, message: msg });
  };

  const handleFileClick = (file: FileEntry) => {
    if (file.locked) {
      toast({
        title: "Access Denied",
        description: "Encrypted file. Decryption key required.",
        variant: "destructive",
      });
      logContext(`access_denied::file(${file.name})`);
      return;
    }
    if (file.type === "folder") {
      toast({
        title: "Directory Navigation",
        description: `Entering ${file.name}... (Mock: Empty directory)`,
      });
      logContext(`navigated::folder(${file.name})`);
      return;
    }
    setViewingFile(file);
    addLog(`Reading file: ${file.name}...`);
    logContext(`opened::file(${file.name})`);
  };

  const handleMessageClick = (msg: MessageEntry) => {
    setReadingMessage(msg);
    addLog(`Opening message from ${msg.from}...`);
    logContext(`opened::message(${msg.id})_from(${msg.from})`);
    
    // Mark as read
    if (msg.unread) {
      markAsReadMutation.mutate(msg.id);
    }
  };

  const handlePostSubmit = (content: string) => {
    const isChirp = content.startsWith("ctx::") || content.startsWith("mode::") || content.startsWith("project::");
    
    createPostMutation.mutate({ content, isChirp });
    
    if (isChirp) {
        addLog(`Chirp received. Seeding context...`, "INFO");
        logContext(`chirp::emitted`);
        setTimeout(() => {
            addLog(`Evna: Enrichment started for chirp ${Math.floor(Math.random() * 1000)}`, "SYSTEM");
            toast({
              title: "Chirp Captured",
              description: "Context seeded. No response expected.",
            });
        }, 500);
    } else {
        addLog(`Request received. Harvesting context...`, "INFO");
        logContext(`request::submitted`);
        setTimeout(() => {
            // Simulate Evna using the context stream
            const contextSummary = contextChirps.slice(0, 3).map(c => c.action.split('_')[0]).join(', ');
            addLog(`Karen: Response shaped by recent activity: [${contextSummary || "none"}]`, "SYSTEM");
            toast({
              title: "Request Processed",
              description: "Response generated with active context.",
            });
        }, 1000);
    }
  };

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");
    
    addLog(`> ${cmd}`);
    logContext(`exec::${command}`);

    // Handle Chirps directly from command bar
    if (cmd.startsWith("ctx::") || cmd.startsWith("project::") || cmd.startsWith("mode::")) {
        addLog(`Chirp logged: ${cmd}`, "INFO");
        logContext(`chirp::${cmd.substring(0, 20)}...`);
        setTimeout(() => {
            addLog("Evna: Context vector updated.", "SYSTEM");
        }, 300);
        return;
    }

    switch (command) {
      case "help":
        addLog("Commands: help, clear, files, status, feed, inbox, post, open [file], read [id], ctx::[msg]");
        break;
      case "clear":
        toast({
          title: "Clear Logs",
          description: "Cannot clear persistent logs. Use feed filters instead.",
        });
        break;
      case "files":
      case "ls":
        handleTabChange("files");
        addLog("Listing directory contents...");
        break;
      case "status":
      case "feed":
        handleTabChange("feed");
        addLog("Switched to System Feed");
        break;
      case "inbox":
      case "mail":
        handleTabChange("inbox");
        addLog("Checking encrypted inbox...");
        break;
      case "post":
      case "write":
        setIsPostEditorOpen(true);
        addLog("Initializing composer...");
        break;
      case "open":
        if (!args) {
          addLog("Usage: open [filename]", "WARN");
        } else {
          const file = files.find(f => f.name.toLowerCase() === args.toLowerCase());
          if (file) {
            handleFileClick(file);
          } else {
            addLog(`File not found: ${args}`, "ERROR");
            logContext(`error::file_not_found(${args})`);
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
        <div className="flex items-center gap-1 mb-4 border-b border-border pb-2 shrink-0 overflow-x-auto">
          <TabButton active={activeTab === "feed"} onClick={() => setActiveTab("feed")}>
            FEED <span className="text-[10px] text-muted-foreground ml-1 font-normal hidden sm:inline">[ALT+1]</span>
          </TabButton>
          <TabButton active={activeTab === "files"} onClick={() => setActiveTab("files")}>
            FILES <span className="text-[10px] text-muted-foreground ml-1 font-normal hidden sm:inline">[ALT+2]</span>
          </TabButton>
          <TabButton active={activeTab === "inbox"} onClick={() => setActiveTab("inbox")}>
            INBOX <span className="text-[10px] text-muted-foreground ml-1 font-normal hidden sm:inline">[ALT+3]</span>
          </TabButton>
          <TabButton active={false} onClick={() => setIsPostEditorOpen(true)} className="ml-auto text-secondary border-secondary/30 hover:bg-secondary/10">
            <span className="flex items-center gap-2"><MessageSquare className="w-3 h-3" /> POST</span>
          </TabButton>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 relative bg-card/20 border border-border/50 backdrop-blur-sm overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-2 opacity-50 pointer-events-none z-10">
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
                        [{new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}]
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
              {filesLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading files...</div>
              ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {files.map((file) => (
                  <div 
                    key={file.id}
                    onClick={() => handleFileClick(file)}
                    className={cn(
                      "border border-border p-4 hover:bg-primary/5 hover:border-primary transition-all cursor-pointer group relative overflow-hidden flex flex-col gap-2",
                      file.locked && "opacity-60 hover:border-destructive hover:bg-destructive/5"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      {file.type === "folder" ? (
                        <Folder className={cn("w-8 h-8", file.locked ? "text-destructive" : "text-accent")} />
                      ) : (
                        <FileText className="w-8 h-8 text-primary" />
                      )}
                      {file.locked && <Lock className="w-4 h-4 text-destructive" />}
                    </div>
                    <div>
                      <div className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                        {file.name}
                      </div>
                      {file.preview && (
                         <div className="text-xs text-muted-foreground mt-1 italic truncate opacity-70 group-hover:opacity-100">
                           "{file.preview}"
                         </div>
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-auto pt-2 border-t border-border/30">
                      <span>{file.date}</span>
                      {file.size && <span>{file.size}</span>}
                    </div>
                    
                    {/* Hover effect corner */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-transparent group-hover:border-r-primary transition-all duration-300" />
                  </div>
                ))}
              </div>
              )}
            </ScrollArea>
          )}

          {activeTab === "inbox" && (
             <ScrollArea className="flex-1 p-4 font-mono">
               {messagesLoading ? (
                 <div className="text-center py-8 text-muted-foreground">Loading messages...</div>
               ) : (
               <div className="space-y-2">
                 {messages.map((msg) => (
                   <div 
                     key={msg.id}
                     onClick={() => handleMessageClick(msg)}
                     className={cn(
                       "border p-3 hover:bg-secondary/5 transition-all cursor-pointer group flex items-center gap-4",
                       msg.unread ? "border-secondary bg-secondary/5" : "border-border opacity-70"
                     )}
                   >
                     <div className={cn("p-2 rounded-full", msg.unread ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground")}>
                       {msg.unread ? <Mail className="w-4 h-4" /> : <Inbox className="w-4 h-4" />}
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-center mb-1">
                         <span className={cn("font-bold truncate", msg.unread ? "text-secondary" : "text-foreground")}>
                           {msg.from}
                         </span>
                         <span className="text-xs text-muted-foreground whitespace-nowrap">{msg.date}</span>
                       </div>
                       <div className="text-sm truncate text-foreground/80 group-hover:text-foreground">
                         {msg.subject}
                       </div>
                     </div>
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                     </div>
                   </div>
                 ))}
               </div>
               )}
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

      {/* Message Reader Modal */}
      <AnimatePresence>
        {readingMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-card border border-secondary shadow-[0_0_30px_rgba(255,107,53,0.15)] relative flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between p-3 border-b border-secondary/30 bg-secondary/10">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-secondary" />
                  <span className="font-bold text-secondary tracking-wider">INBOX // READ</span>
                </div>
                <button onClick={() => setReadingMessage(null)} className="hover:text-destructive hover:bg-destructive/20 p-1 rounded transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-4 border-b border-border/30 bg-card/30 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-lg text-foreground">{readingMessage.subject}</span>
                  <span className="text-xs text-muted-foreground">{readingMessage.date}</span>
                </div>
                <div className="text-sm text-secondary">From: {readingMessage.from}</div>
              </div>

              <ScrollArea className="flex-1 p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {readingMessage.content}
              </ScrollArea>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Post Editor Modal */}
      <AnimatePresence>
        {isPostEditorOpen && (
          <PostEditor 
            isOpen={isPostEditorOpen} 
            onClose={() => setIsPostEditorOpen(false)}
            onSubmit={handlePostSubmit}
          />
        )}
      </AnimatePresence>

    </TerminalLayout>
  );
}

