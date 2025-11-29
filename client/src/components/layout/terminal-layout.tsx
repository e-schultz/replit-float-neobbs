import React from "react";
import { Scanlines } from "@/components/ui/scanlines";
import { cn } from "@/lib/utils";

interface TerminalLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const TerminalLayout = ({ children, className }: TerminalLayoutProps) => {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground font-mono overflow-hidden selection:bg-primary selection:text-background">
      <Scanlines />
      
      {/* Grid Background */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className={cn("relative z-10 h-full flex flex-col p-2 md:p-4 max-w-[1600px] mx-auto", className)}>
        {children}
      </div>
    </div>
  );
};
