import Shell from "@/components/app/Shell";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, Send, MessagesSquare } from "lucide-react";
import { toast } from "sonner";

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai`;

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me write a 3-sentence pitch for my startup.",
  "What 5 user interviews should I run this week?",
  "How do I price a B2B SaaS in early stage?",
  "Draft a cold email to a potential investor.",
];

type CoachMessageRow = { role: "user" | "assistant" | "system"; content: string };
type CoachMessage = { role: "user" | "assistant"; content: string };

export default function Coach() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [streamed, setStreamed] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("coach_messages").select("role, content").eq("user_id", user.id).order("created_at", { ascending: true }).limit(50).then(({ data }) => {
      if (data) {
        const rows = data as CoachMessageRow[];
        const filtered = rows.filter((m): m is CoachMessage => m.role === "user" || m.role === "assistant");
        setMessages(filtered.map(m => ({ role: m.role, content: m.content })));
      }
    });
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streamed]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || streaming) return;
    setInput("");
    const userMsg: Msg = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setStreaming(true); setStreamed("");

    if (user) await supabase.from("coach_messages").insert({ user_id: user.id, role: "user", content });

    try {
      const { data: sess } = await supabase.auth.getSession();
      const r = await fetch(FUNCTIONS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sess.session?.access_token}` },
        body: JSON.stringify({ mode: "coach", messages: next }),
      });
      if (r.status === 429) throw new Error("AI is busy — try again in a moment.");
      if (r.status === 402) throw new Error("AI credits exhausted.");
      if (!r.ok || !r.body) throw new Error("AI error");

      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) { acc += delta; setStreamed(acc); }
          } catch {
            // ignore invalid stream payload and continue
          }
        }
      }
      const assistantMsg: Msg = { role: "assistant", content: acc };
      setMessages(m => [...m, assistantMsg]);
      setStreamed("");
      if (user && acc) await supabase.from("coach_messages").insert({ user_id: user.id, role: "assistant", content: acc });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error(message || "Coach error");
      setMessages(m => m.slice(0, -1));
    }
    setStreaming(false);
  };

  const empty = messages.length === 0;

  return (
    <Shell title="AI Startup Coach">
      <div className="max-w-3xl mx-auto h-[calc(100vh-9rem)] flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pb-4">
          {empty && !streaming && (
            <div className="text-center pt-12 animate-fade-up">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand glow-primary mb-4">
                <MessagesSquare className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Your AI co-founder.</h2>
              <p className="text-muted-foreground mt-2">Ask anything. Strategy, fundraising, hiring, pricing, pitch — it remembers.</p>
              <div className="mt-8 grid sm:grid-cols-2 gap-2 max-w-xl mx-auto">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)} className="text-left p-4 rounded-xl glass-card hover:border-white/15 transition text-sm">
                    <Sparkles className="h-3.5 w-3.5 text-primary mb-2" />{s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && <div className="h-8 w-8 rounded-xl bg-gradient-brand inline-flex items-center justify-center shrink-0"><Sparkles className="h-4 w-4 text-white" /></div>}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${m.role === "user" ? "bg-gradient-brand text-white" : "glass-card"}`}>{m.content}</div>
            </div>
          ))}
          {streaming && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-brand inline-flex items-center justify-center shrink-0"><Sparkles className="h-4 w-4 text-white" /></div>
              <div className="max-w-[80%] glass-card rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed">
                {streamed || <span className="inline-flex gap-1"><span className="h-2 w-2 rounded-full bg-primary animate-pulse" /><span className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:0.15s]" /><span className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:0.3s]" /></span>}
              </div>
            </div>
          )}
        </div>

        <div className="glass-strong rounded-2xl p-2 flex items-end gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask your coach anything…"
            rows={1}
            className="flex-1 bg-transparent border-0 outline-none resize-none px-3 py-2.5 text-sm max-h-32"
          />
          <button onClick={() => send()} disabled={streaming || !input.trim()} className="btn-primary p-3 disabled:opacity-50">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Shell>
  );
}
