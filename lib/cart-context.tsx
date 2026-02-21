"use client";
import React, { createContext, useContext, useReducer, useCallback } from "react";

export interface CartItem {
    variantId: string;
    productName: string;
    variantLabel: string; // e.g. "100ml – Full Bottle"
    sku: string;
    imageUrl: string | null;
    priceCents: number;      // effective price per unit
    quantity: number;
}

interface CartState {
    items: CartItem[];
    open: boolean;
}

type Action =
    | { type: "ADD"; item: CartItem }
    | { type: "REMOVE"; variantId: string }
    | { type: "UPDATE_QTY"; variantId: string; quantity: number }
    | { type: "CLEAR" }
    | { type: "TOGGLE_OPEN"; open?: boolean };

function reducer(state: CartState, action: Action): CartState {
    switch (action.type) {
        case "ADD": {
            const exists = state.items.find((i) => i.variantId === action.item.variantId);
            if (exists) {
                return {
                    ...state,
                    open: true,
                    items: state.items.map((i) =>
                        i.variantId === action.item.variantId
                            ? { ...i, quantity: i.quantity + action.item.quantity }
                            : i
                    ),
                };
            }
            return { ...state, open: true, items: [...state.items, action.item] };
        }
        case "REMOVE":
            return { ...state, items: state.items.filter((i) => i.variantId !== action.variantId) };
        case "UPDATE_QTY":
            if (action.quantity <= 0)
                return { ...state, items: state.items.filter((i) => i.variantId !== action.variantId) };
            return {
                ...state,
                items: state.items.map((i) =>
                    i.variantId === action.variantId ? { ...i, quantity: action.quantity } : i
                ),
            };
        case "CLEAR":
            return { ...state, items: [] };
        case "TOGGLE_OPEN":
            return { ...state, open: action.open !== undefined ? action.open : !state.open };
        default:
            return state;
    }
}

interface CartContextValue {
    items: CartItem[];
    open: boolean;
    totalItems: number;
    subtotalCents: number;
    addItem: (item: CartItem) => void;
    removeItem: (variantId: string) => void;
    updateQty: (variantId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: (open?: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, { items: [], open: false });

    const addItem = useCallback((item: CartItem) => dispatch({ type: "ADD", item }), []);
    const removeItem = useCallback((variantId: string) => dispatch({ type: "REMOVE", variantId }), []);
    const updateQty = useCallback((variantId: string, quantity: number) => dispatch({ type: "UPDATE_QTY", variantId, quantity }), []);
    const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);
    const toggleCart = useCallback((open?: boolean) => dispatch({ type: "TOGGLE_OPEN", open }), []);

    const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
    const subtotalCents = state.items.reduce((s, i) => s + i.priceCents * i.quantity, 0);

    return (
        <CartContext.Provider value={{ ...state, totalItems, subtotalCents, addItem, removeItem, updateQty, clearCart, toggleCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
