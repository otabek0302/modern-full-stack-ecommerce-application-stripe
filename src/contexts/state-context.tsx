"use client";

import React from "react";

import { createContext, useContext } from "react";
import { ProductType } from "@/interfaces";
import { getDiscountedPrice } from "@/lib/products.utils";
import { useState, useEffect, useCallback } from "react";
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
    isProductInCart: (productId: string) => boolean;
    onRemoveFromCart: (productId: string, quantity: number) => void;
    onAddToWishlist: (product: ProductType) => void;
    onRemoveFromWishlist: (product: ProductType) => void;
    isProductInWishlist: (productId: string) => boolean;
    clearCart: () => void;
    clearWishlist: () => void;
    isLoadingData: boolean;
    syncCartWithServer: (userId: string) => Promise<void>;
    syncWishlistWithServer: (userId: string) => Promise<void>;
    addToCartServer: (userId: string, productId: string) => Promise<void>;
    removeFromCartServer: (userId: string, productId: string) => Promise<void>;
    addToWishlistServer: (userId: string, productId: string) => Promise<void>;
    removeFromWishlistServer: (userId: string, productId: string) => Promise<void>;
};

const StateContext = createContext<StateContextValue | null>(null);

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);
    const [isInitialized, setIsInitialized] = useState(false);

    // LocalStorage keys
    const STORAGE_KEYS = {
        CART_ITEMS: 'ecobazar_cart_items',
        WISHLIST_ITEMS: 'ecobazar_wishlist_items',
        CART_TOTALS: 'ecobazar_cart_totals'
    };

    // Load cart and wishlist data from localStorage on component mount
    useEffect(() => {
        try {
            // Load cart items
            const savedCartItems = localStorage.getItem(STORAGE_KEYS.CART_ITEMS);
            if (savedCartItems) {
                const parsedCartItems = JSON.parse(savedCartItems);
                setCartItems(parsedCartItems);
            }

            // Load wishlist items
            const savedWishlistItems = localStorage.getItem(STORAGE_KEYS.WISHLIST_ITEMS);
            if (savedWishlistItems) {
                const parsedWishlistItems = JSON.parse(savedWishlistItems);
                setWishlistItems(parsedWishlistItems);
            }

            // Load cart totals - REMOVED to prevent loading stale discounted prices
            // Totals will be calculated fresh from cart items with current discount data
        } catch (error) {
            console.warn('Error loading cart/wishlist data from localStorage:', error);
            // Clear corrupted data
            clearLocalStorage();
        } finally {
            setIsInitialized(true);
        }
    }, []);

    // Save cart items to localStorage whenever they change
    useEffect(() => {
        if (isInitialized) {
            try {
                localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(cartItems));
            } catch (error) {
                console.warn('Error saving cart items to localStorage:', error);
            }
        }
    }, [cartItems, isInitialized]);

    // Save wishlist items to localStorage whenever they change
    useEffect(() => {
        if (isInitialized) {
            try {
                localStorage.setItem(STORAGE_KEYS.WISHLIST_ITEMS, JSON.stringify(wishlistItems));
            } catch (error) {
                console.warn('Error saving wishlist items to localStorage:', error);
            }
        }
    }, [wishlistItems, isInitialized]);

    // Save cart totals to localStorage whenever they change
    useEffect(() => {
        if (isInitialized) {
            try {
                localStorage.setItem(STORAGE_KEYS.CART_TOTALS, JSON.stringify({
                    totalPrice,
                    totalQuantities
                }));
            } catch (error) {
                console.warn('Error saving cart totals to localStorage:', error);
            }
        }
    }, [totalPrice, totalQuantities, isInitialized]);

    // Clear localStorage function
    const clearLocalStorage = () => {
        try {
            localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
            localStorage.removeItem(STORAGE_KEYS.WISHLIST_ITEMS);
            localStorage.removeItem(STORAGE_KEYS.CART_TOTALS);
        } catch (error) {
            console.warn('Error clearing localStorage:', error);
        }
    };

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
        const existingItem = cartItems.find((item) => item.product._id === product._id);

        if (existingItem) {
            // Quantities will be recalculated from cartItems in the totals effect
            setTotalQuantities((prevQuantities) => prevQuantities + quantity);

            const updatedCartItems = cartItems.map((item) => (item.product._id === product._id ? { ...item, quantity: item.quantity + quantity } : item));
            setCartItems(updatedCartItems);
            toast.success(`${quantity} ${product.name} added to cart`);
        } else {
            setCartItems((prevItems) => [...prevItems, { product, quantity }]);
            // Quantities will be recalculated from cartItems in the totals effect
            setTotalQuantities((prevQuantities) => prevQuantities + quantity);
            toast.success(`${quantity} ${product.name} added to cart`);
        }
    };

    const onRemoveFromCart = (productId: string, quantity: number) => {
        const existingItem = cartItems.find((item) => item.product._id === productId);
        if (!existingItem) return;

        if (quantity >= existingItem.quantity) {
            // Remove entire product if quantity to remove >= current quantity
            const updatedCartItems = cartItems.filter((item) => item.product._id !== productId);
            setCartItems(updatedCartItems);
            // Totals will be recalculated from cartItems in the totals effect
            setTotalQuantities((prevQuantities) => prevQuantities - existingItem.quantity);
            toast.success(`${existingItem.product.name} removed from cart`);
        } else {
            // Reduce quantity if quantity to remove < current quantity
            const updatedCartItems = cartItems.map((item) => 
                item.product._id === productId 
                    ? { ...item, quantity: item.quantity - quantity }
                    : item
            );
            setCartItems(updatedCartItems);
            // Totals will be recalculated from cartItems in the totals effect
            setTotalQuantities((prevQuantities) => prevQuantities - quantity);
            toast.success(`${quantity} ${existingItem.product.name} removed from cart`);
        }
    };

    const onAddToWishlist = (product: ProductType) => {
        const existingItem = wishlistItems.find((item) => item._id === product._id);
        if (existingItem) {
            toast.error(`${product.name} already in wishlist`);
            return;
        } else {
            setWishlistItems((prevItems) => [...prevItems, product]);
            toast.success(`${product.name} added to wishlist`);
        }
    };

    const onRemoveFromWishlist = (product: ProductType) => {
        const updatedWishlistItems = wishlistItems.filter((item) => item._id !== product._id);
        setWishlistItems(updatedWishlistItems);
        toast.success(`${product.name} removed from wishlist`);
    };

    const isProductInWishlist = (productId: string) => {
        return wishlistItems.some((item) => item._id === productId);
    };

    const isProductInCart = (productId: string) => {
        return cartItems.some((item) => item.product._id === productId);
    };

    const clearCart = () => {
        setCartItems([]);
        setTotalPrice(0);
        setTotalQuantities(0);
        toast.success('Cart cleared successfully');
    };

    const clearWishlist = () => {
        setWishlistItems([]);
        toast.success('Wishlist cleared successfully');
    };

    // Server-side sync functions
    const syncCartWithServer = useCallback(async (userId: string) => {
        try {
            const response = await fetch(`/api/user/cart?userId=${userId}`);
            if (response.ok) {
                const data = await response.json();
                // Server now returns discounted prices, so we can use them directly
                // But we need to preserve quantities from local state
                const existingCartItems = cartItems;
                const newCartItems = data.cartItems.map((product: ProductType) => {
                    // Find existing item to preserve quantity
                    const existingItem = existingCartItems.find(item => item.product._id === product._id);
                    return { 
                        product, 
                        quantity: existingItem?.quantity || 1 
                    };
                });
                setCartItems(newCartItems);
                // Use server-calculated totals since they include discounts
                setTotalPrice(data.totalPrice);
                setTotalQuantities(data.totalItems);
            }
        } catch (error) {
            console.error('Error syncing cart with server:', error);
        }
    }, []);

    const syncWishlistWithServer = useCallback(async (userId: string) => {
        try {
            const response = await fetch(`/api/user/wishlist?userId=${userId}`);
            if (response.ok) {
                const data = await response.json();
                setWishlistItems(data.wishlistItems);
            }
        } catch (error) {
            console.error('Error syncing wishlist with server:', error);
        }
    }, []);

    const addToCartServer = useCallback(async (userId: string, productId: string) => {
        try {
            const response = await fetch('/api/user/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productId })
            });
            
            if (response.ok) {
                await syncCartWithServer(userId);
            }
        } catch (error) {
            console.error('Error adding to cart on server:', error);
        }
    }, [syncCartWithServer]);

    const removeFromCartServer = useCallback(async (userId: string, productId: string) => {
        try {
            const response = await fetch(`/api/user/cart?userId=${userId}&productId=${productId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                await syncCartWithServer(userId);
            }
        } catch (error) {
            console.error('Error removing from cart on server:', error);
        }
    }, [syncCartWithServer]);

    const addToWishlistServer = useCallback(async (userId: string, productId: string) => {
        try {
            const response = await fetch('/api/user/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productId })
            });
            
            if (response.ok) {
                await syncWishlistWithServer(userId);
            }
        } catch (error) {
            console.error('Error adding to wishlist on server:', error);
        }
    }, [syncWishlistWithServer]);

    // Always recalculate totals (including discounts) whenever cart items change
    useEffect(() => {
        if (!isInitialized) return;
        
                try {
            const totals = cartItems.reduce(
                (acc, item) => {
                    // Calculate discounted price for 1 item
                    const discountedPricePerItem = getDiscountedPrice(item.product);
                    
                    // Calculate total for this item (discounted price × quantity)
                    const itemTotal = discountedPricePerItem * item.quantity;
                    
                    // Add to running totals
                    acc.totalPrice += itemTotal;
                    acc.totalQuantities += item.quantity;
                    return acc;
                },
                { totalPrice: 0, totalQuantities: 0 }
            );


            setTotalPrice(totals.totalPrice);
            setTotalQuantities(totals.totalQuantities);
        } catch (error) {
            console.warn('Error recalculating cart totals:', error);
        }
    }, [cartItems, isInitialized]);

    const removeFromWishlistServer = useCallback(async (userId: string, productId: string) => {
        try {
            const response = await fetch(`/api/user/wishlist?userId=${userId}&productId=${productId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                await syncWishlistWithServer(userId);
            }
        } catch (error) {
            console.error('Error removing from wishlist on server:', error);
        }
    }, [syncWishlistWithServer]);

    return <StateContext.Provider value={{ showCart, setShowCart, cartItems, setCartItems, wishlistItems, setWishlistItems, totalPrice, setTotalPrice, totalQuantities, setTotalQuantities, qty, setQty, incQty, decQty, onAddToCart, isProductInCart, onRemoveFromCart, onAddToWishlist, onRemoveFromWishlist, isProductInWishlist, clearCart, clearWishlist, isLoadingData: !isInitialized, syncCartWithServer, syncWishlistWithServer, addToCartServer, removeFromCartServer, addToWishlistServer, removeFromWishlistServer }}>{children}</StateContext.Provider>;
};

export const useStateContext = () => {
    const context = useContext(StateContext);
    if (!context) throw new Error("useStateContext must be used within a StateProvider");
    return context;
};
