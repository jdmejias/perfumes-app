export default function ProductDetailLoading() {
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
      {/* Breadcrumb skeleton */}
      <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
        {[80, 20, 60, 20, 100, 20, 140].map((w, i) => (
          <div key={i} className="skeleton" style={{ height: 12, width: w }} />
        ))}
      </div>

      <div className="product-detail-grid">
        {/* Left: image skeleton */}
        <div>
          <div
            className="skeleton"
            style={{ height: 480, borderRadius: "var(--radius-lg)" }}
          />
        </div>

        {/* Right: details skeleton */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="skeleton" style={{ height: 24, width: 140 }} />
          <div className="skeleton" style={{ height: 48, width: "85%" }} />
          <div className="skeleton" style={{ height: 16, width: 180 }} />
          <div className="skeleton" style={{ height: 72, width: "100%" }} />
          <div className="skeleton" style={{ height: 1 }} />

          {/* Variant buttons skeleton */}
          <div>
            <div className="skeleton" style={{ height: 12, width: 100, marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 10 }}>
              {[80, 90, 100].map((w, i) => (
                <div key={i} className="skeleton" style={{ height: 36, width: w, borderRadius: "var(--radius-sm)" }} />
              ))}
            </div>
          </div>

          {/* Price skeleton */}
          <div className="skeleton" style={{ height: 80, borderRadius: "var(--radius)" }} />

          {/* Add to cart skeleton */}
          <div style={{ display: "flex", gap: 12 }}>
            <div className="skeleton" style={{ height: 44, width: 108, borderRadius: "var(--radius-sm)" }} />
            <div className="skeleton" style={{ height: 44, flex: 1, borderRadius: "var(--radius-sm)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
