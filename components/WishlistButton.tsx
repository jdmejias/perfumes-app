"use client";
import { useWishlist } from "@/lib/wishlist-context";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  productId: string;
  size?: number;
  /** when true the button floats over a card */
  overlay?: boolean;
}

export default function WishlistButton({ productId, size = 34, overlay = false }: Props) {
  const { has, toggle } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();
  const [animating, setAnimating] = useState(false);

  const liked = has(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    setAnimating(true);
    await toggle(productId);
    setTimeout(() => setAnimating(false), 400);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={liked ? "Quitar de favoritos" : "Agregar a favoritos"}
      title={liked ? "Quitar de favoritos" : "Me encanta"}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "1px solid",
        borderColor: liked ? "rgba(229,75,75,0.5)" : "var(--border)",
        background: liked
          ? "rgba(229,75,75,0.12)"
          : overlay
          ? "rgba(10,9,6,0.7)"
          : "transparent",
        backdropFilter: overlay ? "blur(8px)" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s",
        transform: animating ? "scale(1.25)" : "scale(1)",
        flexShrink: 0,
      }}
    >
      <svg
        width={size * 0.45}
        height={size * 0.45}
        viewBox="0 0 24 24"
        fill={liked ? "#e54b4b" : "none"}
        stroke={liked ? "#e54b4b" : "currentColor"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: liked ? "#e54b4b" : "var(--text-muted)" }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    </button>
  );
}
