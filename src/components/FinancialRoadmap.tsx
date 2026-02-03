"use client";

import { motion } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  Home, 
  GraduationCap,
  Plane,
  Award,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { 
  universities, 
  financialProfiles, 
  scholarships,
  calculateYearlyCost,
  calculateTotalCost 
} from "@/lib/data";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, typeof DollarSign> = {
  "Tuition & Fees": GraduationCap,
  "Living Costs": Home,
  "One-Time Costs": Plane,
};

function CostBreakdown({ universityId }: { universityId: string }) {
  const profile = financialProfiles[universityId];
  const university = universities.find(u => u.id === universityId);
  
  if (!profile || !university) return null;

  const yearlyCost = calculateYearlyCost(universityId);
  const totalCost = calculateTotalCost(universityId, 2);

  return (
    <div className="space-y-4">
      {profile.map((category, idx) => {
        const Icon = categoryIcons[category.category] || DollarSign;
        
        return (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 bg-surface-card/30 border border-border-subtle/50 rounded"
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon size={14} className="text-brand-primary" />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                {category.category}
              </span>
            </div>
            
            <div className="space-y-2">
              {category.items.map(item => (
                <div key={item.name} className="flex justify-between items-center">
                  <div className="flex-1">
                    <span className="text-sm text-zinc-300">{item.name}</span>
                    {item.note && (
                      <span className="text-[10px] text-text-dim ml-2">({item.note})</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono text-zinc-200">
                      {item.currency} {item.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-text-dim ml-1">
                      /{item.frequency === "monthly" ? "mo" : item.frequency === "yearly" ? "yr" : "once"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
      
      {/* Summary */}
      <div className="p-4 bg-border-subtle/50 border border-zinc-700 rounded">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-text-dim uppercase tracking-wider">Yearly Cost (Est.)</span>
          <span className="text-lg font-bold font-mono text-zinc-200">
            €{yearlyCost.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-text-dim uppercase tracking-wider">2-Year Total</span>
          <span className="text-xl font-bold font-mono text-brand-primary">
            €{totalCost.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function ComparisonChart() {
  const data = universities.map(u => ({
    id: u.id,
    name: u.name,
    yearly: calculateYearlyCost(u.id),
    total: calculateTotalCost(u.id, 2),
    tuition: u.tuitionAmount,
    status: u.status
  })).sort((a, b) => a.total - b.total);

  const maxCost = Math.max(...data.map(d => d.total));

  return (
    <div className="space-y-3">
      {data.map((item, idx) => {
        const percentage = (item.total / maxCost) * 100;
        // Blue bars with status via opacity
        const statusColors = {
          priority: "bg-brand-primary",
          target: "bg-brand-primary/80",
          aspirational: "bg-brand-primary/60",
        };

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-zinc-300">{item.name}</span>
              <span className="text-sm font-mono text-zinc-400">
                €{item.total.toLocaleString()}
              </span>
            </div>
            <div className="h-6 bg-surface-card rounded overflow-hidden">
              <motion.div
                className={cn("h-full rounded flex items-center justify-end pr-2", statusColors[item.status])}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.1 }}
              >
                <span className="text-[10px] font-mono text-white/80">
                  {item.tuition === 0 ? "FREE" : `€${item.tuition}/yr tuition`}
                </span>
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function ScholarshipsPanel() {
  const eligibleScholarships = scholarships.filter(s => s.status !== "ineligible");

  return (
    <div className="space-y-3">
      {eligibleScholarships.map((scholarship, idx) => {
        const university = scholarship.university 
          ? universities.find(u => u.id === scholarship.university)
          : null;

        return (
            <motion.div
            key={scholarship.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "p-4 border rounded bg-surface-card/40",
              scholarship.status === "eligible" 
                ? "border-zinc-600" 
                : "border-border-subtle"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-zinc-400" />
                <span className="font-bold text-zinc-200 text-sm">{scholarship.name}</span>
              </div>
              {scholarship.status === "eligible" ? (
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 border border-zinc-600 px-1.5 py-0.5 rounded">Eligible</span>
              ) : (
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-dim border border-border-subtle px-1.5 py-0.5 rounded">Pending</span>
              )}
            </div>
            
            {university && (
              <div className="text-[10px] text-text-dim uppercase tracking-wider mb-2">
                {university.name}
              </div>
            )}
            
            <div className="text-sm font-mono text-zinc-200 mb-2">
              {scholarship.amount}
            </div>
            
            {scholarship.deadline && (
              <div className="text-[10px] text-text-dim mb-2">
                Deadline: {scholarship.deadline}
              </div>
            )}
            
            <div className="flex flex-wrap gap-1">
              {scholarship.eligibility.map(req => (
                <span 
                  key={req}
                  className="px-2 py-0.5 bg-surface-card border border-border-subtle rounded text-[9px] text-text-dim"
                >
                  {req}
                </span>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function FinancialRoadmap() {
  const [selectedUniversity, setSelectedUniversity] = useState<string>("tum");
  const [view, setView] = useState<"breakdown" | "comparison" | "scholarships">("comparison");

  return (
    <div className="space-y-6">
      {/* Quick Stats - uniform zinc styling */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-surface-card/50 border border-border-subtle rounded">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-brand-primary" />
            <span className="text-[10px] text-text-dim uppercase tracking-wider">Best Value</span>
          </div>
          <div className="text-lg font-bold text-zinc-100">TU Munich</div>
          <div className="text-xs text-text-dim">€0 tuition (EU)</div>
        </div>
        
        <div className="p-4 bg-surface-card/50 border border-border-subtle rounded">
          <div className="flex items-center gap-2 mb-1">
            <Home size={14} className="text-brand-primary" />
            <span className="text-[10px] text-text-dim uppercase tracking-wider">Lowest Living</span>
          </div>
          <div className="text-lg font-bold text-zinc-100">TU Delft</div>
          <div className="text-xs text-text-dim">~€1,300/mo</div>
        </div>
        
        <div className="p-4 bg-surface-card/50 border border-border-subtle rounded">
          <div className="flex items-center gap-2 mb-1">
            <Award size={14} className="text-brand-primary" />
            <span className="text-[10px] text-text-dim uppercase tracking-wider">Top Scholarship</span>
          </div>
          <div className="text-lg font-bold text-zinc-100">ESOP</div>
          <div className="text-xs text-text-dim">CHF 24k+/yr</div>
        </div>
        
        <div className="p-4 bg-surface-card/50 border border-border-subtle rounded">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-brand-primary" />
            <span className="text-[10px] text-text-dim uppercase tracking-wider">Highest Cost</span>
          </div>
          <div className="text-lg font-bold text-zinc-100">MIT</div>
          <div className="text-xs text-text-dim">€70k+/yr (unfunded)</div>
        </div>
      </div>

      {/* View Tabs - Blue for active tab */}
      <div className="flex gap-2 p-1 bg-surface-card/50 rounded border border-border-subtle w-fit">
        {[
          { id: "comparison", label: "Compare All" },
          { id: "breakdown", label: "Cost Breakdown" },
          { id: "scholarships", label: "Scholarships" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id as typeof view)}
            className={cn(
              "px-4 py-2 text-xs font-medium rounded transition-all",
              view === tab.id
                ? "bg-brand-primary text-white"
                : "text-text-dim hover:text-zinc-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {view === "comparison" && (
          <div className="p-6 bg-surface-card/30 border border-border-subtle rounded">
            <h3 className="text-sm font-bold text-zinc-300 mb-6 uppercase tracking-wider">
              2-Year Total Cost Comparison (EUR)
            </h3>
            <ComparisonChart />
            <p className="mt-4 text-[10px] text-text-dim">
              * Estimates include tuition, living costs, and one-time expenses. Actual costs may vary.
            </p>
          </div>
        )}

        {view === "breakdown" && (
          <div>
            {/* University Selector */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {universities.map(u => (
                <button
                  key={u.id}
                  onClick={() => setSelectedUniversity(u.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded border transition-all",
                    selectedUniversity === u.id
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "bg-surface-card/50 border-border-subtle text-text-dim hover:text-zinc-300"
                  )}
                >
                  {u.name}
                </button>
              ))}
            </div>
            
            <CostBreakdown universityId={selectedUniversity} />
          </div>
        )}

        {view === "scholarships" && (
          <div className="p-6 bg-surface-card/30 border border-border-subtle rounded">
            <h3 className="text-sm font-bold text-zinc-300 mb-4 uppercase tracking-wider">
              Available Scholarships (EU Citizen)
            </h3>
            <ScholarshipsPanel />
          </div>
        )}
      </div>
    </div>
  );
}
