/**
 * Mock data for local development without a database.
 * Mirrors the structure produced by the Prisma seed (prisma/seed.ts).
 * Activated when USE_MOCK_DATA=true in .env
 */

import type { ProductListItem, ProductDetail, VariantDetail } from "./data";

// ─────────────────────────────────────────────────────────────
// BRANDS
// ─────────────────────────────────────────────────────────────

const BRANDS = [
  { id: "brand-1", name: "Armaf",           slug: "armaf"           },
  { id: "brand-2", name: "Afnan",           slug: "afnan"           },
  { id: "brand-3", name: "Al Haramain",     slug: "al-haramain"     },
  { id: "brand-4", name: "Maison Alhambra", slug: "maison-alhambra" },
  { id: "brand-5", name: "Lattafa",         slug: "lattafa"         },
  { id: "brand-6", name: "Fragrance World", slug: "fragrance-world" },
];

// ─────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "cat-1", name: "Masculinos", slug: "masculinos", type: "MEN"     },
  { id: "cat-2", name: "Femeninos",  slug: "femeninos",  type: "WOMEN"   },
  { id: "cat-3", name: "Decants",    slug: "decants",    type: "DECANTS" },
  { id: "cat-4", name: "Ofertas",    slug: "ofertas",    type: "OFFERS"  },
  { id: "cat-5", name: "Nuevos",     slug: "nuevos",     type: "NEW"     },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function makeVariants(
  slug: string,
  variants: { sizeMl: number; priceCents: number; type: string; stock: number }[]
): VariantDetail[] {
  return variants.map((v, i) => ({
    id: `${slug}-variant-${i}`,
    type: v.type,
    sizeMl: v.sizeMl,
    sku: `${slug}-${v.sizeMl}ml`,
    priceCents: v.priceCents,
    compareAtPriceCents: null,
    effectivePriceCents: v.priceCents,
    discountApplied: null,
    stock: v.stock,
    isActive: true,
  }));
}

function makeCats(ids: string[]) {
  return CATEGORIES.filter((c) => ids.includes(c.id));
}

function getBrand(id: string) {
  return BRANDS.find((b) => b.id === id)!;
}

const now = new Date("2026-07-01T00:00:00Z");

// ─────────────────────────────────────────────────────────────
// PRODUCTS (from seed.ts)
// ─────────────────────────────────────────────────────────────

const MOCK_PRODUCTS_DETAIL: ProductDetail[] = [
  // ── HOMBRES ──────────────────────────────────────────────
  {
    id: "prod-1",
    name: "Imperium",
    slug: "imperium",
    description: "Fragancia fresca y poderosa con notas cítricas y aromáticas que evocan autoridad y elegancia masculina.",
    gender: "MEN",
    concentration: "EDP",
    topNotes: "Pomelo, Limón, Bergamota",
    middleNotes: "Romero, Cardamomo, Geranio",
    baseNotes: "Ámbar, Almizcle, Madera de cedro",
    isActive: true,
    createdAt: now,
    updatedAt: now,
    brand: getBrand("brand-6"),
    categories: makeCats(["cat-1", "cat-3"]),
    images: [{ id: "img-1", url: "/products/imperium100ml3.3oz.jpeg", alt: "Imperium", position: 0 }],
    variants: makeVariants("imperium", [
      { sizeMl: 5,   priceCents: 20000, type: "DECANT",      stock: 30 },
      { sizeMl: 10,  priceCents: 35000, type: "DECANT",      stock: 20 },
      { sizeMl: 100, priceCents: 220000, type: "FULL_BOTTLE", stock: 10 },
    ]),
  },
  {
    id: "prod-2",
    name: "Odyssey Aqua",
    slug: "odyssey-aqua",
    description: "Edición acuática del icónico Odyssey. Fresca, ligera y perfecta para el día a día.",
    gender: "MEN",
    concentration: "EDP",
    topNotes: "Menta acuática, Lima, Pepino",
    middleNotes: "Violeta, Jengibre, Cardamomo",
    baseNotes: "Madera blanca, Almizcle, Ámbar",
    isActive: true,
    createdAt: now,
    updatedAt: now,
    brand: getBrand("brand-1"),
    categories: makeCats(["cat-1", "cat-3", "cat-5"]),
    images: [{ id: "img-2", url: "/products/oddyseyaqua.jpeg", alt: "Odyssey Aqua", position: 0 }],
    variants: makeVariants("odyssey-aqua", [
      { sizeMl: 5,   priceCents: 20000, type: "DECANT",      stock: 30 },
      { sizeMl: 10,  priceCents: 35000, type: "DECANT",      stock: 20 },
      { sizeMl: 100, priceCents: 190000, type: "FULL_BOTTLE", stock: 10 },
      { sizeMl: 200, priceCents: 290000, type: "FULL_BOTTLE", stock: 10 },
    ]),
  },
  {
    id: "prod-3",
    name: "Odyssey Spectra",
    slug: "odyssey-spectra",
    description: "Rainbow Edition – una explosión de colores en una fragancia vibrante con energía única.",
    gender: "MEN",
    concentration: "EDP",
    topNotes: "Piña, Mango, Naranja",
    middleNotes: "Rosa, Lavanda, Pachulí",
    baseNotes: "Almizcle, Ámbar, Vainilla",
    isActive: true,
    createdAt: now,
    updatedAt: now,
    brand: getBrand("brand-1"),
    categories: makeCats(["cat-1", "cat-3"]),
    images: [{ id: "img-3", url: "/products/oddyseyspectra.jpeg", alt: "Odyssey Spectra", position: 0 }],
    variants: makeVariants("odyssey-spectra", [
      { sizeMl: 5,   priceCents: 20000, type: "DECANT",      stock: 30 },
      { sizeMl: 10,  priceCents: 35000, type: "DECANT",      stock: 20 },
      { sizeMl: 100, priceCents: 190000, type: "FULL_BOTTLE", stock: 10 },
      { sizeMl: 200, priceCents: 290000, type: "FULL_BOTTLE", stock: 10 },
    ]),
  },
  {
    id: "prod-4",
    name: "Odyssey Homme",
    slug: "odyssey-homme",
    description: "La versión original y más oscura del Odyssey. Intenso, elegante y muy persistente.",
    gender: "MEN",
    concentration: "EDP",
    topNotes: "Bergamota, Pimienta negra, Cardamomo",
    middleNotes: "Lavanda, Vetiver, Iris",
    baseNotes: "Oud, Sándalo, Almizcle, Cuero",
    isActive: true,
    createdAt: now,
    updatedAt: now,
    brand: getBrand("brand-1"),
    categories: makeCats(["cat-1", "cat-3"]),
    images: [{ id: "img-4", url: "/products/oddyseyhomme.jpeg", alt: "Odyssey Homme", position: 0 }],
    variants: makeVariants("odyssey-homme", [
      { sizeMl: 5,   priceCents: 20000, type: "DECANT",      stock: 30 },
      { sizeMl: 10,  priceCents: 35000, type: "DECANT",      stock: 20 },
      { sizeMl: 100, priceCents: 190000, type: "FULL_BOTTLE", stock: 10 },
      { sizeMl: 200, priceCents: 290000, type: "FULL_BOTTLE", stock: 10 },
    ]),
  },
  {
    id: "prod-5",
    name: "Afnan 9PM",
    slug: "afnan-9pm",
    description: "El perfume de la noche por excelencia. Dulce, cálido y magnéticamente sensual.",
    gender: "MEN",
    concentration: "EDP",
    topNotes: "Manzana, Canela, Cardamomo",
    middleNotes: "Rosa, Lavanda, Jazmín",
    baseNotes: "Vainilla, Ámbar, Almizcle, Tonka",
    isActive: true,
    createdAt: now,
    updatedAt: now,
    brand: getBrand("brand-2"),
    categories: makeCats(["cat-1", "cat-3", "cat-5"]),
    images: [{ id: "img-5", url: "/products/9pm.jpg", alt: "Afnan 9PM", position: 0 }],
    variants: makeVariants("afnan-9pm", [
      { sizeMl: 5,   priceCents: 20000, type: "DECANT",      stock: 30 },
      { sizeMl: 10,  priceCents: 35000, type: "DECANT",      stock: 20 },
      { sizeMl: 100, priceCents: 190000, type: "FULL_BOTTLE", stock: 10 },
      { sizeMl: 150, priceCents: 240000, type: "FULL_BOTTLE", stock: 10 },
    ]),
  },
  {
    id: "prod-6",
    name: "Club de Nuit Iconic",
    slug: "club-de-nuit-iconic",
    description: "Versión icónica del clásico Club de Nuit. Suave, etéreo y de larga duración.",
    gender: "MEN",
    concentration: "EDP",
    topNotes: "Piña, Grosella negra, Limón",
    middleNotes: "Rosa, Jazmín, Iris",
    baseNotes: "Almizcle, Vainilla, Sándalo, Pachulí",
    isActive: true,
    createdAt: now,
    updatedAt: now,
    brand: getBrand("brand-1"),
    categories: makeCats(["cat-1", "cat-3"]),
    images: [{ id: "img-6", url: "/products/clubnuiteIconic.jpg", alt: "Club de Nuit Iconic", position: 0 }],
    variants: makeVariants("club-de-nuit-iconic", [
      { sizeMl: 5,   priceCents: 25000, type: "DECANT",      stock: 30 },
      { sizeMl: 10,  priceCents: 43000, type: "DECANT",      stock: 20 },
      { sizeMl: 100, priceCents: 250000, type: "FULL_BOTTLE", stock: 10 },
      { sizeMl: 200, priceCents: 400000, type: "FULL_BOTTLE", stock: 10 },
    ]),
  },
  {
    id: "prod-7",
    name: "Sceptre Malachite",
    slug: "sceptre-malachite",
    description: "Fragancia verde y mineral de Maison Alhambra. Sofisticado y diferente.",
    gender: "MEN",
    concentration: "EDP",
    topNotes: "Bergamota, Cardamomo, Pimienta verde",
    middleNotes: "Vetiver, Cedro, Haba tonka",
    baseNotes: "Oud, Sándalo, Musgo de roble",
    isActive: true,
    createdAt: now,
    updatedAt: now,
    brand: getBrand("brand-4"),
    categories: makeCats(["cat-1", "cat-3"]),
    images: [{ id: "img-7", url: "/products/spectre.jpeg", alt: "Sceptre Malachite", position: 0 }],
    variants: makeVariants("sceptre-malachite", [
      { sizeMl: 5,   priceCents: 22000, type: "DECANT",      stock: 30 },
      { sizeMl: 10,  priceCents: 40000, type: "DECANT",      stock: 20 },
      { sizeMl: 100, priceCents: 180000, type: "FULL_BOTTLE", stock: 10 },
    ]),
  },
  {
    id: "prod-8",
    name: "Amber Oud Aqua Dubai",
    slug: "amber-oud-aqua-dubai",
    description: "La edición acuática del legendario Amber Oud. Fresco y oriental con toque de oud.",
    gender: "MEN",
    concentration: "EDP",
    topNotes: "Naranja, Piña, Mandarina",
    middleNotes: "Oud, Rosa, Azafrán",
    baseNotes: "Ámbar, Sándalo, Almizcle blanco",
    isActive: true,
    createdAt: now,
    updatedAt: now,
    brand: getBrand("brand-3"),
    categories: makeCats(["cat-1", "cat-3", "cat-5"]),
    images: [{ id: "img-8", url: "/products/aquadubai.jpg", alt: "Amber Oud Aqua Dubai", position: 0 }],
    variants: makeVariants("amber-oud-aqua-dubai", [
      { sizeMl: 5,   priceCents: 25000, type: "DECANT",      stock: 30 },
      { sizeMl: 10,  priceCents: 45000, type: "DECANT",      stock: 20 },
      { sizeMl: 100, priceCents: 360000, type: "FULL_BOTTLE", stock: 10 },
    ]),
  },
  // ── MUJERES ──────────────────────────────────────────────
  {
    id: "prod-9",
    name: "Lattafa Yara Moi",
    slug: "yara-moi",
    description: "Dulce y sofisticada. Notas florales y gourmand que envuelven con elegancia femenina.",
    gender: "WOMEN",
    concentration: "EDP",
    topNotes: "Pera, Bergamota, Fresia",
    middleNotes: "Rosa, Jazmín, Iris",
    baseNotes: "Vainilla, Almizcle, Sándalo, Ámbar",
    isActive: true,
    createdAt: now,
    updatedAt: now,
    brand: getBrand("brand-5"),
    categories: makeCats(["cat-2", "cat-3"]),
    images: [{ id: "img-9", url: "/products/yaralataffamoi.jpeg", alt: "Lattafa Yara Moi", position: 0 }],
    variants: makeVariants("yara-moi", [
      { sizeMl: 5,   priceCents: 18000, type: "DECANT",      stock: 30 },
      { sizeMl: 10,  priceCents: 31000, type: "DECANT",      stock: 20 },
      { sizeMl: 100, priceCents: 180000, type: "FULL_BOTTLE", stock: 10 },
    ]),
  },
  {
    id: "prod-10",
    name: "Lattafa Yara Tous",
    slug: "yara-tous",
    description: "Cálida y floral. Una fragancia dorada que deja un rastro irresistible.",
    gender: "WOMEN",
    concentration: "EDP",
    topNotes: "Naranja, Limón, Bergamota",
    middleNotes: "Jazmín, Ylang-ylang, Heliotropo",
    baseNotes: "Vainilla, Ámbar, Almizcle",
    isActive: true,
    createdAt: now,
    updatedAt: now,
    brand: getBrand("brand-5"),
    categories: makeCats(["cat-2", "cat-3", "cat-5"]),
    images: [{ id: "img-10", url: "/products/yaralataffatous.jpeg", alt: "Lattafa Yara Tous", position: 0 }],
    // 10% discount applied
    variants: makeVariants("yara-tous", [
      { sizeMl: 5,   priceCents: Math.round(20000 * 0.9), type: "DECANT",      stock: 30 },
      { sizeMl: 10,  priceCents: Math.round(35000 * 0.9), type: "DECANT",      stock: 20 },
      { sizeMl: 100, priceCents: Math.round(185000 * 0.9), type: "FULL_BOTTLE", stock: 10 },
    ]),
  },
];

// ─────────────────────────────────────────────────────────────
// DERIVED LIST ITEMS
// ─────────────────────────────────────────────────────────────

function toListItem(p: ProductDetail): ProductListItem {
  const prices = p.variants.map((v) => v.effectivePriceCents);
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    gender: p.gender,
    concentration: p.concentration,
    isActive: p.isActive,
    createdAt: p.createdAt,
    brand: p.brand,
    categories: p.categories,
    firstImage: p.images[0] ?? null,
    minEffectivePriceCents: prices.length > 0 ? Math.min(...prices) : null,
    hasActiveDiscount: p.variants.some((v) => v.discountApplied !== null),
    variantCount: p.variants.length,
  };
}

// ─────────────────────────────────────────────────────────────
// PUBLIC API – same shape as lib/data.ts
// ─────────────────────────────────────────────────────────────

import type { ProductFilters } from "./data";

export async function mockGetProducts(
  filters: ProductFilters = {}
): Promise<ProductListItem[]> {
  const { q, category, brand, gender, minPrice, maxPrice, onSale, sort = "newest" } = filters;

  let result = MOCK_PRODUCTS_DETAIL.filter((p) => p.isActive).map(toListItem);

  if (q) {
    const lower = q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.description ?? "").toLowerCase().includes(lower)
    );
  }
  if (gender) result = result.filter((p) => p.gender === gender);
  if (brand)  result = result.filter((p) => p.brand.slug === brand);
  if (category)
    result = result.filter((p) => p.categories.some((c) => c.slug === category));
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
  // newest: keep insertion order (already newest-first by id index)

  return result;
}

export async function mockGetProductBySlug(slug: string): Promise<ProductDetail | null> {
  return MOCK_PRODUCTS_DETAIL.find((p) => p.slug === slug && p.isActive) ?? null;
}

export async function mockGetCategories() {
  return CATEGORIES;
}

export async function mockGetBrands() {
  return BRANDS;
}

export async function mockGetFeaturedProducts(limit = 8): Promise<ProductListItem[]> {
  const all = await mockGetProducts({ sort: "newest" });
  return all.slice(0, limit);
}
