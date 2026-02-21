/**
 * Luxauris  Seed
 * Run: pnpm exec prisma db seed
 *
 * 
 *  PRECIOS  (en centavos: 1000 = $10.00 MXN)
 *  Modifica esta tabla para actualizar precios y re-ejecuta el seed.
 * 
 */
const PRECIOS: Record<string, { ml5: number; ml10: number; ml100: number; descuento?: number }> = {
  //                               5 ml     10 ml    100 ml   % descuento (opcional)
  "imperium":             { ml5:  1800, ml10:  3200, ml100: 11000 },
  "odyssey-aqua":         { ml5:  1500, ml10:  2600, ml100:  140000 },
  "odyssey-spectra":      { ml5:  1500, ml10:  2600, ml100:  9500 },
  "odyssey-homme":        { ml5:  1500, ml10:  2600, ml100:  9500 },
  "afnan-9pm":            { ml5:  2000, ml10:  3500, ml100: 12000, descuento: 10 },
  "club-de-nuit-iconic":  { ml5:  2200, ml10:  3800, ml100: 13000 },
  "sceptre-malachite":    { ml5:  1800, ml10:  3200, ml100: 10500 },
  "amber-oud-aqua-dubai": { ml5:  2200, ml10:  3800, ml100: 14000 },
  "yara-moi":             { ml5:  1400, ml10:  2300, ml100:  8500 },
  "yara-tous":            { ml5:  1400, ml10:  2300, ml100:  8500, descuento: 10 },
};
// 

import { PrismaClient, Gender, Concentration, VariantType, DiscountKind } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("  Starting Luxauris seed...");

  //  Limpiar datos existentes 
  await prisma.wishlistItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();

  //  BRANDS 
  const [armaf, afnan, alHaramain, maisonAlhambra, lattafa, fragranceWorld] =
    await Promise.all([
      prisma.brand.create({ data: { name: "Armaf",            slug: "armaf"             } }),
      prisma.brand.create({ data: { name: "Afnan",            slug: "afnan"             } }),
      prisma.brand.create({ data: { name: "Al Haramain",      slug: "al-haramain"       } }),
      prisma.brand.create({ data: { name: "Maison Alhambra",  slug: "maison-alhambra"   } }),
      prisma.brand.create({ data: { name: "Lattafa",          slug: "lattafa"           } }),
      prisma.brand.create({ data: { name: "Fragrance World",  slug: "fragrance-world"   } }),
    ]);
  console.log("  Brands created");

  //  CATEGORIES 
  const [catMen, catWomen, catDecants, catOfertas, catNuevos] = await Promise.all([
    prisma.category.create({ data: { name: "Masculinos", slug: "masculinos", type: "MEN"     } }),
    prisma.category.create({ data: { name: "Femeninos",  slug: "femeninos",  type: "WOMEN"   } }),
    prisma.category.create({ data: { name: "Decants",    slug: "decants",    type: "DECANTS" } }),
    prisma.category.create({ data: { name: "Ofertas",    slug: "ofertas",    type: "OFFERS"  } }),
    prisma.category.create({ data: { name: "Nuevos",     slug: "nuevos",     type: "NEW"     } }),
  ]);
  console.log("  Categories created");

  //  HELPER: crea las 3 variantes a partir de la tabla PRECIOS 
  const variants = (slug: string) => {
    const p = PRECIOS[slug];
    if (!p) throw new Error(`No hay precios definidos para: ${slug}`);
    return [
      { type: VariantType.DECANT,      sizeMl: 5,   sku: `${slug}-5ml`,   priceCents: p.ml5,   stock: 30 },
      { type: VariantType.DECANT,      sizeMl: 10,  sku: `${slug}-10ml`,  priceCents: p.ml10,  stock: 20 },
      { type: VariantType.FULL_BOTTLE, sizeMl: 100, sku: `${slug}-100ml`, priceCents: p.ml100, stock: 10 },
    ];
  };

  type ProductSeed = {
    name: string; slug: string; description: string; gender: Gender;
    concentration: Concentration; topNotes: string; middleNotes: string;
    baseNotes: string; brandId: string; categories: any[];
    imageFile: string; featured?: boolean;
  };

  const products: ProductSeed[] = [
    //  HOMBRES 
    {
      name: "Imperium", slug: "imperium",
      description: "Fragancia fresca y poderosa con notas cítricas y aromáticas que evocan autoridad y elegancia masculina.",
      gender: Gender.MEN, concentration: Concentration.EDP,
      topNotes: "Pomelo, Limón, Bergamota", middleNotes: "Romero, Cardamomo, Geranio",
      baseNotes: "Ámbar, Almizcle, Madera de cedro",
      brandId: fragranceWorld.id, categories: [catMen, catDecants],
      imageFile: "/products/imperium100ml3.3oz.jpeg", featured: true,
    },
    {
      name: "Odyssey Aqua", slug: "odyssey-aqua",
      description: "Edición acuática del icónico Odyssey. Fresca, ligera y perfecta para el día a día.",
      gender: Gender.MEN, concentration: Concentration.EDP,
      topNotes: "Menta acuática, Lima, Pepino", middleNotes: "Violeta, Jengibre, Cardamomo",
      baseNotes: "Madera blanca, Almizcle, Ámbar",
      brandId: armaf.id, categories: [catMen, catDecants, catNuevos],
      imageFile: "/products/oddyseyaqua.jpeg", featured: true,
    },
    {
      name: "Odyssey Spectra", slug: "odyssey-spectra",
      description: "Rainbow Edition  una explosión de colores en una fragancia vibrante con energía única.",
      gender: Gender.MEN, concentration: Concentration.EDP,
      topNotes: "Piña, Mango, Naranja", middleNotes: "Rosa, Lavanda, Pachulí",
      baseNotes: "Almizcle, Ámbar, Vainilla",
      brandId: armaf.id, categories: [catMen, catDecants],
      imageFile: "/products/oddyseyspectra.jpeg", featured: true,
    },
    {
      name: "Odyssey Homme", slug: "odyssey-homme",
      description: "La versión original y más oscura del Odyssey. Intenso, elegante y muy persistente.",
      gender: Gender.MEN, concentration: Concentration.EDP,
      topNotes: "Bergamota, Pimienta negra, Cardamomo", middleNotes: "Lavanda, Vetiver, Iris",
      baseNotes: "Oud, Sándalo, Almizcle, Cuero",
      brandId: armaf.id, categories: [catMen, catDecants],
      imageFile: "/products/oddyseyhomme.jpeg",
    },
    {
      name: "Afnan 9PM", slug: "afnan-9pm",
      description: "El perfume de la noche por excelencia. Dulce, cálido y magnéticamente sensual.",
      gender: Gender.MEN, concentration: Concentration.EDP,
      topNotes: "Manzana, Canela, Cardamomo", middleNotes: "Rosa, Lavanda, Jazmín",
      baseNotes: "Vainilla, Ámbar, Almizcle, Tonka",
      brandId: afnan.id, categories: [catMen, catDecants, catNuevos],
      imageFile: "/products/9pm.jpg", featured: true,
    },
    {
      name: "Club de Nuit Iconic", slug: "club-de-nuit-iconic",
      description: "Versión icónica del clásico Club de Nuit. Suave, etéreo y de larga duración.",
      gender: Gender.MEN, concentration: Concentration.EDP,
      topNotes: "Piña, Grosella negra, Limón", middleNotes: "Rosa, Jazmín, Iris",
      baseNotes: "Almizcle, Vainilla, Sándalo, Pachulí",
      brandId: armaf.id, categories: [catMen, catDecants],
      imageFile: "/products/clubnuiteIconic.jpg", featured: true,
    },
    {
      name: "Sceptre Malachite", slug: "sceptre-malachite",
      description: "Fragancia verde y mineral de Maison Alhambra. Sofisticado y diferente.",
      gender: Gender.MEN, concentration: Concentration.EDP,
      topNotes: "Bergamota, Cardamomo, Pimienta verde", middleNotes: "Vetiver, Cedro, Haba tonka",
      baseNotes: "Oud, Sándalo, Musgo de roble",
      brandId: maisonAlhambra.id, categories: [catMen, catDecants],
      imageFile: "/products/spectre.jpeg",
    },
    {
      name: "Amber Oud Aqua Dubai", slug: "amber-oud-aqua-dubai",
      description: "La edición acuática del legendario Amber Oud. Fresco y oriental con toque de oud.",
      gender: Gender.MEN, concentration: Concentration.EDP,
      topNotes: "Naranja, Piña, Mandarina", middleNotes: "Oud, Rosa, Azafrán",
      baseNotes: "Ámbar, Sándalo, Almizcle blanco",
      brandId: alHaramain.id, categories: [catMen, catDecants, catNuevos],
      imageFile: "/products/aquadubai.jpg", featured: true,
    },
    //  MUJERES 
    {
      name: "Lattafa Yara Moi", slug: "yara-moi",
      description: "Dulce y sofisticada. Notas florales y gourmand que envuelven con elegancia femenina.",
      gender: Gender.WOMEN, concentration: Concentration.EDP,
      topNotes: "Pera, Bergamota, Fresia", middleNotes: "Rosa, Jazmín, Iris",
      baseNotes: "Vainilla, Almizcle, Sándalo, Ámbar",
      brandId: lattafa.id, categories: [catWomen, catDecants],
      imageFile: "/products/yaralataffamoi.jpeg", featured: true,
    },
    {
      name: "Lattafa Yara Tous", slug: "yara-tous",
      description: "Cálida y floral. Una fragancia dorada que deja un rastro irresistible.",
      gender: Gender.WOMEN, concentration: Concentration.EDP,
      topNotes: "Naranja, Limón, Bergamota", middleNotes: "Jazmín, Ylang-ylang, Heliotropo",
      baseNotes: "Vainilla, Ámbar, Almizcle",
      brandId: lattafa.id, categories: [catWomen, catDecants, catNuevos],
      imageFile: "/products/yaralataffatous.jpeg", featured: true,
    },
  ];

  //  INSERT PRODUCTS 
  for (const p of products) {
    const precio = PRECIOS[p.slug];

    const product = await prisma.product.create({
      data: {
        name: p.name, slug: p.slug, description: p.description,
        gender: p.gender, concentration: p.concentration,
        topNotes: p.topNotes, middleNotes: p.middleNotes, baseNotes: p.baseNotes,
        isActive: true,
        brand:      { connect: { id: p.brandId } },
        categories: { connect: p.categories.map((c: any) => ({ id: c.id })) },
        images:   { create: [{ url: p.imageFile, alt: p.name, position: 0 }] },
        variants: { create: variants(p.slug) },
      },
    });

    // Descuento definido en PRECIOS
    if (precio?.descuento) {
      await prisma.discount.create({
        data: {
          name: `Descuento ${p.name}`,
          kind: DiscountKind.PERCENT,
          value: precio.descuento,
          isActive: true,
          productId: product.id,
        },
      });
    }

    console.log(`    ${p.name}   5ml: $${(precio.ml5/100).toFixed(2)} | 10ml: $${(precio.ml10/100).toFixed(2)} | 100ml: $${(precio.ml100/100).toFixed(2)}${precio.descuento ? ` (${precio.descuento}%)` : ""}`);
  }

  console.log(`\n  Seed completo  ${products.length} productos, ${products.length * 3} variantes`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
