import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="w-full px-page pb-10 pt-20">
      <div className="mx-auto max-w-content border-t border-border pt-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-center">
          <div className="label-eyebrow text-muted">
            DBCE CODERS CLUB · GOA
          </div>

          <div className="label-eyebrow text-muted md:text-center">
            BUILD. BREAK. LEARN. DEPLOY.
          </div>

          <div className="label-eyebrow text-muted md:text-right">
            © 2026
          </div>
        </div>
      </div>
    </footer>
  );
}