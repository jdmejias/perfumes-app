import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { ThemeProvider } from "@/lib/theme-context";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Luxauris – Haute Parfumerie",
  description:
    "Decants y frascos completos de las mejores fragancias del mundo. Dior, Chanel, Lattafa y más.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar />
                <main>{children}</main>
                <footer style={{
                  borderTop: "1px solid var(--border)",
                  padding: "48px 24px",
                  marginTop: 96,
                  textAlign: "center",
                  background: "var(--bg-card)",
                }}>
                  <p className="font-serif" style={{ fontSize: "1.2rem", color: "var(--gold)", marginBottom: 8 }}>
                    Luxauris
                  </p>
                  <p style={{ color: "var(--text-dim)", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
                    © {new Date().getFullYear()} Haute Parfumerie · Todos los derechos reservados
                  </p>
                </footer>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
