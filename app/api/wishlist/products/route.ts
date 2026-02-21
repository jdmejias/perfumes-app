import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ products: [] });

  const wishItems = await prisma.wishlistItem.findMany({
    where: { userId: session.id },
    include: {
      product: {
        include: {
          brand: { select: { name: true } },
          images: { orderBy: { position: "asc" }, take: 1 },
          discounts: {
            where: {
              isActive: true,
              OR: [{ startAt: null }, { startAt: { lte: new Date() } }],
              AND: [{ OR: [{ endAt: null }, { endAt: { gte: new Date() } }] }],
            },
          },
          variants: {
            include: {
              discounts: {
                where: {
                  isActive: true,
                  OR: [
                    { startAt: null },
                    { startAt: { lte: new Date() } },
                  ],
                  AND: [{ OR: [{ endAt: null }, { endAt: { gte: new Date() } }] }],
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const products = wishItems.map(({ product: p }) => {
    const productDisc = (p as any).discounts?.[0];
    const prices = (p as any).variants.map((v: any) => {
      const disc = v.discounts[0] ?? productDisc;
      if (disc) {
        if (disc.kind === "PERCENT") return Math.round(v.priceCents * (1 - disc.value / 100));
        if (disc.kind === "FIXED") return Math.max(0, v.priceCents - disc.value);
      }
      return v.priceCents;
    });
    const minEffectivePriceCents = prices.length ? Math.min(...prices) : null;
    const hasActiveDiscount = !!(productDisc || (p as any).variants.some((v: any) => v.discounts.length > 0));

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      gender: p.gender,
      brand: { name: p.brand.name },
      minEffectivePriceCents,
      hasActiveDiscount,
      firstImage: p.images[0] ? { url: p.images[0].url, alt: p.images[0].alt } : null,
    };
  });

  return NextResponse.json({ products });
}
