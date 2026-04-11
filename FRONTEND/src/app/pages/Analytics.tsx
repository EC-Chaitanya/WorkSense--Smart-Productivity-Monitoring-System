import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, useMotionValue, useSpring, useTransform, animate } from "motion/react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { Clock, TrendingUp, Zap, ZapOff, Play, CheckCircle, Target, Activity } from "lucide-react";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { TiltCard } from "../components/TiltCard";
import { cn } from "../utils";

// Mock Data
const trendData = [
  { name: "Week 1", score: 65, avg: 70 },
  { name: "Week 2", score: 72, avg: 71 },
  { name: "Week 3", score: 68, avg: 72 },
  { name: "Week 4", score: 85, avg: 73 },
  { name: "Week 5", score: 82, avg: 74 },
  { name: "Week 6", score: 90, avg: 75 },
];

const timeDistribution = [
  { name: "Deep Work", value: 55 },
  { name: "Meetings", value: 20 },
  { name: "Breaks", value: 15 },
  { name: "Admin", value: 10 },
];

const appUsage = [
  { name: "VS Code", hours: 24.5 },
  { name: "Figma", hours: 18.2 },
  { name: "Slack", hours: 12.1 },
  { name: "Browser", hours: 8.5 },
  { name: "Notion", hours: 5.4 },
];

const COLORS = ["#5B8CFF", "#7C3AED", "#94A3B8", "#475569"];

const AnimatedScoreRing = ({ score }: { score: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const controls = animate(count, score, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [score, count]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-56 w-56 items-center justify-center">
      <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={radius}
          className="stroke-slate-100 dark:stroke-slate-800"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="80"
          cy="80"
          r={radius}
          className="stroke-[#5B8CFF]"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          style={{ filter: "drop-shadow(0 0 4px rgba(91,140,255,0.3))", willChange: "stroke-dashoffset" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-5xl font-bold tracking-tighter text-slate-900 dark:text-white flex items-center">
          <motion.span>{rounded}</motion.span><span className="text-2xl text-slate-400">%</span>
        </span>
        <span className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-500">
          Efficiency
        </span>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, trend, positive, delay }: any) => (
  <TiltCard>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex h-full flex-col justify-between rounded-[20px] border border-slate-200 bg-white/90 backdrop-blur-sm p-6 shadow-sm transition-all dark:border-slate-800 dark:bg-[#111827]/90"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
          <Icon className="h-5 w-5" />
        </div>
        <div className={cn(
          "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium",
          positive 
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
            : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
        )}>
          <TrendingUp className={cn("h-3 w-3", !positive && "rotate-180")} />
          {trend}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</h4>
        <p className="mt-1 text-sm font-medium text-slate-500">{title}</p>
      </div>
    </motion.div>
  </TiltCard>
);

export const Analytics = () => {
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12 font-sans tracking-tight">
      
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics Overview</h1>
          <p className="mt-1 text-slate-500">Monitor your team's productivity and focus patterns.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setIsFocusModalOpen(true)}
          className="shadow-md transition-all hover:scale-105 hover:shadow-lg dark:shadow-[0_0_15px_rgba(91,140,255,0.2)]"
        >
          <Play className="mr-2 h-4 w-4 fill-current" />
          Start Focus Session
        </Button>
      </div>

      <Modal isOpen={isFocusModalOpen} onClose={() => setIsFocusModalOpen(false)} title="New Focus Session">
        <div className="space-y-4">
          <p className="text-sm">Select a focus mode configuration before you begin your deep work session.</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-[#5B8CFF] bg-[#5B8CFF]/10 text-[#5B8CFF] transition-all">
              <Target className="h-6 w-6 mb-2" />
              <span className="font-semibold text-sm">Deep Work</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-[#7C3AED] hover:bg-[#7C3AED]/10 hover:text-[#7C3AED] transition-all">
              <Activity className="h-6 w-6 mb-2" />
              <span className="font-semibold text-sm">Pomodoro</span>
            </button>
          </div>
          <div className="pt-4 flex justify-end">
            <Link to="/focus">
              <Button variant="primary" className="w-full justify-center">Begin Session</Button>
            </Link>
          </div>
        </div>
      </Modal>

      {/* Hero Analytics & Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Score Ring Hero */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-1 flex flex-col items-center justify-center rounded-[20px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#111827]"
        >
          <AnimatedScoreRing score={85} />
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Productivity Score</h3>
            <p className="mt-1 text-sm text-slate-500">Top 12% across your organization</p>
          </div>
        </motion.div>

        {/* 4 Metric Cards */}
        <div className="col-span-1 lg:col-span-2 grid gap-6 sm:grid-cols-2">
          <MetricCard key="metric-1" title="Deep Work Hours" value="32h 15m" icon={Clock} trend="+4.2%" positive delay={0.1} />
          <MetricCard key="metric-2" title="Distraction Time" value="4h 30m" icon={ZapOff} trend="-1.5%" positive delay={0.2} />
          <MetricCard key="metric-3" title="Break Time" value="6h 45m" icon={Zap} trend="+0.8%" positive delay={0.3} />
          <MetricCard key="metric-4" title="Tasks Completed" value="142" icon={CheckCircle} trend="+12" positive delay={0.4} />
        </div>
      </div>

      {/* Data Visualization Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid gap-6 lg:grid-cols-2"
      >
        {/* Line Chart */}
        <div className="flex flex-col rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Productivity Trends</h3>
            <p className="text-sm text-slate-500">Weekly score vs company average</p>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis key="xaxis" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  key="tooltip"
                  contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'var(--tw-colors-white, #fff)', color: '#0f172a' }}
                  itemStyle={{ fontWeight: 500 }}
                  cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line key="line1" type="monotone" dataKey="score" stroke="#5B8CFF" strokeWidth={3} dot={{ r: 4, fill: '#5B8CFF', strokeWidth: 0 }} activeDot={{ r: 6, shadow: '0 0 10px rgba(91,140,255,0.4)' }} />
                <Line key="line2" type="monotone" dataKey="avg" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row for Pie & Bar */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pie Chart */}
          <div className="flex flex-col items-center rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
            <h3 className="mb-6 w-full text-base font-semibold text-slate-900 dark:text-white">Time Distribution</h3>
            <div className="h-[180px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    key="pie"
                    data={timeDistribution}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    stroke="none"
                  >
                    {timeDistribution.map((entry, index) => (
                      <Cell key={`pie-cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    key="tooltip"
                    contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-medium">
              {timeDistribution.map((entry, index) => (
                <div key={`legend-${entry.name}`} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex flex-col rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
             <h3 className="mb-6 w-full text-base font-semibold text-slate-900 dark:text-white">Top Applications</h3>
             <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appUsage} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis key="xaxis" type="number" hide />
                  <YAxis key="yaxis" dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip 
                    key="tooltip"
                    cursor={{fill: 'rgba(0,0,0,0.02)'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}
                  />
                  <Bar key="bar" dataKey="hours" radius={[0, 4, 4, 0]} barSize={12}>
                    {appUsage.map((entry, index) => (
                      <Cell key={`bar-cell-${entry.name}`} fill={index === 0 ? "#5B8CFF" : "#334155"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
