import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/lib/sanity.client";
import { Heart, Eye, Star, ShoppingBag } from "lucide-react";
import { ProductType } from "@/interfaces";
import { calculateDiscountedPrice, formatPrice } from "@/lib/products.utils";

const ProductCart = ({ product, className }: { product: ProductType; className?: string }) => {
    const { finalPrice, discountAmount, isDiscounted } = calculateDiscountedPrice(product.price, product.discount);
    const inStock = product.stockQuantity > 0;

    return (
        <Card key={product._id} className={`group p-4 transition-all duration-200 shadow-none hover:shadow-[2px_2px_10px_#1B5FFE50] ${inStock ? "hover:border-primary" : "hover:border-gray-300"} ${className}`}>
            <CardContent className="relative p-0">
                {/* Stock Status Badge */}
                {!inStock && (
                    <Badge variant="secondary" className="absolute top-2 left-2 z-10">
                        Out of Stock
                    </Badge>
                )}

                {/* Discount Badge */}
                {isDiscounted && (
                    <Badge variant="destructive" className="absolute top-2 left-2 z-10">
                        {product.discount?.discountType === "percentage" ? `-${product.discount.discount}%` : `-$${product.discount?.discount}`}
                    </Badge>
                )}

                {/* Action Icons */}
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                    <Button variant="default" size="icon" className="border bg-gray-100 border-gray-100 hover:bg-primary text-gray-600 hover:text-white cursor-pointer">
                        <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="default" size="icon" className="border bg-gray-100 border-gray-100 hover:bg-primary text-gray-600 hover:text-white cursor-pointer">
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>

                {/* Product Image - Clickable */}
                <Link href={`/products/${product.slug.current}`} className="block">
                    <div className="relative w-full h-72 mb-4 overflow-hidden rounded-2xl">
                        <Image src={urlFor(product.images[0]).url()} alt={product.name} fill className="object-contain object-center group-hover:scale-105 transition-transform duration-300" />
                    </div>
                </Link>

                {/* Product Info */}
                <div className="space-y-2">
                    <Link href={`/products/${product.slug.current}`} className="block">
                        <h4 className="text-gray-900 text-base font-medium group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">{product.name}</h4>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < 4 ? "text-orange-400 fill-current" : "text-gray-300"}`} />
                        ))}
                        <span className="text-sm text-gray-500 ml-1">(3.4)</span>
                    </div>

                    {/* Price Display */}
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">{formatPrice(finalPrice)}</span>
                        {isDiscounted && <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>}
                    </div>

                    {/* Savings Display */}
                    {isDiscounted && <div className="text-sm text-green-600 font-medium">You save {formatPrice(discountAmount)}!</div>}
                </div>

                {/* Add to Cart Button */}
                <Button variant="default" size="icon" className={`absolute bottom-2 right-2 w-12 h-12 rounded-full ${inStock ? "bg-gray-100 hover:bg-primary text-gray-600 hover:text-white cursor-pointer" : "bg-gray-200 text-gray-600 cursor-not-allowed"}`} disabled={!inStock}>
                    <ShoppingBag className="h-6 w-6" />
                </Button>
            </CardContent>
        </Card>
    );
};

export default ProductCart;
