import React, { useState, useRef, useEffect } from "react";
import { Command } from "lucide-react";
import { cn } from "@/lib/utils";

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
      // Focus on any key press unless we're in an input or using modifiers
      if (document.activeElement !== inputRef.current && !e.metaKey && !e.ctrlKey && !e.altKey && e.key.length === 1) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onCommand(input);
    setInput("");
  };

  return (
    <div className="w-full mt-auto pt-4 pb-2">
      <form 
        onSubmit={handleSubmit}
        className={cn(
          "relative flex items-center gap-2 bg-card/50 border border-border px-4 py-3 transition-all duration-200",
          isFocused ? "border-primary shadow-[0_0_10px_rgba(0,255,65,0.2)]" : "opacity-80 hover:opacity-100"
        )}
      >
        <span className="text-primary font-bold shrink-0 animate-pulse">{">"}</span>
        
        <div className="relative flex-1">
          {/* Ghost text for autocomplete */}
          {suggestion && input && suggestion !== input && (
            <div className="absolute inset-0 pointer-events-none flex items-center">
              <span className="text-transparent">{input}</span>
              <span className="text-muted-foreground/50">{suggestion.slice(input.length)}</span>
            </div>
          )}

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground font-mono text-lg relative z-10"
            placeholder="Enter system command..."
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground select-none">
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
