import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEffectivePrice } from "@/lib/pricing";
import { Prisma } from "@prisma/client";
import type { Discount } from "@/lib/pricing";

/**
 * GET /api/products
 *
 * Query params:
 *   q          – text search (name or description)
 *   category   – category slug
 *   brand      – brand slug
 *   gender     – MEN | WOMEN | UNISEX
 *   minPrice   – min effective price in cents (inclusive)
 *   maxPrice   – max effective price in cents (inclusive)
 *   onSale     – "true" → only products with an active discount
 *   sort       – newest | priceAsc | priceDesc  (default: newest)
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const q = searchParams.get("q") ?? undefined;
        const categorySlug = searchParams.get("category") ?? undefined;
        const brandSlug = searchParams.get("brand") ?? undefined;
        const gender = searchParams.get("gender") ?? undefined;
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const onSale = searchParams.get("onSale") === "true";
        const sort = searchParams.get("sort") ?? "newest";

        // ── Build where clause ─────────────────────────────────────
        const where: Prisma.ProductWhereInput = {
            isActive: true,
        };

        if (q) {
            where.OR = [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
            ];
        }

        if (gender) {
            where.gender = gender as "MEN" | "WOMEN" | "UNISEX";
        }

        if (brandSlug) {
            where.brand = { slug: brandSlug };
        }

        if (categorySlug) {
            where.categories = { some: { slug: categorySlug } };
        }

        // ── Ordering ───────────────────────────────────────────────
        let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
        if (sort === "priceAsc" || sort === "priceDesc") {
            orderBy = { variants: { _count: "asc" } }; // placeholder; price sort done post-load
        }

        // ── Query ──────────────────────────────────────────────────
        const now = new Date();

        const products = await prisma.product.findMany({
            where,
            orderBy: sort === "newest" ? { createdAt: "desc" } : undefined,
            include: {
                brand: true,
                categories: true,
                images: { orderBy: { position: "asc" }, take: 1 },
                variants: {
                    where: { isActive: true },
                    include: {
                        discounts: {
                            where: {
                                isActive: true,
                                OR: [{ startAt: null }, { startAt: { lte: now } }],
                                AND: [{ OR: [{ endAt: null }, { endAt: { gte: now } }] }],
                            },
                        },
                    },
                },
                discounts: {
                    where: {
                        isActive: true,
                        OR: [{ startAt: null }, { startAt: { lte: now } }],
                        AND: [{ OR: [{ endAt: null }, { endAt: { gte: now } }] }],
                    },
                },
            },
        });

        // ── Compute effective prices and apply filters ─────────────
        let result = products.map((product) => {
            const variantsWithPrice = product.variants.map((variant) => {
                const { effectivePriceCents, discountApplied } = getEffectivePrice(
                    variant.priceCents,
                    variant.discounts as Discount[],
                    product.discounts as Discount[]
                );
                return { ...variant, effectivePriceCents, discountApplied };
            });

            // Min effective price across active variants
            const minEffectivePrice =
                variantsWithPrice.length > 0
                    ? Math.min(...variantsWithPrice.map((v) => v.effectivePriceCents))
                    : null;

            const hasActiveDiscount = variantsWithPrice.some(
                (v) => v.discountApplied !== null
            );

            return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                gender: product.gender,
                concentration: product.concentration,
                isActive: product.isActive,
                createdAt: product.createdAt,
                brand: product.brand,
                categories: product.categories,
                firstImage: product.images[0] ?? null,
                minEffectivePriceCents: minEffectivePrice,
                hasActiveDiscount,
                variantCount: variantsWithPrice.length,
            };
        });

        // Filter by onSale
        if (onSale) {
            result = result.filter((p) => p.hasActiveDiscount);
        }

        // Filter by price range
        if (minPrice !== null) {
            const min = parseInt(minPrice, 10);
            result = result.filter(
                (p) => p.minEffectivePriceCents !== null && p.minEffectivePriceCents >= min
            );
        }
        if (maxPrice !== null) {
            const max = parseInt(maxPrice, 10);
            result = result.filter(
                (p) => p.minEffectivePriceCents !== null && p.minEffectivePriceCents <= max
            );
        }

        // Sort by price (post-load, since effective price requires discount calc)
        if (sort === "priceAsc") {
            result.sort((a, b) => (a.minEffectivePriceCents ?? 0) - (b.minEffectivePriceCents ?? 0));
        } else if (sort === "priceDesc") {
            result.sort((a, b) => (b.minEffectivePriceCents ?? 0) - (a.minEffectivePriceCents ?? 0));
        }

        return NextResponse.json({ data: result, total: result.length });
    } catch (error) {
        console.error("[GET /api/products]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
