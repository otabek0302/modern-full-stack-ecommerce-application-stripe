"use client";

import React from "react";
import Image from "next/image";

import { ProductType } from "@/interfaces";
import { urlFor } from "@/lib/sanity.client";
import { getDiscountedPrice } from "@/lib/products.utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CheckoutOrderSummaryProps {
    cartItems: Array<{ product: ProductType; quantity: number }>;
}

const CheckoutOrderSummary: React.FC<CheckoutOrderSummaryProps> = ({ cartItems }) => {
    // Calculate cart totals
    const calculateTotals = () => {
        let subtotal = 0;
        let totalDiscount = 0;

        cartItems.forEach((item) => {
            const originalPrice = item.product.price * item.quantity;
            const discountedPrice = getDiscountedPrice(item.product) * item.quantity;
            subtotal += discountedPrice;
            totalDiscount += originalPrice - discountedPrice;
        });

        const shipping = subtotal > 50 ? 0 : 5.99;
        const total = subtotal + shipping;

        return { subtotal, totalDiscount, shipping, total };
    };

    const { subtotal, totalDiscount, shipping, total } = calculateTotals();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const formatCurrency = (amount: number) => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount);

    return (
        <div className="space-y-6">
            {/* Order Summary */}
            <Card className="border border-gray-200 rounded-lg shadow-none">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <CardTitle className="text-xl font-semibold text-gray-900">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {/* Cart Items */}
                    <div className="space-y-4 mb-6">
                        {cartItems.map((item) => {
                            const discountedPrice = getDiscountedPrice(item.product);
                            const hasDiscount = discountedPrice < item.product.price;
                            const itemTotal = discountedPrice * item.quantity;

                            return (
                                <div key={item.product._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="relative h-12 w-12 overflow-hidden rounded-md bg-gray-100 border border-gray-200">{item.product.images?.[0] ? <Image src={urlFor(item.product.images[0]).width(48).height(48).fit("crop").url()} alt={item.product.name} fill sizes="48px" className="object-cover" /> : <span className="text-gray-400 text-xs">Image</span>}</div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                            {item.product.name} x{item.quantity}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            {hasDiscount ? (
                                                <>
                                                    <span className="text-sm font-semibold text-primary">{formatCurrency(discountedPrice)}</span>
                                                    <span className="text-xs text-gray-400 line-through">{formatCurrency(item.product.price)}</span>
                                                </>
                                            ) : (
                                                <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.product.price)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(itemTotal)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Totals */}
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                                Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                            </span>
                            <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                        </div>

                        {totalDiscount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Discount</span>
                                <span className="text-green-600 font-medium">-{formatCurrency(totalDiscount)}</span>
                            </div>
                        )}

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium text-gray-900">{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                        </div>

                        {shipping > 0 && <div className="text-xs text-primary bg-primary/5 p-2 rounded border border-primary/10">Add {formatCurrency(50 - subtotal)} more for free shipping!</div>}

                        <div className="border-t border-gray-200 pt-3">
                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="text-center text-xs text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-100">🔒 Your payment information is secure and encrypted</div>
        </div>
    );
};

export default CheckoutOrderSummary;
