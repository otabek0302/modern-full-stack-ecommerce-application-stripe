"use client";

import React from "react";

import { createContext, useContext } from "react";
import { ProductType } from "@/interfaces";
import { useState } from "react";
import { toast } from "sonner";

type CartItem = {
    product: ProductType;
    quantity: number;
};

type WishlistItem = ProductType;

type StateContextValue = {
    showCart: boolean;
    setShowCart: (show: boolean) => void;
    cartItems: CartItem[];
    setCartItems: (items: CartItem[]) => void;
    wishlistItems: WishlistItem[];
    setWishlistItems: (items: WishlistItem[]) => void;

    totalPrice: number;
    setTotalPrice: (price: number) => void;
    totalQuantities: number;
    setTotalQuantities: (quantities: number) => void;
    qty: number;
    setQty: (quantity: number) => void;
    incQty: () => void;
    decQty: () => void;
    onAddToCart: (product: ProductType, quantity: number) => void;
    checkProductInCart: boolean;
};

const StateContext = createContext<StateContextValue | null>(null);

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [checkProductInCart, setCheckProductInCart] = useState(false);
    const [qty, setQty] = useState(1);

    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    };

    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1;

            return prevQty - 1;
        });
    };

    const onAddToCart = (product: ProductType, quantity: number) => {
        setCheckProductInCart(cartItems.find((item) => item.product._id === product._id));
        if (checkProductInCart) {
            setTotalPrice((prevPrice) => prevPrice + product.price * quantity);
            setTotalQuantities((prevQuantities) => prevQuantities + quantity);

            const updatedCartItems = cartItems.map((item) => (item.product._id === product._id ? { ...item, quantity: item.quantity + quantity } : item));
            setCartItems(updatedCartItems);
            toast.success(`${quantity} ${product.name} added to cart`);
        } else {
            setCartItems((prevItems) => [...prevItems, { product, quantity }]);
            setTotalPrice((prevPrice) => prevPrice + product.price * quantity);
            setTotalQuantities((prevQuantities) => prevQuantities + quantity);
            toast.success(`${quantity} ${product.name} added to cart`);
        }
    };

    return <StateContext.Provider value={{ showCart, setShowCart, cartItems, setCartItems, wishlistItems, setWishlistItems, totalPrice, setTotalPrice, totalQuantities, setTotalQuantities, qty, setQty, incQty, decQty, onAddToCart, checkProductInCart }}>{children}</StateContext.Provider>;
};

export const useStateContext = () => {
    const context = useContext(StateContext);
    if (!context) throw new Error("useStateContext must be used within a StateProvider");
    return context;
};
