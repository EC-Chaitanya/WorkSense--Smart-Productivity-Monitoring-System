import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { Clock, TrendingUp, Zap, ZapOff, Play, Target, Sparkles, ChevronRight, Briefcase, GraduationCap, Lightbulb, TrendingDown, AlertCircle } from "lucide-react";
import { TiltCard } from "../components/TiltCard";
import { Button } from "../components/Button";
import { ActionPanel } from "../components/ActionPanel";
import { FocusPanel } from "../components/FocusPanel";
import { InsightCard, InsightGrid } from "../components/InsightCard";
import { FocusStreak } from "../components/FocusStreak";
import { LiveStatusBar } from "../components/LiveStatusBar";
import { CurrentAppIndicator } from "../components/CurrentAppIndicator";
import { useMode } from "../context/ModeContext";
import { cn } from "../utils";

// Fallback Fake Data (used while loading or if API fails)
const lineData = [
  { name: "Mon", focus: 4, distraction: 2 },
  { name: "Tue", focus: 5, distraction: 1 },
  { name: "Wed", focus: 6, distraction: 1.5 },
  { name: "Thu", focus: 4.5, distraction: 3 },
  { name: "Fri", focus: 7, distraction: 1 },
  { name: "Sat", focus: 3, distraction: 4 },
  { name: "Sun", focus: 2, distraction: 2 },
];

const defaultPieData = [
  { name: "Productive", value: 65 },
  { name: "Neutral", value: 20 },
  { name: "Distracting", value: 15 },
];
const COLORS = ["#5B8CFF", "#94A3B8", "#EF4444"];

const barData = [
  { name: "VS Code", hours: 4.5 },
  { name: "Figma", hours: 3.2 },
  { name: "Browser", hours: 2.1 },
  { name: "Slack", hours: 1.5 },
];

const StatCard = ({ title, value, icon: Icon, trend, positive, delay, mode }: any) => {
  const isStudent = mode === "student";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: isStudent ? 0.6 : 0.4, type: "spring", stiffness: 100 }}
    >
      <TiltCard 
        className={cn(
          "relative overflow-hidden rounded-2xl transition-all group h-full",
          isStudent 
            ? "border border-white/60 bg-white/60 backdrop-blur-md shadow-md hover:border-[#5B8CFF]/50 dark:border-slate-800/50 dark:bg-[#111827]/60 dark:hover:border-[#5B8CFF]/50" 
            : "border-0 bg-transparent rounded-2xl"
        )}
      >
        {/* Background glow on hover (Student only) */}
        {isStudent && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#5B8CFF]/0 to-[#7C3AED]/0 transition-all duration-500 group-hover:from-[#5B8CFF]/10 group-hover:to-[#7C3AED]/10 pointer-events-none" />
        )}
        
        <div className={cn("relative z-10 flex flex-col justify-between h-full", isStudent ? "p-6" : "p-5")}>
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl shadow-inner transition-transform duration-300",
              isStudent 
                ? "bg-white/80 dark:bg-slate-800/80 text-[#5B8CFF] group-hover:scale-110 group-hover:bg-[#5B8CFF] group-hover:text-white group-hover:shadow-[0_0_20px_rgba(91,140,255,0.4)]"
                : "bg-white/5 dark:bg-white/5 border border-white/10 text-slate-700 dark:text-[#A1A1AA]"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <div className={cn(
              "flex items-center gap-1 px-2.5 py-1 text-xs font-semibold backdrop-blur-md rounded-full border",
              positive 
                ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' 
                : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
            )}>
              <TrendingUp className={cn("h-3 w-3", !positive && 'rotate-180')} />
              {trend}
            </div>
          </div>
          <div>
            <h3 className={cn("text-3xl font-bold tracking-tight mb-1", isStudent ? "text-slate-900 dark:text-white" : "text-white")}>{value}</h3>
            <p className={cn("text-xs transition-colors", isStudent ? "font-medium text-slate-500 dark:text-slate-400" : "font-medium text-[#A1A1AA]")}>{title}</p>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};

const AnimatedRing = ({ score, isStudent }: { score: number, isStudent?: boolean }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  
  useEffect(() => {
    const controls = animate(count, score, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [score, count]);

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-48 w-48 shrink-0 items-center justify-center group">
      {/* Background rotating glow */}
      <motion.div 
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,rgba(124,58,237,0.05)_40%,transparent_70%)] opacity-70 group-hover:opacity-100 transition-opacity duration-500 blur-xl" 
      />
      
      <svg className="h-full w-full -rotate-90 transform relative z-10 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" /> {/* Cyber Blue */}
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#9333EA" /> {/* Electric Purple */}
          </linearGradient>
        </defs>
        <circle
          cx="80"
          cy="80"
          r={radius}
          className="stroke-slate-200/30 dark:stroke-white/[0.05]"
          strokeWidth="4"
          fill="none"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          cx="80"
          cy="80"
          r={radius}
          stroke="url(#focusGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          style={{ willChange: "stroke-dashoffset" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center z-20">
        <motion.span 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className={cn(
            "text-4xl font-extrabold flex items-center tracking-tighter",
            isStudent ? "text-slate-900 dark:text-white" : "text-white"
          )}
        >
          <motion.span>{rounded}</motion.span>
        </motion.span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500 dark:text-cyan-400 mt-1">
          WPI Score
        </span>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const { mode } = useMode();
  const navigate = useNavigate();
  const isStudent = mode === "student";
  
  // State for API data
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [focusLoading, setFocusLoading] = useState(false);

  // Handle starting a focus session
  const handleStartSession = async (duration: number) => {
    try {
      setFocusLoading(true);
      const response = await fetch("http://localhost:5000/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Navigate to FocusMode with session info
        navigate("/focus", { state: { sessionId: data.session_id, duration } });
      }
    } catch (err) {
      console.error("Failed to start session:", err);
    } finally {
      setFocusLoading(false);
    }
  };

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("http://localhost:5000/stats");
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch stats");
        // Keep previous stats or use defaults
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Poll every 5 seconds for live updates
    const interval = setInterval(fetchStats, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate derived values
  const wpiScore = stats?.wpi_score ?? 0;
  
  // Convert breakdown (seconds) to hours:minutes format and percentages
  const productiveSeconds = stats?.breakdown?.Productive ?? 0;
  const distractionSeconds = stats?.breakdown?.Distraction ?? 0;
  const neutralSeconds = stats?.breakdown?.Neutral ?? 0;
  const totalSeconds = stats?.total_tracked_seconds ?? 0;

  const productiveHours = Math.floor(productiveSeconds / 3600);
  const productiveMinutes = Math.floor((productiveSeconds % 3600) / 60);
  const distractionHours = Math.floor(distractionSeconds / 3600);
  const distractionMinutes = Math.floor((distractionSeconds % 3600) / 60);
  const neutralHours = Math.floor(neutralSeconds / 3600);
  const neutralMinutes = Math.floor((neutralSeconds % 3600) / 60);

  // Format for display
  const deepWorkDisplay = productiveHours > 0 || productiveMinutes > 0 
    ? `${productiveHours}h ${productiveMinutes}m`
    : "0h 0m";
  const distractionDisplay = distractionHours > 0 || distractionMinutes > 0
    ? `${distractionHours}h ${distractionMinutes}m`
    : "0h 0m";
  const breakDisplay = neutralHours > 0 || neutralMinutes > 0
    ? `${neutralHours}h ${neutralMinutes}m`
    : "0h 0m";

  // Calculate pie chart percentages
  const pieData = totalSeconds > 0 
    ? [
        { name: "Productive", value: Math.round((productiveSeconds / totalSeconds) * 100) },
        { name: "Neutral", value: Math.round((neutralSeconds / totalSeconds) * 100) },
        { name: "Distracting", value: Math.round((distractionSeconds / totalSeconds) * 100) },
      ]
    : defaultPieData;

  // Calculate daily goal progress (assume 4h 30m = 16200 seconds)
  const dailyGoalSeconds = 16200;
  const progressPercentage = totalSeconds > 0 
    ? Math.min(Math.round((productiveSeconds / dailyGoalSeconds) * 100), 100)
    : 0;

  // Mock data for new smart components
  const mockActions = [
    {
      id: "action-1",
      title: "Start a 25-minute focus session",
      description: "You've been productive lately. Capitalize on the momentum!",
      actionLabel: "Start Now",
      actionHandler: () => console.log("Start focus"),
      priority: "high" as const,
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      id: "action-2",
      title: "Reduce social media usage",
      description: "Social media usage increased by 35% this week. Block distracting sites.",
      actionLabel: "Enable Blocker",
      actionHandler: () => console.log("Enable blocker"),
      priority: "medium" as const,
      icon: <AlertCircle className="h-5 w-5" />,
    },
    {
      id: "action-3",
      title: "Your productivity drops after 2 PM",
      description: "Schedule breaks earlier to maintain focus throughout the day.",
      actionLabel: "Adjust Schedule",
      actionHandler: () => console.log("Adjust schedule"),
      priority: "medium" as const,
      icon: <Clock className="h-5 w-5" />,
    },
  ];

  const mockInsights = [
    {
      title: "Deep Work Improved",
      value: "+2h",
      trend: 12,
      description: "You've improved deep work by 2 hours compared to last week",
      type: "positive" as const,
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      title: "Distraction Time",
      value: "-45m",
      trend: -8,
      description: "Distractions reduced by 45 minutes this week",
      type: "positive" as const,
      icon: <TrendingDown className="h-5 w-5" />,
    },
    {
      title: "Focus Consistency",
      value: "87%",
      trend: 5,
      description: "You maintained 87% focus consistency over this week",
      type: "positive" as const,
      icon: <Target className="h-5 w-5" />,
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className={cn("space-y-6 pb-12 relative", isStudent ? "font-sans" : "font-sans tracking-tight")}>
      
      {/* Top Section: Ring & Quick Action */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Banner Card */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isStudent ? 0.6 : 0.4 }}
          style={{ willChange: "transform, opacity" }}
          className={cn(
            "col-span-1 lg:col-span-2 relative overflow-hidden",
            isStudent 
              ? "rounded-[2.5rem] border border-white/60 bg-white/60 p-8 md:p-10 shadow-2xl backdrop-blur-md dark:border-slate-800/50 dark:bg-[#111827]/60" 
              : "rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
          )}
        >
          {/* Animated decorative blobs (Student Only) */}
          {isStudent && (
            <>
              <motion.div 
                animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                style={{ willChange: "transform" }}
                className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(91,140,255,0.15)_0%,transparent_70%)] pointer-events-none" 
              />
              <motion.div 
                animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
                transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
                style={{ willChange: "transform" }}
                className="absolute right-40 -bottom-20 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15)_0%,transparent_70%)] pointer-events-none" 
              />
            </>
          )}
          
          {/* Corporate geometric background */}
          {!isStudent && (
             <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-slate-100/50 to-transparent dark:from-slate-800/30 pointer-events-none" />
          )}
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full">
            {loading ? (
              <div className="relative flex h-48 w-48 shrink-0 items-center justify-center">
                <div className="animate-spin rounded-full h-full w-full border-4 border-slate-200/20 dark:border-white/10 border-t-[#5B8CFF]" />
              </div>
            ) : (
              <AnimatedRing score={wpiScore} isStudent={isStudent} />
            )}
            <div className="flex-1 text-center md:text-left">
              <div className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold mb-4 shadow-sm",
                isStudent 
                  ? "rounded-full bg-[#5B8CFF]/10 text-[#5B8CFF] border border-[#5B8CFF]/20 backdrop-blur-md" 
                  : "rounded-md bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 uppercase tracking-wider"
              )}>
                 {isStudent ? <Sparkles className="h-3.5 w-3.5" /> : <Briefcase className="h-3.5 w-3.5" />} 
                 {isStudent ? "Daily Insights" : "Performance Update"}
              </div>
              <h2 className={cn(
                "mb-3 font-extrabold",
                isStudent ? "text-slate-900 dark:text-white text-4xl tracking-tight" : "text-white text-3xl tracking-tight"
              )}>
                {isStudent ? "Great Focus Today!" : "Efficiency Optimal"}
              </h2>
              <p className={cn(
                "mb-8 max-w-md",
                isStudent 
                  ? "text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium" 
                  : "text-[#A1A1AA] text-sm leading-relaxed"
              )}>
                {isStudent 
                  ? "You're on a streak! 🔥 You're in the top 15% of users. Ready for another session?"
                  : "Performance is in the top 15% quartile. Your deep work streak is at 4 days."}
              </p>
              <Link to="/focus">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative inline-flex items-center justify-center px-8 py-3.5 font-semibold text-white transition-all duration-300 rounded-xl group bg-transparent shadow-[0_0_20px_rgba(34,211,238,0)] hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                >
                  <div className="absolute inset-0 w-full h-full border border-white/20 rounded-xl group-hover:border-cyan-500/50 transition-colors" />
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500 blur-sm" />
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500" />
                  <Play className="mr-2 h-4 w-4 fill-current text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                  <span className="relative z-10 text-sm tracking-wide">{isStudent ? "Start Pomodoro" : "Start Focus Session"}</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Goal Widget */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: isStudent ? 0.6 : 0.4, delay: 0.2 }}
          className={cn(
            "col-span-1 relative overflow-hidden flex flex-col justify-between group transition-all",
            isStudent 
              ? "rounded-[2.5rem] border border-white/60 bg-gradient-to-br from-white/80 to-white/40 p-8 shadow-xl backdrop-blur-xl dark:border-slate-800/50 dark:from-[#111827]/80 dark:to-[#111827]/40 hover:border-[#7C3AED]/50" 
              : "rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:border-cyan-500/30"
          )}
        >
          {isStudent && <div className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/5 to-transparent pointer-events-none" />}
          
          <div className="relative z-10">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("flex items-center justify-center rounded-xl shadow-inner", isStudent ? "p-2.5 bg-[#7C3AED]/10 text-[#7C3AED]" : "h-10 w-10 bg-white/5 border border-white/10 text-cyan-400")}>
                     <Target className="h-5 w-5" />
                  </div>
                  <h3 className={cn("text-xs font-medium uppercase tracking-wider", isStudent ? "text-slate-900 dark:text-[#A1A1AA] text-lg font-bold normal-case tracking-normal" : "text-[#A1A1AA]")}>{isStudent ? "Daily Goal" : "Daily Goal"}</h3>
                </div>
                <button className="text-[#A1A1AA] hover:text-white transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
             </div>
             <p className={cn("font-extrabold mb-1 tracking-tight transform origin-left transition-transform duration-300", isStudent ? "text-slate-900 dark:text-white text-4xl group-hover:scale-105" : "text-white text-3xl")}>
               {loading ? "..." : `${Math.floor(productiveSeconds / 3600)}h ${Math.floor((productiveSeconds % 3600) / 60)}m`}
             </p>
             <p className={cn("text-slate-500 dark:text-[#A1A1AA]", isStudent ? "text-sm font-medium" : "text-xs")}>{isStudent ? "Study Target" : "Deep Work Target"}</p>
          </div>
          <div className="relative z-10 mt-8">
             <div className={cn("flex justify-between mb-2 text-slate-700 dark:text-[#A1A1AA]", isStudent ? "text-sm font-bold" : "text-xs font-medium")}>
               <span>Progress</span>
               <span className={cn(isStudent ? "text-[#7C3AED]" : "text-white font-bold")}>{progressPercentage}%</span>
             </div>
             <div className={cn("w-full overflow-hidden bg-slate-200/50 dark:bg-white/5", isStudent ? "h-3 rounded-full backdrop-blur-sm border border-black/5 dark:border-white/5 p-0.5" : "h-1.5 rounded-full")}>
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${progressPercentage}%` }} 
                  transition={{ duration: isStudent ? 1.5 : 0.8, delay: 0.5, ease: "easeOut" }}
                  className={cn(
                    "h-full relative overflow-hidden",
                    isStudent 
                      ? "bg-gradient-to-r from-[#7C3AED] to-[#5B8CFF] rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)]" 
                      : "bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  )}
                >
                  {isStudent ? (
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                    />
                  ) : (
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                    />
                  )}
                </motion.div>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Current App Indicator - Real-time Activity Tracking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <CurrentAppIndicator isStudent={isStudent} />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={isStudent ? "Study Time" : "Deep Work Hours"} value={deepWorkDisplay} icon={Clock} trend="+12%" positive delay={0.1} mode={mode} />
        <StatCard title="Distracting Time" value={distractionDisplay} icon={ZapOff} trend="-5%" positive delay={0.2} mode={mode} />
        <StatCard title="Break Time" value={breakDisplay} icon={Zap} trend="+2%" positive={false} delay={0.3} mode={mode} />
        <StatCard title={isStudent ? "Focus Streak 🔥" : "Tasks Completed"} value={isStudent ? "4 Days" : "12"} icon={isStudent ? TrendingUp : Briefcase} trend={isStudent ? "+1" : "+3"} positive delay={0.4} mode={mode} />
      </div>


      {/* Focus Panel & Streak Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Focus Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <FocusPanel
            lastSessionData={{
              duration: "45m",
              efficiency: 92,
              date: "Today at 10:30 AM",
            }}
            onStartSession={handleStartSession}
            isLoading={focusLoading}
          />
        </motion.div>

        {/* Focus Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <FocusStreak
            currentStreak={4}
            longestStreak={12}
            todayFocusTime={135}
            goalTime={270}
            compact={false}
          />
        </motion.div>
      </div>

      {/* Action Panel - Smart Recommendations */}
      <ActionPanel actions={mockActions} />

      {/* Insights Grid - Behavioral Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="space-y-4"
      >
        <h3 className={cn(
          "text-lg font-bold flex items-center gap-2",
          isStudent ? "text-slate-900 dark:text-white" : "text-white"
        )}>
          <TrendingUp className="h-5 w-5 text-[#5B8CFF] dark:text-cyan-400" />
          Performance Insights
        </h3>
        <InsightGrid insights={mockInsights} />
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: isStudent ? 0.6 : 0.4, delay: 0.5 }}
        className="grid gap-6 lg:grid-cols-2"
      >
        {/* Line Chart */}
        <TiltCard className={cn(
          "h-full flex flex-col transition-all",
          isStudent 
            ? "p-8 rounded-[2rem] border border-white/60 bg-white/40 shadow-lg backdrop-blur-xl dark:border-slate-800/50 dark:bg-[#111827]/40" 
            : "p-0 rounded-2xl border-0 bg-transparent"
        )}>
          <div className={cn("flex flex-col h-full", !isStudent && "p-5")}>
            <div className="mb-6 flex items-center justify-between">
              <h3 className={cn(isStudent ? "text-slate-900 dark:text-white text-xl font-bold" : "text-white text-base font-semibold tracking-wide")}>Weekly Trends</h3>
              <select className={cn(
                "px-3 py-1.5 text-xs focus:outline-none focus:ring-2 cursor-pointer transition-colors outline-none appearance-none",
                isStudent 
                  ? "rounded-xl border border-slate-200/50 bg-white/50 font-medium shadow-sm backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white focus:ring-[#5B8CFF]/50" 
                  : "rounded-md border border-white/10 bg-white/5 text-[#A1A1AA] font-medium hover:text-white hover:bg-white/10"
              )}>
                <option className="bg-slate-900">This Week</option>
                <option className="bg-slate-900">Last Week</option>
              </select>
            </div>
            <div className="flex-1 min-h-[250px] w-full relative mt-2">
               {/* Chart Background Glow (Student Only) */}
               {isStudent && <div className="absolute inset-0 bg-[#5B8CFF]/5 blur-3xl rounded-full pointer-events-none" />}
               
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs key="defs">
                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isStudent ? "#5B8CFF" : "#22D3EE"} stopOpacity={isStudent ? 0.6 : 0.2}/>
                      <stop offset="95%" stopColor={isStudent ? "#5B8CFF" : "#9333EA"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid key="grid" strokeDasharray="4 4" vertical={false} stroke={isStudent ? "#334155" : "#ffffff"} opacity={isStudent ? 0.15 : 0.05} />
                  <XAxis key="xaxis" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isStudent ? '#64748b' : '#71717a', fontWeight: isStudent ? 500 : 400 }} dy={10} />
                  <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isStudent ? '#64748b' : '#71717a', fontWeight: isStudent ? 500 : 400 }} />
                  <Tooltip 
                    key="tooltip"
                    contentStyle={{ 
                      borderRadius: isStudent ? '16px' : '8px', 
                      border: isStudent ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.1)', 
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)', 
                      backgroundColor: isStudent ? 'rgba(15, 23, 42, 0.85)' : 'rgba(9, 9, 11, 0.9)', 
                      backdropFilter: 'blur(12px)', 
                      color: '#fff', 
                      padding: '12px' 
                    }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    cursor={{ stroke: isStudent ? 'rgba(91,140,255,0.2)' : 'rgba(34,211,238,0.2)', strokeWidth: 2, strokeDasharray: '4 4' }}
                  />
                  <Area 
                    key="area"
                    type={isStudent ? "monotone" : "linear"} 
                    dataKey="focus" 
                    stroke={isStudent ? "#5B8CFF" : "#3B82F6"} 
                    strokeWidth={isStudent ? 4 : 2} 
                    fillOpacity={1} 
                    fill="url(#colorFocus)" 
                    activeDot={{ 
                      r: isStudent ? 8 : 6, 
                      fill: isStudent ? '#5B8CFF' : '#22D3EE', 
                      stroke: isStudent ? '#fff' : '#09090b', 
                      strokeWidth: isStudent ? 3 : 2
                    }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TiltCard>

        {/* Breakdown Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pie Chart */}
          <TiltCard className={cn(
            "flex flex-col items-center",
            isStudent 
              ? "p-8 rounded-[2rem] border border-white/60 bg-white/40 shadow-lg backdrop-blur-xl dark:border-slate-800/50 dark:bg-[#111827]/40" 
              : "p-0 rounded-2xl border-0 bg-transparent"
          )}>
            <div className={cn("flex flex-col h-full w-full", !isStudent && "p-5")}>
              <h3 className={cn("mb-4 w-full", isStudent ? "text-slate-900 dark:text-white text-lg font-bold" : "text-white text-base font-semibold tracking-wide")}>Time Breakdown</h3>
              <div className="flex-1 w-full relative min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      key="pie"
                      data={loading ? defaultPieData : pieData}
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={4}
                    >
                      {(loading ? defaultPieData : pieData).map((entry, index) => (
                        <Cell 
                          key={`pie-chart-cell-${index}-${entry.name}`} 
                          fill={isStudent ? COLORS[index % COLORS.length] : (index === 0 ? "#22D3EE" : index === 1 ? "#3f3f46" : "#71717a")} 
                          style={{ filter: isStudent ? `drop-shadow(0px 4px 6px ${COLORS[index]}40)` : 'none' }} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      key="tooltip"
                      contentStyle={{ 
                        borderRadius: isStudent ? '12px' : '8px', 
                        border: isStudent ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.1)', 
                        backgroundColor: isStudent ? 'rgba(15, 23, 42, 0.85)' : 'rgba(9, 9, 11, 0.9)', 
                        backdropFilter: 'blur(12px)', 
                        padding: '10px' 
                      }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="mt-2 flex flex-wrap justify-center gap-2 text-[10px] font-medium w-full">
                {(loading ? defaultPieData : pieData).map((entry, index) => (
                  <div key={`legend-${index}-${entry.name}`} className={cn(
                    "flex items-center gap-1.5 px-2 py-1",
                    isStudent ? "bg-white/50 dark:bg-slate-800/50 rounded-full shadow-sm" : ""
                  )}>
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: isStudent ? COLORS[index] : (index === 0 ? "#22D3EE" : index === 1 ? "#3f3f46" : "#71717a") }} />
                    <span className="text-slate-600 dark:text-[#A1A1AA]">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>

          {/* Bar Chart */}
          <TiltCard className={cn(
            "flex flex-col",
            isStudent 
              ? "p-8 rounded-[2rem] border border-white/60 bg-white/40 shadow-lg backdrop-blur-xl dark:border-slate-800/50 dark:bg-[#111827]/40" 
              : "p-0 rounded-2xl border-0 bg-transparent"
          )}>
            <div className={cn("flex flex-col h-full w-full", !isStudent && "p-5")}>
              <div className="flex items-center justify-between mb-4">
                 <h3 className={cn(isStudent ? "text-slate-900 dark:text-white text-lg font-bold" : "text-white text-base font-semibold tracking-wide")}>Top Apps</h3>
                 <button className={cn("text-xs hover:underline", isStudent ? "font-bold text-[#5B8CFF]" : "font-medium text-[#A1A1AA] hover:text-white")}>View All</button>
              </div>
              <div className="flex-1 w-full min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis key="xaxis" type="number" hide />
                    <YAxis key="yaxis" dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isStudent ? '#64748b' : '#71717a', fontWeight: isStudent ? 600 : 500 }} />
                    <Tooltip 
                      key="tooltip"
                      cursor={{fill: isStudent ? 'rgba(91,140,255,0.05)' : 'rgba(255,255,255,0.02)', radius: 4}}
                      contentStyle={{ 
                        borderRadius: isStudent ? '12px' : '8px', 
                        border: isStudent ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.1)', 
                        backgroundColor: isStudent ? 'rgba(15, 23, 42, 0.85)' : 'rgba(9, 9, 11, 0.9)', 
                        backdropFilter: 'blur(12px)' 
                      }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Bar key="bar" dataKey="hours" fill={isStudent ? "#7C3AED" : "#3B82F6"} radius={[0, 4, 4, 0]} barSize={12}>
                      {barData.map((entry, index) => (
                        <Cell 
                          key={`bar-chart-cell-${index}-${entry.name}`} 
                          fill={isStudent ? (index === 0 ? "#5B8CFF" : "#7C3AED") : "#3B82F6"} 
                          fillOpacity={isStudent ? (1 - index * 0.15) : (1 - index * 0.2)} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TiltCard>
        </div>
      </motion.div>
    </div>
  );
};
