import React, { useState, useRef, useEffect } from "react";
import { CornerDownLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CommandBarProps {
  onCommand: (cmd: string) => void;
  suggestions?: string[];
}

export const CommandBar = ({ onCommand, suggestions = [] }: CommandBarProps) => {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't steal focus if user is typing in another input/textarea
      const activeElement = document.activeElement;
      const isInInput = activeElement instanceof HTMLInputElement || 
                        activeElement instanceof HTMLTextAreaElement ||
                        activeElement?.closest('[role="dialog"]');
      
      // Focus on any key press unless we're in an input, using modifiers, or in a modal
      if (!isInInput && document.activeElement !== inputRef.current && !e.metaKey && !e.ctrlKey && !e.altKey && e.key.length === 1) {
        inputRef.current?.focus();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Autocomplete logic
  useEffect(() => {
    if (!input) {
      setSuggestion("");
      return;
    }
    const match = suggestions.find(s => s.startsWith(input.toLowerCase()));
    if (match) {
      setSuggestion(match);
    } else {
      setSuggestion("");
    }
  }, [input, suggestions]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (suggestion) {
        setInput(suggestion);
      }
    }
  };

  const handleAutocomplete = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (suggestion) {
      setInput(suggestion);
      inputRef.current?.focus();
    }
  };

  const handleSuggestionClick = (cmd: string) => {
    setInput(cmd + " ");
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onCommand(input);
    setInput("");
  };

  return (
    <div className="w-full mt-auto pt-4 pb-2 relative">
      {/* Command Suggestions Panel */}
      <AnimatePresence>
        {isFocused && !input && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 right-0 mb-2 px-2"
          >
            <div className="bg-card/90 border border-border backdrop-blur-md p-2 shadow-lg flex flex-wrap gap-2">
               <div className="w-full text-[10px] text-muted-foreground uppercase tracking-wider mb-1 px-1">Available Commands</div>
               {suggestions.map((cmd) => (
                 <button
                   key={cmd}
                   onClick={() => handleSuggestionClick(cmd)}
                   className="px-3 py-1.5 bg-primary/5 hover:bg-primary/20 border border-primary/20 hover:border-primary text-primary font-mono text-xs md:text-sm transition-colors rounded-sm"
                 >
                   {cmd}
                 </button>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form 
        onSubmit={handleSubmit}
        className={cn(
          "relative flex items-center gap-2 bg-card/50 border border-border px-3 py-3 md:px-4 transition-all duration-200",
          isFocused ? "border-primary shadow-[0_0_10px_rgba(0,255,65,0.2)]" : "opacity-80 hover:opacity-100"
        )}
      >
        <span className="text-primary font-bold shrink-0 animate-pulse hidden md:block">{">"}</span>
        
        <div className="relative flex-1 min-w-0">
          {/* Ghost text for autocomplete */}
          {suggestion && input && suggestion !== input && (
            <div 
              className="absolute inset-0 flex items-center cursor-pointer" 
              onClick={handleAutocomplete}
              onTouchStart={handleAutocomplete}
            >
              <span className="text-transparent whitespace-pre">{input}</span>
              <span className="text-muted-foreground/50 whitespace-pre">{suggestion.slice(input.length)}</span>
            </div>
          )}

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
                // Small delay to allow click events on suggestions to fire before hiding
                setTimeout(() => setIsFocused(false), 150);
            }}
            className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground font-mono text-base md:text-lg relative z-10 p-0"
            placeholder="Enter command..."
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          {suggestion && input && suggestion !== input && (
             <button
               type="button"
               onClick={handleAutocomplete}
               className="p-2 bg-secondary/10 text-secondary border border-secondary/30 rounded hover:bg-secondary/20 active:scale-95 transition-all"
             >
               <ChevronsRight className="w-4 h-4" />
             </button>
          )}
          <button
            type="submit"
            className="p-2 bg-primary/10 text-primary border border-primary/30 rounded hover:bg-primary/20 active:scale-95 transition-all"
            disabled={!input.trim()}
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop Hints */}
        <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground select-none shrink-0 ml-2">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px]">TAB</kbd> AUTOCOMPLETE
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px]">ENTER</kbd> EXECUTE
          </span>
        </div>
      </form>
    </div>
  );
};
