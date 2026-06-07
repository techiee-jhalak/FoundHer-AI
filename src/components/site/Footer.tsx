import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="container-x px-6 md:px-10 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2 font-semibold">
            <span className="h-8 w-8 inline-flex items-center justify-center rounded-xl bg-gradient-brand">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="text-lg">FoundHer<span className="text-gradient">.ai</span></span>
          </div>
          <p className="text-sm text-muted-foreground mt-4 max-w-sm">
            The AI co-founder for women entrepreneurs. Validate, plan, connect, and launch — faster.
          </p>
          <p className="text-xs text-muted-foreground mt-6">© {new Date().getFullYear()} FoundHer AI. All rights reserved.</p>
        </div>
        {[
          { title: "Product", items: ["Idea Validator", "AI Coach", "Pitch Deck", "Mentor Network"] },
          { title: "Company", items: ["About", "Careers", "Blog", "Press"] },
          { title: "Legal", items: ["Privacy", "Terms", "Security", "Contact"] },
        ].map(col => (
          <div key={col.title}>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{col.title}</div>
            <ul className="space-y-3 text-sm">
              {col.items.map(i => <li key={i}><a href="#" className="hover:text-foreground text-muted-foreground transition">{i}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
