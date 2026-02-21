export default function ProductosLoading() {
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header skeleton */}
      <div style={{ marginBottom: 40 }}>
        <div className="skeleton" style={{ height: 12, width: 80, marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 36, width: 260, marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 14, width: 120 }} />
      </div>

      <div className="products-layout">
        {/* Sidebar skeleton */}
        <div
          style={{
            width: 220,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="skeleton" style={{ height: 10, width: 60, marginBottom: 10 }} />
              <div className="skeleton" style={{ height: 36, width: "100%" }} />
            </div>
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="products-grid" style={{ flex: 1 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                borderRadius: "var(--radius)",
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}
            >
              <div className="skeleton" style={{ height: 260 }} />
              <div style={{ padding: 16 }}>
                <div className="skeleton" style={{ height: 10, width: "50%", marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 16, width: "80%", marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 12, width: "60%", marginBottom: 16 }} />
                <div className="skeleton" style={{ height: 1, marginBottom: 12 }} />
                <div className="skeleton" style={{ height: 20, width: "40%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
