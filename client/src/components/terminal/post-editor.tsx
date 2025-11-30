import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
}

export const PostEditor = ({ isOpen, onClose, onSubmit }: PostEditorProps) => {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" role="dialog" aria-modal="true">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl bg-card border border-secondary shadow-[0_0_30px_rgba(255,107,53,0.15)] flex flex-col h-[60vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-secondary/30 bg-secondary/10">
          <div className="flex items-center gap-2">
            <span className="font-bold text-secondary tracking-wider uppercase">Comms Uplink // New Transmission</span>
          </div>
          <button 
            onClick={onClose} 
            className="hover:text-destructive hover:bg-destructive/20 p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Editor Area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Initiate transmission sequence..."
          className="flex-1 bg-transparent border-none outline-none p-6 font-mono text-foreground placeholder:text-muted-foreground/50 resize-none leading-relaxed"
          spellCheck={false}
        />

        {/* Footer / Actions */}
        <div className="p-3 border-t border-secondary/30 bg-card/50 flex justify-between items-center">
          <div className="flex gap-2">
             <button className="p-2 hover:bg-secondary/10 text-muted-foreground hover:text-secondary rounded transition-colors">
                <Paperclip className="w-4 h-4" />
             </button>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors uppercase"
            >
              Abort
            </button>
            <button 
              onClick={handleSubmit}
              className="px-4 py-1.5 text-xs font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors flex items-center gap-2 uppercase"
            >
              <Send className="w-3 h-3" />
              Transmit
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
