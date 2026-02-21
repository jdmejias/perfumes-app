"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice, getVariantLabel } from "@/lib/utils";
import type { VariantDetail } from "@/lib/data";

interface Props {
  variants: VariantDetail[];
  productName: string;
  productSlug: string;
  firstImageUrl: string | null;
}

export default function VariantSelector({
  variants,
  productName,
  productSlug,
  firstImageUrl,
}: Props) {
  const [selectedId, setSelectedId] = useState<string>(variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, toggleCart } = useCart();

  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];

  const handleAdd = () => {
    if (!selected) return;
    addItem({
      variantId: selected.id,
      productName,
      variantLabel: getVariantLabel(selected.type, selected.sizeMl),
      sku: selected.sku,
      imageUrl: firstImageUrl,
      priceCents: selected.effectivePriceCents,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setTimeout(() => toggleCart(true), 300);
  };

  if (!selected) return null;

  const savingPercent =
    selected.discountApplied?.kind === "PERCENT"
      ? selected.discountApplied.value
      : selected.effectivePriceCents < selected.priceCents
      ? Math.round((1 - selected.effectivePriceCents / selected.priceCents) * 100)
      : 0;

  const typeLabel: Record<string, string> = {
    DECANT: "Decant",
    FULL_BOTTLE: "Frasco Completo",
    TESTER: "Tester",
  };

  return (
    <div>
      {/* Variants */}
      <div style={{ marginBottom: 24 }}>
        <p
          className="section-label"
          style={{ marginBottom: 12 }}
        >
          Presentación
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {variants.map((v) => {
            const isSelected = v.id === selectedId;
            const outOfStock = v.stock === 0;
            return (
              <button
                key={v.id}
                disabled={outOfStock}
                onClick={() => {
                  setSelectedId(v.id);
                  setQty(1);
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-sm)",
                  border: isSelected
                    ? "1px solid var(--gold)"
                    : "1px solid var(--border)",
                  background: isSelected
                    ? "rgba(201,169,110,0.12)"
                    : "rgba(255,255,255,0.03)",
                  color: outOfStock
                    ? "var(--text-dim)"
                    : isSelected
                    ? "var(--gold)"
                    : "var(--text)",
                  cursor: outOfStock ? "not-allowed" : "pointer",
                  fontSize: "0.825rem",
                  fontWeight: isSelected ? 600 : 400,
                  transition: "all 0.2s",
                  opacity: outOfStock ? 0.45 : 1,
                  textDecoration: outOfStock ? "line-through" : "none",
                }}
              >
                {v.sizeMl}ml
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: isSelected ? "var(--gold)" : "var(--text-dim)",
                    marginLeft: 6,
                  }}
                >
                  {typeLabel[v.type]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected variant info */}
      <div
        style={{
          padding: 16,
          background: "rgba(201,169,110,0.05)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 10,
            marginBottom: 8,
          }}
        >
          {selected.effectivePriceCents < selected.priceCents && (
            <span className="price-original" style={{ fontSize: "0.9rem" }}>
              {formatPrice(selected.priceCents)}
            </span>
          )}
          <span
            className="price-effective"
            style={{ fontSize: "1.5rem", lineHeight: 1 }}
          >
            {formatPrice(selected.effectivePriceCents)}
          </span>
          {savingPercent > 0 && (
            <span className="badge badge-sale" style={{ marginBottom: 2 }}>
              -{savingPercent}%
            </span>
          )}
        </div>

        {selected.compareAtPriceCents &&
          selected.compareAtPriceCents > selected.priceCents && (
            <p style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>
              Precio ref:{" "}
              <span className="price-original">
                {formatPrice(selected.compareAtPriceCents)}
              </span>
            </p>
          )}

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 8,
            fontSize: "0.78rem",
            color: "var(--text-muted)",
          }}
        >
          <span>SKU: {selected.sku}</span>
          <span
            style={{
              color: selected.stock > 0 ? "#6fd672" : "var(--red)",
            }}
          >
            {selected.stock > 0 ? `${selected.stock} en stock` : "Agotado"}
          </span>
        </div>
      </div>

      {/* Quantity + Add to cart */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {/* Qty */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            overflow: "hidden",
          }}
        >
          <button
            className="qty-btn"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            style={{ borderRadius: 0, border: "none", width: 36, height: 44 }}
          >
            −
          </button>
          <span
            style={{
              padding: "0 16px",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--text)",
              minWidth: 40,
              textAlign: "center",
            }}
          >
            {qty}
          </span>
          <button
            className="qty-btn"
            onClick={() => setQty((q) => Math.min(selected.stock, q + 1))}
            style={{ borderRadius: 0, border: "none", width: 36, height: 44 }}
          >
            +
          </button>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          disabled={selected.stock === 0}
          className={`btn ${added ? "btn-ghost" : "btn-gold"}`}
          style={{
            flex: 1,
            padding: "12px 20px",
            fontSize: "0.9rem",
            opacity: selected.stock === 0 ? 0.5 : 1,
            cursor: selected.stock === 0 ? "not-allowed" : "pointer",
          }}
        >
          {selected.stock === 0
            ? "Agotado"
            : added
            ? "✓ Agregado al carrito"
            : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}
