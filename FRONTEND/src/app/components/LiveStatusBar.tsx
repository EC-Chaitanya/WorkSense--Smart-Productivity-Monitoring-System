import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Activity, AlertCircle, Clock } from "lucide-react";
import { cn } from "../utils";

interface LiveStatusBarProps {
  currentApp?: string;
  isTracking?: boolean;
  idleTime?: number; // in seconds
  className?: string;
  compact?: boolean;
}

export const LiveStatusBar: React.FC<LiveStatusBarProps> = ({
  currentApp = "VS Code",
  isTracking = true,
  idleTime = 0,
  className,
  compact = false,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking]);

  const formatIdleTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s idle`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m idle`;
    return `${Math.floor(seconds / 3600)}h idle`;
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
          "bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10",
          className
        )}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={cn(
            "h-2 w-2 rounded-full",
            isTracking ? "bg-emerald-500" : "bg-slate-400"
          )}
        />
        <span className="text-slate-700 dark:text-slate-300">
          {isTracking ? "Tracking" : "Idle"}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-center justify-between p-4 rounded-2xl border",
        "bg-gradient-to-r from-white/40 to-white/20 dark:from-white/5 dark:to-white/[0.02]",
        "border-slate-200/50 dark:border-white/10 backdrop-blur-md",
        "shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]",
        className
      )}
    >
      {/* Left: Status Indicator */}
      <div className="flex items-center gap-3 flex-1">
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-emerald-500/30 rounded-full blur-md"
          />
          <div className={cn(
            "relative h-3 w-3 rounded-full border-2",
            isTracking
              ? "bg-emerald-500 border-emerald-600"
              : "bg-slate-400 border-slate-500"
          )} />
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            {isTracking ? "● Tracking Active" : "● Idle"}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {currentApp}
          </p>
        </div>
      </div>

      {/* Middle: Idle Time or Active Time */}
      {idleTime > 0 ? (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
          <AlertCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
          <span className="text-xs font-medium text-rose-700 dark:text-rose-300">
            {formatIdleTime(idleTime)}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#5B8CFF]/10 border border-[#5B8CFF]/20">
          <Clock className="h-3.5 w-3.5 text-[#5B8CFF] dark:text-cyan-400" />
          <span className="text-xs font-medium text-[#5B8CFF] dark:text-cyan-300">
            Actively tracking
          </span>
        </div>
      )}
    </motion.div>
  );
};
