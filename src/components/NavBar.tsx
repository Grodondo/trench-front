"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

const NAV_LINKS = [
  { href: "/warbands/build", label: "Build Warband", primary: true },
  { href: "/warbands", label: "Warbands" },
  { href: "/factions", label: "Factions" },
  { href: "/map", label: "Front Line" },
  { href: "/world-map", label: "World Map" },
  { href: "/about", label: "About" },
];

function linkIsActive(pathname: string, href: string): boolean {
  if (href === "/warbands/build") return pathname.startsWith("/warbands/build");
  if (href === "/warbands")
    return (
      pathname === "/warbands" ||
      (pathname.startsWith("/warbands/") && !pathname.startsWith("/warbands/build"))
    );
  return pathname === href || pathname.startsWith(href + "/");
}

export default function NavBar() {
  const pathname = usePathname();

  const [user, setUser] = useState<{ username: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [showPanel, setShowPanel] = useState<"none" | "login" | "register" | "account">("none");

  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [regUser, setRegUser] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPw, setRegPw] = useState("");
  const [regPwConfirm, setRegPwConfirm] = useState("");
  const [authErr, setAuthErr] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user ?? null);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Close panel on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowPanel("none");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const doLogin = async () => {
    setAuthLoading(true);
    setAuthErr("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: loginId, password: loginPw }),
    });
    const data = await res.json();
    setAuthLoading(false);
    if (!res.ok) { setAuthErr(data.error ?? "Login failed"); return; }
    await checkAuth();
    setShowPanel("none");
    setLoginId(""); setLoginPw("");
  };

  const doRegister = async () => {
    setAuthErr("");
    if (regPw !== regPwConfirm) { setAuthErr("Passwords do not match"); return; }
    setAuthLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: regUser, email: regEmail, password: regPw }),
    });
    const data = await res.json();
    setAuthLoading(false);
    if (!res.ok) { setAuthErr(data.error ?? "Registration failed"); return; }
    await checkAuth();
    setShowPanel("none");
    setRegUser(""); setRegEmail(""); setRegPw(""); setRegPwConfirm("");
  };

  const doLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setShowPanel("none");
  };

  const inputCls =
    "w-full bg-[#0d0805] border border-[#2e1b0e] rounded px-2 py-1.5 text-[#e8d5b0] text-xs focus:outline-none focus:border-[#c8a96e]/60 placeholder:text-[#4a3728]";

  return (
    <div className="flex items-center gap-5 text-sm flex-wrap justify-end">
      {NAV_LINKS.map(({ href, label, primary }) => {
        const active = linkIsActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={[
              "uppercase tracking-wider transition-colors text-sm",
              active
                ? "text-[#c8a96e] border-b border-[#c8a96e]/60 pb-px"
                : primary
                ? "text-[#c8a96e]/80 hover:text-[#c8a96e] font-bold"
                : "text-[#c8a96e]/60 hover:text-[#c8a96e]",
            ].join(" ")}
          >
            {label}
          </Link>
        );
      })}

      {/* Auth button */}
      {authChecked && (
        <div className="relative" ref={panelRef}>
          {user ? (
            <button
              onClick={() =>
                setShowPanel(showPanel === "account" ? "none" : "account")
              }
              className="text-[#c8a96e]/70 hover:text-[#c8a96e] transition-colors uppercase tracking-wider text-xs border border-[#2e1b0e] hover:border-[#c8a96e]/40 rounded px-2.5 py-1"
            >
              {user.username}
            </button>
          ) : (
            <button
              onClick={() => {
                setShowPanel(showPanel === "login" ? "none" : "login");
                setAuthErr("");
              }}
              className="text-[#c8a96e] hover:text-[#d4b87a] transition-colors uppercase tracking-wider text-xs border border-[#c8a96e]/40 hover:border-[#c8a96e] rounded px-2.5 py-1"
            >
              Sign In
            </button>
          )}

          {/* Dropdown panel */}
          {showPanel !== "none" && (
            <div
              className="absolute right-0 top-full mt-2 bg-[#1a0f0a] border border-[#2e1b0e] rounded-lg shadow-xl z-[100] p-4"
              style={{ minWidth: "220px" }}
            >
              {/* Account dropdown */}
              {showPanel === "account" && user && (
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] text-[#c8a96e]/50 font-mono pb-2 border-b border-[#2e1b0e] mb-1">
                    Signed in as{" "}
                    <span className="text-[#c8a96e]">{user.username}</span>
                  </p>
                  <Link
                    href="/warbands?mine=1"
                    onClick={() => setShowPanel("none")}
                    className="text-xs text-[#e8d5b0]/70 hover:text-[#c8a96e] transition-colors py-1.5 px-1 rounded hover:bg-[#c8a96e]/5"
                  >
                    My Warbands
                  </Link>
                  <Link
                    href="/warbands/build"
                    onClick={() => setShowPanel("none")}
                    className="text-xs text-[#e8d5b0]/70 hover:text-[#c8a96e] transition-colors py-1.5 px-1 rounded hover:bg-[#c8a96e]/5"
                  >
                    Build Warband
                  </Link>
                  <div className="border-t border-[#2e1b0e] mt-1 pt-1">
                    <button
                      onClick={doLogout}
                      className="text-xs text-[#4a3728] hover:text-[#ff6666] transition-colors py-1.5 px-1 w-full text-left rounded hover:bg-red-900/10"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}

              {/* Login / Register panel */}
              {(showPanel === "login" || showPanel === "register") && (
                <div className="flex flex-col gap-2.5">
                  {/* Tabs */}
                  <div className="flex border border-[#2e1b0e] rounded overflow-hidden">
                    <button
                      onClick={() => { setShowPanel("login"); setAuthErr(""); }}
                      className={`flex-1 text-[10px] uppercase tracking-wider py-1.5 transition-colors ${
                        showPanel === "login"
                          ? "bg-[#c8a96e]/10 text-[#c8a96e]"
                          : "text-[#4a3728] hover:text-[#c8a96e]/60"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { setShowPanel("register"); setAuthErr(""); }}
                      className={`flex-1 text-[10px] uppercase tracking-wider py-1.5 transition-colors border-l border-[#2e1b0e] ${
                        showPanel === "register"
                          ? "bg-[#c8a96e]/10 text-[#c8a96e]"
                          : "text-[#4a3728] hover:text-[#c8a96e]/60"
                      }`}
                    >
                      Register
                    </button>
                  </div>

                  {showPanel === "login" && (
                    <>
                      <input
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        placeholder="Email or username"
                        className={inputCls}
                        autoFocus
                      />
                      <input
                        type="password"
                        value={loginPw}
                        onChange={(e) => setLoginPw(e.target.value)}
                        placeholder="Password"
                        className={inputCls}
                        onKeyDown={(e) => e.key === "Enter" && doLogin()}
                      />
                      {authErr && (
                        <p className="text-[10px] text-red-400">{authErr}</p>
                      )}
                      <button
                        onClick={doLogin}
                        disabled={authLoading || !loginId || !loginPw}
                        className="w-full py-1.5 bg-[#c8a96e] text-[#1a0f0a] text-xs font-bold uppercase tracking-wider rounded hover:bg-[#d4b87a] disabled:opacity-40 transition-colors"
                      >
                        {authLoading ? "…" : "Sign In"}
                      </button>
                    </>
                  )}

                  {showPanel === "register" && (
                    <>
                      <input
                        value={regUser}
                        onChange={(e) => setRegUser(e.target.value)}
                        placeholder="Username (max 30)"
                        className={inputCls}
                        maxLength={30}
                        autoFocus
                      />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="Email"
                        className={inputCls}
                      />
                      <input
                        type="password"
                        value={regPw}
                        onChange={(e) => setRegPw(e.target.value)}
                        placeholder="Password (min 8)"
                        className={inputCls}
                        minLength={8}
                      />
                      <input
                        type="password"
                        value={regPwConfirm}
                        onChange={(e) => setRegPwConfirm(e.target.value)}
                        placeholder="Confirm password"
                        className={`${inputCls}${regPwConfirm && regPw !== regPwConfirm ? " border-red-700" : ""}`}
                        onKeyDown={(e) => e.key === "Enter" && doRegister()}
                      />
                      {authErr && (
                        <p className="text-[10px] text-red-400">{authErr}</p>
                      )}
                      <button
                        onClick={doRegister}
                        disabled={authLoading || !regUser || !regEmail || !regPw || !regPwConfirm}
                        className="w-full py-1.5 bg-[#c8a96e] text-[#1a0f0a] text-xs font-bold uppercase tracking-wider rounded hover:bg-[#d4b87a] disabled:opacity-40 transition-colors"
                      >
                        {authLoading ? "…" : "Create Account"}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
