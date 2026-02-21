import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "60px 24px",
      }}
    >
      <p
        className="font-serif"
        style={{
          fontSize: "6rem",
          fontWeight: 700,
          color: "var(--gold)",
          opacity: 0.3,
          lineHeight: 1,
          marginBottom: 16,
        }}
      >
        404
      </p>
      <h1
        className="font-serif"
        style={{ fontSize: "2rem", fontWeight: 600, marginBottom: 12 }}
      >
        Página no encontrada
      </h1>
      <p
        style={{
          color: "var(--text-muted)",
          maxWidth: 400,
          marginBottom: 36,
          lineHeight: 1.7,
        }}
      >
        La fragancia que buscas no existe o fue retirada de nuestra colección.
      </p>
      <Link href="/productos" className="btn btn-gold" style={{ padding: "12px 32px" }}>
        Ver colección completa
      </Link>
    </div>
  );
}
