"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPrice, getVariantLabel } from "@/lib/utils";
import WishlistButton from "./WishlistButton";

export interface ProductCardData {
    id: string;
    name: string;
    slug: string;
    gender: string;
    concentration: string;
    minEffectivePriceCents: number | null;
    hasActiveDiscount: boolean;
    brand: { name: string; slug: string };
    categories: { name: string }[];
    firstImage: { url: string; alt: string | null } | null;
    variantCount: number;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
    const { addItem, toggleCart } = useCart();

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Quick-add the cheapest variant (we add a generic decant item)
        addItem({
            variantId: `${product.id}-quick`,
            productName: product.name,
            variantLabel: "Ver variantes en detalle",
            sku: product.slug,
            imageUrl: product.firstImage?.url ?? null,
            priceCents: product.minEffectivePriceCents ?? 0,
            quantity: 1,
        });
        toggleCart(true);
    };

    const concLabel: Record<string, string> = {
        EDP: "Eau de Parfum", EDT: "Eau de Toilette",
        PARFUM: "Parfum", EXTRAIT: "Extrait de Parfum", COLOGNE: "Cologne",
    };

    return (
        <Link href={`/productos/${product.slug}`} style={{ textDecoration: "none", display: "block" }}>
            <article className="card" style={{ overflow: "hidden", cursor: "pointer" }}>
                {/* Image */}
                <div className="product-img-wrap" style={{ height: 260, position: "relative" }}>
                    {product.firstImage ? (
                        <Image
                            src={product.firstImage.url}
                            alt={product.firstImage.alt ?? product.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            style={{ objectFit: "cover" }}
                            unoptimized
                        />
                    ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", color: "var(--text-dim)" }}>
                            🌸
                        </div>
                    )}

                    {/* Badges */}
                    <div style={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                        {product.hasActiveDiscount && <span className="badge badge-sale">Oferta</span>}
                        <span className="badge badge-gold">{product.gender === "MEN" ? "Hombre" : product.gender === "WOMEN" ? "Mujer" : "Unisex"}</span>
                    </div>

                    {/* Wishlist */}
                    <WishlistButton productId={product.id} overlay />

                    {/* Quick add overlay */}
                    <div className="quick-add-overlay" style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        background: "linear-gradient(to top, rgba(10,9,6,0.9), transparent)",
                        padding: "24px 12px 12px",
                        transform: "translateY(100%)",
                        transition: "transform 0.3s",
                    }}>
                        <button
                            className="btn btn-gold"
                            style={{ width: "100%", padding: "10px" }}
                            onClick={handleQuickAdd}
                        >
                            + Agregar al carrito
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div style={{ padding: "16px" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
                        {product.brand.name}
                    </p>
                    <h3 style={{ fontWeight: 500, fontSize: "0.95rem", lineHeight: 1.3, marginBottom: 4 }}>{product.name}</h3>
                    <p style={{ color: "var(--text-dim)", fontSize: "0.75rem", marginBottom: 12 }}>
                        {concLabel[product.concentration] ?? product.concentration} · {product.variantCount} variante{product.variantCount !== 1 ? "s" : ""}
                    </p>

                    <div className="divider-gold" style={{ marginBottom: 12 }} />

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <p style={{ color: "var(--text-dim)", fontSize: "0.68rem", marginBottom: 2 }}>Desde</p>
                            <p className="price-effective" style={{ fontSize: "1rem" }}>
                                {product.minEffectivePriceCents !== null ? formatPrice(product.minEffectivePriceCents) : "—"}
                            </p>
                        </div>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-dim)", fontSize: "0.8rem" }}>
                            →
                        </div>
                    </div>
                </div>
            </article>

            <style>{`
        article.card:hover .quick-add-overlay { transform: translateY(0); }
      `}</style>
        </Link>
    );
}
