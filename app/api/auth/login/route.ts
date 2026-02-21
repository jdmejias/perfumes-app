import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user)
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid)
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });

    await setSessionCookie({ id: user.id, email: user.email, name: user.name });

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) {
    console.error("[POST /api/auth/login]", e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
