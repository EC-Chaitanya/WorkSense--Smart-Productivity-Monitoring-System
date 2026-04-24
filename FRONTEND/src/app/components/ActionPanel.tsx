import React from "react";
import { motion } from "motion/react";
import { Lightbulb, ArrowRight, Zap, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "./Button";
import { TiltCard } from "./TiltCard";
import { cn } from "../utils";

interface ActionItem {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHandler: () => void;
  priority?: "high" | "medium" | "low";
  icon?: React.ReactNode;
}

interface ActionPanelProps {
  actions: ActionItem[];
  title?: string;
  className?: string;
}

const getPriorityStyles = (priority?: string) => {
  switch (priority) {
    case "high":
      return "border-rose-500/30 dark:border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/5";
    case "medium":
      return "border-amber-500/30 dark:border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/5";
    default:
      return "border-[#5B8CFF]/30 dark:border-[#5B8CFF]/20 bg-[#5B8CFF]/5 dark:bg-[#5B8CFF]/5";
  }
};

const getIconColor = (priority?: string) => {
  switch (priority) {
    case "high":
      return "text-rose-500 dark:text-rose-400";
    case "medium":
      return "text-amber-500 dark:text-amber-400";
    default:
      return "text-[#5B8CFF] dark:text-cyan-400";
  }
};

const ActionCard: React.FC<ActionItem & { delay: number }> = ({
  title,
  description,
  actionLabel,
  actionHandler,
  priority,
  icon,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <TiltCard className={cn("h-full rounded-2xl border-2 transition-all", getPriorityStyles(priority))}>
        <div className="p-5 space-y-3">
          {/* Header with Icon */}
          <div className="flex items-start justify-between gap-3">
            <div className={cn("flex-shrink-0 p-2 rounded-lg bg-white/10 dark:bg-white/5", getIconColor(priority))}>
              {icon || <Lightbulb className="h-5 w-5" />}
            </div>
            {priority === "high" && (
              <div className="px-2 py-1 text-xs font-bold rounded-full bg-rose-500/20 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                Important
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
              {title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Action Button */}
          <motion.button
            onClick={actionHandler}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-3 px-3 py-2 text-xs font-semibold text-center rounded-lg transition-all bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-200/50 dark:border-white/10 flex items-center justify-center gap-1 group"
          >
            {actionLabel}
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </TiltCard>
    </motion.div>
  );
};

export const ActionPanel: React.FC<ActionPanelProps> = ({
  actions,
  title = "Smart Recommendations",
  className,
}) => {
  if (!actions || actions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {/* Panel Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#5B8CFF] dark:text-cyan-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {actions.length} action{actions.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Action Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action, index) => (
          <ActionCard
            key={action.id}
            {...action}
            delay={index * 0.1}
          />
        ))}
      </div>
    </motion.div>
  );
};
