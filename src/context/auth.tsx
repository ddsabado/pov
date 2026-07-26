import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthCtx {
  unlocked: boolean;
  unlock: () => void;
}

const Ctx = createContext<AuthCtx>({ unlocked: false, unlock: () => {} });

const SK = 'alb_s';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SK) === '1');
  const unlock = () => { sessionStorage.setItem(SK, '1'); setUnlocked(true); };
  return <Ctx.Provider value={{ unlocked, unlock }}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);
