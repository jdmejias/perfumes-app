/**
 * Server-side data access layer.
 * Used directly by React Server Components to avoid the network overhead
 * of calling our own API routes.
 *
 * When USE_MOCK_DATA=true (or when the DB is unreachable), all functions
 * transparently fall back to the static mock dataset in lib/mock-data.ts.
 */

import { prisma } from "./prisma";
import { getEffectivePrice } from "./pricing";
import type { Discount } from "@/lib/pricing";
import { Prisma } from "@prisma/client";
import {
  mockGetProducts,
  mockGetProductBySlug,
  mockGetCategories,
  mockGetBrands,
  mockGetFeaturedProducts,
} from "./mock-data";

const USE_MOCK = process.env.USE_MOCK_DATA === "true";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  gender: string;
  concentration: string;
  isActive: boolean;
  createdAt: Date;
  brand: { id: string; name: string; slug: string };
  categories: { id: string; name: string; slug: string }[];
  firstImage: { url: string; alt: string | null } | null;
  minEffectivePriceCents: number | null;
  hasActiveDiscount: boolean;
  variantCount: number;
}

export interface VariantDetail {
  id: string;
  type: string;
  sizeMl: number;
  sku: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  effectivePriceCents: number;
  discountApplied: Discount | null;
  stock: number;
  isActive: boolean;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  gender: string;
  concentration: string;
  topNotes: string | null;
  middleNotes: string | null;
  baseNotes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  brand: { id: string; name: string; slug: string };
  categories: { id: string; name: string; slug: string; type: string | null }[];
  images: { id: string; url: string; alt: string | null; position: number }[];
  variants: VariantDetail[];
}

export interface ProductFilters {
  q?: string;
  category?: string;
  brand?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  sort?: "newest" | "priceAsc" | "priceDesc";
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function buildActiveDiscountWhere(now: Date): Prisma.DiscountWhereInput {
  return {
    isActive: true,
    OR: [{ startAt: null }, { startAt: { lte: now } }],
    AND: [{ OR: [{ endAt: null }, { endAt: { gte: now } }] }],
  };
}

// ─────────────────────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────────────────────

export async function getProducts(
  filters: ProductFilters = {}
): Promise<ProductListItem[]> {
  if (USE_MOCK) return mockGetProducts(filters);

  try {
    const now = new Date();
    const {
      q,
      category,
      brand,
      gender,
      minPrice,
      maxPrice,
      onSale,
      sort = "newest",
    } = filters;

    const where: Prisma.ProductWhereInput = { isActive: true };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }
    if (gender) where.gender = gender as "MEN" | "WOMEN" | "UNISEX";
    if (brand) where.brand = { slug: brand };
    if (category) where.categories = { some: { slug: category } };

    const products = await prisma.product.findMany({
      where,
      orderBy: sort === "newest" ? { createdAt: "desc" } : undefined,
      include: {
        brand: true,
        categories: true,
        images: { orderBy: { position: "asc" }, take: 1 },
        variants: {
          where: { isActive: true },
          include: { discounts: { where: buildActiveDiscountWhere(now) } },
        },
        discounts: { where: buildActiveDiscountWhere(now) },
      },
    });

    let result: ProductListItem[] = products.map((product) => {
      const variantsWithPrice = product.variants.map((variant) => {
        const { effectivePriceCents, discountApplied } = getEffectivePrice(
          variant.priceCents,
          variant.discounts as Discount[],
          product.discounts as Discount[]
        );
        return { ...variant, effectivePriceCents, discountApplied };
      });

      const minEffectivePriceCents =
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
        minEffectivePriceCents,
        hasActiveDiscount,
        variantCount: variantsWithPrice.length,
      };
    });

    if (onSale) result = result.filter((p) => p.hasActiveDiscount);
    if (minPrice != null)
      result = result.filter(
        (p) => p.minEffectivePriceCents !== null && p.minEffectivePriceCents >= minPrice
      );
    if (maxPrice != null)
      result = result.filter(
        (p) => p.minEffectivePriceCents !== null && p.minEffectivePriceCents <= maxPrice
      );

    if (sort === "priceAsc")
      result.sort((a, b) => (a.minEffectivePriceCents ?? 0) - (b.minEffectivePriceCents ?? 0));
    else if (sort === "priceDesc")
      result.sort((a, b) => (b.minEffectivePriceCents ?? 0) - (a.minEffectivePriceCents ?? 0));

    return result;
  } catch (err) {
    console.warn("[data] DB unavailable, falling back to mock data.", err);
    return mockGetProducts(filters);
  }
}

export async function getProductBySlug(
  slug: string
): Promise<ProductDetail | null> {
  if (USE_MOCK) return mockGetProductBySlug(slug);

  try {
    const now = new Date();

    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        brand: true,
        categories: true,
        images: { orderBy: { position: "asc" } },
        variants: {
          where: { isActive: true },
          include: { discounts: { where: buildActiveDiscountWhere(now) } },
          orderBy: { sizeMl: "asc" },
        },
        discounts: { where: buildActiveDiscountWhere(now) },
      },
    });

    if (!product) return null;

    const variants: VariantDetail[] = product.variants.map((variant) => {
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
      };
    });

    return {
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
    };
  } catch (err) {
    console.warn("[data] DB unavailable, falling back to mock data.", err);
    return mockGetProductBySlug(slug);
  }
}

export async function getCategories() {
  if (USE_MOCK) return mockGetCategories();
  try {
    return await prisma.category.findMany({ orderBy: { name: "asc" } });
  } catch (err) {
    console.warn("[data] DB unavailable, falling back to mock data.", err);
    return mockGetCategories();
  }
}

export async function getBrands() {
  if (USE_MOCK) return mockGetBrands();
  try {
    return await prisma.brand.findMany({ orderBy: { name: "asc" } });
  } catch (err) {
    console.warn("[data] DB unavailable, falling back to mock data.", err);
    return mockGetBrands();
  }
}

export async function getFeaturedProducts(
  limit = 8
): Promise<ProductListItem[]> {
  if (USE_MOCK) return mockGetFeaturedProducts(limit);
  try {
    const all = await getProducts({ sort: "newest" });
    return all.slice(0, limit);
  } catch (err) {
    console.warn("[data] DB unavailable, falling back to mock data.", err);
    return mockGetFeaturedProducts(limit);
  }
}
