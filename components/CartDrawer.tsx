"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

export default function CartDrawer() {
    const { open, items, subtotalCents, totalItems, toggleCart, removeItem, updateQty, clearCart } = useCart();

    if (!open) return null;

    return (
        <>
            {/* Overlay */}
            <div className="cart-overlay" onClick={() => toggleCart(false)} />

            {/* Drawer */}
            <aside className="cart-drawer glass" style={{ borderLeft: "1px solid var(--border)" }}>
                {/* Header */}
                <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <p className="section-label">Tu carrito</p>
                        <h2 className="font-serif" style={{ fontSize: "1.3rem", marginTop: 4 }}>
                            {totalItems} {totalItems === 1 ? "artículo" : "artículos"}
                        </h2>
                    </div>
                    <button
                        onClick={() => toggleCart(false)}
                        style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "6px 10px", cursor: "pointer", color: "var(--text-muted)", fontSize: "1.2rem", lineHeight: 1, transition: "all 0.2s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
                    >
                        ✕
                    </button>
                </div>

                {/* Items */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                    {items.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
                            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🛍️</div>
                            <p className="font-serif" style={{ fontSize: "1.1rem", color: "var(--text)" }}>Tu carrito está vacío</p>
                            <p style={{ fontSize: "0.85rem", marginTop: 8 }}>Explora nuestra colección y encuentra tu fragancia perfecta.</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <CartItem key={item.variantId} item={item} removeItem={removeItem} updateQty={updateQty} />
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div style={{ padding: "16px 24px 24px", borderTop: "1px solid var(--border)" }}>
                        <div className="divider-gold" style={{ marginBottom: 16 }} />

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Subtotal</span>
                            <span style={{ fontWeight: 600, color: "var(--gold)" }}>{formatPrice(subtotalCents)}</span>
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginBottom: 16 }}>
                            Envío calculado al finalizar el pedido
                        </p>

                        <Link href="/checkout" className="btn btn-gold" style={{ width: "100%", padding: "14px", fontSize: "0.9rem", marginBottom: 8, textAlign: "center", display: "block", boxSizing: "border-box" }} onClick={() => toggleCart(false)}>
                            Proceder al pago
                        </Link>
                        <button
                            className="btn btn-ghost"
                            style={{ width: "100%", padding: "10px", fontSize: "0.8rem" }}
                            onClick={clearCart}
                        >
                            Vaciar carrito
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}

function CartItem({
    item,
    removeItem,
    updateQty,
}: {
    item: import("@/lib/cart-context").CartItem;
    removeItem: (id: string) => void;
    updateQty: (id: string, qty: number) => void;
}) {
    return (
        <div style={{ display: "flex", gap: 12, padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
            {/* Image */}
            <div style={{ width: 64, height: 64, borderRadius: "var(--radius-sm)", overflow: "hidden", flexShrink: 0, background: "#1a1208" }}>
                {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.productName} width={64} height={64} style={{ objectFit: "cover", width: "100%", height: "100%" }} unoptimized />
                ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-dim)", fontSize: "1.2rem" }}>🌸</div>
                )}
            </div>

            {/* Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 500, fontSize: "0.875rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.productName}</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: 2 }}>{item.variantLabel}</p>
                <p style={{ color: "var(--gold)", fontSize: "0.8rem", fontWeight: 600, marginTop: 4 }}>{formatPrice(item.priceCents)}</p>

                {/* Qty + Remove */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                    <button className="qty-btn" onClick={() => updateQty(item.variantId, item.quantity - 1)}>−</button>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.variantId, item.quantity + 1)}>+</button>
                    <button
                        onClick={() => removeItem(item.variantId)}
                        style={{ marginLeft: "auto", background: "transparent", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "0.75rem", transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--red)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-dim)"}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}
