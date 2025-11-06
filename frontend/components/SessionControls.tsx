"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, Save } from "lucide-react";
import { toast } from "sonner";

interface SessionControlsProps {
  onStateChange: (isActive: boolean, progress: number) => void;
  onSessionComplete: (minutes: number) => Promise<void>;
  isLogging: boolean;
  canLog: boolean;
}

const SessionControls = ({ onStateChange, onSessionComplete, isLogging, canLog }: SessionControlsProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const sessionDuration = 25 * 60; // 25 minutes in seconds
  
  // Use ref to avoid stale closure in setInterval
  const onStateChangeRef = useRef(onStateChange);
  onStateChangeRef.current = onStateChange;

  const handleStop = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    onStateChangeRef.current(false, 0);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const newSeconds = prev + 1;
          const progress = (newSeconds / sessionDuration) * 100;
          onStateChangeRef.current(true, Math.min(progress, 100));
          
          if (newSeconds >= sessionDuration) {
            handleStop();
            toast.success("Focus session completed!", {
              description: "Click 'Save Session' to encrypt and store your data on-chain.",
            });
            return sessionDuration;
          }
          
          return newSeconds;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, sessionDuration, handleStop]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    toast.success("Focus session started", {
      description: "Your session will be encrypted when completed.",
    });
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? "Session resumed" : "Session paused");
  };

  const handleSaveSession = async () => {
    if (seconds === 0) {
      toast.error("No session to save");
      return;
    }
    
    const minutes = Math.ceil(seconds / 60);
    
    try {
      await onSessionComplete(minutes);
      setSeconds(0);
      toast.success("Session saved on-chain!", {
        description: `${minutes} minutes encrypted and stored securely.`,
      });
    } catch (error) {
      toast.error("Failed to save session", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tabular-nums">
        {formatTime(seconds)}
      </div>
      
      <div className="flex gap-3">
        {!isActive ? (
          <>
            <Button
              onClick={handleStart}
              size="lg"
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg"
              disabled={!canLog}
            >
              <Play className="w-5 h-5" />
              Start Focus Session
            </Button>
            {seconds > 0 && (
              <Button
                onClick={handleSaveSession}
                size="lg"
                variant="outline"
                className="gap-2 border-accent/30 hover:bg-accent/5"
                disabled={isLogging || !canLog}
              >
                <Save className="w-5 h-5" />
                {isLogging ? "Encrypting..." : "Save Session"}
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              onClick={handlePause}
              size="lg"
              variant="outline"
              className="gap-2 border-primary/30 hover:bg-primary/5"
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              )}
            </Button>
            <Button
              onClick={handleStop}
              size="lg"
              variant="outline"
              className="gap-2 border-destructive/30 hover:bg-destructive/5 text-destructive"
            >
              <Square className="w-5 h-5" />
              Stop
            </Button>
          </>
        )}
      </div>
      
      {isActive && (
        <p className="text-sm text-muted-foreground">
          Session data will be encrypted with your wallet key
        </p>
      )}
      
      {!canLog && !isActive && (
        <p className="text-sm text-destructive">
          Connect your wallet to start tracking
        </p>
      )}
    </div>
  );
};

export default SessionControls;
