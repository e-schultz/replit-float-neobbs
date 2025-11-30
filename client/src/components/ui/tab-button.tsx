import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TabButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  className?: string;
}

export const TabButton = ({ children, active, onClick, className }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 text-sm font-bold border-t-2 transition-all relative overflow-hidden group whitespace-nowrap",
      active 
        ? "border-primary text-primary bg-primary/10" 
        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5",
      className
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
