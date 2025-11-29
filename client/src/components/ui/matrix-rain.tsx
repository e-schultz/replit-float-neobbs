import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MatrixRainProps {
  className?: string;
  opacity?: number;
}

export const MatrixRain = ({ className, opacity = 0.1 }: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    const columns = Math.floor(width / 20);
    const drops: number[] = [];
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@&%";

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      ctx.fillStyle = `rgba(13, 17, 23, 0.05)`; // Fade out trail
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#00FF41"; // Green text
      ctx.font = "15px 'JetBrains Mono'";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 z-0 pointer-events-none", className)}
      style={{ opacity }}
    />
  );
};
