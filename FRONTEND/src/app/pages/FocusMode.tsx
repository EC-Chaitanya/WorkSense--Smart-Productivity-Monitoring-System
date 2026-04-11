import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, Square, X, Maximize2, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "../components/Button";
import { useMode } from "../context/ModeContext";
import { cn } from "../utils";

export const FocusMode = () => {
  const navigate = useNavigate();
  const { mode } = useMode();
  const isStudent = mode === "student";
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a sound or show a notification here in a real app
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Immersive layout takes over the whole screen (using fixed positioning)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4 }}
      className={cn("fixed inset-0 z-50 flex flex-col items-center justify-center text-white", isStudent ? "bg-[#050B14]" : "bg-[#0B1120]")}
    >
      {/* Soft pulsating background when active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isStudent ? [0.3, 0.6, 0.3] : [0.1, 0.2, 0.1] }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: isStudent ? 4 : 8, ease: "easeInOut" }}
            className={cn(
              "pointer-events-none absolute inset-0", 
              isStudent 
                ? "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#5B8CFF]/20 via-transparent to-transparent" 
                : "bg-gradient-to-b from-slate-800/20 to-transparent"
            )}
          />
        )}
      </AnimatePresence>

      <div className="absolute top-8 left-8 flex gap-2 items-center text-white/50 font-medium">
        {isStudent ? <GraduationCap className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
        <span>{isStudent ? "Study Session" : "Deep Work Session"}</span>
      </div>

      <div className="absolute top-8 right-8 flex gap-4 z-10">
        <button 
          onClick={() => setIsFullscreen(!isFullscreen)} 
          className="rounded-full bg-white/10 p-3 hover:bg-white/20 transition-colors"
        >
          <Maximize2 className="h-5 w-5" />
        </button>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="rounded-full bg-white/10 p-3 hover:bg-white/20 transition-colors text-red-400 hover:text-red-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="z-10 text-center">
        <motion.div
          animate={{ scale: isActive ? (isStudent ? 1.02 : 1.01) : 1 }}
          transition={{ repeat: isActive ? Infinity : 0, repeatType: "reverse", duration: isStudent ? 2 : 4 }}
          className="mb-12 font-mono text-[8rem] md:text-[12rem] font-bold tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50"
          style={{ textShadow: isActive && isStudent ? '0 0 80px rgba(91,140,255,0.4)' : 'none' }}
        >
          {formatTime(timeLeft)}
        </motion.div>

        <div className="flex items-center justify-center gap-6">
          {isActive ? (
             <Button onClick={toggleTimer} variant={isStudent ? "secondary" : "ghost"} size="lg" className={cn("rounded-full h-20 w-20 p-0", isStudent ? "shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:shadow-[0_0_50px_rgba(124,58,237,0.7)]" : "bg-white/10 hover:bg-white/20")}>
               <Pause className="h-8 w-8 fill-current" />
             </Button>
          ) : (
             <Button onClick={toggleTimer} variant={isStudent ? "primary" : "secondary"} size="lg" className={cn("rounded-full h-20 w-20 p-0", isStudent ? "shadow-[0_0_30px_rgba(91,140,255,0.5)] hover:shadow-[0_0_50px_rgba(91,140,255,0.7)]" : "bg-white text-black hover:bg-slate-200")}>
               <Play className="h-8 w-8 fill-current ml-2" />
             </Button>
          )}

          <button
            onClick={resetTimer}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 text-white"
          >
            <Square className="h-6 w-6" />
          </button>
        </div>
        
        <p className="mt-12 text-lg text-slate-400 font-medium tracking-wide">
          {isActive ? "Deep work session in progress..." : "Ready to focus?"}
        </p>
      </div>
    </motion.div>
  );
};
