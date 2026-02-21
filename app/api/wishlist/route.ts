import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/** GET /api/wishlist — returns the logged-in user's wishlist product IDs */
export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ data: [] });

  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    select: { productId: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: items.map((i) => i.productId) });
}

/** POST /api/wishlist — toggle (add or remove) a product */
export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { productId } = await req.json();
  if (!productId)
    return NextResponse.json({ error: "productId requerido" }, { status: 400 });

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId: user.id, productId } },
    });
    return NextResponse.json({ added: false });
  }

  await prisma.wishlistItem.create({
    data: { userId: user.id, productId },
  });
  return NextResponse.json({ added: true });
}
