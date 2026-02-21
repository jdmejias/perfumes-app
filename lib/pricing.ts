/** Minimal shape of a Discount record — avoids depending on generated Prisma types. */
export interface Discount {
  id: string;
  name: string;
  kind: string;
  value: number;
  isActive: boolean;
  startAt: Date | null;
  endAt: Date | null;
}

export interface EffectivePriceResult {
    effectivePriceCents: number;
    discountApplied: Discount | null;
}

/**
 * Returns the effective (discounted) price for a variant.
 *
 * Priority:
 *  1. Active variant-level discount
 *  2. Active product-level discount
 *  3. Original priceCents
 */
export function getEffectivePrice(
    priceCents: number,
    variantDiscounts: Discount[],
    productDiscounts: Discount[]
): EffectivePriceResult {
    const now = new Date();

    const activeDiscount = findActiveDiscount(variantDiscounts, now)
        ?? findActiveDiscount(productDiscounts, now);

    if (!activeDiscount) {
        return { effectivePriceCents: priceCents, discountApplied: null };
    }

    const effectivePriceCents = applyDiscount(priceCents, activeDiscount);
    return { effectivePriceCents, discountApplied: activeDiscount };
}

function findActiveDiscount(
    discounts: Discount[],
    now: Date
): Discount | null {
    return (
        discounts.find((d) => {
            if (!d.isActive) return false;
            if (d.startAt && d.startAt > now) return false;
            if (d.endAt && d.endAt < now) return false;
            return true;
        }) ?? null
    );
}

function applyDiscount(priceCents: number, discount: Discount): number {
    if (discount.kind === "PERCENT") {
        const percent = Math.min(Math.max(discount.value, 0), 100);
        return Math.round(priceCents * (1 - percent / 100));
    }
    // FIXED
    return Math.max(0, priceCents - discount.value);
}
