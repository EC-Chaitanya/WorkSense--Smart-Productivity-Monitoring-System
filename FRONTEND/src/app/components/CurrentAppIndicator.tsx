/**
 * Current App Indicator Component
 * Displays real-time information about the currently active application
 * Shows app name, distraction status, elapsed time, and live tracking indicator
 */

import React from "react";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Clock, Zap } from "lucide-react";
import { useActivityTracking } from "../hooks/useActivityTracking";
import { cn } from "../utils";

interface CurrentAppIndicatorProps {
  isStudent?: boolean;
  compact?: boolean;
}

export const CurrentAppIndicator: React.FC<CurrentAppIndicatorProps> = ({
  isStudent = false,
  compact = false,
}) => {
  const { currentApp, elapsedSeconds, isDistracting, isTracking, category } =
    useActivityTracking();

  if (!currentApp) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  if (compact) {
    // Compact inline version for dashboard
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg border-2",
          isDistracting
            ? "border-[#EF4444]/50 bg-[#EF4444]/10 dark:border-[#EF4444]/30 dark:bg-[#7F1D1D]/20"
            : "border-[#10B981]/50 bg-[#10B981]/10 dark:border-[#10B981]/30 dark:bg-[#064E3B]/20"
        )}
      >
        {/* Pulsing indicator */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={cn(
            "h-3 w-3 rounded-full",
            isDistracting ? "bg-[#EF4444]" : "bg-[#10B981]"
          )}
        />

        {/* App name and time */}
        <div className="min-w-0">
          <p
            className={cn(
              "text-sm font-semibold truncate",
              isStudent
                ? "text-slate-900 dark:text-white"
                : "text-slate-100"
            )}
          >
            {currentApp}
          </p>
          <p
            className={cn(
              "text-xs",
              isStudent
                ? "text-slate-500 dark:text-slate-400"
                : "text-slate-400"
            )}
          >
            {formatTime(elapsedSeconds)}
          </p>
        </div>

        {/* Status icon */}
        {isDistracting ? (
          <AlertTriangle className="h-4 w-4 text-[#EF4444] ml-auto flex-shrink-0" />
        ) : (
          <CheckCircle2 className="h-4 w-4 text-[#10B981] ml-auto flex-shrink-0" />
        )}
      </motion.div>
    );
  }

  // Full card version
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative overflow-hidden rounded-2xl backdrop-blur-md border-2 p-6",
        isDistracting
          ? "border-[#EF4444]/40 bg-[#EF4444]/5 dark:bg-[#7F1D1D]/10"
          : "border-[#10B981]/40 bg-[#10B981]/5 dark:bg-[#064E3B]/10"
      )}
    >
      {/* Animated background glow */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={cn(
          "absolute inset-0 opacity-0 blur-xl pointer-events-none",
          isDistracting ? "bg-[#EF4444]/20" : "bg-[#10B981]/20"
        )}
      />

      <div className="relative z-10 space-y-4">
        {/* Header with status */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-2"
            >
              <div
                className={cn(
                  "h-3 w-3 rounded-full",
                  isDistracting ? "bg-[#EF4444]" : "bg-[#10B981]"
                )}
              />
              <span
                className={cn(
                  "text-xs font-bold uppercase tracking-widest",
                  isDistracting ? "text-[#EF4444]" : "text-[#10B981]"
                )}
              >
                {isTracking ? "Live" : "Paused"}
              </span>
            </motion.div>
          </div>

          {/* Category badge */}
          <div
            className={cn(
              "text-xs font-semibold px-3 py-1 rounded-full",
              category === "Productive"
                ? "bg-[#10B981]/20 text-[#10B981]"
                : category === "Neutral"
                  ? "bg-[#6366F1]/20 text-[#6366F1]"
                  : "bg-[#EF4444]/20 text-[#EF4444]"
            )}
          >
            {category}
          </div>
        </div>

        {/* App name and elapsed time */}
        <div>
          <h3
            className={cn(
              "text-3xl font-bold mb-2",
              isStudent
                ? "text-slate-900 dark:text-white"
                : "text-white"
            )}
          >
            {currentApp}
          </h3>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <p
              className={cn(
                "text-sm font-medium",
                isStudent
                  ? "text-slate-600 dark:text-slate-400"
                  : "text-slate-300"
              )}
            >
              Active for {formatTime(elapsedSeconds)}
            </p>
          </div>
        </div>

        {/* Distraction warning if applicable */}
        {isDistracting && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20"
          >
            <AlertTriangle className="h-5 w-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#EF4444]">
                Distracting App Detected
              </p>
              <p
                className={cn(
                  "text-xs mt-1",
                  isStudent
                    ? "text-slate-600 dark:text-slate-400"
                    : "text-slate-400"
                )}
              >
                Consider switching to a productive task or taking a scheduled break
              </p>
            </div>
          </motion.div>
        )}

        {/* Progress bar for time spent */}
        <div className="space-y-2">
          <p
            className={cn(
              "text-xs font-medium",
              isStudent
                ? "text-slate-600 dark:text-slate-400"
                : "text-slate-400"
            )}
          >
            Time on this app today
          </p>
          <div
            className={cn(
              "h-2 rounded-full overflow-hidden",
              isStudent
                ? "bg-slate-200 dark:bg-slate-700"
                : "bg-white/10"
            )}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (elapsedSeconds / 3600) * 100)}%` }}
              transition={{ duration: 0.5 }}
              className={cn(
                "h-full rounded-full",
                isDistracting
                  ? "bg-gradient-to-r from-[#EF4444] to-[#F97316]"
                  : "bg-gradient-to-r from-[#10B981] to-[#14B8A6]"
              )}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentAppIndicator;
