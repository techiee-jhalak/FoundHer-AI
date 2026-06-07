import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => { console.error("404:", location.pathname); }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="absolute inset-0 aurora opacity-60 pointer-events-none" />
      <div className="relative text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand mb-6"><Sparkles className="h-5 w-5 text-white" /></div>
        <div className="text-7xl font-bold text-gradient">404</div>
        <p className="text-xl mt-3">This page hasn't been founded yet.</p>
        <Link to="/" className="btn-primary mt-8 inline-flex">Back to FoundHer</Link>
      </div>
    </div>
  );
};

export default NotFound;
