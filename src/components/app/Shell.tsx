import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Sparkles, MessagesSquare, Users, Heart, FileText, BarChart3, Settings, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/validator", label: "Idea Validator", icon: Sparkles },
  { to: "/coach", label: "AI Coach", icon: MessagesSquare },
  { to: "#", label: "Mentors", icon: Users, disabled: true },
  { to: "#", label: "Co-founders", icon: Heart, disabled: true },
  { to: "#", label: "Pitch Deck", icon: FileText, disabled: true },
  { to: "#", label: "Analytics", icon: BarChart3, disabled: true },
];

export default function Shell({ children, title }: { children: ReactNode; title?: string }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle().then(({ data }) => {
      setName(data?.full_name ?? user.email?.split("@")[0] ?? "Founder");
    });
  }, [user]);

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/5 bg-[hsl(240_15%_9%)] sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 font-semibold px-6 h-16 border-b border-white/5">
          <span className="h-8 w-8 inline-flex items-center justify-center rounded-xl bg-gradient-brand">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span className="text-base">FoundHer<span className="text-gradient">.ai</span></span>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(item => {
            const Icon = item.icon;
            if (item.disabled) {
              return (
                <div key={item.label} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground/60 cursor-not-allowed">
                  <div className="flex items-center gap-3"><Icon className="h-4 w-4" />{item.label}</div>
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5">Soon</span>
                </div>
              );
            }
            return (
              <NavLink key={item.to} to={item.to} end className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isActive
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"}`
              }>
                <Icon className="h-4 w-4" /> {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-white hover:bg-white/5">
            <Settings className="h-4 w-4" /> Settings
          </button>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-white hover:bg-white/5">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-background/70 backdrop-blur-xl flex items-center justify-between px-5 md:px-8">
          <div>
            <div className="text-xs text-muted-foreground">Welcome back</div>
            <div className="text-base font-semibold">{title ?? `Hi, ${name?.split(" ")[0] || "Founder"}`}</div>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-9 w-9 rounded-full bg-white/5 border border-white/10 inline-flex items-center justify-center hover:bg-white/10"><Bell className="h-4 w-4" /></button>
            <div className="h-9 w-9 rounded-full bg-gradient-brand inline-flex items-center justify-center text-sm font-semibold">
              {(name?.[0] ?? "F").toUpperCase()}
            </div>
          </div>
        </header>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
