export type JobType = "full-time" | "part-time" | "contract" | "internship";

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  type: JobType;
  salary?: string;
  category: string;
  tags: string[];
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  whatsappNumber: string;
  githubToken?: string;
  githubRepo?: string;
  githubBranch?: string;
}

export interface JobsData {
  jobs: Job[];
  categories: string[];
  settings: SiteSettings;
}

export interface JobInput {
  title: string;
  description: string;
  company: string;
  location: string;
  type: JobType;
  salary?: string;
  category: string;
  tags: string[];
  featured?: boolean;
}
