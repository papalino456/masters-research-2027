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
            className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon size={14} className="text-zinc-500" />
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
                      <span className="text-[10px] text-zinc-600 ml-2">({item.note})</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono text-zinc-200">
                      {item.currency} {item.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-zinc-600 ml-1">
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
      <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">Yearly Cost (Est.)</span>
          <span className="text-lg font-bold font-mono text-zinc-200">
            €{yearlyCost.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">2-Year Total</span>
          <span className="text-xl font-bold font-mono text-blue-400">
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
        const statusColors = {
          priority: "bg-green-500",
          target: "bg-blue-500",
          aspirational: "bg-purple-500",
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
            <div className="h-6 bg-zinc-900 rounded overflow-hidden">
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
              "p-4 border rounded-lg",
              scholarship.status === "eligible" 
                ? "bg-green-500/5 border-green-500/30" 
                : "bg-yellow-500/5 border-yellow-500/30"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award size={16} className={scholarship.status === "eligible" ? "text-green-500" : "text-yellow-500"} />
                <span className="font-bold text-zinc-200 text-sm">{scholarship.name}</span>
              </div>
              {scholarship.status === "eligible" ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <AlertTriangle size={14} className="text-yellow-500" />
              )}
            </div>
            
            {university && (
              <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">
                {university.name}
              </div>
            )}
            
            <div className="text-sm font-mono text-blue-400 mb-2">
              {scholarship.amount}
            </div>
            
            {scholarship.deadline && (
              <div className="text-[10px] text-orange-500 mb-2">
                Deadline: {scholarship.deadline}
              </div>
            )}
            
            <div className="flex flex-wrap gap-1">
              {scholarship.eligibility.map(req => (
                <span 
                  key={req}
                  className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[9px] text-zinc-500"
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
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-green-500/5 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-green-500" />
            <span className="text-[10px] text-green-500 uppercase tracking-wider">Best Value</span>
          </div>
          <div className="text-lg font-bold text-zinc-100">TU Munich</div>
          <div className="text-xs text-zinc-500">€0 tuition (EU)</div>
        </div>
        
        <div className="p-4 bg-blue-500/5 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Home size={14} className="text-blue-500" />
            <span className="text-[10px] text-blue-500 uppercase tracking-wider">Lowest Living</span>
          </div>
          <div className="text-lg font-bold text-zinc-100">TU Delft</div>
          <div className="text-xs text-zinc-500">~€1,300/mo</div>
        </div>
        
        <div className="p-4 bg-purple-500/5 border border-purple-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Award size={14} className="text-purple-500" />
            <span className="text-[10px] text-purple-500 uppercase tracking-wider">Top Scholarship</span>
          </div>
          <div className="text-lg font-bold text-zinc-100">ESOP</div>
          <div className="text-xs text-zinc-500">CHF 24k+/yr</div>
        </div>
        
        <div className="p-4 bg-orange-500/5 border border-orange-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-orange-500" />
            <span className="text-[10px] text-orange-500 uppercase tracking-wider">Highest Cost</span>
          </div>
          <div className="text-lg font-bold text-zinc-100">MIT</div>
          <div className="text-xs text-zinc-500">€70k+/yr (unfunded)</div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-lg border border-zinc-800 w-fit">
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
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {view === "comparison" && (
          <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
            <h3 className="text-sm font-bold text-zinc-300 mb-6 uppercase tracking-wider">
              2-Year Total Cost Comparison (EUR)
            </h3>
            <ComparisonChart />
            <p className="mt-4 text-[10px] text-zinc-600">
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
                      ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                      : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-zinc-300"
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
          <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
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
