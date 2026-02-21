"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const { register, user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Las contraseñas no coinciden"); return; }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    setSubmitting(true);
    try {
      await register(name, email, password);
      router.replace("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "var(--bg)" }}>
      <div className="card" style={{ width: "100%", maxWidth: 420, padding: "40px 36px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p className="font-serif" style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--gold)", letterSpacing: "0.05em" }}>Luxauris</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 6 }}>Crea tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
              Nombre (opcional)
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="field"
              style={{ width: "100%", boxSizing: "border-box" }}
              placeholder="Tu nombre"
            />
          </div>
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
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
              Confirmar contraseña
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="field"
              style={{ width: "100%", boxSizing: "border-box" }}
              placeholder="Repite tu contraseña"
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
            {submitting ? "Creando cuenta…" : "Crear cuenta"}
          </button>
        </form>

        <div className="divider-gold" style={{ margin: "24px 0" }} />

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 500 }}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
