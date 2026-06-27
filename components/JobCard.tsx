"use client";

import { MapPin, Clock, Building2, Send } from "lucide-react";
import type { Job } from "@/lib/types";

interface JobCardProps {
  job: Job;
  whatsappNumber: string;
}

const typeColors: Record<string, string> = {
  "full-time": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "part-time": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contract: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  internship: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export function JobCard({ job, whatsappNumber }: JobCardProps) {
  const handleApply = () => {
    if (!whatsappNumber) {
      alert("WhatsApp number not configured. Please contact admin.");
      return;
    }
    const cleaned = whatsappNumber.replace(/[^0-9]/g, "");
    const message = encodeURIComponent(
      `Hi, I want to apply for the position of ${job.title} at ${job.company}.`
    );
    window.open(`https://wa.me/${cleaned}?text=${message}`, "_blank");
  };

  return (
    <div
      className={`group rounded-2xl border border-glass-border bg-glass-card/60 p-5 backdrop-blur-2xl transition-all duration-300 hover:border-glass-accent/30 hover:bg-glass-card hover:shadow-[0_0_30px_-5px] hover:shadow-glass-accent/15 ${
        job.featured ? "border-glass-accent/20 bg-glass-accent/5" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold truncate" style={{ color: "var(--glass-text)" }}>
              {job.title}
            </h3>
            {job.featured && (
              <span className="shrink-0 rounded-full bg-glass-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-glass-accent-bright">
                Featured
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-glass-muted">
            <span className="flex items-center gap-1">
              <Building2 className="size-3" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {job.type}
            </span>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-glass-muted">
            {job.description}
          </p>

          {job.salary && (
            <p className="mt-2 text-sm font-semibold text-emerald-400">
              ₹ {job.salary.replace(/^\$?\s*/, "")}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${typeColors[job.type] || typeColors["full-time"]}`}>
              {job.type}
            </span>
            {job.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-glass-border bg-glass-dark/60 px-2.5 py-0.5 text-[10px] font-medium text-glass-muted"
              >
                {tag}
              </span>
            ))}
            {job.tags.length > 3 && (
              <span className="rounded-full border border-glass-border bg-glass-dark/60 px-2.5 py-0.5 text-[10px] font-medium text-glass-muted">
                +{job.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleApply}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-glass-accent/30 bg-glass-accent/10 px-4 py-2.5 text-sm font-semibold text-glass-accent-bright transition-all hover:bg-glass-accent/20 hover:shadow-[0_0_20px_-5px] hover:shadow-glass-accent/30"
      >
        <Send className="size-4" />
        Apply Now
      </button>
    </div>
  );
}
