import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setSessionCookie } from "@/lib/auth";


const USE_MOCK = process.env.USE_MOCK_DATA === "true";

// Mock user for demo when USE_MOCK_DATA=true
const MOCK_USER = {
  id: "mock-user-1",
  email: "demo@luxauris.com",
  name: "Demo User",
  passwordHash: "",
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });

    // ── Mock mode: accept demo credentials or any login ──
    if (USE_MOCK) {
      // Allow demo@luxauris.com / demo or admin@luxauris.com / admin
      const isDemoEmail =
        email.toLowerCase() === "demo@luxauris.com" ||
        email.toLowerCase() === "admin@luxauris.com";

      if (!isDemoEmail || password.length < 4) {
        return NextResponse.json(
          { error: "En modo demo usa demo@luxauris.com / demo" },
          { status: 401 }
        );
      }
      const mockSessionUser = { id: MOCK_USER.id, email: email.toLowerCase(), name: "Demo User" };
      await setSessionCookie(mockSessionUser);
      return NextResponse.json({ user: mockSessionUser });
    }

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
