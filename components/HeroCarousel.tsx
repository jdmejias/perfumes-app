"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=1600&q=80",
    title: "Odyssey & Club de Nuit",
    subtitle: "Las fragancias más elegantes de Armaf",
    href: "/productos?brand=armaf",
    label: "Ver colección",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1600&q=80",
    title: "Decants Exclusivos",
    subtitle: "Prueba antes de invertir en el frasco completo",
    href: "/productos?category=decants",
    label: "Ver decants",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=1600&q=80",
    title: "Lattafa Yara",
    subtitle: "Dulzura y elegancia femenina irresistible",
    href: "/productos?gender=WOMEN",
    label: "Para ella",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1600&q=80",
    title: "Afnan 9PM",
    subtitle: "La fragancia de la noche — sensual y magnética",
    href: "/productos/afnan-9pm",
    label: "Descubrir",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=1600&q=80",
    title: "Ofertas especiales",
    subtitle: "Descuentos en fragancias seleccionadas",
    href: "/productos?onSale=true",
    label: "Ver ofertas",
  },
];

const AUTO_PLAY_MS = 4500;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, AUTO_PLAY_MS);
    return () => clearInterval(t);
  }, [next, paused]);

  const slide = SLIDES[current];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(480px, 80vh, 720px)",
        overflow: "hidden",
        background: "#0a0906",
      }}
    >
      {/* Slides */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.9s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            priority={i === 0}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
            unoptimized
          />
          {/* dark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(10,9,6,0.75) 0%, rgba(10,9,6,0.35) 50%, rgba(10,9,6,0.1) 100%)",
            }}
          />
        </div>
      ))}

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 clamp(24px, 6vw, 100px)",
        }}
      >
        <div
          key={current}
          style={{ animation: "slideUp 0.6s ease", maxWidth: 560 }}
        >
          <p
            className="section-label"
            style={{ marginBottom: 16, color: "var(--gold)" }}
          >
            Luxauris Collection
          </p>
          <h2
            className="font-serif"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#f0ebe2",
              marginBottom: 14,
            }}
          >
            {slide.title}
          </h2>
          <p
            style={{
              color: "rgba(240,235,226,0.75)",
              fontSize: "1.05rem",
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            {slide.subtitle}
          </p>
          <Link href={slide.href} className="btn btn-gold" style={{ padding: "13px 32px" }}>
            {slide.label} →
          </Link>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Anterior"
        style={{
          position: "absolute",
          left: 20,
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(201,169,110,0.3)",
          borderRadius: "50%",
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--gold)",
          backdropFilter: "blur(8px)",
          transition: "all 0.2s",
          zIndex: 10,
          fontSize: "1.1rem",
        }}
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Siguiente"
        style={{
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(201,169,110,0.3)",
          borderRadius: "50%",
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--gold)",
          backdropFilter: "blur(8px)",
          transition: "all 0.2s",
          zIndex: 10,
          fontSize: "1.1rem",
        }}
      >
        ›
      </button>

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          zIndex: 10,
        }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              borderRadius: 99,
              background:
                i === current
                  ? "var(--gold)"
                  : "rgba(201,169,110,0.35)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
