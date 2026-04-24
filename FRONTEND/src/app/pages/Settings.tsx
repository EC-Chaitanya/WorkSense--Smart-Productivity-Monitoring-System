import React, { useState } from "react";
import { motion } from "motion/react";
import { Button } from "../components/Button";
import { ThemeToggle } from "../components/ThemeToggle";
import { useMode } from "../context/ModeContext";
import { Bell, Shield, Smartphone, Globe, Moon, Monitor, RefreshCw } from "lucide-react";
import { cn } from "../utils";

const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={cn(
      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#5B8CFF] focus:ring-offset-2",
      checked ? "bg-[#5B8CFF]" : "bg-slate-200 dark:bg-slate-700"
    )}
  >
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    />
  </button>
);

const SettingRow = ({ icon: Icon, title, description, control }: any) => (
  <div className="flex items-start justify-between py-5 border-b border-slate-200/50 dark:border-slate-800/50 last:border-0">
    <div className="flex gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">{description}</p>
      </div>
    </div>
    <div className="ml-4">{control}</div>
  </div>
);

export const Settings = () => {
  const { mode, setMode } = useMode();
  
  const [settings, setSettings] = useState({
    notifications: true,
    strictMode: false,
    appBlocker: true,
    syncDevice: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_250px]">
        {/* Main Settings Area */}
        <div className="space-y-6">
          {/* Appearance Section */}
          <section className="rounded-3xl border border-slate-200 bg-white/60 backdrop-blur-md p-6 shadow-sm dark:border-slate-800/50 dark:bg-[#111827]/60">
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200/50 pb-2 dark:border-slate-800/50">
              Appearance & Mode
            </h3>
            <SettingRow
              icon={RefreshCw}
              title="Experience Mode"
              description="Switch between Student and Corporate interfaces dynamically."
              control={
                <select 
                  value={mode}
                  onChange={(e) => setMode(e.target.value as "student" | "corporate")}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B8CFF]/50 cursor-pointer"
                >
                  <option value="student">Student Mode</option>
                  <option value="corporate">Corporate Mode</option>
                </select>
              }
            />
            <SettingRow
              icon={Moon}
              title="Theme Preference"
              description="Switch between light and dark mode for a better viewing experience."
              control={<ThemeToggle />}
            />
          </section>

          {/* Focus & Notifications */}
          <section className="rounded-3xl border border-slate-200 bg-white/60 backdrop-blur-md p-6 shadow-sm dark:border-slate-800/50 dark:bg-[#111827]/60">
             <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200/50 pb-2 dark:border-slate-800/50">
              Focus & Notifications
            </h3>
            <SettingRow
              icon={Bell}
              title="Push Notifications"
              description="Receive alerts for focus sessions, breaks, and daily goal achievements."
              control={<ToggleSwitch checked={settings.notifications} onChange={() => toggle('notifications')} />}
            />
            <SettingRow
              icon={Shield}
              title="Strict Focus Mode"
              description="Automatically blocks all distracting websites and apps during active sessions."
              control={<ToggleSwitch checked={settings.strictMode} onChange={() => toggle('strictMode')} />}
            />
          </section>

          {/* Integrations */}
           <section className="rounded-3xl border border-slate-200 bg-white/60 backdrop-blur-md p-6 shadow-sm dark:border-slate-800/50 dark:bg-[#111827]/60">
             <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200/50 pb-2 dark:border-slate-800/50">
              Integrations & Devices
            </h3>
            <SettingRow
              icon={Globe}
              title="Browser Extension"
              description="Track website usage and enforce blockers across all Chrome-based browsers."
              control={<ToggleSwitch checked={settings.appBlocker} onChange={() => toggle('appBlocker')} />}
            />
            <SettingRow
              icon={Smartphone}
              title="Sync Mobile App"
              description="Synchronize focus sessions and stats with the WorkSense iOS/Android app."
              control={<ToggleSwitch checked={settings.syncDevice} onChange={() => toggle('syncDevice')} />}
            />
          </section>

          <div className="flex justify-end gap-4 mt-8">
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>

        {/* Sidebar details */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white/60 backdrop-blur-md p-6 dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Current Plan</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#5B8CFF]/20 to-[#7C3AED]/20 text-[#7C3AED]">
                <Monitor className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold capitalize">{mode} Pro</p>
                <p className="text-xs text-slate-500">$4.99 / mo</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">Manage Subscription</Button>
          </div>

          <div className="rounded-3xl border border-red-200/50 bg-red-50/50 backdrop-blur-md p-6 dark:border-red-900/20 dark:bg-red-900/10 shadow-sm">
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Permanently delete your account and all focus data.</p>
            <Button variant="outline" size="sm" className="w-full border-red-200 text-red-600 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
