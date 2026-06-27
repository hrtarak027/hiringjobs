import { promises as fs } from "fs";
import path from "path";
import {
  isGitHubRepoConfigured,
  readFileFromGitHub,
  writeFileToGitHub,
} from "./github";
import type {
  Job,
  JobInput,
  JobsData,
  SiteSettings,
} from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "jobs.json");

const DEFAULT_CATEGORIES = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Support",
  "Other",
];

const DEFAULT_SETTINGS = { whatsappNumber: "", githubToken: "", githubRepo: "", githubBranch: "" };

function normalizeData(parsed: Partial<JobsData>): JobsData {
  const jobs = Array.isArray(parsed.jobs) ? parsed.jobs : [];
  const categories =
    Array.isArray(parsed.categories) && parsed.categories.length > 0
      ? parsed.categories
      : DEFAULT_CATEGORIES;
  const whatsappNumber =
    typeof parsed.settings?.whatsappNumber === "string"
      ? parsed.settings.whatsappNumber.trim()
      : "";
  const githubToken =
    typeof parsed.settings?.githubToken === "string"
      ? parsed.settings.githubToken.trim()
      : "";
  const githubRepo =
    typeof parsed.settings?.githubRepo === "string"
      ? parsed.settings.githubRepo.trim()
      : "";
  const githubBranch =
    typeof parsed.settings?.githubBranch === "string"
      ? parsed.settings.githubBranch.trim()
      : "main";

  return {
    jobs,
    categories,
    settings: { whatsappNumber, githubToken, githubRepo, githubBranch },
  };
}

function getGitHubSettings(settings: SiteSettings): {
  githubToken?: string;
  githubRepo?: string;
  githubBranch?: string;
} {
  return {
    ...(settings.githubToken ? { githubToken: settings.githubToken } : {}),
    ...(settings.githubRepo ? { githubRepo: settings.githubRepo } : {}),
    ...(settings.githubBranch ? { githubBranch: settings.githubBranch } : {}),
  };
}

async function readLocalFile(): Promise<JobsData> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return normalizeData(JSON.parse(raw));
}

async function writeLocalFile(data: JobsData): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

let githubSha: string | undefined;

function getGhSettings(data: JobsData) {
  return {
    ...(data.settings.githubToken ? { githubToken: data.settings.githubToken } : {}),
    ...(data.settings.githubRepo ? { githubRepo: data.settings.githubRepo } : {}),
    ...(data.settings.githubBranch ? { githubBranch: data.settings.githubBranch } : {}),
  };
}

function isGithubConfigured(data: JobsData): boolean {
  return !!(process.env.GITHUB_REPO || data.settings.githubRepo);
}

async function loadData(): Promise<JobsData> {
  const local = await readLocalFile().catch(() => null);
  if (!local) {
    return {
      jobs: [],
      categories: DEFAULT_CATEGORIES,
      settings: DEFAULT_SETTINGS,
    };
  }

  if (isGithubConfigured(local)) {
    try {
      const file = await readFileFromGitHub(getGhSettings(local));
      if (file) {
        githubSha = file.sha || undefined;
        return normalizeData(JSON.parse(file.content));
      }
      return local;
    } catch (error) {
      console.error("GitHub read failed:", error);
    }
  }

  return local;
}

async function saveData(
  data: JobsData,
  commitMessage: string
): Promise<void> {
  const content = JSON.stringify(data, null, 2);

  if (isGithubConfigured(data)) {
    await writeFileToGitHub(content, commitMessage, githubSha, getGhSettings(data));
    const refreshed = await readFileFromGitHub(getGhSettings(data));
    if (refreshed) {
      githubSha = refreshed.sha;
    }
    return;
  }

  await writeLocalFile(data);
}

function generateId(): string {
  return `job-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function mergeCategories(data: JobsData, category: string): string[] {
  const trimmed = category.trim();
  if (!trimmed) return data.categories;
  if (data.categories.includes(trimmed)) return data.categories;
  return [...data.categories, trimmed].sort();
}

export async function getJobsData(): Promise<JobsData> {
  return loadData();
}

export async function getAllJobs(): Promise<Job[]> {
  const data = await loadData();
  return data.jobs.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function createJob(input: JobInput): Promise<Job> {
  const data = await loadData();
  const now = new Date().toISOString();

  const job: Job = {
    id: generateId(),
    title: input.title.trim(),
    description: input.description.trim(),
    company: input.company.trim(),
    location: input.location.trim(),
    type: input.type,
    salary: input.salary?.trim() || undefined,
    category: input.category.trim(),
    tags: input.tags.map((t) => t.trim().toLowerCase()).filter(Boolean),
    featured: input.featured ?? false,
    createdAt: now,
    updatedAt: now,
  };

  data.jobs.push(job);
  data.categories = mergeCategories(data, job.category);

  await saveData(data, `Add job: ${job.title}`);
  return job;
}

export async function updateJob(
  id: string,
  input: JobInput
): Promise<Job | null> {
  const data = await loadData();
  const index = data.jobs.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const existing = data.jobs[index];
  const updated: Job = {
    ...existing,
    title: input.title.trim(),
    description: input.description.trim(),
    company: input.company.trim(),
    location: input.location.trim(),
    type: input.type,
    salary: input.salary?.trim() || undefined,
    category: input.category.trim(),
    tags: input.tags.map((t) => t.trim().toLowerCase()).filter(Boolean),
    featured: input.featured ?? false,
    updatedAt: new Date().toISOString(),
  };

  data.jobs[index] = updated;
  data.categories = mergeCategories(data, updated.category);

  await saveData(data, `Update job: ${updated.title}`);
  return updated;
}

export async function deleteJob(id: string): Promise<boolean> {
  const data = await loadData();
  const job = data.jobs.find((s) => s.id === id);
  if (!job) return false;

  data.jobs = data.jobs.filter((s) => s.id !== id);
  await saveData(data, `Delete job: ${job.title}`);
  return true;
}

export async function deleteCategory(name: string): Promise<boolean> {
  const data = await loadData();
  const trimmed = name.trim();
  if (!trimmed) return false;

  data.categories = data.categories.filter(
    (c) => c.toLowerCase() !== trimmed.toLowerCase()
  );

  await saveData(data, `Remove category: ${trimmed}`);
  return true;
}

export async function addCategory(name: string): Promise<string[]> {
  const data = await loadData();
  data.categories = mergeCategories(data, name);
  await saveData(data, `Add category: ${name.trim()}`);
  return data.categories;
}

export async function updateWhatsAppNumber(
  number: string
): Promise<SiteSettings> {
  const data = await loadData();
  data.settings.whatsappNumber = number.trim();
  await saveData(data, "Update WhatsApp number");
  return data.settings;
}

export async function updateGitHubSettings(settings: {
  githubToken?: string;
  githubRepo?: string;
  githubBranch?: string;
}): Promise<SiteSettings> {
  const data = await loadData();
  if (settings.githubToken !== undefined) data.settings.githubToken = settings.githubToken.trim();
  if (settings.githubRepo !== undefined) data.settings.githubRepo = settings.githubRepo.trim();
  if (settings.githubBranch !== undefined) data.settings.githubBranch = settings.githubBranch.trim();
  await saveData(data, "Update GitHub settings");
  return data.settings;
}
