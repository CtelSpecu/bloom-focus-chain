"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

interface TimerRingProps {
  isActive: boolean;
  progress: number;
}

const TimerRing = ({ isActive, progress }: TimerRingProps) => {
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setRotation(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      {/* Outer glow ring */}
      {isActive && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl animate-pulse-ring" />
      )}
      
      {/* SVG rings */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 320 320">
        {/* Background ring */}
        <circle
          cx="160"
          cy="160"
          r="140"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
          opacity="0.2"
        />
        
        {/* Progress ring */}
        <circle
          cx="160"
          cy="160"
          r="140"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: isActive ? "drop-shadow(0 0 8px hsl(var(--primary)))" : "none",
          }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
        
        {/* Encrypted indicator dots */}
        {isActive && (
          <>
            <circle
              cx="160"
              cy="20"
              r="4"
              fill="hsl(var(--secondary))"
              className="animate-pulse"
              style={{
                transformOrigin: "160px 160px",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            <circle
              cx="300"
              cy="160"
              r="4"
              fill="hsl(var(--secondary))"
              className="animate-pulse"
              style={{
                transformOrigin: "160px 160px",
                animation: "pulse 2s ease-in-out infinite 0.5s",
              }}
            />
            <circle
              cx="160"
              cy="300"
              r="4"
              fill="hsl(var(--secondary))"
              className="animate-pulse"
              style={{
                transformOrigin: "160px 160px",
                animation: "pulse 2s ease-in-out infinite 1s",
              }}
            />
            <circle
              cx="20"
              cy="160"
              r="4"
              fill="hsl(var(--secondary))"
              className="animate-pulse"
              style={{
                transformOrigin: "160px 160px",
                animation: "pulse 2s ease-in-out infinite 1.5s",
              }}
            />
          </>
        )}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="relative">
          <Lock
            className="w-12 h-12 text-primary mb-4"
            style={{
              transform: isActive ? `rotate(${rotation}deg)` : "rotate(0deg)",
              transition: "transform 0.05s linear",
            }}
          />
          {isActive && (
            <div className="absolute -inset-2 bg-primary/10 rounded-full animate-ping" />
          )}
        </div>
        <p className="text-sm text-muted-foreground font-medium tracking-wide">
          {isActive ? "Encrypted Session Active" : "Ready to Focus"}
        </p>
      </div>
    </div>
  );
};

export default TimerRing;

