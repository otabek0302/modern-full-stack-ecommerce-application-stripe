import React from "react";
import ProductCart from "./product-cart";
import ProductSkeleton from "./product-skeleton";
import { ProductType } from "@/interfaces";

interface ProductsGridProps {
    products: ProductType[];
    isLoading?: boolean;
}

const ProductsGrid = ({ products, isLoading }: ProductsGridProps) => {
    // Show skeleton products when loading
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        );
    }

    // Show actual products when not loading and products exist
    if (products.length > 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product: ProductType) => (
                    <ProductCart key={product._id} product={product} />
                ))}
            </div>
        );
    }

    return null;
};

export default ProductsGrid;