import React from "react";

const ProductSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            {/* Product image skeleton */}
            <div className="relative">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
                {/* Discount badge skeleton */}
                <div className="absolute top-2 left-2 w-12 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                {/* Wishlist button skeleton */}
                <div className="absolute top-2 right-2 w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            
            {/* Product content skeleton */}
            <div className="p-4 space-y-3">
                {/* Category skeleton */}
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
                
                {/* Title skeleton */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
                
                {/* Rating skeleton */}
                <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-8 ml-2"></div>
                </div>
                
                {/* Price skeleton */}
                <div className="flex items-center space-x-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-12 line-through"></div>
                </div>
                
                {/* Description skeleton */}
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
                
                {/* Tags skeleton */}
                <div className="flex flex-wrap gap-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                    ))}
                </div>
                
                {/* Button skeleton */}
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-full"></div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
