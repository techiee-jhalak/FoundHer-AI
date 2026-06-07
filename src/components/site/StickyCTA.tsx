import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function StickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`fixed bottom-4 inset-x-0 z-40 px-4 pointer-events-none transition-all duration-500 ${show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
      <div className="container-x">
        <div className="pointer-events-auto glass-strong rounded-full pl-5 pr-2 py-2 flex items-center justify-between gap-4 shadow-elevated mx-auto max-w-xl">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Ready to meet your AI co-founder?</span>
            <span className="sm:hidden">Meet your AI co-founder</span>
          </div>
          <Link to="/auth?mode=signup" className="btn-primary text-sm py-2 px-4 shrink-0">
            Start free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
