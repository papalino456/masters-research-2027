"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  Target, 
  CheckCircle2, 
  MapPin, 
  Cpu, 
  ExternalLink, 
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const PROGRAMS = [
  {
    name: "TU Delft",
    program: "MSc Robotics",
    location: "Netherlands",
    deadline: "2027-01-15",
    status: "Planning",
    focus: "Brain-Body Integration",
    url: "https://www.tudelft.nl/en/education/programmes/masters/robotics/msc-robotics",
    priority: "High",
    requirements: ["SOP", "Portfolio", "English Proficiency"]
  },
  {
    name: "ETH Zurich",
    program: "MSc Robotics, Systems and Control",
    location: "Switzerland",
    deadline: "2026-12-15",
    status: "Planning",
    focus: "Control Theory & Physical Integration",
    url: "https://master-robotics.ethz.ch/",
    priority: "Target",
    requirements: ["GRE", "High GPA", "Research Proposal"]
  },
  {
    name: "TU Munich",
    program: "MSc Robotics, Cognition, Intelligence",
    location: "Germany",
    deadline: "2027-05-31",
    status: "Planning",
    focus: "Industrial AI & Sensor Fusion",
    url: "https://www.tum.de/en/studies/degree-programs/detail/robotics-cognition-intelligence-master-of-science-msc/",
    priority: "Tactical",
    requirements: ["Local Networking", "German/English"]
  },
  {
    name: "MIT",
    program: "CSAIL / Media Lab",
    location: "USA",
    deadline: "2026-12-15",
    status: "Aspirational",
    focus: "Biomimetic Robotics",
    url: "https://www.csail.mit.edu/",
    priority: "Target",
    requirements: ["High-caliber Portfolio", "Research Experience"]
  }
];

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20 font-mono">
      {/* Header */}
      <header className="mb-20 space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-blue-500 text-xs font-bold tracking-[0.2em] uppercase"
        >
          <Cpu size={14} />
          <span>System Status: Active</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-zinc-100 tracking-tight"
        >
          MASTERS RESEARCH <br />
          <span className="text-zinc-600">STEEL & SILICON</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl text-zinc-500 leading-relaxed text-sm md:text-base"
        >
          An evolving dashboard for graduate application tracking. 
          Focusing on the intersection of physical robotics and neural intelligence.
        </motion.p>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900/50 border border-zinc-900 rounded-xl overflow-hidden backdrop-blur-sm">
        {PROGRAMS.map((program, idx) => (
          <motion.div
            key={program.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 * idx }}
            className="group p-8 bg-[#0a0a0a] hover:bg-zinc-900/40 transition-all duration-500 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[10px] text-zinc-500 uppercase tracking-widest">
                  {program.priority}
                </div>
                <div className="flex gap-2">
                  <a href={program.url} target="_blank" className="p-2 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-blue-400 transition-colors">
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-zinc-100 mb-2 group-hover:text-blue-400 transition-colors">
                {program.name}
              </h2>
              <p className="text-zinc-500 text-sm mb-6 flex items-center gap-2">
                <MapPin size={14} /> {program.location}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Target size={14} className="text-blue-500" />
                  <span className="text-xs text-zinc-300">{program.program}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={14} className="text-orange-500/70" />
                  <span className="text-xs text-zinc-400">Deadline: <span className="text-zinc-200">{program.deadline}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle size={14} className="text-zinc-600" />
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{program.focus}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-900">
              <div className="flex flex-wrap gap-2 mb-6">
                {program.requirements.map(req => (
                  <span key={req} className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900/50 border border-zinc-800 text-[9px] text-zinc-500">
                    <CheckCircle2 size={10} className="text-zinc-700" />
                    {req}
                  </span>
                ))}
              </div>
              <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-all group/btn uppercase tracking-widest">
                View Timeline <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Meta */}
      <footer className="mt-20 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-zinc-700 uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span>AOI PROTOCOL V1.0.4</span>
          <span className="w-1 h-1 rounded-full bg-zinc-800" />
          <span>EST. 2026-02-01</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-800">LATENCY: 24MS</span>
          <span className="text-blue-500/50 animate-pulse">● SYNCED</span>
        </div>
      </footer>
    </main>
  );
}
