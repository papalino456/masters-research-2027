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

// Blue accents for milestones/scholarships - red only for urgent deadlines (<30 days)
const typeColors = {
  deadline: { icon: "text-zinc-400", border: "border-zinc-600", bg: "bg-surface-card/50" },
  milestone: { icon: "text-brand-primary", border: "border-brand-primary/30", bg: "bg-brand-primary/5" },
  scholarship: { icon: "text-brand-primary", border: "border-brand-primary/30", bg: "bg-brand-primary/5" },
};

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  const Icon = typeIcons[event.type];
  const baseColors = typeColors[event.type];
  const daysUntil = getDaysUntil(event.date);
  const isPast = daysUntil < 0;
  const isUrgent = daysUntil >= 0 && daysUntil < 30;
  
  // Use critical red styling ONLY for urgent items (<30 days)
  const colors = isUrgent && !isPast
    ? { icon: "text-accent-critical", border: "border-accent-critical/50", bg: "bg-accent-critical/5" }
    : baseColors;

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
        isPast ? "border-border-subtle opacity-50" : colors.border
      )}
    >
      {/* Timeline dot */}
      <div className={cn(
        "absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center",
        isPast 
          ? "bg-surface-card border-zinc-700" 
          : cn(colors.bg, colors.border),
        event.critical && !isPast && "ring-2 ring-offset-2 ring-offset-[#0a0a0a] ring-accent-critical/50"
      )}>
        <div className={cn(
          "w-1.5 h-1.5 rounded-full",
          isPast ? "bg-zinc-700" : colors.icon.replace("text-", "bg-")
        )} />
      </div>

      {/* Content */}
      <div className={cn(
        "ml-4 p-4 rounded border",
        isPast ? "bg-surface-card/20 border-border-subtle/50" : cn(colors.bg, colors.border)
      )}>
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <Icon size={14} className={isPast ? "text-text-dim" : colors.icon} />
            <span className={cn(
              "text-xs font-bold uppercase tracking-wider",
              isPast ? "text-text-dim" : colors.icon
            )}>
              {event.type}
            </span>
            {event.critical && !isPast && (
              <span className="px-1.5 py-0.5 bg-accent-critical/20 text-accent-critical/80 text-[9px] font-bold rounded uppercase">
                Critical
              </span>
            )}
          </div>
          
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider",
            isPast ? "text-zinc-700" : isUrgent ? "text-accent-critical" : "text-text-dim"
          )}>
            <Clock size={10} />
            {getTimeLabel()}
          </div>
        </div>

        <h3 className={cn(
          "font-bold mb-1",
          isPast ? "text-text-dim" : "text-zinc-100"
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
            <Calendar size={12} className="text-text-dim" />
            <span className="text-xs text-text-dim font-mono">{event.date}</span>
          </div>
          
          {university && (
            <span className={cn(
              "px-2 py-0.5 rounded text-[10px] font-medium bg-surface-card border",
              university.status === "priority" && "border-zinc-600 text-zinc-300",
              university.status === "target" && "border-border-subtle text-zinc-400",
              university.status === "aspirational" && "border-border-subtle/50 text-zinc-500"
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
    <div className="p-4 bg-accent-critical/5 border border-accent-critical/30 rounded mb-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} className="text-accent-critical" />
        <span className="text-sm font-bold text-accent-critical/80 uppercase tracking-wider">
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
              className="flex items-center justify-between p-3 bg-surface-card/50 rounded"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded flex items-center justify-center font-mono font-bold",
                  daysUntil < 30 ? "bg-accent-critical/20 text-accent-critical" : "bg-surface-card text-zinc-400 border border-border-subtle"
                )}>
                  {daysUntil}
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-200">{event.title}</div>
                  <div className="text-[10px] text-text-dim">{event.date}</div>
                </div>
              </div>
              
              {university && (
                <ChevronRight size={16} className="text-text-dim" />
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
      <div className="p-6 bg-surface-card/30 border border-border-subtle rounded">
        <h3 className="text-sm font-bold text-zinc-300 mb-6 uppercase tracking-wider">
          Application Timeline
        </h3>

        {Object.entries(grouped).map(([monthKey, events]) => (
          <div key={monthKey} className="mb-8 last:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-text-dim" />
              <h4 className="text-xs font-bold text-text-dim uppercase tracking-widest">
                {formatMonthYear(monthKey)}
              </h4>
              <div className="flex-1 h-px bg-border-subtle" />
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
