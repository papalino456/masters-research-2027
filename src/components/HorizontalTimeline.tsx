"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  AlertTriangle, 
  Award, 
  Flag,
  Calendar,
  MapPin
} from "lucide-react";
import { timeline, universities, getDaysUntil, TimelineEvent } from "@/lib/data";
import { cn } from "@/lib/utils";

const typeIcons = {
  deadline: AlertTriangle,
  milestone: Flag,
  scholarship: Award,
};

// Color mapping for Tailwind classes
const colorClasses = {
  "zinc-800": { border: "border-zinc-800", text: "text-zinc-800", bg: "bg-zinc-800" },
  "red-500": { border: "border-red-500", text: "text-red-500", bg: "bg-red-500" },
  "amber-500": { border: "border-amber-500", text: "text-amber-500", bg: "bg-amber-500" },
  "blue-400": { border: "border-blue-400", text: "text-blue-400", bg: "bg-blue-400" },
  "cyan-400": { border: "border-cyan-400", text: "text-cyan-400", bg: "bg-cyan-400" },
};

export default function HorizontalTimeline() {
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);

  // Sort events by date
  const sortedEvents = [...timeline].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate date range - include today so it's always visible
  const today = new Date();
  const firstEventDate = new Date(sortedEvents[0].date);
  const lastEventDate = new Date(sortedEvents[sortedEvents.length - 1].date);
  const firstDate = today < firstEventDate ? today : firstEventDate;
  const lastDate = lastEventDate;
  const totalDays = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));

  const getEventPosition = (event: TimelineEvent) => {
    const eventDate = new Date(event.date);
    const daysSinceStart = Math.ceil((eventDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
    return (daysSinceStart / totalDays) * 100;
  };

  const getEventColorKey = (event: TimelineEvent): keyof typeof colorClasses => {
    const daysUntil = getDaysUntil(event.date);
    const isPast = daysUntil < 0;
    const isUrgent = daysUntil >= 0 && daysUntil < 30;

    if (isPast) return "zinc-800";
    if (isUrgent && event.critical) return "red-500";
    if (event.type === "deadline") return "amber-500";
    if (event.type === "scholarship") return "blue-400";
    return "cyan-400";
  };

  const getEventColors = (event: TimelineEvent) => {
    const key = getEventColorKey(event);
    return colorClasses[key];
  };

  const monthMarkers = () => {
    const markers = [];
    const current = new Date(firstDate);
    current.setDate(1);

    while (current <= lastDate) {
      const position = ((current.getTime() - firstDate.getTime()) / (totalDays * 24 * 60 * 60 * 1000)) * 100;
      markers.push({
        date: new Date(current),
        position,
      });
      current.setMonth(current.getMonth() + 1);
    }
    return markers;
  };

  const markers = monthMarkers();

  // Calculate today's position on the timeline (today is always included in range now)
  const todayPosition = ((today.getTime() - firstDate.getTime()) / (lastDate.getTime() - firstDate.getTime())) * 100;

  return (
    <div className="bg-surface-card/50 border border-border-subtle rounded p-4">
      {/* Header - compact */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          Timeline
        </h3>
        <div className="flex items-center gap-2 text-[9px] text-zinc-600">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-brand-primary rotate-45"/>Today</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500"/>Critical</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-500"/>Deadline</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-blue-400"/>Scholarship</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-400"/>Milestone</span>
        </div>
      </div>

      {/* Timeline visualization - horizontally scrollable */}
      <div 
        className="relative h-20 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
        id="timeline-scroll"
      >
        {/* Timeline content with min-width */}
        <div className="relative h-full min-w-[800px] px-8">
          {/* Main horizontal line */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-px bg-zinc-700" />
          
          {/* Today marker - always visible */}
          <div 
            className="absolute top-0 bottom-0 -translate-x-1/2 z-20"
            style={{ left: `calc(32px + (${todayPosition}% - 32px) * 0.94)` }}
          >
            {/* Vertical line */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-brand-primary/50" />
            {/* Top indicator */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2">
              <div className="w-2 h-2 bg-brand-primary rotate-45" />
            </div>
            {/* Bottom label */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
              <span className="text-[8px] font-mono font-bold text-brand-primary uppercase whitespace-nowrap">
                TODAY
              </span>
            </div>
          </div>
          
          {/* Month tick marks */}
          {markers.map((m, i) => (
            <div 
              key={i}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `calc(32px + ${m.position}% * 0.94)` }}
            >
              <div className="w-px h-2 bg-zinc-800" />
              <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[7px] text-zinc-700 font-mono uppercase">
                {m.date.toLocaleDateString("en-US", { month: "short" })}
              </div>
            </div>
          ))}

          {/* Event markers */}
          {sortedEvents.map((event, idx) => {
            const position = getEventPosition(event);
            const colors = getEventColors(event);
            const daysUntil = getDaysUntil(event.date);
            const isPast = daysUntil < 0;

            return (
              <motion.div
                key={event.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer"
                style={{ left: `calc(32px + ${position}% * 0.94)` }}
                onMouseEnter={() => setHoveredEvent(event)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                {/* Pulsing effect for critical */}
                {event.critical && !isPast && daysUntil < 60 && (
                  <motion.div
                    className={cn("absolute inset-0", colors.bg)}
                    animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Icon marker - rounded square style */}
                <div className={cn(
                  "w-6 h-6 rounded-md border bg-[#0a0a0a] flex items-center justify-center transition-all",
                  isPast ? "border-zinc-800 opacity-30" : colors.border,
                  hoveredEvent?.id === event.id && "scale-125"
                )}>
                  {(() => {
                    const Icon = typeIcons[event.type];
                    return <Icon size={12} className={isPast ? "text-zinc-800" : colors.text} />;
                  })()}
                </div>

                {/* Days counter for critical */}
                {event.critical && !isPast && daysUntil < 100 && (
                  <div className={cn(
                    "absolute -top-5 left-1/2 -translate-x-1/2 text-[7px] font-mono font-bold",
                    daysUntil < 30 ? "text-red-500" : "text-amber-500"
                  )}>
                    {daysUntil}d
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Scroll hint */}
      <div className="flex items-center justify-center gap-1 mt-1 text-[9px] text-zinc-700">
        <span>← Scroll to see all events →</span>
      </div>

      {/* Event info panel - below timeline, no scroll needed */}
      <AnimatePresence mode="wait">
        {hoveredEvent ? (
          <motion.div
            key={hoveredEvent.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-border-subtle"
          >
            <div className="flex items-start gap-3">
              {(() => {
                const Icon = typeIcons[hoveredEvent.type];
                const colors = getEventColors(hoveredEvent);
                return <Icon size={14} className={cn(colors.text, "flex-shrink-0 mt-0.5")} />;
              })()}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {(() => {
                    const colors = getEventColors(hoveredEvent);
                    return (
                      <span className={cn("text-[9px] font-bold uppercase tracking-wider", colors.text)}>
                        {hoveredEvent.type}
                      </span>
                    );
                  })()}
                  {hoveredEvent.critical && (
                    <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[8px] font-bold uppercase">
                      Critical
                    </span>
                  )}
                </div>
                
                <h4 className="text-sm font-bold text-zinc-200 mb-1">
                  {hoveredEvent.title}
                </h4>
                
                <p className="text-xs text-zinc-500 mb-2">
                  {hoveredEvent.description}
                </p>
                
                <div className="flex items-center gap-4 text-[10px] text-zinc-600">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    <span className="font-mono">{hoveredEvent.date}</span>
                  </span>
                  {(() => {
                    const days = getDaysUntil(hoveredEvent.date);
                    if (days < 0) return <span className="text-zinc-700">PAST</span>;
                    if (days === 0) return <span className="text-brand-primary">TODAY</span>;
                    return <span>{days} days</span>;
                  })()}
                  {hoveredEvent.university && (() => {
                    const uni = universities.find(u => u.id === hoveredEvent.university);
                    return uni ? (
                      <span className="flex items-center gap-1">
                        <MapPin size={10} />
                        {uni.name}
                      </span>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 pt-4 border-t border-border-subtle text-center"
          >
            <span className="text-[10px] text-zinc-600">Hover over timeline markers for details</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
