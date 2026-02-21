"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { useWishlist } from "@/lib/wishlist-context";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface WishProduct {
  id: string;
  name: string;
  slug: string;
  gender: string;
  brand: { name: string };
  minEffectivePriceCents: number | null;
  hasActiveDiscount: boolean;
  firstImage: { url: string; alt: string | null } | null;
}

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { ids, toggle } = useWishlist();
  const router = useRouter();
  const [products, setProducts] = useState<WishProduct[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    fetch("/api/wishlist/products")
      .then(r => r.ok ? r.json() : { products: [] })
      .then(d => setProducts(d.products ?? []))
      .finally(() => setFetching(false));
  }, [user, ids.size]);

  if (authLoading || fetching) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
      <div style={{ marginBottom: 48 }}>
        <p className="section-label" style={{ marginBottom: 10 }}>Mi cuenta</p>
        <h1 className="font-serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700 }}>
          Mis favoritos
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: "0.9rem" }}>
          {ids.size === 0 ? "Aún no tienes favoritos guardados." : `${ids.size} producto${ids.size !== 1 ? "s" : ""} guardado${ids.size !== 1 ? "s" : ""}`}
        </p>
      </div>

      {ids.size === 0 ? (
        <div className="card" style={{ padding: "60px 40px", textAlign: "center", maxWidth: 480 }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>♡</div>
          <h2 className="font-serif" style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: 12 }}>Lista de favoritos vacía</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 28, fontSize: "0.9rem", lineHeight: 1.7 }}>
            Guarda los perfumes que te encantan para encontrarlos fácilmente después.
          </p>
          <Link href="/productos" className="btn btn-gold" style={{ padding: "13px 28px" }}>Explorar perfumes</Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.filter(p => ids.has(p.id)).map(product => (
            <article key={product.id} className="card" style={{ overflow: "hidden", position: "relative" }}>
              {/* Remove from wishlist */}
              <button
                onClick={() => toggle(product.id)}
                title="Quitar de favoritos"
                style={{ position: "absolute", top: 10, right: 10, zIndex: 10, background: "rgba(10,9,6,0.6)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "var(--gold)", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
              >
                ♥
              </button>

              <Link href={`/productos/${product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                {/* Image */}
                <div style={{ height: 240, position: "relative", background: "var(--input-bg)" }}>
                  {product.firstImage ? (
                    <Image src={product.firstImage.url} alt={product.firstImage.alt ?? product.name} fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: "cover" }} unoptimized />
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", color: "var(--text-dim)" }}>🌸</div>
                  )}
                  {product.hasActiveDiscount && (
                    <span className="badge badge-sale" style={{ position: "absolute", top: 12, left: 12 }}>Oferta</span>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: "16px" }}>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{product.brand.name}</p>
                  <h3 style={{ fontWeight: 500, fontSize: "0.95rem", lineHeight: 1.3, marginBottom: 12 }}>{product.name}</h3>
                  <div className="divider-gold" style={{ marginBottom: 12 }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ color: "var(--text-dim)", fontSize: "0.68rem", marginBottom: 2 }}>Desde</p>
                      <p className="price-effective" style={{ fontSize: "1rem" }}>
                        {product.minEffectivePriceCents !== null ? formatPrice(product.minEffectivePriceCents) : "—"}
                      </p>
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-dim)", fontSize: "0.8rem" }}>→</div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
