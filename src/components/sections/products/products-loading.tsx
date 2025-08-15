import React from "react";
import ProductSkeleton from "./product-skeleton";

const ProductsLoading = () => {
    return (
        <div className="flex gap-6">
            {/* Filter sidebar skeleton */}
            <div className="flex-1 max-w-sm bg-white rounded-2xl p-6 shadow-[1px_1px_2px_#1B5FFE20] sticky top-6">
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded-lg mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Products grid skeleton */}
            <div className="flex-1">
                <div className="mb-6">
                    <div className="h-8 bg-gray-200 rounded-lg mb-2 w-1/3 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded-lg w-1/4 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductsLoading;
