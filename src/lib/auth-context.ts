import { createContext, useContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

type Ctx = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<Ctx>({ session: null, user: null, loading: true, signOut: async () => {} });

export const useAuth = () => useContext(AuthCtx);
export { AuthCtx };
