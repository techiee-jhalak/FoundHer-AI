import { Link } from "react-router-dom";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import StickyCTA from "@/components/site/StickyCTA";
import AnimatedCounter from "@/components/site/AnimatedCounter";
import {
  ArrowRight, Sparkles, Brain, Target, Users, Heart, Rocket, Shield, Zap, Check, Star, Quote, Play,
  TrendingUp, FileText, MessagesSquare, BarChart3, Award, Compass, CheckCircle2, Calendar, Video,
  GraduationCap, Building2, Briefcase, Hexagon, ShieldCheck, Globe, Flame, Clock, ChevronRight,
  CircleDot, ArrowUpRight, Send, Lightbulb, Layers, Wand2, LineChart, MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai`;

/* ───────────────────────── HERO DASHBOARD MOCK ───────────────────────── */

function Ring({ value, label, size = 120, stroke = 10, gradId = "g1" }: { value: number; label: string; size?: number; stroke?: number; gradId?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="hsl(var(--primary))" />
            <stop offset="0.5" stopColor="hsl(var(--secondary))" />
            <stop offset="1" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(0 0% 100% / 0.06)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={`url(#${gradId})`} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.9,.2,1)" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-gradient">{value}</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function HeroProductMock() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % 4), 2400);
    return () => clearInterval(t);
  }, []);
  const milestones = [
    { t: "Validate idea", done: true },
    { t: "Talk to 5 users", done: step >= 1 },
    { t: "MVP wireframes", done: step >= 2 },
    { t: "Pitch deck", done: step >= 3 },
  ];
  return (
    <div className="relative">
      {/* glow */}
      <div className="absolute -inset-10 bg-gradient-mesh blur-3xl opacity-30 animate-gradient" />
      {/* main dashboard card */}
      <div className="relative glass-strong rounded-3xl p-5 md:p-6 shadow-elevated overflow-hidden">
        <div className="flex items-center gap-2 mb-5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
          <div className="ml-3 text-xs text-muted-foreground flex items-center gap-2">
            <Globe className="h-3 w-3" /> app.foundher.ai / dashboard
          </div>
          <div className="ml-auto chip text-[10px] py-0.5"><span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live</div>
        </div>

        {/* Top scores */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-4 flex flex-col items-center justify-center">
            <Ring value={82} label="Health" gradId="hh1" size={104} />
          </div>
          <div className="glass-card p-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Validation</div>
            <div className="text-3xl font-bold mt-1 text-gradient">88</div>
            <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-gradient-brand rounded-full transition-all duration-1000" style={{ width: "88%" }} />
            </div>
            <div className="text-[10px] text-muted-foreground mt-2">Strong demand · 3 named competitors</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Investor</div>
            <div className="text-3xl font-bold mt-1 text-gradient">64</div>
            <div className="mt-2 grid grid-cols-5 gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-1.5 rounded-full ${i <= 3 ? "bg-gradient-brand" : "bg-white/5"}`} />
              ))}
            </div>
            <div className="text-[10px] text-muted-foreground mt-2">Pre-seed ready in 4 weeks</div>
          </div>
        </div>

        {/* Roadmap */}
        <div className="glass-card p-4 mt-3">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Founder roadmap</div>
            <div className="text-[10px] text-primary">{milestones.filter(m => m.done).length} / 4</div>
          </div>
          <div className="space-y-2">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className={`h-4 w-4 transition ${m.done ? "text-success" : "text-muted-foreground/30"}`} />
                <div className={`text-sm flex-1 ${m.done ? "line-through text-muted-foreground" : ""}`}>{m.t}</div>
                {!m.done && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating: AI coach chat */}
      <div className="hidden md:block absolute -left-12 lg:-left-20 top-32 w-72 glass-strong rounded-2xl p-4 shadow-elevated animate-float" style={{ animationDelay: "0.6s" }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-7 w-7 rounded-lg bg-gradient-brand inline-flex items-center justify-center"><Sparkles className="h-3.5 w-3.5 text-white" /></div>
          <div className="text-xs font-semibold">AI Coach</div>
          <div className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-success" /> typing…</div>
        </div>
        <div className="space-y-2 text-xs">
          <div className="rounded-xl bg-white/5 px-3 py-2 leading-relaxed">"Should I build the MVP or run more interviews?"</div>
          <div className="rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 border border-primary/20 px-3 py-2 leading-relaxed">
            Run <b>5 more interviews</b> — your retention hypothesis isn't validated yet. I'll draft questions.
          </div>
        </div>
      </div>

      {/* Floating: mentor card */}
      <div className="hidden md:block absolute -right-10 lg:-right-16 top-10 w-64 glass-strong rounded-2xl p-4 shadow-elevated animate-float" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-brand inline-flex items-center justify-center text-sm font-semibold">P</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold flex items-center gap-1">Priya S. <ShieldCheck className="h-3 w-3 text-primary" /></div>
            <div className="text-[10px] text-muted-foreground truncate">Ex-Stripe · Fintech GTM</div>
          </div>
          <div className="text-xs font-bold text-gradient">94%</div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="chip text-[10px] py-0.5"><Calendar className="h-2.5 w-2.5" /> Thu 3pm</div>
          <button className="ml-auto text-[10px] text-primary font-semibold">Book →</button>
        </div>
      </div>

      {/* Floating: metric */}
      <div className="hidden lg:block absolute -right-12 -bottom-6 w-56 glass-strong rounded-2xl p-4 shadow-elevated animate-float" style={{ animationDelay: "1.2s" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Weekly traction</div>
          <ArrowUpRight className="h-3 w-3 text-success" />
        </div>
        <div className="flex items-end gap-1 h-12">
          {[20, 35, 28, 50, 42, 65, 78].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-primary/40 to-accent/60" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="text-sm font-bold mt-2">+38% <span className="text-xs text-muted-foreground font-normal">interviews</span></div>
      </div>
    </div>
  );
}

/* ───────────────────────── LIVE VALIDATOR DEMO ───────────────────────── */

type HeroValidatorResult = {
  score?: number;
  tagline?: string;
  tam?: string;
  marketDemand?: { summary?: string };
  error?: string;
  [key: string]: unknown;
};

function HeroValidator() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HeroValidatorResult | null>(null);

  const run = async () => {
    if (!idea.trim() || idea.length < 8) return;
    setLoading(true); setResult(null);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const r = await fetch(FUNCTIONS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sess.session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ mode: "validate", idea }),
      });
      setResult((await r.json()) as HeroValidatorResult);
    } catch (e: unknown) {
      setResult({ error: String(e) });
    }
    setLoading(false);
  };

  return (
    <div className="glass-strong rounded-3xl p-5 md:p-6 max-w-2xl mx-auto shadow-elevated">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Live AI Idea Validator
        </div>
        <div className="hidden sm:flex items-center gap-1"><Wand2 className="h-3 w-3" /> Powered by FoundHer AI</div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={idea}
          onChange={e => setIdea(e.target.value)}
          onKeyDown={e => e.key === "Enter" && run()}
          placeholder="Describe your startup idea in one sentence…"
          className="input-field flex-1"
        />
        <button onClick={run} disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? "Analyzing…" : <>Validate <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>
      {result && !result.error && (
        <div className="mt-5 grid grid-cols-3 gap-3 animate-fade-up">
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</div>
            <div className="text-3xl font-bold text-gradient mt-1">{result.score}</div>
          </div>
          <div className="glass rounded-xl p-4 col-span-2">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Positioning</div>
            <div className="text-sm font-medium mt-1 leading-snug">{result.tagline}</div>
          </div>
          <div className="glass rounded-xl p-4 col-span-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Market</div>
            <div className="text-xs text-muted-foreground leading-relaxed">{result.marketDemand?.summary}</div>
          </div>
          <Link to="/auth?mode=signup" className="col-span-3 btn-ghost text-sm">
            See full report — sign up free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
      {result?.error && <div className="mt-4 text-sm text-destructive">Couldn't reach AI right now. Try again.</div>}
      {!result && !loading && (
        <div className="mt-3 flex flex-wrap gap-2">
          {["AI tutor for first-gen students", "Sustainable beauty marketplace", "Mental wellness for working moms"].map(s => (
            <button key={s} onClick={() => setIdea(s)} className="chip hover:text-foreground transition">{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── AI COACH CHAT SHOWCASE ───────────────────────── */

const COACH_DEMO = [
  { who: "you", text: "I want to build a marketplace for female fitness trainers." },
  {
    who: "ai",
    blocks: [
      { title: "Market opportunity", body: "$1.4B and growing — women's fitness creator economy. Underserved by Mindbody-style B2B tools." },
      { title: "Competitors", body: "Alo Moves (content, not marketplace) · Future (1:1, premium) · Playbook (creator-led, mostly male). Gap: trainer-owned brand + class commerce." },
      { title: "Revenue models", body: "15% take-rate on sessions · creator subscription tiers · branded merch fulfillment." },
      { title: "First 30 days", body: "Recruit 10 trainers in NYC · ship Calendly + Stripe wrapper · 200 booked sessions before building a single line of marketplace code." },
    ],
  },
];

function CoachShowcase() {
  return (
    <div className="glass-strong rounded-3xl p-5 md:p-7 shadow-elevated">
      <div className="flex items-center gap-2 pb-4 border-b border-white/5 mb-5">
        <div className="h-9 w-9 rounded-xl bg-gradient-brand inline-flex items-center justify-center"><Sparkles className="h-4 w-4 text-white" /></div>
        <div>
          <div className="text-sm font-semibold">FoundHer Coach</div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Online · remembers your startup
          </div>
        </div>
        <div className="ml-auto chip text-[10px]"><Brain className="h-3 w-3" /> Gemini 2.5</div>
      </div>
      <div className="space-y-4">
        {COACH_DEMO.map((m, i) => m.who === "you" ? (
          <div key={i} className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-2.5 bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm">
              {m.text}
            </div>
          </div>
        ) : (
          <div key={i} className="flex gap-3">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-brand inline-flex items-center justify-center"><Sparkles className="h-4 w-4 text-white" /></div>
            <div className="flex-1 space-y-2.5">
              {m.blocks!.map((b, k) => (
                <div key={k} className="glass rounded-xl p-3.5">
                  <div className="text-[10px] uppercase tracking-widest text-primary mb-1 font-semibold">{b.title}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{b.body}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-2 glass rounded-full p-2 pl-4">
        <input disabled placeholder="Ask your AI co-founder anything…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60" />
        <button className="h-8 w-8 rounded-full bg-gradient-brand inline-flex items-center justify-center"><Send className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}

/* ───────────────────────── INVESTOR READINESS RADAR ───────────────────────── */

function InvestorRadar() {
  const cats = [
    { label: "Market", v: 88 },
    { label: "Model", v: 74 },
    { label: "Team", v: 62 },
    { label: "Traction", v: 55 },
    { label: "Financials", v: 70 },
    { label: "Pitch", v: 81 },
  ];
  const cx = 140, cy = 140, R = 100;
  const pts = cats.map((c, i) => {
    const angle = (Math.PI * 2 * i) / cats.length - Math.PI / 2;
    const r = (c.v / 100) * R;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  const polygon = pts.map(p => p.join(",")).join(" ");
  const axis = (i: number) => {
    const angle = (Math.PI * 2 * i) / cats.length - Math.PI / 2;
    return [cx + R * Math.cos(angle), cy + R * Math.sin(angle)];
  };
  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8 shadow-elevated">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Investor Readiness</div>
          <div className="text-2xl font-bold mt-1 text-gradient">72 / 100</div>
          <div className="text-xs text-muted-foreground mt-1">Pre-seed ready in 4 weeks</div>
        </div>
        <div className="chip chip-brand"><Award className="h-3 w-3" /> Live score</div>
      </div>
      <svg viewBox="0 0 280 280" className="w-full max-w-[320px] mx-auto">
        <defs>
          <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
            <stop offset="1" stopColor="hsl(var(--secondary))" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map(s => (
          <polygon key={s}
            points={cats.map((_, i) => {
              const angle = (Math.PI * 2 * i) / cats.length - Math.PI / 2;
              return `${cx + R * s * Math.cos(angle)},${cy + R * s * Math.sin(angle)}`;
            }).join(" ")}
            fill="none" stroke="hsl(0 0% 100% / 0.06)" strokeWidth="1" />
        ))}
        {cats.map((_, i) => {
          const [x, y] = axis(i);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="hsl(0 0% 100% / 0.06)" />;
        })}
        <polygon points={polygon} fill="url(#radarFill)" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="hsl(var(--primary))" />)}
        {cats.map((c, i) => {
          const angle = (Math.PI * 2 * i) / cats.length - Math.PI / 2;
          const lx = cx + (R + 18) * Math.cos(angle);
          const ly = cy + (R + 18) * Math.sin(angle);
          return <text key={c.label} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground" fontSize="10">{c.label}</text>;
        })}
      </svg>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {cats.map(c => (
          <div key={c.label} className="rounded-lg bg-white/[0.03] border border-white/5 p-2 text-center">
            <div className="text-[10px] text-muted-foreground">{c.label}</div>
            <div className="text-sm font-semibold text-gradient">{c.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── COMPATIBILITY CARD ───────────────────────── */

function CoFounderCard({ name, role, tags, match, tz, avail }: { name: string; role: string; tags: string[]; match: number; tz: string; avail: string }) {
  return (
    <div className="glass-card p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-mesh opacity-30 blur-2xl rounded-full" />
      <div className="relative flex items-start gap-3">
        <div className="h-14 w-14 rounded-2xl bg-gradient-brand inline-flex items-center justify-center font-semibold text-lg">{name[0]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold flex items-center gap-1.5">{name} <ShieldCheck className="h-3.5 w-3.5 text-primary" /></div>
              <div className="text-xs text-muted-foreground truncate">{role}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-lg font-bold text-gradient leading-none">{match}%</div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Match</div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map(t => <span key={t} className="chip text-[10px] py-0.5">{t}</span>)}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {tz}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {avail}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="btn-ghost text-xs py-2">Pass</button>
        <button className="btn-primary text-xs py-2">Connect <ArrowRight className="h-3 w-3" /></button>
      </div>
    </div>
  );
}

/* ───────────────────────── FEATURE WALKTHROUGH TABS ───────────────────────── */

const FEATURES = [
  {
    icon: Brain, label: "Idea Validator",
    title: "Validate before you build.",
    blurb: "Score your idea against real markets in 30 seconds. Named competitors, TAM, monetization paths, and the specific risks investors will ask about.",
    inputs: ["Your one-line idea", "Optional: target user, geography"],
    process: ["Cross-references 2M+ market signals", "Maps competitor landscape", "Stress-tests monetization"],
    outputs: ["Score / 100", "Positioning statement", "3 revenue paths", "Risk register"],
  },
  {
    icon: FileText, label: "Business Blueprint",
    title: "Your lean canvas, written for you.",
    blurb: "Auto-generated business plan, lean canvas, and GTM strategy — grounded in your actual idea, not a template.",
    inputs: ["Validation report", "Your stage & runway"],
    process: ["Drafts canvas", "Models GTM funnel", "Estimates unit economics"],
    outputs: ["Lean canvas", "12-week GTM plan", "Cost model"],
  },
  {
    icon: MessagesSquare, label: "AI Startup Coach",
    title: "An always-on co-founder.",
    blurb: "Remembers every conversation, every decision, every milestone. Pushes back when you're wrong. Drafts what you need next.",
    inputs: ["Your goals & current blockers"],
    process: ["Recalls full startup context", "References mentor playbooks"],
    outputs: ["Action plan", "Drafted artifacts", "Honest critique"],
  },
  {
    icon: Heart, label: "Co-Founder Matching",
    title: "Find your missing half.",
    blurb: "Matched on skills, values, time-zone, and ambition — not just keywords. Tinder-style discovery, LinkedIn-grade depth.",
    inputs: ["Your skills, vision, working style"],
    process: ["AI compatibility scoring", "Mutual interest filtering"],
    outputs: ["Ranked matches", "Intro chats", "Shared workspace"],
  },
  {
    icon: Users, label: "Mentor Marketplace",
    title: "Operators who've actually shipped.",
    blurb: "Vetted women founders, investors, and operators. AI picks the right one for your stage. Book, pay, meet — all in one click.",
    inputs: ["Your stage & blocker"],
    process: ["AI mentor matching", "Calendar sync", "Secure payment"],
    outputs: ["Booked sessions", "Recorded notes", "Follow-up tasks"],
  },
  {
    icon: Layers, label: "Pitch Deck Generator",
    title: "Investor-ready slides, automatically.",
    blurb: "From your roadmap to a 12-slide pitch deck. Edit once, export to PDF, Figma, or share a live link.",
    inputs: ["Validation + traction data"],
    process: ["Generates narrative", "Designs slides", "Stress-tests against rejections"],
    outputs: ["12-slide deck", "Speaker notes", "Investor list"],
  },
  {
    icon: BarChart3, label: "Progress Tracker",
    title: "Stay on the path — or get nudged.",
    blurb: "Milestones, weekly reports, and an AI nudge when you're drifting. Like a coach that actually shows up on Monday.",
    inputs: ["Weekly check-ins"],
    process: ["Compares to playbook", "Detects drift early"],
    outputs: ["Weekly report", "Risk alerts", "Next-best-action"],
  },
  {
    icon: Award, label: "Investor Readiness",
    title: "Know exactly where you stand.",
    blurb: "Live score across market, model, team, traction, financials, and pitch. Close every gap before the meeting.",
    inputs: ["Your full workspace"],
    process: ["Scores 6 dimensions", "Benchmarks vs. funded peers"],
    outputs: ["Readiness score", "Gap list", "Fix-it playbook"],
  },
];

function FeatureWalkthrough() {
  const [i, setI] = useState(0);
  const f = FEATURES[i];
  const Icon = f.icon;
  return (
    <div className="grid lg:grid-cols-12 gap-5">
      <div className="lg:col-span-4 space-y-1.5">
        {FEATURES.map((feat, idx) => {
          const FIcon = feat.icon;
          const active = i === idx;
          return (
            <button key={feat.label} onClick={() => setI(idx)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition border ${active ? "bg-gradient-to-r from-primary/15 to-secondary/15 border-primary/30" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"}`}>
              <div className={`h-9 w-9 rounded-xl inline-flex items-center justify-center ${active ? "bg-gradient-brand" : "bg-white/5"}`}>
                <FIcon className={`h-4 w-4 ${active ? "text-white" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{feat.label}</div>
                <div className="text-[11px] text-muted-foreground line-clamp-1">{feat.title}</div>
              </div>
              {active && <ChevronRight className="h-4 w-4 text-primary" />}
            </button>
          );
        })}
      </div>
      <div className="lg:col-span-8">
        <div className="glass-strong rounded-3xl p-6 md:p-8 shadow-elevated animate-fade-up" key={i}>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-brand inline-flex items-center justify-center"><Icon className="h-5 w-5 text-white" /></div>
            <div className="chip text-[10px]">{f.label}</div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{f.title}</h3>
          <p className="text-muted-foreground mt-2 max-w-xl leading-relaxed">{f.blurb}</p>

          <div className="mt-6 grid md:grid-cols-3 gap-3">
            {[{ k: "Inputs", v: f.inputs, c: "from-primary/15 to-primary/5" },
              { k: "AI process", v: f.process, c: "from-secondary/15 to-secondary/5" },
              { k: "Outputs", v: f.outputs, c: "from-accent/15 to-accent/5" }].map(col => (
              <div key={col.k} className={`rounded-2xl p-4 bg-gradient-to-br ${col.c} border border-white/5`}>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">{col.k}</div>
                <ul className="space-y-1.5">
                  {col.v.map(x => (
                    <li key={x} className="flex items-start gap-1.5 text-xs leading-relaxed">
                      <CircleDot className="h-3 w-3 text-primary mt-0.5 shrink-0" />{x}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── COMMUNITY FEED ───────────────────────── */

const FEED = [
  { who: "Lena P.", role: "Nurtura · Pre-seed", text: "Just closed our 20th customer interview this week 🎉 patterns I didn't expect…", likes: 142, comments: 24, tag: "Validation" },
  { who: "Aisha M.", role: "Loop Logistics", text: "Hiring our first engineer. Where did you find your earliest tech hires?", likes: 88, comments: 41, tag: "Hiring" },
  { who: "Camila V.", role: "Brava Health", text: "Live: $14k MRR after 3 months. Sharing the entire growth playbook tomorrow.", likes: 312, comments: 67, tag: "Traction" },
];

/* ───────────────────────── PAGE ───────────────────────── */

export default function Landing() {
  return (
    <div className="relative">
      <Nav />
      <StickyCTA />

      {/* HERO */}
      <section className="relative pt-32 md:pt-40 pb-24 md:pb-32 px-6">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute inset-0 aurora opacity-60 pointer-events-none" />
        <div className="container-x relative">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-6 animate-fade-up">
              <div className="chip chip-brand mb-5">
                <Sparkles className="h-3 w-3" /> Now in private beta · Y Combinator School backed
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.98] tracking-tight">
                Your <span className="text-gradient">AI Co-Founder</span><br />
                From Idea to <span className="font-serif italic text-gradient">Launch</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
                Validate ideas, build business plans, connect with mentors, find co-founders, generate pitch decks,
                and launch faster — with AI designed for women founders.
              </p>
              <div className="mt-8 flex items-center gap-3 flex-wrap">
                <Link to="/auth?mode=signup" className="btn-primary">
                  Start building free <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#coach" className="btn-ghost">
                  <Play className="h-4 w-4" /> Watch 2-min demo
                </a>
              </div>
              <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Free forever for solo founders</span>
                <span className="hidden sm:flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> No credit card</span>
              </div>

              {/* avatars */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["L", "A", "C", "M", "S"].map((c, i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-gradient-brand border-2 border-background inline-flex items-center justify-center text-[10px] font-semibold">{c}</div>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="text-foreground font-semibold"><AnimatedCounter to={2847} />+</span> founders on the waitlist this month
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <HeroProductMock />
            </div>
          </div>

          <div className="mt-20 md:mt-24">
            <div className="text-center text-[11px] uppercase tracking-widest text-muted-foreground mb-5">Try it live · no signup</div>
            <HeroValidator />
          </div>
        </div>
      </section>

      {/* TRUST / SOCIAL PROOF */}
      <section className="px-6 pb-10">
        <div className="container-x">
          <div className="glass-strong rounded-3xl p-8 md:p-10 grid md:grid-cols-4 gap-6 md:gap-8">
            {[
              { label: "Beta waitlist", to: 14823, suffix: "" },
              { label: "Community members", to: 6420, suffix: "" },
              { label: "Mentor applications", to: 312, suffix: "" },
              { label: "Ideas validated", to: 28941, suffix: "" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient">
                  <AnimatedCounter to={s.to} suffix={s.suffix} />
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <div className="text-center text-[11px] uppercase tracking-widest text-muted-foreground mb-6">
              Built for founders from
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { I: GraduationCap, n: "Stanford GSB" },
                { I: Building2, n: "Y Combinator" },
                { I: Briefcase, n: "Techstars" },
                { I: GraduationCap, n: "MIT Sloan" },
                { I: Hexagon, n: "On Deck" },
                { I: Building2, n: "AllRaise" },
              ].map(({ I, n }) => (
                <div key={n} className="glass rounded-2xl p-4 flex items-center gap-2 justify-center hover:border-white/15 transition">
                  <I className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT ANCHOR */}
      <section id="product" className="section">
        <div className="container-x">
          <div className="max-w-2xl mb-12">
            <div className="chip mb-4"><Zap className="h-3 w-3" /> The full operating system</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Not another chatbot. A founder OS.</h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Eight tools that work together — connected by AI that remembers your startup, your goals, and your last decision.
            </p>
          </div>
          <FeatureWalkthrough />
        </div>
      </section>

      {/* DASHBOARD SHOWCASE */}
      <section id="dashboard" className="section">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="chip mx-auto mb-4"><LineChart className="h-3 w-3" /> Your founder dashboard</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">One workspace. Every signal.</h2>
            <p className="mt-4 text-muted-foreground text-lg">Health, validation, market, funding readiness — and an AI that turns numbers into next moves.</p>
          </div>

          <div className="glass-strong rounded-3xl p-5 md:p-8 shadow-elevated relative overflow-hidden">
            <div className="absolute inset-0 aurora opacity-30 pointer-events-none" />
            <div className="relative grid lg:grid-cols-3 gap-5">
              {/* Scores column */}
              <div className="space-y-4">
                <div className="glass-card p-5">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Startup health</div>
                  <Ring value={82} label="Overall" gradId="dh1" size={140} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { l: "Validation", v: 88 },
                    { l: "Market", v: 76 },
                    { l: "Funding", v: 64 },
                    { l: "Launch", v: 41 },
                  ].map(s => (
                    <div key={s.l} className="glass-card p-3.5">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
                      <div className="text-xl font-bold text-gradient mt-0.5">{s.v}</div>
                      <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-gradient-brand" style={{ width: `${s.v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roadmap column */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Founder journey</div>
                  <div className="chip text-[10px] py-0.5"><Flame className="h-3 w-3 text-primary" /> Day 27</div>
                </div>
                <ol className="space-y-3">
                  {[
                    { s: "Idea", done: true },
                    { s: "Validation", done: true },
                    { s: "Planning", done: true, current: false },
                    { s: "MVP", done: false, current: true },
                    { s: "Launch", done: false },
                  ].map((st, i) => (
                    <li key={st.s} className="flex items-center gap-3">
                      <div className={`h-7 w-7 rounded-full inline-flex items-center justify-center text-[10px] font-semibold ${st.done ? "bg-gradient-brand" : st.current ? "border-2 border-primary text-primary" : "bg-white/5 text-muted-foreground"}`}>
                        {st.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${st.current ? "text-primary" : ""}`}>{st.s}</div>
                        {st.current && <div className="text-[10px] text-muted-foreground">In progress · 3 tasks</div>}
                      </div>
                      {st.current && <span className="text-[10px] chip py-0.5">Active</span>}
                    </li>
                  ))}
                </ol>
              </div>

              {/* AI recs column */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-gradient-brand inline-flex items-center justify-center"><Sparkles className="h-4 w-4 text-white" /></div>
                  <div className="text-sm font-semibold">AI recommendations</div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { i: Users, t: "Talk to 5 more customers this week", p: "High" },
                    { i: Target, t: "Refine target audience to mid-market", p: "High" },
                    { i: Rocket, t: "Build clickable MVP wireframes", p: "Medium" },
                    { i: Calendar, t: "Schedule mentor call with Priya S.", p: "Medium" },
                  ].map((r, k) => {
                    const RI = r.i;
                    return (
                      <div key={k} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="h-7 w-7 rounded-lg bg-white/5 inline-flex items-center justify-center shrink-0"><RI className="h-3.5 w-3.5 text-primary" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs leading-relaxed">{r.t}</div>
                          <div className="text-[10px] text-muted-foreground mt-1">Priority · {r.p}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI COACH SHOWCASE */}
      <section id="coach" className="section">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="chip mb-4"><Sparkles className="h-3 w-3" /> AI Startup Coach</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              A coach who's read every <span className="font-serif italic text-gradient">playbook</span> — and remembers yours.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Not generic advice. Your coach knows your idea, your last decision, your blockers, and what funded founders did at your stage.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Persistent memory across every conversation",
                "References real strategies from funded women founders",
                "Pushes back when your logic is wrong",
                "Drafts the artifact you need next — email, deck slide, plan",
              ].map(s => (
                <li key={s} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-success mt-0.5 shrink-0" />{s}</li>
              ))}
            </ul>
            <div className="mt-8">
              <Link to="/auth?mode=signup" className="btn-primary">Try the Coach free <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <CoachShowcase />
        </div>
      </section>

      {/* MENTOR MARKETPLACE */}
      <section id="mentors" className="section">
        <div className="container-x">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <div className="chip mb-4"><Users className="h-3 w-3" /> Mentor marketplace</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Operators who've shipped it.</h2>
            </div>
            <p className="text-muted-foreground max-w-md">Vetted women founders, investors, and operators. AI matches the right one to your stage. Book in two clicks.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { n: "Priya Sharma", r: "Ex-Stripe · Series B founder", tags: ["Fintech", "GTM", "Pre-seed"], price: 180, rating: 4.9, sessions: 142, match: 94, avail: "Thu 3pm" },
              { n: "Maya Okonkwo", r: "Partner @ AccelHer Ventures", tags: ["Fundraising", "Pitch", "Seed→A"], price: 240, rating: 5.0, sessions: 89, match: 88, avail: "Fri 11am" },
              { n: "Sofía Rey", r: "2x exited founder · DTC", tags: ["Brand", "Growth", "Pre-seed"], price: 160, rating: 4.9, sessions: 211, match: 82, avail: "Tue 2pm" },
            ].map((m, i) => (
              <div key={m.n} className="glass-card p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-mesh opacity-20 blur-3xl rounded-full" />
                <div className="relative">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-brand inline-flex items-center justify-center font-semibold text-lg">{m.n[0]}</div>
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-success border-2 border-background inline-flex items-center justify-center">
                        <Video className="h-2.5 w-2.5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold flex items-center gap-1.5">{m.n} <ShieldCheck className="h-3.5 w-3.5 text-primary" /></div>
                      <div className="text-xs text-muted-foreground">{m.r}</div>
                      <div className="mt-1 flex items-center gap-1 text-[11px]">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span className="font-semibold">{m.rating}</span>
                        <span className="text-muted-foreground">· {m.sessions} sessions</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {m.tags.map(t => <span key={t} className="chip text-[10px] py-0.5">{t}</span>)}
                  </div>

                  <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">AI match</div>
                    <div className="text-sm font-bold text-gradient">{m.match}%</div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold">${m.price}<span className="text-xs text-muted-foreground font-normal">/session</span></div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5"><Calendar className="h-3 w-3" /> Next: {m.avail}</div>
                    </div>
                    <button className="btn-primary text-xs py-2.5 px-4">Book <ArrowRight className="h-3 w-3" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CO-FOUNDER MATCHING */}
      <section id="cofounder" className="section">
        <div className="container-x">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="chip mb-4"><Heart className="h-3 w-3" /> Co-founder matching</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Find your <span className="font-serif italic text-gradient">missing half</span>.</h2>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                Matched on six dimensions that actually predict co-founder fit. Tinder-style discovery, LinkedIn-grade depth.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { i: Briefcase, t: "Complementary skills" },
                  { i: Compass, t: "Industry overlap" },
                  { i: Target, t: "Vision alignment" },
                  { i: Clock, t: "Availability" },
                  { i: Globe, t: "Time zone fit" },
                  { i: Rocket, t: "Startup stage" },
                ].map(({ i: I, t }) => (
                  <div key={t} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <I className="h-4 w-4 text-primary" />
                    <span className="text-sm">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <CoFounderCard name="Riya Mehta" role="Full-stack · ex-Stripe · 4yrs" tags={["React", "Payments", "Pre-seed", "0→1"]} match={94} tz="SF · GMT-8" avail="20h/wk" />
              <CoFounderCard name="Tanya Okeke" role="Design + Brand · 2x founder" tags={["Product", "Brand", "DTC", "Pre-seed"]} match={88} tz="NYC · GMT-5" avail="Full-time" />
              <CoFounderCard name="Aria Chen" role="Growth · ex-Notion" tags={["GTM", "Content", "B2B SaaS"]} match={81} tz="London · GMT" avail="15h/wk" />
            </div>
          </div>
        </div>
      </section>

      {/* INVESTOR READINESS */}
      <section id="investor" className="section">
        <div className="container-x">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <InvestorRadar />
            <div>
              <div className="chip mb-4"><Award className="h-3 w-3" /> Investor readiness</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Walk into every pitch <span className="font-serif italic text-gradient">prepared</span>.</h2>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                A live score across six dimensions investors actually grade you on. Close every gap before the meeting — and know exactly which one to fix first.
              </p>
              <div className="mt-6 space-y-2.5">
                {[
                  { l: "Market validation", v: 88, c: "Strong demand signals" },
                  { l: "Business model", v: 74, c: "Refine pricing tiers" },
                  { l: "Team", v: 62, c: "Add technical co-founder" },
                  { l: "Traction", v: 55, c: "Hit $5k MRR target" },
                ].map(r => (
                  <div key={r.l} className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">{r.l}</div>
                      <div className="text-sm font-bold text-gradient">{r.v}/100</div>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-gradient-brand rounded-full" style={{ width: `${r.v}%` }} />
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1"><Lightbulb className="h-3 w-3 text-primary" /> {r.c}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="section">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="chip mx-auto mb-4"><Users className="h-3 w-3" /> Community</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Join thousands of women <span className="font-serif italic text-gradient">building together</span>.</h2>
            <p className="mt-4 text-muted-foreground text-lg">Founder feed, startup circles, weekly challenges, peer feedback. LinkedIn meets YC Startup School.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {/* Feed */}
            <div className="lg:col-span-2 glass-strong rounded-3xl p-5 md:p-6 shadow-elevated">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold">Founder feed</div>
                <div className="flex items-center gap-2">
                  {["All", "Validation", "Hiring", "Traction"].map((t, i) => (
                    <span key={t} className={`chip text-[10px] ${i === 0 ? "chip-brand" : ""}`}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {FEED.map(f => (
                  <div key={f.who} className="glass-card p-4 hover:border-white/15 transition">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-brand inline-flex items-center justify-center font-semibold text-sm">{f.who[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="text-sm font-semibold">{f.who}</div>
                          <div className="text-[11px] text-muted-foreground">· {f.role}</div>
                          <span className="chip text-[10px] py-0.5 ml-auto">{f.tag}</span>
                        </div>
                        <p className="text-sm mt-1.5 leading-relaxed">{f.text}</p>
                        <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {f.likes}</span>
                          <span className="flex items-center gap-1"><MessagesSquare className="h-3 w-3" /> {f.comments}</span>
                          <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Trending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side: groups + challenges */}
            <div className="space-y-5">
              <div className="glass-strong rounded-3xl p-5">
                <div className="text-sm font-semibold mb-3">Startup circles</div>
                <div className="space-y-2.5">
                  {[
                    { n: "Pre-seed B2B SaaS", m: 1240 },
                    { n: "FemTech Founders", m: 890 },
                    { n: "Solo Founders Sprint", m: 612 },
                    { n: "AI / ML builders", m: 1502 },
                  ].map(g => (
                    <div key={g.n} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition cursor-pointer">
                      <div className="h-9 w-9 rounded-xl bg-gradient-brand/30 border border-primary/20" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{g.n}</div>
                        <div className="text-[10px] text-muted-foreground">{g.m.toLocaleString()} members</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-strong rounded-3xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold">Weekly challenge</div>
                  <span className="chip text-[10px] py-0.5"><Flame className="h-3 w-3 text-primary" /> 4 days left</span>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                  <div className="text-sm font-semibold">10 Customer Interviews</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">Talk to 10 ideal users this week. Share top insight, win a free mentor session.</div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {["L", "A", "C", "M"].map((c, i) => (
                        <div key={i} className="h-6 w-6 rounded-full bg-gradient-brand border-2 border-background inline-flex items-center justify-center text-[9px] font-semibold">{c}</div>
                      ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground">312 joined</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="section">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="chip mx-auto mb-4"><TrendingUp className="h-3 w-3" /> Built with FoundHer</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Real founders. Real progress.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { n: "Lena Park", c: "Nurtura · Femtech", img: "L", score: 88, q: "FoundHer turned 2 years of confusion into a clear 90-day plan. We raised pre-seed 8 weeks later.", mrr: "$8.2k MRR", raised: "$1.4M raised" },
              { n: "Aisha Mohammed", c: "Loop Logistics · B2B SaaS", img: "A", score: 81, q: "The AI Coach caught a pricing flaw my advisors missed. That alone paid for the year — ten times over.", mrr: "$14k MRR", raised: "Bootstrapped" },
              { n: "Camila Vidal", c: "Brava Health · Consumer", img: "C", score: 92, q: "Matched with my technical co-founder in week one. We've shipped daily ever since.", mrr: "$4.5k MRR", raised: "$650k raised" },
            ].map(t => (
              <div key={t.n} className="glass-card p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-mesh opacity-20 blur-3xl rounded-full" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-brand inline-flex items-center justify-center font-semibold">{t.img}</div>
                    <div>
                      <div className="font-semibold text-sm">{t.n}</div>
                      <div className="text-xs text-muted-foreground">{t.c}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-lg font-bold text-gradient leading-none">{t.score}</div>
                      <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Score</div>
                    </div>
                  </div>
                  <Quote className="h-4 w-4 text-primary mb-2" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{t.q}</p>
                  <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Revenue</div>
                      <div className="text-sm font-semibold text-gradient">{t.mrr}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Funding</div>
                      <div className="text-sm font-semibold">{t.raised}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="section">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="chip mx-auto mb-4"><Rocket className="h-3 w-3" /> Pricing</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Free to start. Worth every penny when you scale.</h2>
            <p className="mt-4 text-muted-foreground text-lg">No credit card to begin. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {[
              { name: "Founder", price: "$0", suffix: "", desc: "Get started", features: ["3 idea validations / mo", "AI Coach (20 msgs/day)", "Community access", "Progress tracker"], cta: "Start free" },
              { name: "Builder Pro", price: "$29", suffix: "/mo", featured: true, desc: "For serious builders", features: ["Unlimited validations", "Unlimited AI Coach", "Business blueprint", "Pitch deck generator", "1 mentor session / mo", "Co-founder matching"], cta: "Start 14-day trial" },
              { name: "Startup Growth", price: "$79", suffix: "/mo", desc: "Ready to launch", features: ["Everything in Pro", "4 mentor sessions / mo", "Investor readiness review", "Priority matching", "Team workspace (3 seats)", "Pitch coaching"], cta: "Start trial" },
              { name: "Accelerator", price: "Custom", suffix: "", desc: "For programs & teams", features: ["Everything in Growth", "Unlimited mentor sessions", "Cohort dashboards", "Custom AI fine-tuning", "Dedicated success manager", "SSO + admin"], cta: "Contact sales" },
            ].map(p => (
              <div key={p.name} className={`glass-card p-6 relative flex flex-col ${p.featured ? "border-gradient shadow-elevated" : ""}`}>
                {p.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 chip chip-brand text-[10px]">Most popular</div>}
                <div className="text-sm text-muted-foreground">{p.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.suffix}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{p.desc}</div>
                <ul className="mt-5 space-y-2 flex-1">
                  {p.features.map(f => <li key={f} className="flex items-start gap-2 text-xs leading-relaxed"><Check className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />{f}</li>)}
                </ul>
                <Link to="/auth?mode=signup" className={`mt-6 w-full text-sm py-2.5 ${p.featured ? "btn-primary" : "btn-ghost"} justify-center`}>{p.cta}</Link>
              </div>
            ))}
          </div>

          {/* Feature comparison */}
          <div className="mt-14 glass-strong rounded-3xl p-6 overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="text-left font-medium py-3">Compare</th>
                  <th className="font-medium py-3">Founder</th>
                  <th className="font-medium py-3 text-primary">Pro</th>
                  <th className="font-medium py-3">Growth</th>
                  <th className="font-medium py-3">Accel.</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["AI idea validations", "3/mo", "Unlimited", "Unlimited", "Unlimited"],
                  ["AI Coach messages", "20/day", "Unlimited", "Unlimited", "Unlimited"],
                  ["Business blueprint", "—", "✓", "✓", "✓"],
                  ["Pitch deck generator", "—", "✓", "✓", "✓"],
                  ["Mentor sessions", "—", "1/mo", "4/mo", "Unlimited"],
                  ["Co-founder matching", "Browse", "✓", "Priority", "Priority"],
                  ["Investor readiness", "—", "—", "✓", "✓"],
                  ["Team seats", "1", "1", "3", "Unlimited"],
                  ["SSO + admin", "—", "—", "—", "✓"],
                ].map((row, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-3 text-muted-foreground">{row[0]}</td>
                    {row.slice(1).map((cell, k) => (
                      <td key={k} className={`text-center py-3 ${k === 1 ? "text-primary font-semibold" : ""}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container-x max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-12">Questions, answered.</h2>
          <div className="space-y-3">
            {[
              { q: "Is FoundHer only for women?", a: "We design for women founders, but anyone can join. Our community guidelines and matching prioritize an inclusive, women-led environment." },
              { q: "How is this different from ChatGPT?", a: "FoundHer is a full operating system — your idea, plan, mentors, co-founder, milestones, and pitch deck in one workspace. The AI remembers your startup and works with you over months, not minutes." },
              { q: "Do I really get real human mentors?", a: "Yes. Every mentor on FoundHer is vetted — operators, founders, and investors with real exits and operator experience." },
              { q: "How does co-founder matching work?", a: "We score compatibility across six dimensions — skills, vision, industry, availability, time-zone, and stage. You only see mutual matches." },
              { q: "Can I cancel anytime?", a: "Yes. Monthly plans, no contracts. Your data is yours and exportable any time." },
            ].map(f => (
              <details key={f.q} className="glass-card p-5 group">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-medium">{f.q}</span>
                  <span className="text-primary transition group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA + WAITLIST */}
      <section className="section">
        <div className="container-x">
          <div className="relative glass-strong rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 aurora opacity-80 pointer-events-none" />
            <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
            <div className="relative">
              <div className="chip chip-brand mx-auto mb-6"><Sparkles className="h-3 w-3" /> Your AI co-founder is waiting</div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                From idea to launch —<br />
                <span className="font-serif italic text-gradient">faster, together.</span>
              </h2>
              <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
                Join thousands of women turning ideas into companies. Start free in 30 seconds.
              </p>
              <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                <Link to="/auth?mode=signup" className="btn-primary">Start building free <ArrowRight className="h-4 w-4" /></Link>
                <a href="#product" className="btn-ghost">Explore the platform</a>
              </div>
              <div className="mt-6 text-xs text-muted-foreground">No credit card · Free forever for solo founders</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
