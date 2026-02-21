"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import CartDrawer from "./CartDrawer";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <nav className="navbar glass" style={{ background: scrolled ? "var(--bg-glass)" : "transparent" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <LuxaurisLogo />
          </Link>
          <div className="nav-links" style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <NavLink href="/productos">Perfumes</NavLink>
            <NavLink href="/productos?category=decants">Decants</NavLink>
            <NavLink href="/productos?gender=MEN">Hombre</NavLink>
            <NavLink href="/productos?gender=WOMEN">Mujer</NavLink>
            <NavLink href="/productos?onSale=true">Ofertas</NavLink>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ThemeToggle />
            <Link href="/wishlist" aria-label="Favoritos" title="Mis favoritos" style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", textDecoration: "none", transition: "all 0.2s" }}>
              <HeartIcon />
            </Link>
            <button onClick={() => toggleCart()} style={{ position: "relative", background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "7px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: "var(--text)", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}>
              <CartIcon />
              {totalItems > 0 && (<span style={{ position: "absolute", top: -8, right: -8, background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#0a0906", width: 20, height: 20, borderRadius: "50%", fontSize: "0.65rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse-gold 1.5s infinite" }}>{totalItems > 99 ? "99+" : totalItems}</span>)}
              <span style={{ fontSize: "0.8rem" }}>Carrito</span>
            </button>
            {user ? (
              <div ref={userMenuRef} style={{ position: "relative" }}>
                <button onClick={() => setUserMenuOpen((o) => !o)} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "7px 12px", cursor: "pointer", color: "var(--text)", transition: "all 0.2s" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "#0a0906" }}>{(user.name ?? user.email).charAt(0).toUpperCase()}</div>
                  <span style={{ fontSize: "0.8rem", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name ?? user.email.split("@")[0]}</span>
                  <span style={{ fontSize: "0.6rem" }}></span>
                </button>
                {userMenuOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, minWidth: 190, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", zIndex: 100, overflow: "hidden", animation: "slideUp 0.15s ease" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Conectado como</p>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                    </div>
                    <MenuRow href="/wishlist" onClick={() => setUserMenuOpen(false)} icon="">Mis favoritos</MenuRow>
                    <button onClick={async () => { setUserMenuOpen(false); await logout(); }} style={{ display: "flex", width: "100%", alignItems: "center", gap: 10, padding: "10px 16px", color: "var(--red)", background: "transparent", border: "none", borderTop: "1px solid var(--border)", fontSize: "0.85rem", cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(229,75,75,0.06)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                      <span></span> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn btn-outline" style={{ padding: "7px 16px", fontSize: "0.8rem" }}>Iniciar sesión</Link>
            )}
          </div>
        </div>
      </nav>
      <CartDrawer />
    </>
  );
}

function MenuRow({ href, onClick, icon, children }: { href: string; onClick: () => void; icon: string; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", color: "var(--text-muted)", textDecoration: "none", fontSize: "0.85rem", transition: "background 0.15s" }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--input-bg)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
      <span>{icon}</span> {children}
    </Link>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", letterSpacing: "0.04em", transition: "color 0.2s" }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--gold)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}>
      {children}
    </Link>
  );
}

function LuxaurisLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 62"
      width="154"
      height="44"
      aria-label="Luxauris"
    >
      {/* ── Text ── */}
      <text
        x="108"
        y="36"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="28"
        fontWeight="400"
        letterSpacing="5"
        fill="url(#goldGrad)"
      >
        LUXAURIS
      </text>

      {/* ── Wave beneath text ── */}
      <path
        d="M 18 45 C 45 38, 75 52, 108 45 C 141 38, 171 52, 198 45"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* ── Leaf / plume (top-right of text) ── */}
      <g transform="translate(183, 8) rotate(-20)">
        <path d="M0,0 Q3,-7 1,-14"  fill="none" stroke="url(#goldGrad)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M0,0 Q6,-6 7,-13"  fill="none" stroke="url(#goldGrad)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M0,0 Q8,-3 11,-10" fill="none" stroke="url(#goldGrad)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M0,0 Q7,0 12,-5"   fill="none" stroke="url(#goldGrad)" strokeWidth="1" strokeLinecap="round"/>
      </g>

      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#c9a96e" />
          <stop offset="50%"  stopColor="#e8c97e" />
          <stop offset="100%" stopColor="#a67c3c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}
