/**
 * Format cents to COP / USD-style string
 * e.g. 1500 → "$15.00"  |  18000 → "$180.00"
 */
export function formatPrice(cents: number): string {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(cents);
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export function getVariantLabel(type: string, sizeMl: number): string {
    const typeLabel: Record<string, string> = {
        DECANT: "Decant",
        FULL_BOTTLE: "Frasco",
        TESTER: "Tester",
    };
    return `${sizeMl}ml – ${typeLabel[type] ?? type}`;
}

export function cn(...classes: (string | undefined | null | boolean)[]): string {
    return classes.filter(Boolean).join(" ");
}
