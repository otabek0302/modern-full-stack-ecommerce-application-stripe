import React from "react";
import Link from "next/link";
import ProductCart from "../products/product-cart";
import Image from "next/image";

import { ProductType } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Heart, Eye, Star, ShoppingBag } from "lucide-react";
import { calculateDiscountedPrice, formatPrice } from "@/lib/products.utils";
import { urlFor } from "@/lib/sanity.client";

const HotProducts = ({ products }: { products: ProductType[] }) => {
    const filteredProducts = products?.slice(0, 9);
    const featuredProduct = products?.[0];

    if (!filteredProducts || !featuredProduct) return null;

    const { finalPrice, isDiscounted } = calculateDiscountedPrice(featuredProduct.price, featuredProduct.discount);

    return (
        <section className="relative py-8">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-900 text-2xl font-semibold leading-none">Hot Deals</h3>
                    <Button variant="link" asChild className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                        <Link href="/products">
                            <span className="text-sm font-medium">View All</span>
                            <ArrowRight className="w-4 h-4 text-primary" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Featured Product Card (Left) */}
                    <div className="lg:col-span-1">
                        <div className="relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary hover:shadow-[2px_2px_10px_#1B5FFE50] transition-shadow duration-300">
                            {/* Sale Badges */}
                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                {isDiscounted && (
                                    <Badge variant="destructive" className="text-xs font-bold">
                                        Sale {featuredProduct.discount?.discount}%
                                    </Badge>
                                )}
                                <Badge className="bg-blue-600 text-white text-xs font-bold">Best Sale</Badge>
                            </div>

                            {/* Action Icons */}
                            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                                <Button variant="default" size="icon" className="w-8 h-8 bg-white/80 hover:bg-white border border-gray-200">
                                    <Heart className="h-4 w-4 text-gray-600" />
                                </Button>
                                <Button variant="default" size="icon" className="w-8 h-8 bg-white/80 hover:bg-white border border-gray-200">
                                    <Eye className="h-4 w-4 text-gray-600" />
                                </Button>
                            </div>

                            {/* Product Image */}
                            <div className="relative w-full h-64 mb-4 overflow-hidden rounded-xl">
                                <Image src={urlFor(featuredProduct.images[0]).url()} alt={featuredProduct.name} fill className="object-cover object-center hover:scale-105 transition-transform duration-300" />
                            </div>

                            {/* Product Info */}
                            <div className="space-y-3">
                                <h4 className="text-gray-900 text-lg font-semibold text-center">{featuredProduct.name}</h4>

                                {/* Price */}
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-xl font-bold text-gray-900">{formatPrice(finalPrice)}</span>
                                    {isDiscounted && <span className="text-lg text-gray-500 line-through">{formatPrice(featuredProduct.price)}</span>}
                                </div>

                                {/* Rating */}
                                <div className="flex items-center justify-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-4 w-4 ${i < 4 ? "text-orange-400 fill-current" : "text-gray-300"}`} />
                                    ))}
                                    <span className="text-sm text-gray-500 ml-1">(524 Feedback)</span>
                                </div>

                                {/* Countdown Timer */}
                                <div className="bg-gray-100 rounded-xl p-4">
                                    <p className="text-sm text-gray-600 text-center mb-3">Hurry up ! Offer ends In:</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        <div className="text-center">
                                            <div className="bg-primary text-white rounded-lg px-2 py-2 mb-1">
                                                <span className="text-sm font-bold">01</span>
                                            </div>
                                            <span className="text-xs text-gray-600">DAYS</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="bg-primary text-white rounded-lg px-2 py-2 mb-1">
                                                <span className="text-sm font-bold">23</span>
                                            </div>
                                            <span className="text-xs text-gray-600">HOURS</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="bg-primary text-white rounded-lg px-2 py-2 mb-1">
                                                <span className="text-sm font-bold">34</span>
                                            </div>
                                            <span className="text-xs text-gray-600">MINS</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="bg-primary text-white rounded-lg px-2 py-2 mb-1">
                                                <span className="text-sm font-bold">57</span>
                                            </div>
                                            <span className="text-xs text-gray-600">SECS</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Add to Cart Button */}
                                <Button variant="primary" size="lg" className="w-full rounded-lg">
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                    <span className="text-white text-lg font-medium">Add to Cart</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid (Right) */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredProducts?.map((product) => {
                                return <ProductCart key={product._id} product={product} className="" />;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HotProducts;
