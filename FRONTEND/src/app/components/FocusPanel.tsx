import React, { useState } from "react";
import { motion } from "motion/react";
import { Play, Clock, Flame } from "lucide-react";
import { Button } from "./Button";
import { TiltCard } from "./TiltCard";
import { cn } from "../utils";

interface FocusPanelProps {
  onStartSession?: (duration: number) => void;
  lastSessionData?: {
    duration: string;
    efficiency: number;
    date: string;
  };
  className?: string;
  isLoading?: boolean;
}

const PRESET_DURATIONS = [
  { label: "25 min", duration: 25 * 60, icon: "⚡" },
  { label: "50 min", duration: 50 * 60, icon: "🔥" },
  { label: "90 min", duration: 90 * 60, icon: "💪" },
];

export const FocusPanel: React.FC<FocusPanelProps> = ({
  onStartSession,
  lastSessionData,
  className,
  isLoading = false,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(25 * 60);

  const handleStartClick = () => {
    onStartSession?.(selectedDuration);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <TiltCard className="h-full rounded-[2.5rem] border-2 border-[#5B8CFF]/40 dark:border-[#5B8CFF]/20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5B8CFF]/10 via-transparent to-[#7C3AED]/10 dark:from-[#5B8CFF]/5 dark:via-transparent dark:to-[#7C3AED]/5" />

        {/* Animated Blob */}
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[#5B8CFF]/10 blur-3xl"
        />

        <div className="relative z-10 p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Ready to Focus?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Start a productive session
              </p>
            </div>
            <div className="flex gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="p-2 rounded-full bg-[#5B8CFF]/10 border border-[#5B8CFF]/20"
              >
                <Flame className="h-5 w-5 text-[#5B8CFF] dark:text-cyan-400" />
              </motion.div>
            </div>
          </div>

          {/* Last Session Info */}
          {lastSessionData && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 backdrop-blur-sm"
            >
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Last Session
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {lastSessionData.duration}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {lastSessionData.efficiency}% efficient
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                {lastSessionData.date}
              </p>
            </motion.div>
          )}

          {/* Duration Presets */}
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-3">
              Choose Duration
            </p>
            <div className="grid grid-cols-3 gap-3">
              {PRESET_DURATIONS.map((preset, index) => (
                <motion.button
                  key={preset.duration}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => setSelectedDuration(preset.duration)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "py-3 px-3 rounded-xl border-2 transition-all font-semibold text-sm",
                    "flex flex-col items-center justify-center gap-1",
                    selectedDuration === preset.duration
                      ? "bg-[#5B8CFF]/20 border-[#5B8CFF] text-slate-900 dark:bg-[#5B8CFF]/10 dark:text-white shadow-[0_0_20px_rgba(91,140,255,0.2)]"
                      : "bg-white/30 dark:bg-white/5 border-slate-200/50 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-[#5B8CFF]/50"
                  )}
                >
                  <span>{preset.icon}</span>
                  {preset.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartClick}
              disabled={isLoading}
              className={cn(
                "w-full shadow-[0_0_30px_rgba(91,140,255,0.3)] hover:shadow-[0_0_50px_rgba(91,140,255,0.5)]",
                "transition-all duration-300",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Play className="h-5 w-5 fill-current" />
                  Start Focus Session
                </>
              )}
            </Button>
          </motion.div>

          {/* Footer Info */}
          <p className="text-xs text-center text-slate-600 dark:text-slate-400">
            💡 Tip: This session will be tracked and logged for insights
          </p>
        </div>
      </TiltCard>
    </motion.div>
  );
};
