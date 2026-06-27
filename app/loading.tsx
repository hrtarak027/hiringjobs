import { Briefcase } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--glass-bg)" }}>
      <div className="text-center">
        <Briefcase className="mx-auto size-8 animate-pulse text-glass-accent-bright" />
        <p className="mt-4 text-sm text-glass-muted">Loading...</p>
      </div>
    </div>
  );
}
