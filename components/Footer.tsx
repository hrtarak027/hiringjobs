export function Footer() {
  return (
    <footer className="border-t border-glass-border/40 py-6">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="text-xs text-glass-muted">
          &copy; {new Date().getFullYear()} Hiring Jobs. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
