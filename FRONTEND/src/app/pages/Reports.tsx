import React, { useState } from "react";
import { motion } from "motion/react";
import { FileText, Download, Sparkles, Brain, AlertCircle, CheckCircle2, TrendingUp, Mail } from "lucide-react";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { TiltCard } from "../components/TiltCard";
import { cn } from "../utils";

// Mock Data for the table (Examiners love seeing raw data tables in FYPs)
const rawData = [
  { id: 1, date: "2023-10-24", session: "Morning Deep Work", duration: "2h 15m", efficiency: "92%", status: "Excellent" },
  { id: 2, date: "2023-10-24", session: "Afternoon Review", duration: "1h 30m", efficiency: "78%", status: "Good" },
  { id: 3, date: "2023-10-23", session: "Project Architecture", duration: "3h 00m", efficiency: "85%", status: "Great" },
  { id: 4, date: "2023-10-23", session: "Email & Admin", duration: "0h 45m", efficiency: "60%", status: "Distracted" },
  { id: 5, date: "2023-10-22", session: "Algorithm Research", duration: "2h 45m", efficiency: "88%", status: "Great" },
];

const InsightCard = ({ title, description, icon: Icon, type, delay }: any) => {
  const isPositive = type === "positive";
  const isWarning = type === "warning";
  const isNeutral = type === "neutral";

  return (
    <TiltCard className="h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="flex h-full items-start gap-4 rounded-[20px] border border-slate-200 bg-white/90 backdrop-blur-sm p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]/90"
        style={{ willChange: "transform, opacity" }}
      >
        <div className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-inner",
          isPositive ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
          isWarning ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" :
          "bg-[#5B8CFF]/10 text-[#5B8CFF]"
        )}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">{title}</h4>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
        </div>
      </motion.div>
    </TiltCard>
  );
};

export const Reports = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const confirmExport = () => {
    setIsExportModalOpen(false);
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 1500); // Mock export delay
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12 font-sans tracking-tight">
      
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports & AI Insights</h1>
          <p className="mt-1 text-slate-500">System generated behavioral analysis and raw data exports.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white dark:bg-[#111827]">
            <FileText className="mr-2 h-4 w-4" />
            CSV Data
          </Button>
          <Button 
            variant="primary" 
            onClick={handleExport}
            disabled={isExporting}
            className="shadow-md transition-all w-40 justify-center"
          >
            {isExporting ? (
              <span className="flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Sparkles className="h-4 w-4" />
                </motion.div>
                Generating...
              </span>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4 fill-current" />
                Export PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Insights Section (Great for FYP presentation to show "Smart" features) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-[#7C3AED]" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Predictive Insights</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <InsightCard 
            type="neutral"
            icon={TrendingUp}
            title="Peak Performance Window"
            description="Your productivity score peaks between 09:00 AM and 11:30 AM. Consider scheduling complex architectural tasks during this window."
            delay={0.1}
          />
          <InsightCard 
            type="warning"
            icon={AlertCircle}
            title="Distraction Vulnerability"
            description="High frequency of context-switching detected on Friday afternoons. We recommend enabling Strict Focus Mode during these hours."
            delay={0.2}
          />
          <InsightCard 
            type="positive"
            icon={CheckCircle2}
            title="Sustained Deep Work"
            description="You have successfully increased your average deep work block duration by 15% this week compared to your historical baseline."
            delay={0.3}
          />
        </div>
      </div>

      {/* Raw Data Table (Crucial for academic projects to show data tracking) */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Raw Session Logs</h2>
        <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-[#111827]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">Date</th>
                  <th className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">Session Type</th>
                  <th className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">Duration</th>
                  <th className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">Efficiency</th>
                  <th className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">System Tag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {rawData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors">
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{row.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">{row.session}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{row.duration}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              parseInt(row.efficiency) > 80 ? "bg-emerald-500" : 
                              parseInt(row.efficiency) > 70 ? "bg-[#5B8CFF]" : "bg-rose-500"
                            )}
                            style={{ width: row.efficiency }}
                          />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-slate-200">{row.efficiency}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                        row.status === "Excellent" || row.status === "Great" 
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : row.status === "Good"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                      )}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-4 text-center dark:border-slate-800 dark:bg-slate-800/20">
            <button className="text-sm font-medium text-[#5B8CFF] hover:text-[#7C3AED] transition-colors">
              View All 142 Records
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} title="Export Report">
        <div className="space-y-4">
          <p className="text-sm">Choose your export preferences for the behavior analysis report.</p>
          <div className="space-y-3 mt-4">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
              <input type="radio" name="export-type" className="h-4 w-4 text-[#5B8CFF] focus:ring-[#5B8CFF]" defaultChecked />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Full Analysis Report</p>
                <p className="text-xs text-slate-500">Includes AI insights and graphs (PDF)</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
              <input type="radio" name="export-type" className="h-4 w-4 text-[#5B8CFF] focus:ring-[#5B8CFF]" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Executive Summary</p>
                <p className="text-xs text-slate-500">1-page high-level metrics (PDF)</p>
              </div>
            </label>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsExportModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={confirmExport}>
              <Mail className="mr-2 h-4 w-4" />
              Send to Email
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};