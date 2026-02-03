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
          className="p-4 bg-surface-card/50 border border-border-subtle rounded"
        >
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap size={14} className="text-brand-primary" />
            <span className="text-[10px] text-text-dim uppercase tracking-wider">Programs</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100">{universities.length}</div>
          <div className="text-xs text-text-dim">Target schools</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-brand-secondary/5 border border-brand-secondary/30 rounded"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-brand-secondary" />
            <span className="text-[10px] text-brand-secondary/70 uppercase tracking-wider">Priority</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100">TUM</div>
          <div className="text-xs text-text-dim">Best value option</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "p-4 rounded",
            daysUntil && daysUntil <= 60 
              ? "bg-accent-critical/5 border border-accent-critical/30" 
              : "bg-accent-warning/5 border border-accent-warning/30"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className={daysUntil && daysUntil <= 60 ? "text-accent-critical" : "text-accent-warning"} />
            <span className={cn(
              "text-[10px] uppercase tracking-wider",
              daysUntil && daysUntil <= 60 ? "text-accent-critical/70" : "text-accent-warning/70"
            )}>Next Deadline</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100">{daysUntil ?? "—"}</div>
          <div className="text-xs text-text-dim">Days remaining</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-brand-tertiary/5 border border-brand-tertiary/30 rounded"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target size={14} className="text-brand-tertiary" />
            <span className="text-[10px] text-brand-tertiary/70 uppercase tracking-wider">Goal</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100">Fall '27</div>
          <div className="text-xs text-text-dim">Start semester</div>
        </motion.div>
      </div>

      {/* Next Deadline Banner */}
      {nextDeadline && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-gradient-to-r from-accent-critical/10 via-accent-warning/10 to-transparent border border-accent-critical/20 rounded"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-accent-critical uppercase tracking-widest mb-1">
                Next Critical Deadline
              </div>
              <h3 className="text-xl font-bold text-zinc-100">{nextDeadline.title}</h3>
              <p className="text-sm text-text-dim mt-1">{nextDeadline.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold font-mono text-accent-critical/80">{daysUntil}</div>
              <div className="text-[10px] text-text-dim uppercase">Days Left</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* University Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-surface-card/50 border border-surface-card rounded overflow-hidden backdrop-blur-sm">
        {universities.map((program, idx) => (
          <motion.div
            key={program.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 * idx }}
            className="group p-6 bg-[#0a0a0a] hover:bg-surface-card/40 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn(
                "px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold",
                program.status === "priority" && "bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/30",
                program.status === "target" && "bg-brand-primary/10 text-brand-primary border border-brand-primary/30",
                program.status === "aspirational" && "bg-brand-tertiary/10 text-brand-tertiary border border-brand-tertiary/30"
              )}>
                {program.status}
              </div>
              <a 
                href={program.url} 
                target="_blank" 
                className="p-2 rounded hover:bg-border-subtle text-text-dim hover:text-brand-primary transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </div>

            <h2 className="text-xl font-bold text-brand-primary mb-1 group-hover:text-blue-400 transition-colors">
              {program.name}
            </h2>
            
            <div className="flex items-center gap-2 text-text-dim text-sm mb-4">
              <MapPin size={14} />
              <span>{program.location}, {program.country}</span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-3">
                <Target size={12} className="text-brand-primary" />
                <span className="text-xs text-zinc-400">{program.program}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={12} className="text-accent-warning" />
                <span className="text-xs text-zinc-400">
                  Deadline: <span className="text-zinc-200">{program.deadline}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign size={12} className="text-brand-secondary" />
                <span className="text-xs text-brand-secondary/80">{program.tuition}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-surface-card">
              <div className="flex flex-wrap gap-1.5">
                {program.highlights.slice(0, 2).map(highlight => (
                  <span 
                    key={highlight}
                    className="px-2 py-1 bg-surface-card/50 border border-border-subtle rounded text-[9px] text-text-dim"
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
          className="flex items-center gap-2 text-brand-primary text-xs font-bold tracking-[0.2em] uppercase"
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
          className="max-w-xl text-text-dim leading-relaxed text-sm"
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
        <div className="flex gap-1 p-1 bg-surface-card/50 rounded border border-border-subtle w-fit">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded transition-all",
                  activeTab === tab.id
                    ? "bg-border-subtle text-zinc-100 shadow-lg"
                    : "text-text-dim hover:text-zinc-300 hover:bg-border-subtle/50"
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
          <span className="w-1 h-1 rounded-full bg-border-subtle" />
          <span>Last Updated: 2026-02-02</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-border-subtle">Sebastian&apos;s Dashboard</span>
          <span className="text-brand-primary/50 animate-pulse">● Active</span>
        </div>
      </footer>
    </main>
  );
}
