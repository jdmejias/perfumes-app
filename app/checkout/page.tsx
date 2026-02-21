"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

const SHIPPING_CENTS = 500_00; // $500 flat rate (in cents)
const FREE_SHIPPING_THRESHOLD = 2000_00; // free over $2,000

export default function CheckoutPage() {
  const { items, totalItems, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", notes: "" });
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.priceCents * i.quantity, 0);
  const couponDiscount = couponApplied ? Math.round(subtotal * 0.1) : 0; // 10% demo coupon
  const shippingCost = subtotal - couponDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CENTS;
  const total = subtotal - couponDiscount + shippingCost;

  function handleApplyCoupon() {
    setCouponError("");
    if (coupon.toUpperCase() === "LUXAURIS10") {
      setCouponApplied(true);
    } else {
      setCouponError("Cupón inválido o expirado");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Simulate order submission
    await new Promise(r => setTimeout(r, 1200));
    clearCart();
    setSuccess(true);
    setSubmitting(false);
  }

  if (success) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div className="card" style={{ maxWidth: 480, width: "100%", padding: "48px 40px", textAlign: "center" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: 20 }}>🎉</div>
          <h1 className="font-serif" style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 12 }}>¡Pedido confirmado!</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 32 }}>
            Gracias por tu compra. Recibirás una confirmación a <strong>{form.email}</strong> pronto.
          </p>
          <Link href="/" className="btn btn-gold" style={{ padding: "13px 32px" }}>Volver al inicio</Link>
        </div>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div className="card" style={{ maxWidth: 440, width: "100%", padding: "48px 40px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🛒</div>
          <h2 className="font-serif" style={{ fontSize: "1.6rem", fontWeight: 600, marginBottom: 12 }}>Tu carrito está vacío</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 28, fontSize: "0.9rem" }}>Agrega productos antes de continuar al checkout.</p>
          <Link href="/productos" className="btn btn-gold" style={{ padding: "13px 28px" }}>Ver perfumes</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
      <h1 className="font-serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, marginBottom: 8 }}>Finalizar compra</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 48, fontSize: "0.9rem" }}>Revisa tu pedido y completa tus datos de envío.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr min(420px, 100%)", gap: 32, alignItems: "start" }}>
        {/* ── Left: Form ── */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ padding: "28px 24px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 20 }}>DATOS DE CONTACTO</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Nombre completo" required style={{ gridColumn: "1/-1" }}>
                <input className="field" style={{ width: "100%", boxSizing: "border-box" }} required placeholder="Ana García" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Correo electrónico" required>
                <input className="field" type="email" style={{ width: "100%", boxSizing: "border-box" }} required placeholder="ana@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label="Teléfono">
                <input className="field" type="tel" style={{ width: "100%", boxSizing: "border-box" }} placeholder="+52 55 0000 0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </Field>
            </div>
          </div>

          <div className="card" style={{ padding: "28px 24px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 20 }}>DIRECCIÓN DE ENVÍO</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Dirección completa" required>
                <input className="field" style={{ width: "100%", boxSizing: "border-box" }} required placeholder="Calle Principal 123, Col. Centro" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </Field>
              <Field label="Ciudad / Estado" required>
                <input className="field" style={{ width: "100%", boxSizing: "border-box" }} required placeholder="Ciudad de México" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
              </Field>
              <Field label="Notas adicionales (opcional)">
                <textarea className="field" style={{ width: "100%", boxSizing: "border-box", minHeight: 80, resize: "vertical" }} placeholder="Instrucciones de entrega, referencias…" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </Field>
            </div>
          </div>

          <button type="submit" className="btn btn-gold" disabled={submitting} style={{ padding: "15px", fontSize: "1rem" }}>
            {submitting ? "Procesando pedido…" : `Confirmar pedido — ${formatPrice(total)}`}
          </button>
        </form>

        {/* ── Right: Summary ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Items list */}
          <div className="card" style={{ padding: "24px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 20 }}>TU PEDIDO ({totalItems})</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {items.map(item => (
                <div key={item.variantId} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--input-bg)", flexShrink: 0, position: "relative" }}>
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.productName} fill style={{ objectFit: "cover" }} unoptimized />
                    ) : <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "1.5rem" }}>🌸</span>}
                    <span style={{ position: "absolute", top: -6, right: -6, background: "var(--gold)", color: "#0a0906", width: 18, height: 18, borderRadius: "50%", fontSize: "0.6rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.quantity}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 500, fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.productName}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{item.variantLabel}</p>
                  </div>
                  <p style={{ fontWeight: 600, fontSize: "0.88rem", flexShrink: 0 }}>{formatPrice(item.priceCents * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>Cupón de descuento</p>
            {couponApplied ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#4caf50", fontSize: "0.85rem" }}>
                <span>✓</span> Cupón <strong>LUXAURIS10</strong> aplicado (−10%)
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <input className="field" style={{ flex: 1 }} placeholder="Código de cupón" value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} />
                <button type="button" className="btn btn-outline" style={{ padding: "8px 14px", fontSize: "0.8rem" }} onClick={handleApplyCoupon}>Aplicar</button>
              </div>
            )}
            {couponError && <p style={{ color: "var(--red)", fontSize: "0.78rem", marginTop: 6 }}>{couponError}</p>}
          </div>

          {/* Price breakdown */}
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <PriceLine label="Subtotal" value={formatPrice(subtotal)} />
              {couponApplied && <PriceLine label="Descuento (10%)" value={`−${formatPrice(couponDiscount)}`} accent />}
              <PriceLine label="Envío" value={shippingCost === 0 ? "Gratis 🎉" : formatPrice(shippingCost)} />
              {shippingCost > 0 && (
                <p style={{ fontSize: "0.72rem", color: "var(--gold)", marginTop: -4 }}>
                  Agrega {formatPrice(FREE_SHIPPING_THRESHOLD - (subtotal - couponDiscount))} más para envío gratis
                </p>
              )}
            </div>
            <div className="divider-gold" style={{ margin: "16px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>Total</p>
              <p className="price-effective" style={{ fontSize: "1.4rem" }}>{formatPrice(total)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, style, children }: { label: string; required?: boolean; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div style={style}>
      <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
        {label}{required && <span style={{ color: "var(--gold)", marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function PriceLine({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span style={{ fontWeight: 500, color: accent ? "#4caf50" : "inherit" }}>{value}</span>
    </div>
  );
}
