import React from "react";
import Link from "next/link";
import ProductCart from "../products/product-cart";

import { ProductType } from "@/interfaces";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PopularProducts = ({ products }: { products: ProductType[] }) => {
    const filteredProducts = products?.slice(0, 8);

    if (!filteredProducts) return null;

    return (
        <section className="relative py-8">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-900 text-2xl font-semibold leading-none">Popular Products</h3>
                    <Button variant="link" asChild className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                        <Link href="/products">
                            <span className="text-sm font-medium">View All</span>
                            <ArrowRight className="w-4 h-4 text-primary" />
                        </Link>
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts?.map((product) => (
                        <ProductCart key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularProducts;
