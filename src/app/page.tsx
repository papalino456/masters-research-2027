"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Calendar, 
  Target, 
  CheckCircle2, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  DollarSign,
  ClipboardList,
  TrendingUp,
  Clock,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { universities, getDaysUntil, timeline } from "@/lib/data";
import RequirementsTracker from "@/components/RequirementsTracker";
import FinancialRoadmap from "@/components/FinancialRoadmap";
import Timeline from "@/components/Timeline";

type TabId = "overview" | "requirements" | "finances" | "timeline";

const tabs = [
  { id: "overview" as const, label: "Overview", icon: Target },
  { id: "requirements" as const, label: "Requirements", icon: ClipboardList },
  { id: "finances" as const, label: "Finances", icon: DollarSign },
  { id: "timeline" as const, label: "Timeline", icon: Clock },
];

// Get next critical deadline
function getNextCriticalDeadline() {
  const upcoming = timeline
    .filter(e => getDaysUntil(e.date) >= 0 && e.critical)
    .sort((a, b) => getDaysUntil(a.date) - getDaysUntil(b.date))[0];
  return upcoming;
}

function OverviewTab() {
  const nextDeadline = getNextCriticalDeadline();
  const daysUntil = nextDeadline ? getDaysUntil(nextDeadline.date) : null;

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap size={14} className="text-blue-500" />
            <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Programs</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100">{universities.length}</div>
          <div className="text-xs text-zinc-500">Target schools</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-green-500/5 border border-green-500/30 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-green-500" />
            <span className="text-[10px] text-green-500/70 uppercase tracking-wider">Priority</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100">TUM</div>
          <div className="text-xs text-zinc-500">Best value option</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "p-4 rounded-xl",
            daysUntil && daysUntil <= 60 
              ? "bg-red-500/5 border border-red-500/30" 
              : "bg-orange-500/5 border border-orange-500/30"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className={daysUntil && daysUntil <= 60 ? "text-red-500" : "text-orange-500"} />
            <span className={cn(
              "text-[10px] uppercase tracking-wider",
              daysUntil && daysUntil <= 60 ? "text-red-500/70" : "text-orange-500/70"
            )}>Next Deadline</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100">{daysUntil ?? "—"}</div>
          <div className="text-xs text-zinc-500">Days remaining</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-purple-500/5 border border-purple-500/30 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target size={14} className="text-purple-500" />
            <span className="text-[10px] text-purple-500/70 uppercase tracking-wider">Goal</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100">Fall '27</div>
          <div className="text-xs text-zinc-500">Start semester</div>
        </motion.div>
      </div>

      {/* Next Deadline Banner */}
      {nextDeadline && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-transparent border border-red-500/20 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-red-500 uppercase tracking-widest mb-1">
                Next Critical Deadline
              </div>
              <h3 className="text-xl font-bold text-zinc-100">{nextDeadline.title}</h3>
              <p className="text-sm text-zinc-500 mt-1">{nextDeadline.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold font-mono text-red-400">{daysUntil}</div>
              <div className="text-[10px] text-zinc-600 uppercase">Days Left</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* University Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900/50 border border-zinc-900 rounded-xl overflow-hidden backdrop-blur-sm">
        {universities.map((program, idx) => (
          <motion.div
            key={program.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 * idx }}
            className="group p-6 bg-[#0a0a0a] hover:bg-zinc-900/40 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn(
                "px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold",
                program.status === "priority" && "bg-green-500/10 text-green-500 border border-green-500/30",
                program.status === "target" && "bg-blue-500/10 text-blue-500 border border-blue-500/30",
                program.status === "aspirational" && "bg-purple-500/10 text-purple-500 border border-purple-500/30"
              )}>
                {program.status}
              </div>
              <a 
                href={program.url} 
                target="_blank" 
                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-blue-400 transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </div>

            <h2 className="text-xl font-bold text-zinc-100 mb-1 group-hover:text-blue-400 transition-colors">
              {program.name}
            </h2>
            
            <div className="flex items-center gap-2 text-zinc-500 text-sm mb-4">
              <MapPin size={14} />
              <span>{program.location}, {program.country}</span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-3">
                <Target size={12} className="text-blue-500" />
                <span className="text-xs text-zinc-400">{program.program}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={12} className="text-orange-500" />
                <span className="text-xs text-zinc-400">
                  Deadline: <span className="text-zinc-200">{program.deadline}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign size={12} className="text-green-500" />
                <span className="text-xs text-green-500/80">{program.tuition}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-900">
              <div className="flex flex-wrap gap-1.5">
                {program.highlights.slice(0, 2).map(highlight => (
                  <span 
                    key={highlight}
                    className="px-2 py-1 bg-zinc-900/50 border border-zinc-800 rounded text-[9px] text-zinc-500"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 font-mono">
      {/* Header */}
      <header className="mb-12 space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-blue-500 text-xs font-bold tracking-[0.2em] uppercase"
        >
          <CheckCircle2 size={14} />
          <span>Masters Research Dashboard</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-zinc-100 tracking-tight"
        >
          FALL 2027 <br />
          <span className="text-zinc-600">AI & ROBOTICS</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl text-zinc-500 leading-relaxed text-sm"
        >
          Graduate program tracker for European and US universities. 
          Requirement checklists, financial planning, and application timeline.
        </motion.p>
      </header>

      {/* Navigation Tabs */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex gap-1 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800 w-fit">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg transition-all",
                  activeTab === tab.id
                    ? "bg-zinc-800 text-zinc-100 shadow-lg"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                )}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.nav>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "requirements" && <RequirementsTracker />}
        {activeTab === "finances" && <FinancialRoadmap />}
        {activeTab === "timeline" && <Timeline />}
      </motion.div>

      {/* Footer Meta */}
      <footer className="mt-16 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-zinc-700 uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span>Masters Research v2.0</span>
          <span className="w-1 h-1 rounded-full bg-zinc-800" />
          <span>Last Updated: 2026-02-02</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-800">Sebastian&apos;s Dashboard</span>
          <span className="text-blue-500/50 animate-pulse">● Active</span>
        </div>
      </footer>
    </main>
  );
}
