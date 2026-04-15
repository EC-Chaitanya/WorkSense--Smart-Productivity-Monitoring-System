import React from "react";
import { motion } from "motion/react";
import { Flame, Award, TrendingUp } from "lucide-react";
import { TiltCard } from "./TiltCard";
import { cn } from "../utils";

interface FocusStreakProps {
  currentStreak: number;
  longestStreak: number;
  todayFocusTime: number; // in minutes
  goalTime: number; // in minutes
  className?: string;
  compact?: boolean;
}

export const FocusStreak: React.FC<FocusStreakProps> = ({
  currentStreak,
  longestStreak,
  todayFocusTime,
  goalTime,
  className,
  compact = false,
}) => {
  const progressPercentage = Math.min((todayFocusTime / goalTime) * 100, 100);
  const isStreakMilestone = currentStreak > 0 && currentStreak % 7 === 0;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "inline-flex items-center gap-3 px-4 py-2 rounded-full",
          "bg-gradient-to-r from-orange-500/10 to-rose-500/10 dark:from-orange-500/5 dark:to-rose-500/5",
          "border border-orange-500/20 dark:border-orange-500/10 backdrop-blur-md",
          className
        )}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Flame className="h-4 w-4 text-orange-500 dark:text-orange-400 fill-current" />
        </motion.div>
        <span className="text-sm font-bold text-slate-900 dark:text-white">
          {currentStreak} day streak
        </span>
        <span className="text-xs text-slate-600 dark:text-slate-400">
          🏆 {longestStreak} best
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <TiltCard className="h-full rounded-2xl border-2 border-orange-500/30 dark:border-orange-500/20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-rose-500/5 to-transparent dark:from-orange-500/5 dark:via-rose-500/0 dark:to-transparent" />

        <div className="relative z-10 p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Focus Streak
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Keep the momentum going!
              </p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1, 1.2, 1], rotate: [0, 15, 0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="p-2.5 rounded-full bg-gradient-to-br from-orange-500/20 to-rose-500/10 border border-orange-500/30"
            >
              <Flame className="h-5 w-5 text-orange-500 dark:text-orange-400 fill-current" />
            </motion.div>
          </div>

          {/* Main Streak Display */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center py-4 px-4 rounded-2xl bg-white/30 dark:bg-white/5 border border-orange-500/20 dark:border-orange-500/10 backdrop-blur-sm"
          >
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Current Streak
            </p>
            <p className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-orange-600 to-rose-500 bg-clip-text">
              {currentStreak}
            </p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2">
              {currentStreak === 1 ? "day" : "days"}
            </p>
          </motion.div>

          {/* Progress & Stats */}
          <div className="space-y-3">
            {/* Today's Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Today's Focus
                </span>
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                  {Math.min(todayFocusTime, goalTime)}m / {goalTime}m
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/20 dark:bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                />
              </div>
            </div>

            {/* Best Streak */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/20 dark:bg-white/5 border border-slate-200/50 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Personal Best
                </span>
              </div>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                {longestStreak} days
              </span>
            </div>
          </div>

          {/* Milestone Badge */}
          {isStreakMilestone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-xl bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 border border-yellow-500/30 dark:border-yellow-500/20 text-center"
            >
              <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400 flex items-center justify-center gap-1">
                🎉 Milestone Reached! {currentStreak} Day Streak!
              </p>
            </motion.div>
          )}

          {/* Encouraging Message */}
          <div className="pt-2 border-t border-slate-200/50 dark:border-white/10">
            <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
              {currentStreak === 0
                ? "Start focusing today to build your streak!"
                : currentStreak < 7
                ? `Almost a week! ${7 - currentStreak} more days to go!`
                : "Amazing consistency! Keep it up! 💪"}
            </p>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};
