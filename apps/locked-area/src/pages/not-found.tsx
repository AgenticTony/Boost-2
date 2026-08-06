import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface p-6 font-body">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-display font-extrabold text-brand-navy mb-4">404</h1>
        <p className="text-lg text-text-muted leading-relaxed mb-8">
          Sidan du letar efter finns inte.
        </p>
        <Link
          to="/"
          className="inline-block bg-brand-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-navy/90 transition-colors"
        >
          Tillbaka till startsidan
        </Link>
      </div>
    </div>
  );
}
