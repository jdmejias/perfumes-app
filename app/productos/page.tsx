import { Suspense } from "react";
import { getProducts, getCategories, getBrands } from "@/lib/data";

export const dynamic = 'force-dynamic';
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";

interface SearchParams {
  q?: string;
  category?: string;
  brand?: string;
  gender?: string;
  minPrice?: string;
  maxPrice?: string;
  onSale?: string;
  sort?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function ProductosPage({ searchParams }: Props) {
  const params = await searchParams;

  const [products, categories, brands] = await Promise.all([
    getProducts({
      q: params.q,
      category: params.category,
      brand: params.brand,
      gender: params.gender,
      minPrice: params.minPrice ? parseInt(params.minPrice, 10) : undefined,
      maxPrice: params.maxPrice ? parseInt(params.maxPrice, 10) : undefined,
      onSale: params.onSale === "true",
      sort: (params.sort as "newest" | "priceAsc" | "priceDesc") ?? "newest",
    }),
    getCategories(),
    getBrands(),
  ]);

  const hasActiveFilters = !!(
    params.q ||
    params.category ||
    params.brand ||
    params.gender ||
    params.onSale === "true"
  );

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p className="section-label" style={{ marginBottom: 8 }}>
          Catálogo
        </p>
        <h1
          className="font-serif"
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          {params.brand
            ? `${brands.find((b) => b.slug === params.brand)?.name ?? ""}`
            : params.category
            ? `${categories.find((c) => c.slug === params.category)?.name ?? "Colección"}`
            : "Todos los perfumes"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          {products.length} resultado{products.length !== 1 ? "s" : ""}
          {hasActiveFilters && (
            <span style={{ color: "var(--gold)", marginLeft: 8 }}>
              · Filtros activos
            </span>
          )}
        </p>
      </div>

        <div className="products-layout">
        {/* Sidebar filters */}
        <Suspense
          fallback={
            <div
              style={{
                width: 220,
                flexShrink: 0,
                height: 400,
                background: "rgba(255,255,255,0.03)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
              }}
            />
          }
        >
          <ProductFilters categories={categories} brands={brands} />
        </Suspense>

        {/* Products grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {products.length === 0 ? (
            <EmptyState hasFilters={hasActiveFilters} />
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 24px",
        color: "var(--text-muted)",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: 20 }}>
        {hasFilters ? "🔍" : "🌸"}
      </div>
      <p
        className="font-serif"
        style={{ fontSize: "1.3rem", color: "var(--text)", marginBottom: 10 }}
      >
        {hasFilters ? "Sin resultados" : "No hay productos disponibles"}
      </p>
      <p style={{ fontSize: "0.875rem" }}>
        {hasFilters
          ? "Intenta ajustar los filtros para encontrar lo que buscas."
          : "Vuelve pronto, estamos actualizando el catálogo."}
      </p>
    </div>
  );
}
