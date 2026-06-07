import Shell from "@/components/app/Shell";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, MessagesSquare, FileText, TrendingUp, Users, Calendar, ArrowRight, Award, Target, Zap, CheckCircle2 } from "lucide-react";

type Startup = { id: string; name: string; idea: string | null; stage: string | null; health_score: number; investor_readiness_score: number };
type Validation = { id: string; idea: string; score: number; created_at: string };

function Ring({ value, label, color = "primary" }: { value: number; label: string; color?: "primary" | "secondary" | "accent" }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const stroke = color === "secondary" ? "url(#grad2)" : color === "accent" ? "url(#grad3)" : "url(#grad1)";
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="96" height="96" className="-rotate-90">
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF5DA2" /><stop offset="1" stopColor="#7C3AED" /></linearGradient>
          <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7C3AED" /><stop offset="1" stopColor="#C084FC" /></linearGradient>
          <linearGradient id="grad3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#C084FC" /><stop offset="1" stopColor="#FF5DA2" /></linearGradient>
        </defs>
        <circle cx="48" cy="48" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
        <circle cx="48" cy="48" r={r} stroke={stroke} strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [validations, setValidations] = useState<Validation[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("startups").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle().then(({ data }) => setStartup(data as Startup | null));
    supabase.from("idea_validations").select("id, idea, score, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3).then(({ data }) => setValidations((data ?? []) as Validation[]));
  }, [user]);

  const health = startup?.health_score ?? 50;
  const investor = startup?.investor_readiness_score ?? 20;

  const milestones = [
    { t: "Validate your idea", done: validations.length > 0, link: "/validator" },
    { t: "Talk to 5 users", done: false },
    { t: "Build MVP wireframes", done: false },
    { t: "Generate pitch deck", done: false },
    { t: "First mentor session", done: false },
  ];

  return (
    <Shell>
      <div className="space-y-6">
        {/* Top hero */}
        <div className="relative glass-strong rounded-3xl p-6 md:p-8 overflow-hidden">
          <div className="absolute inset-0 aurora opacity-60 pointer-events-none" />
          <div className="relative grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <div className="chip chip-brand mb-3"><Sparkles className="h-3 w-3" /> Today's focus</div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {startup ? <>Let's move <span className="font-serif italic text-gradient">{startup.name}</span> forward.</> : <>Let's get your startup off the ground.</>}
              </h1>
              <p className="text-muted-foreground mt-2 max-w-lg">
                {startup?.idea || "Start by validating your idea — your AI co-founder will guide every next step."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to="/validator" className="btn-primary text-sm py-2.5"><Sparkles className="h-4 w-4" /> Validate an idea</Link>
                <Link to="/coach" className="btn-ghost text-sm py-2.5"><MessagesSquare className="h-4 w-4" /> Ask your coach</Link>
              </div>
            </div>
            <div className="flex justify-center md:justify-end gap-6">
              <Ring value={health} label="Health" color="primary" />
              <Ring value={investor} label="Investor" color="accent" />
            </div>
          </div>
        </div>

        {/* Quick actions row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { i: Sparkles, t: "Validate idea", to: "/validator", c: "from-primary/30 to-secondary/30" },
            { i: MessagesSquare, t: "AI Coach", to: "/coach", c: "from-secondary/30 to-accent/30" },
            { i: FileText, t: "Pitch deck", to: "#", c: "from-accent/30 to-primary/30", soon: true },
            { i: Users, t: "Find mentor", to: "#", c: "from-primary/30 to-accent/30", soon: true },
          ].map(a => (
            <Link key={a.t} to={a.to} className="glass-card p-5 hover:border-white/15 transition relative">
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${a.c} flex items-center justify-center mb-3`}><a.i className="h-5 w-5" /></div>
              <div className="text-sm font-semibold flex items-center justify-between">{a.t} {a.soon && <span className="chip text-[9px] py-0">Soon</span>}</div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Progress tracker */}
          <div className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Startup Progress</div>
                <div className="text-lg font-semibold mt-1">Pre-seed milestones</div>
              </div>
              <div className="chip"><Target className="h-3 w-3" /> {milestones.filter(m => m.done).length} / {milestones.length}</div>
            </div>
            <ul className="space-y-2.5">
              {milestones.map((m, i) => (
                <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <CheckCircle2 className={`h-5 w-5 ${m.done ? "text-success" : "text-muted-foreground/40"}`} />
                  <span className={`text-sm flex-1 ${m.done ? "line-through text-muted-foreground" : ""}`}>{m.t}</span>
                  {m.link && !m.done && <Link to={m.link} className="text-xs text-primary hover:underline">Start →</Link>}
                </li>
              ))}
            </ul>
          </div>

          {/* AI insights */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-brand/20 border border-primary/30 inline-flex items-center justify-center"><Zap className="h-4 w-4 text-primary" /></div>
              <div className="font-semibold">AI Insights</div>
            </div>
            <div className="space-y-3 text-sm">
              {[
                "Talk to 5 users this week before building anything else.",
                "Your stage matches Pre-seed playbook — focus on conviction, not polish.",
                "Two mentors in your industry have open slots this week.",
              ].map((t, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-muted-foreground leading-relaxed">{t}</div>
              ))}
            </div>
          </div>

          {/* Recent validations */}
          <div className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div className="font-semibold">Recent validations</div>
              <Link to="/validator" className="text-sm text-primary hover:underline">New →</Link>
            </div>
            {validations.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6 text-center">No validations yet. <Link to="/validator" className="text-primary hover:underline">Try one</Link>.</div>
            ) : (
              <ul className="space-y-2">
                {validations.map(v => (
                  <li key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-sm truncate pr-3">{v.idea}</div>
                    <div className="text-sm font-bold text-gradient shrink-0">{v.score}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Co-founder recos */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-primary" />
              <div className="font-semibold">Co-founder matches</div>
            </div>
            <div className="space-y-3">
              {[
                { n: "Riya M.", r: "Full-stack · ex-Stripe", m: 92 },
                { n: "Tanya O.", r: "Designer · 2x founder", m: 87 },
              ].map(p => (
                <div key={p.n} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="h-9 w-9 rounded-full bg-gradient-brand flex items-center justify-center text-sm font-semibold">{p.n[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.n}</div>
                    <div className="text-xs text-muted-foreground truncate">{p.r}</div>
                  </div>
                  <div className="text-xs font-bold text-gradient">{p.m}%</div>
                </div>
              ))}
              <button className="w-full btn-ghost text-xs py-2">See all matches</button>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
