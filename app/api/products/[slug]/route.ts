import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEffectivePrice } from "@/lib/pricing";
import type { Discount } from "@/lib/pricing";

/**
 * GET /api/products/[slug]
 *
 * Returns full product detail:
 *   - brand, categories, images
 *   - all active variants with effectivePriceCents + discountApplied
 */
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const now = new Date();

        const product = await prisma.product.findUnique({
            where: { slug, isActive: true },
            include: {
                brand: true,
                categories: true,
                images: { orderBy: { position: "asc" } },
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
                    orderBy: { sizeMl: "asc" },
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

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // ── Enrich variants with effective pricing ─────────────────
        const variants = product.variants.map((variant) => {
            const { effectivePriceCents, discountApplied } = getEffectivePrice(
                variant.priceCents,
                variant.discounts as Discount[],
                product.discounts as Discount[]
            );

            return {
                id: variant.id,
                type: variant.type,
                sizeMl: variant.sizeMl,
                sku: variant.sku,
                priceCents: variant.priceCents,
                compareAtPriceCents: variant.compareAtPriceCents,
                effectivePriceCents,
                discountApplied,
                stock: variant.stock,
                isActive: variant.isActive,
                createdAt: variant.createdAt,
                updatedAt: variant.updatedAt,
            };
        });

        return NextResponse.json({
            data: {
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                gender: product.gender,
                concentration: product.concentration,
                topNotes: product.topNotes,
                middleNotes: product.middleNotes,
                baseNotes: product.baseNotes,
                isActive: product.isActive,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                brand: product.brand,
                categories: product.categories,
                images: product.images,
                variants,
                productDiscounts: product.discounts,
            },
        });
    } catch (error) {
        console.error("[GET /api/products/[slug]]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
