"use client";

import Link from "next/link";
import { Briefcase, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-glass-border/40 bg-[var(--glass-bg)]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex size-9 items-center justify-center rounded-xl border border-glass-accent/30 bg-glass-accent/10">
            <Briefcase className="size-4 text-glass-accent-bright" />
          </div>
          <span className="font-display text-lg font-bold" style={{ color: "var(--glass-text)" }}>
            Hiring <span className="text-glass-accent-bright">Jobs</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="flex size-8 items-center justify-center rounded-lg border border-glass-border bg-glass-card/60 text-glass-muted transition-all hover:border-glass-accent/30 hover:text-glass-accent-bright"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <Link
            href="/admin"
            className="rounded-lg border border-glass-border bg-glass-card/60 px-3 py-1.5 text-xs font-medium text-glass-muted transition-all hover:border-glass-accent/30 hover:text-glass-accent-bright"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
