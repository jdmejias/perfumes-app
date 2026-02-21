"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
  brands: Brand[];
}

export default function ProductFilters({ categories, brands }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, pathname, router]
  );

  const current = {
    q: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? "",
    brand: searchParams.get("brand") ?? "",
    gender: searchParams.get("gender") ?? "",
    sort: searchParams.get("sort") ?? "newest",
    onSale: searchParams.get("onSale") === "true",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.68rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--gold)",
    fontWeight: 600,
    marginBottom: 8,
  };

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 28,
        opacity: isPending ? 0.6 : 1,
        transition: "opacity 0.2s",
      }}
    >
      {/* Search */}
      <div>
        <label style={labelStyle}>Buscar</label>
        <input
          className="field"
          placeholder="Dior Sauvage…"
          defaultValue={current.q}
          onChange={(e) => updateParam("q", e.target.value || null)}
        />
      </div>

      {/* Sort */}
      <div>
        <label style={labelStyle}>Ordenar</label>
        <select
          className="field"
          value={current.sort}
          onChange={(e) => updateParam("sort", e.target.value)}
          style={{ cursor: "pointer" }}
        >
          <option value="newest">Más nuevos</option>
          <option value="priceAsc">Precio: menor a mayor</option>
          <option value="priceDesc">Precio: mayor a menor</option>
        </select>
      </div>

      {/* On sale */}
      <div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={current.onSale}
            onChange={(e) =>
              updateParam("onSale", e.target.checked ? "true" : null)
            }
            style={{ accentColor: "var(--gold)", width: 16, height: 16 }}
          />
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Solo en oferta
          </span>
        </label>
      </div>

      {/* Gender */}
      <FilterGroup label="Género">
        {[
          { value: "", label: "Todos" },
          { value: "MEN", label: "Hombre" },
          { value: "WOMEN", label: "Mujer" },
          { value: "UNISEX", label: "Unisex" },
        ].map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            active={current.gender === opt.value}
            onClick={() => updateParam("gender", opt.value || null)}
          />
        ))}
      </FilterGroup>

      {/* Categories */}
      <FilterGroup label="Categorías">
        <FilterChip
          label="Todas"
          active={current.category === ""}
          onClick={() => updateParam("category", null)}
        />
        {categories.map((cat) => (
          <FilterChip
            key={cat.id}
            label={cat.name}
            active={current.category === cat.slug}
            onClick={() => updateParam("category", cat.slug)}
          />
        ))}
      </FilterGroup>

      {/* Brands */}
      <FilterGroup label="Marcas">
        <FilterChip
          label="Todas"
          active={current.brand === ""}
          onClick={() => updateParam("brand", null)}
        />
        {brands.map((b) => (
          <FilterChip
            key={b.id}
            label={b.name}
            active={current.brand === b.slug}
            onClick={() => updateParam("brand", b.slug)}
          />
        ))}
      </FilterGroup>

      {/* Clear all */}
      {(current.q || current.category || current.brand || current.gender || current.onSale) && (
        <button
          className="btn btn-ghost"
          style={{ fontSize: "0.8rem", padding: "8px 12px" }}
          onClick={() => {
            startTransition(() => {
              router.replace(pathname, { scroll: false });
            });
          }}
        >
          × Limpiar filtros
        </button>
      )}
    </aside>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        style={{
          fontSize: "0.68rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--gold)",
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{children}</div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 12px",
        borderRadius: 99,
        border: active
          ? "1px solid var(--gold)"
          : "1px solid var(--border)",
        background: active
          ? "rgba(201,169,110,0.14)"
          : "transparent",
        color: active ? "var(--gold)" : "var(--text-muted)",
        fontSize: "0.78rem",
        cursor: "pointer",
        transition: "all 0.15s",
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </button>
  );
}
