"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "var(--bg)" }}>
      <div className="card" style={{ width: "100%", maxWidth: 420, padding: "40px 36px" }}>
        {/* Logo area */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p className="font-serif" style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--gold)", letterSpacing: "0.05em" }}>Luxauris</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 6 }}>Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="field"
              style={{ width: "100%", boxSizing: "border-box" }}
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="field"
              style={{ width: "100%", boxSizing: "border-box" }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{ background: "rgba(229,75,75,0.1)", border: "1px solid rgba(229,75,75,0.3)", borderRadius: "var(--radius-sm)", padding: "10px 14px", color: "var(--red)", fontSize: "0.83rem" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-gold"
            disabled={submitting}
            style={{ padding: "13px", fontSize: "0.9rem", marginTop: 4 }}
          >
            {submitting ? "Ingresando…" : "Iniciar sesión"}
          </button>
        </form>

        <div className="divider-gold" style={{ margin: "24px 0" }} />

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
          ¿No tienes cuenta?{" "}
          <Link href="/register" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 500 }}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
