import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getProducts } from "@/lib/data";

export const dynamic = 'force-dynamic';
import VariantSelector from "@/components/VariantSelector";
import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} – ${product.brand.name} | Luxauris`,
    description:
      product.description ??
      `${product.name} de ${product.brand.name}. ${product.concentration}. Disponible en Luxauris.`,
  };
}

const CONCENTRATION_LABEL: Record<string, string> = {
  EDP: "Eau de Parfum",
  EDT: "Eau de Toilette",
  PARFUM: "Parfum",
  EXTRAIT: "Extrait de Parfum",
  COLOGNE: "Cologne",
};

const GENDER_LABEL: Record<string, string> = {
  MEN: "Hombre",
  WOMEN: "Mujer",
  UNISEX: "Unisex",
};

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  // Related products: same brand, exclude current
  const related = (
    await getProducts({ brand: product.brand.slug, sort: "newest" })
  )
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  const firstImage = product.images[0] ?? null;

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
      {/* Breadcrumb */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 40,
          fontSize: "0.8rem",
          color: "var(--text-dim)",
        }}
      >
        <Link href="/" style={{ color: "var(--text-dim)", textDecoration: "none" }}>
          Inicio
        </Link>
        <span>/</span>
        <Link
          href="/productos"
          style={{ color: "var(--text-dim)", textDecoration: "none" }}
        >
          Perfumes
        </Link>
        <span>/</span>
        <Link
          href={`/productos?brand=${product.brand.slug}`}
          style={{ color: "var(--text-dim)", textDecoration: "none" }}
        >
          {product.brand.name}
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text-muted)" }}>{product.name}</span>
      </nav>

      {/* Main layout */}
      <div className="product-detail-grid">
        {/* Left: Images */}
        <div>
          {/* Main image */}
          <div
            className="product-img-wrap"
            style={{
              height: 480,
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border)",
              marginBottom: 12,
            }}
          >
            {firstImage ? (
              <Image
                src={firstImage.url}
                alt={firstImage.alt ?? product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover", borderRadius: "var(--radius-lg)" }}
                unoptimized
                priority
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  color: "var(--text-dim)",
                }}
              >
                <span style={{ fontSize: "5rem" }}>🌸</span>
                <p style={{ fontSize: "0.8rem", letterSpacing: "0.1em" }}>
                  Sin imagen
                </p>
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
              {product.images.map((img, i) => (
                <div
                  key={img.id}
                  style={{
                    width: 72,
                    height: 72,
                    flexShrink: 0,
                    borderRadius: "var(--radius-sm)",
                    overflow: "hidden",
                    border: i === 0 ? "1px solid var(--gold)" : "1px solid var(--border)",
                    position: "relative",
                  }}
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? product.name}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details + Selector */}
        <div>
          {/* Brand + categories */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <Link
              href={`/productos?brand=${product.brand.slug}`}
              style={{ textDecoration: "none" }}
            >
              <span className="badge badge-gold">{product.brand.name}</span>
            </Link>
            <span className="badge badge-new">
              {GENDER_LABEL[product.gender] ?? product.gender}
            </span>
            {product.categories.slice(0, 2).map((cat) => (
              <Link
                key={cat.id}
                href={`/productos?category=${cat.slug}`}
                style={{ textDecoration: "none" }}
              >
                <span className="badge badge-new">{cat.name}</span>
              </Link>
            ))}
          </div>

          <h1
            className="font-serif"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: 8,
            }}
          >
            {product.name}
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              marginBottom: 20,
              letterSpacing: "0.04em",
            }}
          >
            {CONCENTRATION_LABEL[product.concentration] ?? product.concentration}
          </p>

          {product.description && (
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.75,
                fontSize: "0.9rem",
                marginBottom: 24,
              }}
            >
              {product.description}
            </p>
          )}

          <div className="divider-gold" style={{ marginBottom: 24 }} />

          {/* Variant selector + cart */}
          <VariantSelector
            variants={product.variants}
            productName={product.name}
            productSlug={product.slug}
            firstImageUrl={firstImage?.url ?? null}
          />

          {/* Notes */}
          {(product.topNotes || product.middleNotes || product.baseNotes) && (
            <div style={{ marginTop: 32 }}>
              <div className="divider-gold" style={{ marginBottom: 24 }} />
              <p className="section-label" style={{ marginBottom: 16 }}>
                Pirámide olfativa
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                }}
              >
                {[
                  { label: "Notas de salida", value: product.topNotes, icon: "🌿" },
                  { label: "Notas de corazón", value: product.middleNotes, icon: "🌺" },
                  { label: "Notas de fondo", value: product.baseNotes, icon: "🪵" },
                ].map((note) =>
                  note.value ? (
                    <div
                      key={note.label}
                      style={{
                        padding: "16px 14px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        textAlign: "center",
                      }}
                    >
                      <span style={{ fontSize: "1.3rem", display: "block", marginBottom: 8 }}>
                        {note.icon}
                      </span>
                      <p
                        style={{
                          fontSize: "0.65rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--gold)",
                          marginBottom: 6,
                          fontWeight: 600,
                        }}
                      >
                        {note.label}
                      </p>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                        {note.value}
                      </p>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Related products ─────────────────────────────── */}
      {related.length > 0 && (
        <section>
          <div className="divider-gold" style={{ marginBottom: 48 }} />
          <div style={{ marginBottom: 32 }}>
            <p className="section-label" style={{ marginBottom: 8 }}>
              Más de {product.brand.name}
            </p>
            <h2
              className="font-serif"
              style={{ fontSize: "1.6rem", fontWeight: 600 }}
            >
              También te puede gustar
            </h2>
          </div>
          <div className="products-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


