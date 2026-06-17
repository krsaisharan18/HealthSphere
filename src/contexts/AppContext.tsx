import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { defaultData, type DataState } from "@/lib/health";
import {
  apiLogin,
  apiLogout,
  apiSignup,
  apiGetMe,
  apiGetHealth,
  apiSaveHealth,
  apiUpdateProfile,
  type AuthUser,
} from "@/lib/api/client";

// ── Types ─────────────────────────────────────────────────────────────────────
export type User = AuthUser;

type Theme = "light" | "dark";
type Lang = "en" | "hi";

type Ctx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (u: Omit<User, "id"> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (u: Partial<User>) => Promise<void>;
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  data: DataState;
  setData: (updater: (d: DataState) => DataState) => void;
  resetData: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

const THEME_KEY = "hs:theme";
const LANG_KEY = "hs:lang";

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState<Theme>("light");
  const [lang, setLangState] = useState<Lang>("en");
  const [data, setDataState] = useState<DataState>(defaultData);

  // Debounce timer for auto-save
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Bootstrap: restore session + preferences ───────────────────────────────
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    if (savedTheme) setThemeState(savedTheme);
    const savedLang = localStorage.getItem(LANG_KEY) as Lang | null;
    if (savedLang) setLangState(savedLang);

    const token = localStorage.getItem("hs:token");
    if (!token) {
      setLoading(false);
      return;
    }

    // Restore user from token
    apiGetMe()
      .then((u) => {
        setUser(u);
        return apiGetHealth<DataState>();
      })
      .then((health) => {
        setDataState(health ?? defaultData);
      })
      .catch(() => {
        // Token expired or invalid — clear it
        apiLogout();
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Theme persistence ──────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // ── Lang persistence ───────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  // ── Auto-save health data to MongoDB (debounced 2s) ────────────────────────
  useEffect(() => {
    if (!user) return; // not logged in, skip
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      apiSaveHealth(data).catch((err) =>
        console.warn("Auto-save failed:", err)
      );
    }, 2000);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, user]);

  // ── Auth actions ───────────────────────────────────────────────────────────
  const login: Ctx["login"] = async (email, password) => {
    try {
      const u = await apiLogin(email, password);
      setUser(u);
      const health = await apiGetHealth<DataState>().catch(() => defaultData);
      setDataState(health ?? defaultData);
      return true;
    } catch {
      return false;
    }
  };

  const signup: Ctx["signup"] = async (form) => {
    try {
      const u = await apiSignup(form);
      setUser(u);
      // Backend creates default data; fetch it
      const health = await apiGetHealth<DataState>().catch(() => defaultData);
      setDataState(health ?? defaultData);
      return true;
    } catch (err: unknown) {
      const msg = (err as Error).message ?? "";
      if (msg.toLowerCase().includes("already")) return false;
      return false;
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setDataState(defaultData);
  };

  const updateUser: Ctx["updateUser"] = async (patch) => {
    const updated = await apiUpdateProfile(patch);
    setUser(updated);
  };

  // ── Data actions ───────────────────────────────────────────────────────────
  const setData: Ctx["setData"] = (updater) =>
    setDataState((d) => updater(d));

  const resetData = () => setDataState(defaultData);

  // ── Context value ──────────────────────────────────────────────────────────
  const value = useMemo<Ctx>(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      updateUser,
      theme,
      setTheme: setThemeState,
      lang,
      setLang: setLangState,
      data,
      setData,
      resetData,
    }),
    [user, loading, theme, lang, data]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
