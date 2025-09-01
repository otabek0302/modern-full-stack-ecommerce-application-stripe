"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Heart } from "lucide-react";

import { useStateContext } from "@/contexts/state-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { urlFor } from "@/lib/sanity.client";
import { ProductType } from "@/interfaces";

// Utility functions
const formatCurrency = (amount: number, currency = "USD") => new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);

const getDiscountedPrice = (product: ProductType) => {
    if (!product.discount?.isActive) return product.price;

    const now = new Date();
    const startDate = new Date(product.discount.startDate);
    const endDate = new Date(product.discount.endDate);

    if (now < startDate || now > endDate) return product.price;

    if (product.discount.discountType === "percentage") {
        return product.price * (1 - product.discount.discount / 100);
    }

    if (product.discount.discountType === "fixed") {
        return Math.max(0, product.price - product.discount.discount);
    }

    return product.price;
};

// Components
const StockBadge = ({ inStock }: { inStock: boolean }) => <span className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-medium ${inStock ? "bg-primary/10 text-primary" : "bg-red-100 text-red-600"}`}>{inStock ? "In Stock" : "Out of Stock"}</span>;

const DiscountBadge = ({ discount }: { discount: ProductType["discount"] }) => {
    if (!discount) return null;

    const discountText = discount.discountType === "percentage" ? `${discount.discount}%` : `$${discount.discount}`;

    return <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">-{discountText}</span>;
};

const EmptyWishlist = () => (
    <div className="p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg font-medium mb-2">Your wishlist is empty</p>
        <p className="text-gray-400 text-sm mb-4">Start shopping to add items to your wishlist!</p>
        <Link href="/products" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Start Shopping
        </Link>
    </div>
);

const WishlistItem = ({ product, onAddToCart, onRemove }: { product: ProductType; onAddToCart: (product: ProductType) => void; onRemove: (product: ProductType) => void }) => {
    const productUrl = product.slug?.current ? `/product/${product.slug.current}` : "#";
    const discountedPrice = getDiscountedPrice(product);
    const hasDiscount = discountedPrice < product.price;
    const isOutOfStock = product.stockQuantity <= 0;

    return (
        <div className="grid grid-cols-12 items-center gap-y-4 border-b border-gray-100 px-4 py-5 hover:bg-gray-50 transition-colors">
            {/* Product Info */}
            <div className="col-span-12 sm:col-span-6">
                <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100">{product.images?.[0] ? <Image src={urlFor(product.images[0]).width(64).height(64).fit("crop").url()} alt={product.name} fill sizes="64px" className="object-cover" /> : <span className="text-gray-400 text-xs">Image</span>}</div>
                    <Link href={productUrl} className="text-base font-medium hover:text-primary transition-colors">
                        {product.name}
                    </Link>
                </div>
            </div>

            {/* Price */}
            <div className="col-span-6 sm:col-span-2">
                <div className="flex items-center gap-2">
                    {hasDiscount ? (
                        <>
                            <span className="text-base font-semibold text-primary">{formatCurrency(discountedPrice)}</span>
                            <span className="text-sm text-gray-400 line-through">{formatCurrency(product.price)}</span>
                            <DiscountBadge discount={product.discount} />
                        </>
                    ) : (
                        <span className="text-base font-semibold text-gray-900">{formatCurrency(product.price)}</span>
                    )}
                </div>
            </div>

            {/* Stock Status */}
            <div className="col-span-3 sm:col-span-2">
                <StockBadge inStock={!isOutOfStock} />
            </div>

            {/* Actions */}
            <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-3">
                <Button className="rounded-full bg-primary hover:bg-primary/90 px-6" disabled={isOutOfStock} onClick={() => onAddToCart(product)}>
                    Add to Cart
                </Button>

                <button aria-label="Remove from wishlist" onClick={() => onRemove(product)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 transition-colors" title="Remove from wishlist">
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

const ShareSection = () => (
    <div className="flex items-center gap-4 px-4 py-5 border-t border-gray-100">
        <span className="text-sm text-gray-600">Share:</span>
        <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors" aria-label="Share on Facebook">
            f
        </Link>
        <Link href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Share on Twitter">
            <span className="text-xl">𝕏</span>
        </Link>
        <Link href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Share on Pinterest">
            <span className="text-xl">𝒑</span>
        </Link>
        <Link href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Share on Instagram">
            <span className="text-xl">◎</span>
        </Link>
    </div>
);

// Main Component
export default function WishlistPage() {
    const { wishlistItems, onAddToCart, onRemoveFromWishlist } = useStateContext();

    const handleAddToCart = (product: ProductType) => {
        if (product.stockQuantity <= 0) return;
        onAddToCart(product, 1);
    };

    const handleRemove = (product: ProductType) => {
        onRemoveFromWishlist(product);
    };

    return (
        <Card className="border border-gray-200 rounded-lg shadow-none">
            <CardHeader className="border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Wishlist</CardTitle>
                </div>
            </CardHeader>

            <CardContent className="pt-6">
                {/* Table Header */}
                <div className="grid grid-cols-12 items-center border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">
                    <div className="col-span-6 sm:col-span-6">Product</div>
                    <div className="col-span-2 hidden sm:block">Price</div>
                    <div className="col-span-2 hidden sm:flex">Stock Status</div>
                    <div className="col-span-2 hidden sm:flex justify-end"></div>
                </div>

                {/* Wishlist Items */}
                {wishlistItems.length === 0 ? <EmptyWishlist /> : wishlistItems.map((product) => <WishlistItem key={product._id} product={product} onAddToCart={handleAddToCart} onRemove={handleRemove} />)}

                {/* Share Section */}
                <ShareSection />
            </CardContent>
        </Card>
    );
}
