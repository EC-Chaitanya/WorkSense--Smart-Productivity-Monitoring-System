import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, MoveRight, LogIn } from "lucide-react";
import { Button } from "../Button";
import { cn } from "../../utils";

interface StrongWarningProps {
  isVisible: boolean;
  distractingApp?: string;
  onReturn?: () => void;
  onStartFocus?: () => void;
}

export const StrongWarning: React.FC<StrongWarningProps> = ({
  isVisible,
  distractingApp = "that app",
  onReturn,
  onStartFocus,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onReturn}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className={cn(
              "rounded-3xl border overflow-hidden shadow-2xl",
              "bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 dark:from-slate-900/90 dark:via-slate-800/90 dark:to-slate-900/90",
              "border-slate-700/50 dark:border-slate-700/50",
              "backdrop-blur-2xl"
            )}>
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 p-8 space-y-6">
                {/* Header */}
                <div className="text-center space-y-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex justify-center"
                  >
                    <div className="p-3 rounded-full bg-red-500/20 border border-red-500/30">
                      <AlertCircle className="h-6 w-6 text-red-500" />
                    </div>
                  </motion.div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Off Track!
                    </h2>
                    <p className="text-sm text-slate-300">
                      You've been using <span className="font-semibold text-amber-400">{distractingApp}</span> for too long
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                  <p className="text-center text-slate-200 text-sm font-medium">
                    "You've been away from your task. Let's get back on track."
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-xs text-slate-400">Distraction Time</p>
                    <p className="text-lg font-bold text-white mt-1">45 sec</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-xs text-slate-400">Task Progress</p>
                    <p className="text-lg font-bold text-emerald-400 mt-1">15 min</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <Button
                    onClick={onReturn}
                    className={cn(
                      "w-full flex items-center justify-center gap-2",
                      "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
                      "text-white font-semibold shadow-lg",
                      "transform transition-all duration-200 hover:scale-105"
                    )}
                  >
                    <MoveRight className="h-4 w-4" />
                    Return to Work
                  </Button>
                  
                  <Button
                    onClick={onStartFocus}
                    variant="outline"
                    className={cn(
                      "w-full flex items-center justify-center gap-2",
                      "border-slate-600 hover:border-slate-500",
                      "text-slate-300 hover:text-white",
                      "bg-slate-900/50 hover:bg-slate-800/50",
                      "duration-200"
                    )}
                  >
                    <LogIn className="h-4 w-4" />
                    Start Focus Mode
                  </Button>
                </div>

                {/* Tip */}
                <p className="text-xs text-center text-slate-400 pt-2">
                  💡 Tip: Enable app blockers in settings to prevent distractions
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
