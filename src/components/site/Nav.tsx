import { Link } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";

const links = [
  { href: "#product", label: "Product" },
  { href: "#dashboard", label: "Dashboard" },
  { href: "#mentors", label: "Mentors" },
  { href: "#community", label: "Community" },
  { href: "#pricing", label: "Pricing" },
];

export default function Nav() {
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className={`container-x mt-3 md:mt-4 px-3 md:px-6 transition-all ${scrolled ? "md:mt-2" : ""}`}>
        <nav className={`glass-strong rounded-full pl-3 md:pl-5 pr-2 md:pr-2 py-2 flex items-center justify-between transition-all ${scrolled ? "shadow-elevated" : ""}`}>
          <Link to="/" className="flex items-center gap-2 font-semibold shrink-0">
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand glow-primary">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="text-lg tracking-tight">FoundHer<span className="text-gradient">.ai</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            {links.map(l => (
              <a key={l.href} href={l.href} className="hover:text-foreground transition-colors">{l.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {session ? (
              <Link to="/dashboard" className="btn-primary text-sm py-2 px-5">Open app</Link>
            ) : (
              <>
                <Link to="/auth" className="hidden sm:inline-flex btn-ghost text-sm py-2 px-4">Sign in</Link>
                <Link to="/auth?mode=signup" className="btn-primary text-sm py-2 px-5">Start free</Link>
              </>
            )}
            <button onClick={() => setOpen(v => !v)} className="md:hidden h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-white/5">
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden glass-strong rounded-2xl mt-2 p-4 animate-fade-up">
            <div className="flex flex-col">
              {links.map(l => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 text-sm text-muted-foreground hover:text-foreground border-b border-white/5 last:border-0">{l.label}</a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
