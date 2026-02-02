"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  FileText, 
  GraduationCap, 
  Calendar, 
  Award,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { universities, Requirement, University, getDaysUntil } from "@/lib/data";
import { cn } from "@/lib/utils";

const categoryIcons = {
  document: FileText,
  test: GraduationCap,
  deadline: Calendar,
  scholarship: Award,
};

const categoryColors = {
  document: "text-blue-500",
  test: "text-purple-500",
  deadline: "text-orange-500",
  scholarship: "text-green-500",
};

function RequirementItem({ 
  requirement, 
  onToggle 
}: { 
  requirement: Requirement; 
  onToggle: (id: string) => void;
}) {
  const Icon = categoryIcons[requirement.category];
  const colorClass = categoryColors[requirement.category];
  const daysUntil = requirement.deadline ? getDaysUntil(requirement.deadline) : null;
  const isUrgent = daysUntil !== null && daysUntil <= 30 && daysUntil > 0;
  const isPast = daysUntil !== null && daysUntil < 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer group",
        requirement.completed 
          ? "bg-zinc-900/30 border-zinc-800/50" 
          : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700",
        isUrgent && !requirement.completed && "border-orange-500/50 bg-orange-500/5"
      )}
      onClick={() => onToggle(requirement.id)}
    >
      <div className="pt-0.5">
        {requirement.completed ? (
          <CheckCircle2 size={18} className="text-green-500" />
        ) : (
          <Circle size={18} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Icon size={12} className={cn(colorClass, requirement.completed && "opacity-50")} />
          <span className={cn(
            "text-sm font-medium",
            requirement.completed ? "text-zinc-600 line-through" : "text-zinc-200"
          )}>
            {requirement.name}
          </span>
        </div>
        
        {requirement.description && (
          <p className={cn(
            "text-xs mt-1",
            requirement.completed ? "text-zinc-700" : "text-zinc-500"
          )}>
            {requirement.description}
          </p>
        )}
        
        {requirement.deadline && (
          <div className={cn(
            "flex items-center gap-1 mt-2 text-[10px] uppercase tracking-wider",
            isPast ? "text-red-500" : isUrgent ? "text-orange-500" : "text-zinc-600"
          )}>
            <Calendar size={10} />
            <span>
              {requirement.deadline}
              {daysUntil !== null && !isPast && ` (${daysUntil} days)`}
              {isPast && " (PAST)"}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function UniversityRequirements({ 
  university,
  requirements,
  onToggle
}: { 
  university: University;
  requirements: Requirement[];
  onToggle: (id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const completedCount = requirements.filter(r => r.completed).length;
  const totalCount = requirements.length;
  const progress = (completedCount / totalCount) * 100;

  const statusColors = {
    priority: "border-green-500/50 bg-green-500/5",
    target: "border-blue-500/50 bg-blue-500/5",
    aspirational: "border-purple-500/50 bg-purple-500/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "border rounded-xl overflow-hidden",
        statusColors[university.status]
      )}
    >
      {/* Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-zinc-900/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown size={16} className="text-zinc-500" />
            ) : (
              <ChevronRight size={16} className="text-zinc-500" />
            )}
            <div>
              <h3 className="font-bold text-zinc-100">{university.name}</h3>
              <p className="text-xs text-zinc-500">{university.program}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-mono text-zinc-300">
              {completedCount}/{totalCount}
            </div>
            <div className="text-[10px] text-zinc-600 uppercase tracking-wider">
              {Math.round(progress)}% Complete
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className={cn(
              "h-full rounded-full",
              university.status === "priority" && "bg-green-500",
              university.status === "target" && "bg-blue-500",
              university.status === "aspirational" && "bg-purple-500"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Requirements List */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {requirements.map(req => (
            <RequirementItem
              key={req.id}
              requirement={req}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function RequirementsTracker() {
  // Local state for requirements (in production, this would be persisted)
  const [requirementsState, setRequirementsState] = useState<Record<string, boolean>>({});

  const handleToggle = (id: string) => {
    setRequirementsState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getUpdatedRequirements = (reqs: Requirement[]): Requirement[] => {
    return reqs.map(r => ({
      ...r,
      completed: requirementsState[r.id] ?? r.completed
    }));
  };

  // Calculate overall stats
  const allRequirements = universities.flatMap(u => 
    getUpdatedRequirements(u.requirements)
  );
  const totalCompleted = allRequirements.filter(r => r.completed).length;
  const totalItems = allRequirements.length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <div className="text-2xl font-bold text-zinc-100">{totalCompleted}</div>
          <div className="text-[10px] text-zinc-600 uppercase tracking-wider">Completed</div>
        </div>
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <div className="text-2xl font-bold text-zinc-100">{totalItems - totalCompleted}</div>
          <div className="text-[10px] text-zinc-600 uppercase tracking-wider">Remaining</div>
        </div>
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <div className="text-2xl font-bold text-zinc-100">{universities.length}</div>
          <div className="text-[10px] text-zinc-600 uppercase tracking-wider">Programs</div>
        </div>
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <div className="text-2xl font-bold text-green-500">
            {Math.round((totalCompleted / totalItems) * 100)}%
          </div>
          <div className="text-[10px] text-zinc-600 uppercase tracking-wider">Progress</div>
        </div>
      </div>

      {/* University Requirements */}
      <div className="space-y-4">
        {universities.map(university => (
          <UniversityRequirements
            key={university.id}
            university={university}
            requirements={getUpdatedRequirements(university.requirements)}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}
