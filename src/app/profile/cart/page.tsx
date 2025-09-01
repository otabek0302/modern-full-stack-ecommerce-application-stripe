"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useStateContext } from "@/contexts/state-context";
import { ProductType } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { urlFor } from "@/lib/sanity.client";

export default function CartPage() {
    const { cartItems, onRemoveFromCart, onAddToCart } = useStateContext();
    const updateQuantity = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        const currentItem = cartItems.find((item) => item.product._id === itemId);
        if (!currentItem) return;

        // Check if new quantity exceeds stock
        if (newQuantity > currentItem.product.stockQuantity) {
            return;
        }

        if (newQuantity > currentItem.quantity) {
            // Increase quantity: add more of the same product
            const quantityToAdd = newQuantity - currentItem.quantity;
            onAddToCart(currentItem.product, quantityToAdd);
        } else if (newQuantity < currentItem.quantity) {
            // Decrease quantity: remove some of the product
            const quantityToRemove = currentItem.quantity - newQuantity;
            onRemoveFromCart(itemId, quantityToRemove);
        }
    };

    const removeItem = (itemId: string) => {
        const currentItem = cartItems.find((item) => item.product._id === itemId);
        if (currentItem) {
            onRemoveFromCart(itemId, currentItem.quantity);
        }
    };

    // Calculate discounted price for a product
    const getDiscountedPrice = (product: ProductType) => {
        const price = product.price || 0;
        
        if (product.discount && product.discount.isActive) {
            const now = new Date();
            const startDate = new Date(product.discount.startDate);
            const endDate = new Date(product.discount.endDate);

            if (now >= startDate && now <= endDate) {
                if (product.discount.discountType === "percentage") {
                    return price * (1 - (product.discount.discount || 0) / 100);
                } else if (product.discount.discountType === "fixed") {
                    return Math.max(0, price - (product.discount.discount || 0));
                }
            }
        }
        return price;
    };

    // Calculate cart totals with discounts
    const calculateCartTotals = () => {
        let subtotal = 0;
        let totalDiscount = 0;

        cartItems.forEach((item) => {
            const originalPrice = item.product.price * item.quantity;
            const discountedPrice = getDiscountedPrice(item.product) * item.quantity;
            subtotal += discountedPrice;
            totalDiscount += originalPrice - discountedPrice;
        });

        return { subtotal, totalDiscount };
    };

    const { subtotal, totalDiscount } = calculateCartTotals();
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + shipping;

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="space-y-6">
                <Card className="border border-gray-200 rounded-lg shadow-none">
                    <CardContent className="text-center py-12">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                        <p className="text-gray-500 mb-6">Start shopping to add items to your cart!</p>
                        <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                            <Link href="/products">Browse Products</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="border border-gray-200 rounded-lg shadow-none">
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                        <CardTitle className="text-2xl font-bold text-gray-900">Shopping Cart</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {cartItems.map((item, index) => {
                            const discountedPrice = getDiscountedPrice(item.product);
                            const hasDiscount = discountedPrice < item.product.price;
                            const itemTotal = discountedPrice * item.quantity;
                            const maxStock = item.product.stockQuantity || 999; // Fallback if stockQuantity is undefined

                            return (
                                <div key={item.product._id || `cart-item-${index}`} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg">
                                    <div className="w-16 h-16 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden">{item.product.images && item.product.images.length > 0 ? <Image src={urlFor(item.product.images[0]).url()} alt={item.product.name} width={64} height={64} className="object-cover w-full h-full" /> : <span className="text-gray-400 text-xs">Image</span>}</div>

                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                                        <div className="flex items-center gap-2">
                                            {hasDiscount ? (
                                                <>
                                                    <p className="text-primary font-semibold">${discountedPrice.toFixed(2)}</p>
                                                    <p className="text-gray-400 line-through text-sm">${item.product.price.toFixed(2)}</p>
                                                    {item.product.discount && <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">-{item.product.discount.discountType === "percentage" ? `${item.product.discount.discount}%` : `$${item.product.discount.discount}`}</span>}
                                                </>
                                            ) : (
                                                <p className="text-primary font-semibold">${item.product?.price?.toFixed(2) || "0.00"}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.product._id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-8 h-8 p-0 disabled:opacity-50 disabled:cursor-not-allowed">
                                            <Minus className="w-4 h-4" />
                                        </Button>

                                        <Input
                                            type="text"
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value) || 1;
                                                if (value >= 1 && value <= maxStock) {
                                                    updateQuantity(item.product._id, value);
                                                }
                                            }}
                                            className="w-16 text-center"
                                            min="1"
                                            max={maxStock}
                                        />

                                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.product._id, item.quantity + 1)} disabled={item.quantity >= maxStock} className="w-8 h-8 p-0 disabled:opacity-50 disabled:cursor-not-allowed">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">${itemTotal.toFixed(2)}</p>
                                    </div>

                                    <Button variant="ghost" size="sm" onClick={() => removeItem(item.product._id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="border border-gray-200 rounded-lg shadow-none">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-900">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>

                        {totalDiscount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Discount</span>
                                <span className="text-green-600 font-medium">-${totalDiscount.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                        </div>

                        {shipping > 0 && <div className="text-xs text-primary bg-primary/5 p-2 rounded">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</div>}

                        <div className="border-t border-gray-200 pt-3">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
                                <Link href="/checkout">Proceed to Checkout</Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/products">Continue Shopping</Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
