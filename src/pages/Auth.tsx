import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      // Decide where to send the user
      supabase.from("profiles").select("onboarded").eq("id", session.user.id).maybeSingle().then(({ data }) => {
        navigate(data?.onboarded ? "/dashboard" : "/onboarding", { replace: true });
      });
    }
  }, [session, navigate]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: fullName } },
        });
        if (error) throw error;
        toast.success("Welcome to FoundHer!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Something went wrong");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error("Google sign-in failed"); setLoading(false); }
    // redirect or session set automatically; AuthProvider will update.
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 aurora" />
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="h-9 w-9 rounded-xl bg-gradient-brand inline-flex items-center justify-center glow-primary"><Sparkles className="h-4 w-4 text-white" /></span>
            <span className="text-lg">FoundHer<span className="text-gradient">.ai</span></span>
          </Link>
          <div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight">
              Your <span className="font-serif italic text-gradient">AI co-founder</span> is waiting.
            </h1>
            <p className="mt-5 text-muted-foreground text-lg max-w-md">
              Join 50,000+ women founders building the next generation of startups — backed by AI guidance,
              real mentors, and a community that ships.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[{ k: "50k+", v: "Founders" }, { k: "$120M", v: "Raised" }, { k: "4.9★", v: "Rating" }].map(s => (
                <div key={s.v}>
                  <div className="text-2xl font-bold text-gradient">{s.k}</div>
                  <div className="text-xs text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">© FoundHer AI</div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <span className="h-9 w-9 rounded-xl bg-gradient-brand inline-flex items-center justify-center"><Sparkles className="h-4 w-4 text-white" /></span>
              <span className="text-lg">FoundHer<span className="text-gradient">.ai</span></span>
            </Link>
          </div>

          <h2 className="text-3xl font-bold tracking-tight">{mode === "signup" ? "Start building." : "Welcome back."}</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {mode === "signup" ? "Free forever for solo founders." : "Sign in to your founder workspace."}
          </p>

          <button onClick={handleGoogle} disabled={loading} className="w-full mt-7 btn-ghost justify-center">
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.9 6.5 29.7 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.3-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.3 19 13.5 24 13.5c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.9 6.5 29.7 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5.5 0 10.6-2.1 14.4-5.6l-6.6-5.6C29.7 33.7 27 34.5 24 34.5c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.5 38.9 16.1 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.6C41.2 36.6 43.5 31 43.5 24c0-1.2-.1-2.3-.3-3.5z"/></svg>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-white/10" /> or <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleEmail} className="space-y-3">
            {mode === "signup" && (
              <input className="input-field" placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} required />
            )}
            <input className="input-field" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className="input-field" type="password" placeholder="Password" minLength={8} value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading} className="w-full btn-primary justify-center disabled:opacity-60">
              {loading ? "Working…" : <>{mode === "signup" ? "Create account" : "Sign in"} <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <div className="mt-5 text-sm text-center text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "New to FoundHer?"}{" "}
            <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="text-primary hover:underline">
              {mode === "signup" ? "Sign in" : "Create one"}
            </button>
          </div>
          <div className="mt-6 text-xs text-muted-foreground text-center">
            By continuing you agree to our Terms & Privacy.
          </div>
        </div>
      </div>
    </div>
  );
}
