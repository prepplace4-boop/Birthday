import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50 px-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-7xl animate-float">🎈</div>
        <div className="space-y-2">
          <h1 className="font-display text-5xl font-bold text-foreground tracking-tight">
            404
          </h1>
          <h2 className="font-display text-2xl font-semibold text-foreground/80">
            Lost in the celebration
          </h2>
          <p className="text-muted-foreground font-sans">
            This surprise hasn&apos;t been unwrapped yet. Let&apos;s get you back to the birthday journey.
          </p>
        </div>
        <Link
          href="/birthday"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-primary-foreground font-medium shadow-soft hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5"
        >
          🎂 Back to Birthday Journey
        </Link>
      </div>
    </div>
  );
}
