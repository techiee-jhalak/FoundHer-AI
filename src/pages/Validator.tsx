import Shell from "@/components/app/Shell";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, ArrowRight, TrendingUp, AlertTriangle, DollarSign, Users, Target, Download } from "lucide-react";
import { toast } from "sonner";

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai`;

type Result = {
  score: number;
  tagline: string;
  tam: string;
  marketDemand: { score: number; summary: string };
  competitors: { name: string; note: string }[];
  revenue: string[];
  risks: string[];
  recommendations: string[];
};

export default function Validator() {
  const { user } = useAuth();
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const run = async () => {
    if (idea.trim().length < 8) { toast.error("Add a few more details about your idea."); return; }
    setLoading(true); setResult(null);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const r = await fetch(FUNCTIONS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sess.session?.access_token}` },
        body: JSON.stringify({ mode: "validate", idea }),
      });
      if (r.status === 429) throw new Error("AI is busy — please try again in a moment.");
      if (r.status === 402) throw new Error("AI credits exhausted. Add credits to keep going.");
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      if (user) {
        await supabase.from("idea_validations").insert({ user_id: user.id, idea, score: data.score, result: data });
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error(message || "Couldn't validate");
    }
    setLoading(false);
  };

  return (
    <Shell title="AI Idea Validator">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="glass-strong rounded-3xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute inset-0 aurora opacity-50 pointer-events-none" />
          <div className="relative">
            <div className="chip chip-brand mb-3"><Sparkles className="h-3 w-3" /> AI-powered analysis</div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Validate your startup idea.</h1>
            <p className="text-muted-foreground mt-2 max-w-xl">A rigorous report in 30 seconds — market signal, named competitors, monetization, risks, and what to do next.</p>
            <div className="mt-6 flex flex-col md:flex-row gap-3">
              <textarea value={idea} onChange={e => setIdea(e.target.value)} placeholder="e.g. AI-powered postpartum coach helping new moms with sleep, recovery, and mental health" className="input-field flex-1 min-h-[80px] resize-none" />
              <button onClick={run} disabled={loading} className="btn-primary self-start disabled:opacity-60">
                {loading ? "Analyzing…" : <>Validate <ArrowRight className="h-4 w-4" /></>}
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="glass-card p-10 text-center">
            <div className="inline-block h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3" />
            <div className="text-sm text-muted-foreground">Scanning market signals, competitors, and monetization paths…</div>
          </div>
        )}

        {result && (
          <div className="space-y-5 animate-fade-up">
            {/* Top score + tagline */}
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="glass-card p-6 text-center">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Validation Score</div>
                <div className="mt-3 text-6xl font-bold text-gradient">{result.score}</div>
                <div className="text-xs text-muted-foreground mt-1">out of 100</div>
                <div className={`mt-4 chip ${result.score >= 70 ? "chip-brand" : ""}`}>
                  {result.score >= 80 ? "Very strong" : result.score >= 60 ? "Promising" : result.score >= 40 ? "Needs work" : "Pivot recommended"}
                </div>
              </div>
              <div className="glass-card p-6 lg:col-span-2">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Positioning</div>
                <div className="text-2xl font-bold leading-snug">"{result.tagline}"</div>
                <div className="mt-5 pt-5 border-t border-white/5">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">TAM estimate</div>
                  <div className="text-sm text-muted-foreground">{result.tam}</div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-3"><TrendingUp className="h-4 w-4 text-primary" /><div className="font-semibold">Market demand</div><div className="ml-auto text-sm font-bold text-gradient">{result.marketDemand?.score}/100</div></div>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.marketDemand?.summary}</p>
              </div>
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-3"><Users className="h-4 w-4 text-primary" /><div className="font-semibold">Competitors</div></div>
                <ul className="space-y-2">
                  {result.competitors?.map((c, i) => (
                    <li key={i} className="text-sm"><span className="font-medium">{c.name}</span> <span className="text-muted-foreground">— {c.note}</span></li>
                  ))}
                </ul>
              </div>
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-3"><DollarSign className="h-4 w-4 text-success" /><div className="font-semibold">Revenue paths</div></div>
                <ul className="space-y-2">{result.revenue?.map((r, i) => <li key={i} className="text-sm text-muted-foreground">• {r}</li>)}</ul>
              </div>
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-3"><AlertTriangle className="h-4 w-4 text-warning" /><div className="font-semibold">Risks</div></div>
                <ul className="space-y-2">{result.risks?.map((r, i) => <li key={i} className="text-sm text-muted-foreground">• {r}</li>)}</ul>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4"><Target className="h-4 w-4 text-primary" /><div className="font-semibold">Recommended next actions</div></div>
              <div className="grid md:grid-cols-2 gap-3">
                {result.recommendations?.map((r, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="h-7 w-7 rounded-full bg-gradient-brand inline-flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                    <div className="text-sm">{r}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(result, null, 2)); toast.success("Copied report JSON"); }} className="btn-ghost text-sm py-2.5"><Download className="h-4 w-4" /> Export</button>
              <button onClick={() => { setResult(null); setIdea(""); }} className="btn-ghost text-sm py-2.5">New validation</button>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
