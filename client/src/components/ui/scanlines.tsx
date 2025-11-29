import { cn } from "@/lib/utils";

export const Scanlines = ({ className }: { className?: string }) => {
  return (
    <div className={cn("pointer-events-none fixed inset-0 z-50 overflow-hidden select-none", className)}>
      {/* Scanline texture */}
      <div className="crt-overlay absolute inset-0 opacity-40" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
      
      {/* Subtle flickering - Wrapped to ensure opacity scaling works correctly */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay">
        <div className="crt-flicker w-full h-full bg-white" />
      </div>
    </div>
  );
};
