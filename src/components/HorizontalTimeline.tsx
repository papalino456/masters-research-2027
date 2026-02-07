"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
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

export default function HorizontalTimeline() {
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const timelineRef = useRef<HTMLDivElement>(null);

  // Sort events by date
  const sortedEvents = [...timeline].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate date range
  const firstDate = new Date(sortedEvents[0].date);
  const lastDate = new Date(sortedEvents[sortedEvents.length - 1].date);
  const totalDays = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate position for each event (0-100%)
  const getEventPosition = (event: TimelineEvent) => {
    const eventDate = new Date(event.date);
    const daysSinceStart = Math.ceil((eventDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
    return (daysSinceStart / totalDays) * 100;
  };

  const handleMouseEnter = (event: TimelineEvent, e: React.MouseEvent) => {
    setHoveredEvent(event);
    updateTooltipPosition(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredEvent) {
      updateTooltipPosition(e);
    }
  };

  const updateTooltipPosition = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    setTooltipPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 80,
    });
  };

  const handleMouseLeave = () => {
    setHoveredEvent(null);
  };

  const getEventColor = (event: TimelineEvent) => {
    const daysUntil = getDaysUntil(event.date);
    const isPast = daysUntil < 0;
    const isUrgent = daysUntil >= 0 && daysUntil < 30;

    if (isPast) return "zinc-700";
    if (isUrgent && event.critical) return "red-500";
    if (event.type === "deadline") return "amber-500";
    if (event.type === "scholarship") return "blue-400";
    return "cyan-400";
  };

  // Generate month markers
  const generateMonthMarkers = () => {
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

  const monthMarkers = generateMonthMarkers();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
          Application Timeline
        </h3>
        <div className="flex items-center gap-4 text-[10px] text-text-dim">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>Critical Deadline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Deadline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Scholarship</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Milestone</span>
          </div>
        </div>
      </div>

      {/* Timeline Container */}
      <div 
        ref={timelineRef}
        className="relative w-full py-16 px-8 bg-surface-card/30 border border-border-subtle rounded overflow-x-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main timeline line */}
        <div className="relative h-1 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 rounded-full">
          {/* Month markers */}
          {monthMarkers.map((marker, idx) => (
            <div
              key={idx}
              className="absolute top-0 transform -translate-y-full"
              style={{ left: `${marker.position}%` }}
            >
              <div className="flex flex-col items-center -translate-x-1/2">
                <div className="w-px h-4 bg-border-subtle mb-2" />
                <span className="text-[9px] text-text-dim font-mono uppercase whitespace-nowrap">
                  {marker.date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })}
                </span>
              </div>
            </div>
          ))}

          {/* Event points */}
          {sortedEvents.map((event, idx) => {
            const position = getEventPosition(event);
            const color = getEventColor(event);
            const Icon = typeIcons[event.type];
            const daysUntil = getDaysUntil(event.date);
            const isPast = daysUntil < 0;

            return (
              <motion.div
                key={event.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer"
                style={{ left: `${position}%` }}
                onMouseEnter={(e) => handleMouseEnter(event, e)}
              >
                {/* Pulse animation for critical upcoming events */}
                {event.critical && !isPast && daysUntil < 60 && (
                  <motion.div
                    className={`absolute inset-0 rounded-full bg-${color}`}
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* Event point */}
                <div
                  className={cn(
                    "relative w-5 h-5 rounded-full border-2 bg-[#0a0a0a] flex items-center justify-center transition-all hover:scale-150",
                    isPast ? "border-zinc-700 opacity-50" : `border-${color}`,
                    hoveredEvent?.id === event.id && "scale-150 z-50"
                  )}
                >
                  <Icon 
                    size={10} 
                    className={isPast ? "text-zinc-700" : `text-${color}`}
                  />
                </div>

                {/* Label below timeline for critical events */}
                {event.critical && !isPast && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div className={cn(
                      "text-[8px] font-bold uppercase tracking-wider px-2 py-1 rounded",
                      daysUntil < 30 ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                    )}>
                      {daysUntil}d
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {hoveredEvent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute z-50 pointer-events-none"
              style={{
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl p-4 max-w-xs">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  {(() => {
                    const Icon = typeIcons[hoveredEvent.type];
                    const color = getEventColor(hoveredEvent);
                    return <Icon size={16} className={`text-${color} flex-shrink-0 mt-0.5`} />;
                  })()}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-[9px] font-bold uppercase tracking-wider",
                        `text-${getEventColor(hoveredEvent)}`
                      )}>
                        {hoveredEvent.type}
                      </span>
                      {hoveredEvent.critical && (
                        <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[8px] font-bold rounded uppercase">
                          Critical
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-zinc-100 leading-tight">
                      {hoveredEvent.title}
                    </h4>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                  {hoveredEvent.description}
                </p>

                {/* Meta info */}
                <div className="space-y-2 pt-3 border-t border-zinc-800">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    <Calendar size={10} />
                    <span className="font-mono">{hoveredEvent.date}</span>
                    <span className="ml-auto font-bold text-zinc-400">
                      {(() => {
                        const days = getDaysUntil(hoveredEvent.date);
                        if (days < 0) return "PAST";
                        if (days === 0) return "TODAY";
                        if (days === 1) return "TOMORROW";
                        return `${days} days`;
                      })()}
                    </span>
                  </div>
                  
                  {hoveredEvent.university && (() => {
                    const uni = universities.find(u => u.id === hoveredEvent.university);
                    return uni ? (
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                        <MapPin size={10} />
                        <span>{uni.name}</span>
                        <span className={cn(
                          "ml-auto px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
                          uni.status === "priority" && "bg-brand-secondary/20 text-brand-secondary",
                          uni.status === "target" && "bg-brand-primary/20 text-brand-primary",
                          uni.status === "aspirational" && "bg-brand-tertiary/20 text-brand-tertiary"
                        )}>
                          {uni.status}
                        </span>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>

              {/* Arrow pointing down to timeline */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-zinc-700" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Today marker */}
      <div className="flex items-center gap-2 text-[10px] text-text-dim">
        <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
        <span>Hover over points to see event details</span>
      </div>
    </div>
  );
}
