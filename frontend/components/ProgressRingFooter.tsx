"use client";

interface ProgressRingFooterProps {
  totalSessions: number;
  totalMinutes: number;
  weeklyGoal: number;
  isDecrypted: boolean;
}

const ProgressRingFooter = ({ totalSessions, totalMinutes, weeklyGoal, isDecrypted }: ProgressRingFooterProps) => {
  const progress = weeklyGoal > 0 ? Math.min((totalMinutes / weeklyGoal) * 100, 100) : 0;
  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Mini progress ring */}
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="4"
                opacity="0.3"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="url(#footerGradient)"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-foreground">
                {isDecrypted ? `${Math.round(progress)}%` : "?"}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {isDecrypted ? totalSessions : "***"}
              </p>
              <p className="text-xs text-muted-foreground">Sessions This Week</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {isDecrypted ? totalMinutes : "***"}
              </p>
              <p className="text-xs text-muted-foreground">Minutes Focused</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {isDecrypted ? weeklyGoal : "***"}
              </p>
              <p className="text-xs text-muted-foreground">Weekly Goal</p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium text-muted-foreground">
            {isDecrypted ? "Decrypted Summary" : "Encrypted Data"}
          </p>
          <p className="text-xs text-muted-foreground">
            All session data stored on-chain
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressRingFooter;

