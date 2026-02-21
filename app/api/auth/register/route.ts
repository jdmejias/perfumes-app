import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });

    if (password.length < 6)
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });

    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (exists)
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 });

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email: email.toLowerCase(), name: name ?? null, passwordHash },
    });

    await setSessionCookie({ id: user.id, email: user.email, name: user.name });

    return NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    );
  } catch (e) {
    console.error("[POST /api/auth/register]", e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
