import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Hiring Jobs",
  description: "Find your next career opportunity — browse jobs and apply directly via WhatsApp.",
  keywords: ["jobs", "career", "hiring", "job portal"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body className="font-body min-h-screen flex flex-col">
        <ThemeProvider>
          <div className="fixed inset-0 bg-dot-grid pointer-events-none" />
          <div className="fixed inset-0 bg-noise pointer-events-none" />
          <div className="fixed inset-0 bg-gradient-to-br from-[var(--glass-gradient-from)] via-[var(--glass-bg)] to-[var(--glass-dark)] pointer-events-none animate-gradient-shift" style={{ backgroundSize: "200% 200%" }} />
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--glass-radial),transparent)] pointer-events-none" />
          <div className="fixed left-1/2 top-1/4 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--glass-glow)] blur-[120px] pointer-events-none" />
          <main className="relative flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
