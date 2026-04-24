import React from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { TiltCard } from "./TiltCard";
import { cn } from "../utils";

interface InsightCardProps {
  title: string;
  value: string;
  trend?: number; // percentage change (positive or negative)
  description?: string;
  type?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  delay?: number;
  className?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  value,
  trend,
  description,
  type = "neutral",
  icon,
  delay = 0,
  className,
}) => {
  const isPositive = type === "positive" || (trend !== undefined && trend > 0);
  const isNegative = type === "negative" || (trend !== undefined && trend < 0);

  const getBgStyles = () => {
    if (isPositive) {
      return "from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/5 dark:to-transparent border-emerald-500/20 dark:border-emerald-500/10";
    }
    if (isNegative) {
      return "from-rose-500/10 to-rose-500/5 dark:from-rose-500/5 dark:to-transparent border-rose-500/20 dark:border-rose-500/10";
    }
    return "from-[#5B8CFF]/10 to-[#5B8CFF]/5 dark:from-[#5B8CFF]/5 dark:to-transparent border-[#5B8CFF]/20 dark:border-[#5B8CFF]/10";
  };

  const getIconBgStyles = () => {
    if (isPositive) {
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }
    if (isNegative) {
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400";
    }
    return "bg-[#5B8CFF]/10 text-[#5B8CFF] dark:text-cyan-400";
  };

  const getTrendColor = () => {
    if (isPositive) return "text-emerald-600 dark:text-emerald-400";
    if (isNegative) return "text-rose-600 dark:text-rose-400";
    return "text-slate-600 dark:text-slate-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className={className}
    >
      <TiltCard className={cn("h-full rounded-2xl border-2")}>
        <div className={cn(
          "h-full bg-gradient-to-br rounded-2xl p-5 space-y-4 border-2",
          getBgStyles()
        )}>
          {/* Header */}
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white max-w-[60%] leading-snug">
              {title}
            </h4>
            <div className={cn("p-2 rounded-lg", getIconBgStyles())}>
              {icon || <AlertCircle className="h-4 w-4" />}
            </div>
          </div>

          {/* Main Value */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {value}
            </span>
            {trend !== undefined && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: delay + 0.2 }}
                className={cn("flex items-center gap-0.5 text-xs font-bold", getTrendColor())}
              >
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : isNegative ? (
                  <TrendingDown className="h-3.5 w-3.5" />
                ) : null}
                {Math.abs(trend)}%
              </motion.div>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          )}

          {/* Progress Bar */}
          <div className="pt-2">
            <div className="h-1.5 w-full rounded-full bg-white/30 dark:bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.abs(Number(value) || 0))}%` }}
                transition={{ delay: delay + 0.3, duration: 0.8, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full",
                  isPositive
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                    : isNegative
                    ? "bg-gradient-to-r from-rose-500 to-rose-400"
                    : "bg-gradient-to-r from-[#5B8CFF] to-cyan-400"
                )}
              />
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};

// Bulk Insights Grid Component
interface InsightGridProps {
  insights: InsightCardProps[];
  className?: string;
}

export const InsightGrid: React.FC<InsightGridProps> = ({ insights, className }) => {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {insights.map((insight, index) => (
        <InsightCard key={`insight-${index}`} {...insight} delay={index * 0.1} />
      ))}
    </div>
  );
};
