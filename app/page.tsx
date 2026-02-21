import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getCategories, getBrands, getProducts } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import { formatPrice } from "@/lib/utils";

export default async function HomePage() {
  const [featured, categories, brands, allMen, allWomen] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
    getBrands(),
    getProducts({ gender: "MEN" }),
    getProducts({ gender: "WOMEN" }),
  ]);
  const topMen = allMen.slice(0, 6);
  const topWomen = allWomen.slice(0, 6);

  return (
    <>
      {/* ── Hero Carousel ─────────────────────────────────── */}
      <HeroCarousel />

      {/* ── Categories ────────────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <p className="section-label" style={{ marginBottom: 10 }}>Colecciones</p>
          <h2
            className="font-serif"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 600 }}
          >
            Encuentra tu estilo
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 16,
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/productos?category=${cat.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className="card"
                style={{
                  padding: "24px 16px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    fontSize: "1.8rem",
                    marginBottom: 10,
                  }}
                >
                  {catEmoji(cat.slug)}
                </div>
                <p style={{ fontWeight: 500, fontSize: "0.9rem" }}>{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="divider-gold" style={{ maxWidth: 1280, margin: "0 auto 0", padding: "0 24px" }}>
        <div className="divider-gold" />
      </div>

      {/* ── Featured products ─────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 40,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <p className="section-label" style={{ marginBottom: 10 }}>Novedades</p>
            <h2
              className="font-serif"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 600 }}
            >
              Últimas llegadas
            </h2>
          </div>
          <Link
            href="/productos"
            style={{ color: "var(--gold)", fontSize: "0.875rem", textDecoration: "none", letterSpacing: "0.04em" }}
          >
            Ver todos →
          </Link>
        </div>

        {featured.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "60px 0" }}>
            <p className="font-serif" style={{ fontSize: "1.2rem" }}>Aún no hay productos.</p>
            <p style={{ marginTop: 8, fontSize: "0.875rem" }}>Ejecuta el seed para agregar datos de prueba.</p>
          </div>
        ) : (
          <div className="products-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── Top Hombres ───────────────────────────────────── */}
      {topMen.length > 0 && (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
            <div>
              <p className="section-label" style={{ marginBottom: 10 }}>Para él</p>
              <h2 className="font-serif" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 600 }}>Top Hombres</h2>
            </div>
            <Link href="/productos?gender=MEN" style={{ color: "var(--gold)", fontSize: "0.875rem", textDecoration: "none", letterSpacing: "0.04em" }}>Ver todos →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
            {topMen.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── Top Damas ─────────────────────────────────────── */}
      {topWomen.length > 0 && (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
            <div>
              <p className="section-label" style={{ marginBottom: 10 }}>Para ella</p>
              <h2 className="font-serif" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 600 }}>Top Damas</h2>
            </div>
            <Link href="/productos?gender=WOMEN" style={{ color: "var(--gold)", fontSize: "0.875rem", textDecoration: "none", letterSpacing: "0.04em" }}>Ver todos →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
            {topWomen.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── Brands ────────────────────────────────────────── */}
      {brands.length > 0 && (
        <section
          style={{
            background: "var(--bg-card)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            padding: "64px 24px",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
            <p className="section-label" style={{ marginBottom: 32 }}>
              Marcas disponibles
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                justifyContent: "center",
              }}
            >
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/productos?brand=${brand.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <span className="brand-badge">{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Value props ───────────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 24,
          }}
        >
          {[
            { icon: "💎", title: "Fragancias originales", desc: "Solo trabajamos con perfumes 100% auténticos y sellados de fábrica." },
            { icon: "🧪", title: "Decants artesanales", desc: "Presentaciones pequeñas para probar antes de invertir en el frasco completo." },
            { icon: "🚀", title: "Envío seguro", desc: "Empaque especializado para que tu perfume llegue intacto a donde estés." },
            { icon: "🎁", title: "Servicio personalizado", desc: "Te ayudamos a encontrar la fragancia perfecta para cada ocasión." },
          ].map((item) => (
            <div
              key={item.title}
              className="card"
              style={{ padding: 28, textAlign: "center" }}
            >
              <div style={{ fontSize: "2rem", marginBottom: 16 }}>{item.icon}</div>
              <h3
                style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: 10 }}
              >
                {item.title}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function catEmoji(slug: string): string {
  const map: Record<string, string> = {
    masculinos: "🧔",
    femeninos: "💄",
    unisex: "✨",
    decants: "🧪",
    ofertas: "🏷️",
    nuevos: "🆕",
    "new": "🆕",
    brands: "🏆",
  };
  return map[slug] ?? "🌸";
}
