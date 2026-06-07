import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, Sparkles, Check } from "lucide-react";

const stages = [
  { v: "idea", t: "Just an idea", d: "Exploring possibilities" },
  { v: "validating", t: "Validating", d: "Talking to potential users" },
  { v: "building", t: "Building MVP", d: "Shipping a first version" },
  { v: "launched", t: "Launched", d: "Live with early users" },
  { v: "raising", t: "Raising / scaling", d: "Growing the team" },
];

const goals = ["Validate my idea", "Build a business plan", "Find a co-founder", "Connect with mentors", "Build a pitch deck", "Find investors"];

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [startup, setStartup] = useState("");
  const [idea, setIdea] = useState("");
  const [industry, setIndustry] = useState("");
  const [stage, setStage] = useState("idea");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleGoal = (g: string) =>
    setSelectedGoals(p => p.includes(g) ? p.filter(x => x !== g) : [...p, g]);

  const finish = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await supabase.from("profiles").update({
        full_name: name || undefined,
        headline: selectedGoals.join(", ") || null,
        stage,
        onboarded: true,
      }).eq("id", user.id);

      if (startup) {
        await supabase.from("startups").insert({
          user_id: user.id,
          name: startup,
          idea: idea || null,
          industry: industry || null,
          stage,
        });
      }
      toast.success("You're all set!");
      navigate("/dashboard");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error(message || "Couldn't save");
    }
    setLoading(false);
  };

  const next = () => setStep(s => Math.min(s + 1, 3));
  const back = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 aurora opacity-60 pointer-events-none" />
      <div className="relative w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="h-9 w-9 rounded-xl bg-gradient-brand inline-flex items-center justify-center"><Sparkles className="h-4 w-4 text-white" /></span>
          <span className="text-lg font-semibold">FoundHer<span className="text-gradient">.ai</span></span>
        </div>

        <div className="flex gap-1.5 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition ${i <= step ? "bg-gradient-brand" : "bg-white/10"}`} />
          ))}
        </div>

        <div className="glass-strong rounded-3xl p-8 md:p-10">
          {step === 0 && (
            <div className="animate-fade-up">
              <div className="chip mb-4">Step 1 of 4</div>
              <h1 className="text-3xl md:text-4xl font-bold">What should we call you?</h1>
              <p className="text-muted-foreground mt-2">We'll personalize your founder workspace.</p>
              <input autoFocus className="input-field mt-6" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          {step === 1 && (
            <div className="animate-fade-up">
              <div className="chip mb-4">Step 2 of 4</div>
              <h1 className="text-3xl md:text-4xl font-bold">Tell us about your startup.</h1>
              <p className="text-muted-foreground mt-2">Even a working title is fine — you can change it later.</p>
              <div className="space-y-3 mt-6">
                <input className="input-field" placeholder="Startup name (e.g. Nurtura)" value={startup} onChange={e => setStartup(e.target.value)} />
                <textarea className="input-field min-h-[100px] resize-none" placeholder="In one sentence, what does it do?" value={idea} onChange={e => setIdea(e.target.value)} />
                <input className="input-field" placeholder="Industry (e.g. Health, Fintech, Climate)" value={industry} onChange={e => setIndustry(e.target.value)} />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="animate-fade-up">
              <div className="chip mb-4">Step 3 of 4</div>
              <h1 className="text-3xl md:text-4xl font-bold">Where are you in the journey?</h1>
              <div className="grid sm:grid-cols-2 gap-3 mt-6">
                {stages.map(s => (
                  <button key={s.v} onClick={() => setStage(s.v)} className={`text-left p-4 rounded-xl border transition ${stage === s.v ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20 bg-white/[0.02]"}`}>
                    <div className="font-semibold">{s.t}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.d}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="animate-fade-up">
              <div className="chip mb-4">Step 4 of 4</div>
              <h1 className="text-3xl md:text-4xl font-bold">What do you want help with?</h1>
              <p className="text-muted-foreground mt-2">Select all that apply.</p>
              <div className="grid sm:grid-cols-2 gap-2 mt-6">
                {goals.map(g => {
                  const sel = selectedGoals.includes(g);
                  return (
                    <button key={g} onClick={() => toggleGoal(g)} className={`flex items-center justify-between text-left p-3.5 rounded-xl border transition ${sel ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20 bg-white/[0.02]"}`}>
                      <span className="text-sm font-medium">{g}</span>
                      {sel && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button onClick={back} disabled={step === 0} className="text-sm text-muted-foreground disabled:opacity-30 hover:text-foreground transition">Back</button>
            {step < 3 ? (
              <button onClick={next} className="btn-primary">Continue <ArrowRight className="h-4 w-4" /></button>
            ) : (
              <button onClick={finish} disabled={loading} className="btn-primary disabled:opacity-60">
                {loading ? "Setting up…" : <>Enter dashboard <ArrowRight className="h-4 w-4" /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
