"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  AlertTriangle, 
  Award, 
  Flag,
  Clock,
  ChevronRight
} from "lucide-react";
import { timeline, universities, getDaysUntil, TimelineEvent } from "@/lib/data";
import { cn } from "@/lib/utils";

const typeIcons = {
  deadline: AlertTriangle,
  milestone: Flag,
  scholarship: Award,
};

const typeColors = {
  deadline: { icon: "text-red-500", border: "border-red-500/30", bg: "bg-red-500/5" },
  milestone: { icon: "text-blue-500", border: "border-blue-500/30", bg: "bg-blue-500/5" },
  scholarship: { icon: "text-green-500", border: "border-green-500/30", bg: "bg-green-500/5" },
};

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  const Icon = typeIcons[event.type];
  const colors = typeColors[event.type];
  const daysUntil = getDaysUntil(event.date);
  const isPast = daysUntil < 0;
  const isUrgent = daysUntil >= 0 && daysUntil <= 30;
  const isSoon = daysUntil > 30 && daysUntil <= 90;

  const university = event.university 
    ? universities.find(u => u.id === event.university)
    : null;

  const getTimeLabel = () => {
    if (isPast) return "PAST";
    if (daysUntil === 0) return "TODAY";
    if (daysUntil === 1) return "TOMORROW";
    if (daysUntil < 7) return `${daysUntil} DAYS`;
    if (daysUntil < 30) return `${Math.floor(daysUntil / 7)} WEEKS`;
    return `${Math.floor(daysUntil / 30)} MONTHS`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "relative pl-8 pb-8 border-l-2",
        isPast ? "border-zinc-800 opacity-50" : colors.border
      )}
    >
      {/* Timeline dot */}
      <div className={cn(
        "absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center",
        isPast 
          ? "bg-zinc-900 border-zinc-700" 
          : cn(colors.bg, colors.border),
        event.critical && !isPast && "ring-2 ring-offset-2 ring-offset-[#0a0a0a] ring-red-500/50"
      )}>
        <div className={cn(
          "w-1.5 h-1.5 rounded-full",
          isPast ? "bg-zinc-700" : colors.icon.replace("text-", "bg-")
        )} />
      </div>

      {/* Content */}
      <div className={cn(
        "ml-4 p-4 rounded-lg border",
        isPast ? "bg-zinc-900/20 border-zinc-800/50" : cn(colors.bg, colors.border)
      )}>
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <Icon size={14} className={isPast ? "text-zinc-600" : colors.icon} />
            <span className={cn(
              "text-xs font-bold uppercase tracking-wider",
              isPast ? "text-zinc-600" : colors.icon
            )}>
              {event.type}
            </span>
            {event.critical && !isPast && (
              <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[9px] font-bold rounded uppercase">
                Critical
              </span>
            )}
          </div>
          
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider",
            isPast ? "text-zinc-700" : isUrgent ? "text-orange-500" : isSoon ? "text-yellow-500" : "text-zinc-500"
          )}>
            <Clock size={10} />
            {getTimeLabel()}
          </div>
        </div>

        <h3 className={cn(
          "font-bold mb-1",
          isPast ? "text-zinc-600" : "text-zinc-100"
        )}>
          {event.title}
        </h3>
        
        <p className={cn(
          "text-sm mb-3",
          isPast ? "text-zinc-700" : "text-zinc-400"
        )}>
          {event.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-zinc-600" />
            <span className="text-xs text-zinc-500 font-mono">{event.date}</span>
          </div>
          
          {university && (
            <span className={cn(
              "px-2 py-0.5 rounded text-[10px] font-medium",
              university.status === "priority" && "bg-green-500/10 text-green-500",
              university.status === "target" && "bg-blue-500/10 text-blue-500",
              university.status === "aspirational" && "bg-purple-500/10 text-purple-500"
            )}>
              {university.name}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function UpcomingDeadlines() {
  const now = new Date();
  const upcoming = timeline
    .filter(e => getDaysUntil(e.date) >= 0 && e.type === "deadline")
    .sort((a, b) => getDaysUntil(a.date) - getDaysUntil(b.date))
    .slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <div className="p-4 bg-red-500/5 border border-red-500/30 rounded-xl mb-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} className="text-red-500" />
        <span className="text-sm font-bold text-red-400 uppercase tracking-wider">
          Upcoming Deadlines
        </span>
      </div>
      
      <div className="space-y-3">
        {upcoming.map(event => {
          const daysUntil = getDaysUntil(event.date);
          const university = event.university 
            ? universities.find(u => u.id === event.university)
            : null;

          return (
            <div 
              key={event.id}
              className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold",
                  daysUntil <= 30 ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"
                )}>
                  {daysUntil}
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-200">{event.title}</div>
                  <div className="text-[10px] text-zinc-600">{event.date}</div>
                </div>
              </div>
              
              {university && (
                <ChevronRight size={16} className="text-zinc-600" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Timeline() {
  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group by year-month
  const grouped = sortedTimeline.reduce((acc, event) => {
    const date = new Date(event.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  const formatMonthYear = (key: string) => {
    const [year, month] = key.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Urgent Deadlines */}
      <UpcomingDeadlines />

      {/* Full Timeline */}
      <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
        <h3 className="text-sm font-bold text-zinc-300 mb-6 uppercase tracking-wider">
          Application Timeline
        </h3>

        {Object.entries(grouped).map(([monthKey, events]) => (
          <div key={monthKey} className="mb-8 last:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-zinc-600" />
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                {formatMonthYear(monthKey)}
              </h4>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
            
            <div className="ml-4">
              {events.map((event, idx) => (
                <TimelineItem key={event.id} event={event} index={idx} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
