import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getJobsData } from "@/lib/jobs";
import { Briefcase, TrendingUp, Users, Building2 } from "lucide-react";
import dynamicImport from "next/dynamic";

const JobCard = dynamicImport(() => import("@/components/JobCard").then((m) => ({ default: m.JobCard })), {
  loading: () => (
    <div className="h-48 animate-pulse rounded-2xl border border-glass-border bg-glass-card/60" />
  ),
});

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { jobs, categories, settings } = await getJobsData();

  const fullTimeCount = jobs.filter((j) => j.type === "full-time").length;
  const partTimeCount = jobs.filter((j) => j.type === "part-time").length;

  return (
    <>
      <Header />
      <section className="relative overflow-hidden border-b border-glass-border/40 pb-16 pt-16 sm:pb-20 sm:pt-24">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-glass-accent/30 bg-glass-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-glass-accent-bright">
              <Briefcase className="size-3" />
              Job Portal
            </div>

            <h1 className="animate-fade-in font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl md:text-8xl">
              <span style={{ color: "var(--glass-text)" }}>Hiring</span>
              <br />
              <span className="bg-gradient-to-r from-glass-accent-bright via-glass-accent to-glass-accent-dim bg-clip-text text-transparent">
                Jobs
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl animate-fade-in text-base leading-relaxed text-glass-muted sm:text-lg">
              Find your next career opportunity. Browse curated job listings
              and apply directly with one click.
            </p>

            <div className="mt-10 grid animate-fade-in grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
              <StatCard value={jobs.length} label="Openings" icon={<TrendingUp className="size-3.5" />} color="text-glass-accent-bright" />
              <StatCard value={fullTimeCount} label="Full Time" icon={<Building2 className="size-3.5" />} color="text-emerald-400" />
              <StatCard value={partTimeCount} label="Part Time" icon={<Users className="size-3.5" />} color="text-amber-400" />
              <StatCard value={categories.length} label="Categories" icon={<Briefcase className="size-3.5" />} color="text-white" />
            </div>
          </div>
        </div>

        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-glass-accent/30 to-transparent" />
      </section>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
        {jobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="mx-auto size-12 text-glass-muted/40" />
            <h2 className="mt-4 font-display text-xl font-bold" style={{ color: "var(--glass-text)" }}>No openings yet</h2>
            <p className="mt-2 text-sm text-glass-muted">Check back soon for new opportunities.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} whatsappNumber={settings.whatsappNumber} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

function StatCard({ value, label, icon, color }: { value: number; label: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-glass-border bg-glass-card/60 px-4 py-3 backdrop-blur-2xl transition-all duration-300 hover:border-glass-accent/30 hover:bg-glass-card hover:shadow-[0_0_30px_-5px] hover:shadow-glass-accent/15">
      <div className={`flex size-10 items-center justify-center rounded-xl border border-glass-border bg-glass-dark/60 ${color}`}>
        {icon}
      </div>
      <div className="text-left">
        <p className={`font-display text-xl font-bold leading-none ${color}`}>{value}</p>
        <p className="mt-0.5 text-xs text-glass-muted">{label}</p>
      </div>
    </div>
  );
}
