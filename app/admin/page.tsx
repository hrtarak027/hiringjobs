"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, Save, X, Settings,
  Briefcase, Phone, Tag, GitBranch, Globe
} from "lucide-react";
import type { Job, JobInput, JobsData, JobType } from "@/lib/types";

export default function AdminPage() {
  const [data, setData] = useState<JobsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [whatsappInput, setWhatsappInput] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [githubBranch, setGithubBranch] = useState("");
  const [githubStatus, setGithubStatus] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const router = useRouter();

  async function fetchData() {
    try {
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to fetch");
      const d = await res.json();
      setData(d);
      setWhatsappInput(d.settings?.whatsappNumber || "");
      setGithubToken(d.settings?.githubToken || "");
      setGithubRepo(d.settings?.githubRepo || "");
      setGithubBranch(d.settings?.githubBranch || "main");
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  async function handleSave(jobData: JobInput) {
    const res = editingJob
      ? await fetch(`/api/admin/jobs/${editingJob.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobData),
        })
      : await fetch("/api/admin/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobData),
        });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Failed to save job");
      return;
    }

    setShowForm(false);
    setEditingJob(null);
    fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this job?")) return;
    const res = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete job");
      return;
    }
    fetchData();
  }

  async function handleWhatsAppSave() {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ whatsappNumber: whatsappInput }),
    });
    if (!res.ok) {
      alert("Failed to save WhatsApp number");
      return;
    }
    fetchData();
  }

  async function handleGithubSave() {
    setGithubStatus("Saving...");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateGithub", github: { githubToken, githubRepo, githubBranch } }),
    });
    if (!res.ok) { setGithubStatus("Failed"); return; }
    setGithubStatus("Saved! Data will sync to GitHub on next change.");
    setTimeout(() => setGithubStatus(""), 3000);
    fetchData();
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) return;
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addCategory", name: newCategory }),
    });
    if (!res.ok) { alert("Failed to add category"); return; }
    setNewCategory("");
    fetchData();
  }

  async function handleDeleteCategory(name: string) {
    if (!confirm(`Delete category "${name}"?`)) return;
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteCategory", name }),
    });
    if (!res.ok) { alert("Failed to delete category"); return; }
    fetchData();
  }

  if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--glass-bg)" }}>
        <div className="text-glass-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--glass-bg)" }}>
      <header className="sticky top-0 z-50 border-b border-glass-border/40 bg-[var(--glass-bg)]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Briefcase className="size-4 text-glass-accent-bright" />
              <span className="font-display text-sm font-bold" style={{ color: "var(--glass-text)" }}>Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-glass-muted">{data?.jobs.length || 0} jobs</span>
            <button
              onClick={() => router.push("/")}
              className="rounded-lg border border-glass-border bg-glass-card/60 px-3 py-1.5 text-xs font-medium text-glass-muted transition-all hover:border-glass-accent/30 hover:text-glass-accent-bright"
            >
              View Site
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Settings Section */}
        <section className="mb-10 rounded-2xl border border-glass-border bg-glass-card/60 p-6 backdrop-blur-2xl">
          <div className="mb-4 flex items-center gap-2">
            <Settings className="size-4 text-glass-accent-bright" />
            <h2 className="font-display text-lg font-bold" style={{ color: "var(--glass-text)" }}>Settings</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-glass-muted">
                <Phone className="size-3" />
                WhatsApp Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={whatsappInput}
                  onChange={(e) => setWhatsappInput(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className="flex-1 rounded-xl border border-glass-border bg-glass-dark/60 px-4 py-2.5 text-sm outline-none transition-all focus:border-glass-accent/50"
                  style={{ color: "var(--glass-text)", background: "var(--glass-dark)" }}
                />
                <button
                  onClick={handleWhatsAppSave}
                  className="flex items-center gap-2 rounded-xl border border-glass-accent/30 bg-glass-accent/10 px-4 text-sm font-semibold text-glass-accent-bright transition-all hover:bg-glass-accent/20"
                >
                  <Save className="size-4" />
                  Save
                </button>
              </div>
              <p className="mt-1 text-[10px] text-glass-muted/60">International format without + (e.g. 919876543210)</p>
            </div>

            <div className="border-t border-glass-border pt-6">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-glass-muted">
                <GitBranch className="size-3" />
                GitHub Sync (use a different account)
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <input type="password" value={githubToken} onChange={(e) => setGithubToken(e.target.value)} placeholder="GitHub Token (ghp_...)"
                  className="rounded-xl border border-glass-border px-3 py-2 text-sm placeholder-glass-muted/40 outline-none focus:border-glass-accent/50" style={{ color: "var(--glass-text)", background: "var(--glass-dark)" }} />
                <input type="text" value={githubRepo} onChange={(e) => setGithubRepo(e.target.value)} placeholder="Repo (user/repo)"
                  className="rounded-xl border border-glass-border px-3 py-2 text-sm placeholder-glass-muted/40 outline-none focus:border-glass-accent/50" style={{ color: "var(--glass-text)", background: "var(--glass-dark)" }} />
                <input type="text" value={githubBranch} onChange={(e) => setGithubBranch(e.target.value)} placeholder="Branch (default: main)"
                  className="rounded-xl border border-glass-border px-3 py-2 text-sm placeholder-glass-muted/40 outline-none focus:border-glass-accent/50" style={{ color: "var(--glass-text)", background: "var(--glass-dark)" }} />
              </div>
              <div className="mt-2 flex items-center gap-3">
                <button onClick={handleGithubSave}
                  className="flex items-center gap-2 rounded-xl border border-glass-accent/30 bg-glass-accent/10 px-4 py-2 text-sm font-semibold text-glass-accent-bright transition-all hover:bg-glass-accent/20">
                  <Save className="size-4" />
                  Save GitHub Config
                </button>
                {githubStatus && <span className="text-xs text-glass-muted">{githubStatus}</span>}
              </div>
              <p className="mt-1 text-[10px] text-glass-muted/60">Create a classic PAT at github.com/settings/tokens with repo scope. Changes auto-commit to your repo.</p>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-glass-muted">
                <Tag className="size-3" />
                Categories
              </label>
              <div className="mb-3 flex flex-wrap gap-2">
                {data?.categories.map((cat) => (
                  <span key={cat} className="inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-glass-dark/60 px-3 py-1 text-xs text-glass-muted">
                    {cat}
                    <button onClick={() => handleDeleteCategory(cat)} className="text-glass-muted/50 hover:text-red-400 transition-colors">
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="flex-1 rounded-xl border border-glass-border px-4 py-2 text-sm placeholder-glass-muted/40 outline-none transition-all focus:border-glass-accent/50"
                  style={{ color: "var(--glass-text)", background: "var(--glass-dark)" }}
                />
                <button
                  onClick={handleAddCategory}
                  className="flex items-center gap-2 rounded-xl border border-glass-border bg-glass-dark/60 px-4 text-sm font-medium text-glass-muted transition-all hover:border-glass-accent/30 hover:text-glass-accent-bright"
                >
                  <Plus className="size-4" />
                  Add
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold" style={{ color: "var(--glass-text)" }}>Job Listings</h2>
            <button
              onClick={() => { setEditingJob(null); setShowForm(true); }}
              className="flex items-center gap-2 rounded-xl border border-glass-accent/30 bg-glass-accent/10 px-4 py-2 text-sm font-semibold text-glass-accent-bright transition-all hover:bg-glass-accent/20"
            >
              <Plus className="size-4" />
              New Job
            </button>
          </div>

          {showForm && (
            <JobForm
              job={editingJob}
              categories={data?.categories || []}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditingJob(null); }}
            />
          )}

          <div className="space-y-3">
            {data?.jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-glass-border bg-glass-card/60 p-4 backdrop-blur-2xl transition-all hover:border-glass-accent/20"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm font-bold" style={{ color: "var(--glass-text)" }}>{job.title}</h3>
                    {job.featured && <span className="rounded-full bg-glass-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-glass-accent-bright">Featured</span>}
                  </div>
                  <p className="mt-1 text-xs text-glass-muted">
                    {job.company} &middot; {job.location} &middot; {job.type} &middot; {job.category}
                  </p>
                  <p className="mt-1.5 line-clamp-1 text-xs text-glass-muted/60">{job.description}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => { setEditingJob(job); setShowForm(true); }}
                    className="flex size-8 items-center justify-center rounded-lg border border-glass-border bg-glass-dark/60 text-glass-muted transition-all hover:border-glass-accent/30 hover:text-glass-accent-bright"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="flex size-8 items-center justify-center rounded-lg border border-glass-border bg-glass-dark/60 text-glass-muted transition-all hover:border-red-500/30 hover:text-red-400"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {data?.jobs.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-sm text-glass-muted">No jobs yet. Click "New Job" to add one.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function JobForm({
  job,
  categories,
  onSave,
  onCancel,
}: {
  job: Job | null;
  categories: string[];
  onSave: (data: JobInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(job?.title || "");
  const [description, setDescription] = useState(job?.description || "");
  const [company, setCompany] = useState(job?.company || "");
  const [location, setLocation] = useState(job?.location || "");
  const [type, setType] = useState<string>(job?.type || "full-time");
  const [salary, setSalary] = useState(job?.salary || "");
  const [category, setCategory] = useState(job?.category || "");
  const [tagsStr, setTagsStr] = useState(job?.tags?.join(", ") || "");
  const [featured, setFeatured] = useState(job?.featured || false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const tags = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
    await onSave({ title, description, company, location, type: type as JobType, salary: salary || undefined, category, tags, featured });
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-glass-accent/20 bg-glass-accent/5 p-6 backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold" style={{ color: "var(--glass-text)" }}>
          {job ? "Edit Job" : "New Job"}
        </h3>
        <button type="button" onClick={onCancel} className="text-glass-muted hover:text-[var(--glass-text)] transition-colors">
          <X className="size-4" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-wider text-glass-muted mb-1">Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
            className="w-full rounded-xl border border-glass-border px-3 py-2 text-sm outline-none focus:border-glass-accent/50" style={{ color: "var(--glass-text)", background: "var(--glass-dark)" }} />
        </div>
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-wider text-glass-muted mb-1">Company *</label>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required
            className="w-full rounded-xl border border-glass-border px-3 py-2 text-sm outline-none focus:border-glass-accent/50" style={{ color: "var(--glass-text)", background: "var(--glass-dark)" }} />
        </div>
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-wider text-glass-muted mb-1">Location *</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required
            className="w-full rounded-xl border border-glass-border px-3 py-2 text-sm outline-none focus:border-glass-accent/50" style={{ color: "var(--glass-text)", background: "var(--glass-dark)" }} />
        </div>
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-wider text-glass-muted mb-1">Type *</label>
          <select value={type} onChange={(e) => setType(e.target.value)}
            className="w-full rounded-xl border border-glass-border px-3 py-2 text-sm outline-none focus:border-glass-accent/50" style={{ color: "var(--glass-text)", background: "var(--glass-dark)" }}>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-wider text-glass-muted mb-1">Category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required
            className="w-full rounded-xl border border-glass-border px-3 py-2 text-sm outline-none focus:border-glass-accent/50" style={{ color: "var(--glass-text)", background: "var(--glass-dark)" }}>
            <option value="">Select...</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-wider text-glass-muted mb-1">Salary (optional)</label>
          <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. ₹5L-₹10L"
            className="w-full rounded-xl border border-glass-border px-3 py-2 text-sm placeholder-glass-muted/40 outline-none focus:border-glass-accent/50" style={{ color: "var(--glass-text)", background: "var(--glass-dark)" }} />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-[10px] font-medium uppercase tracking-wider text-glass-muted mb-1">Description *</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3}
            className="w-full rounded-xl border border-glass-border px-3 py-2 text-sm outline-none focus:border-glass-accent/50 resize-none" style={{ color: "var(--glass-text)", background: "var(--glass-dark)" }} />
      </div>

      <div className="mt-4">
        <label className="block text-[10px] font-medium uppercase tracking-wider text-glass-muted mb-1">Tags (comma separated)</label>
        <input type="text" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="e.g. react, nodejs, remote"
          className="w-full rounded-xl border border-glass-border bg-glass-dark/60 px-3 py-2 text-sm text-white placeholder-glass-muted/40 outline-none focus:border-glass-accent/50" />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
          className="rounded border-glass-border bg-glass-dark/60 text-glass-accent focus:ring-glass-accent/30" />
        <label htmlFor="featured" className="text-xs text-glass-muted">Featured listing</label>
      </div>

      <div className="mt-6 flex gap-3">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 rounded-xl border border-glass-accent/30 bg-glass-accent/10 px-5 py-2.5 text-sm font-semibold text-glass-accent-bright transition-all hover:bg-glass-accent/20 disabled:opacity-50">
          <Save className="size-4" />
          {saving ? "Saving..." : (job ? "Update Job" : "Create Job")}
        </button>
        <button type="button" onClick={onCancel}
          className="rounded-xl border border-glass-border bg-glass-dark/60 px-5 py-2.5 text-sm font-medium text-glass-muted transition-all hover:text-[var(--glass-text)]">
          Cancel
        </button>
      </div>
    </form>
  );
}
