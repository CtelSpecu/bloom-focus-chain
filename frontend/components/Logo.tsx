"use client";

import { Lock } from "lucide-react";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-10 h-10">
        {/* Lotus petals */}
        <svg viewBox="0 0 40 40" className="w-full h-full">
          {/* Outer petals */}
          <path
            d="M20 8 C15 8, 12 12, 12 16 L12 20 L8 20 C8 20, 8 12, 15 8 Z"
            fill="hsl(var(--primary))"
            opacity="0.3"
          />
          <path
            d="M20 8 C25 8, 28 12, 28 16 L28 20 L32 20 C32 20, 32 12, 25 8 Z"
            fill="hsl(var(--primary))"
            opacity="0.3"
          />
          {/* Middle petals */}
          <path
            d="M12 20 C12 24, 14 28, 18 30 L20 32 L20 28 Z"
            fill="hsl(var(--secondary))"
            opacity="0.4"
          />
          <path
            d="M28 20 C28 24, 26 28, 22 30 L20 32 L20 28 Z"
            fill="hsl(var(--secondary))"
            opacity="0.4"
          />
          {/* Center petal */}
          <circle cx="20" cy="20" r="8" fill="hsl(var(--accent))" opacity="0.2" />
        </svg>
        
        {/* Lock icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock className="w-4 h-4 text-primary" />
        </div>
      </div>
      <span className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        MindFocus
      </span>
    </div>
  );
};

export default Logo;

