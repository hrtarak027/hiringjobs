"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, LogIn } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        return;
      }

      router.push("/admin");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--glass-bg)" }}>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl border border-glass-accent/30 bg-glass-accent/10">
              <Lock className="size-4 text-glass-accent-bright" />
            </div>
            <span className="font-display text-lg font-bold" style={{ color: "var(--glass-text)" }}>
              Admin Panel
            </span>
          </Link>
          <p className="mt-2 text-sm text-glass-muted">Sign in to manage job listings</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-glass-border bg-glass-card/60 p-6 backdrop-blur-2xl">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-glass-muted mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-glass-border px-4 py-2.5 text-sm placeholder-glass-muted/40 outline-none transition-all focus:border-glass-accent/50 focus:shadow-[0_0_15px_-5px] focus:shadow-glass-accent/20" style={{ color: "var(--glass-text)", background: "var(--glass-dark)" }}
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-glass-muted mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-glass-border px-4 py-2.5 text-sm placeholder-glass-muted/40 outline-none transition-all focus:border-glass-accent/50 focus:shadow-[0_0_15px_-5px] focus:shadow-glass-accent/20" style={{ color: "var(--glass-text)", background: "var(--glass-dark)" }}
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-glass-accent/30 bg-glass-accent/10 px-4 py-2.5 text-sm font-semibold text-glass-accent-bright transition-all hover:bg-glass-accent/20 hover:shadow-[0_0_20px_-5px] hover:shadow-glass-accent/30 disabled:opacity-50"
          >
            <LogIn className="size-4" />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
