import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TerminalTextProps {
  children: string;
  className?: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  glitch?: boolean;
}

export const TerminalText = ({
  children,
  className,
  speed = 30,
  delay = 0,
  onComplete,
  glitch = false,
}: TerminalTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (indexRef.current < children.length) {
          setDisplayedText((prev) => prev + children.charAt(indexRef.current));
          indexRef.current++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          if (onComplete) onComplete();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [children, speed, delay, onComplete]);

  return (
    <motion.span
      className={cn(
        "inline-block font-mono",
        isComplete && glitch && "animate-[glitch_3s_infinite]",
        className
      )}
    >
      {displayedText}
      {!isComplete && (
        <span className="animate-blink inline-block w-[0.5em] h-[1em] bg-primary ml-1 align-middle" />
      )}
    </motion.span>
  );
};
