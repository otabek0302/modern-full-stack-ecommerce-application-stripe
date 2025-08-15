import React from "react";

const ProductDetailLoading = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
                {/* Breadcrumb skeleton */}
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left side - Images skeleton */}
                    <div className="space-y-4">
                        {/* Main image skeleton */}
                        <div className="h-96 bg-gray-200 rounded-lg"></div>
                        
                        {/* Thumbnail images skeleton */}
                        <div className="flex space-x-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-20 w-20 bg-gray-200 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Right side - Product info skeleton */}
                    <div className="space-y-6">
                        {/* Category skeleton */}
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        
                        {/* Title skeleton */}
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                        
                        {/* Rating skeleton */}
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-5 h-5 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                        </div>
                        
                        {/* Price skeleton */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="h-8 bg-gray-200 rounded w-24"></div>
                                <div className="h-6 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="h-5 bg-gray-200 rounded w-32"></div>
                        </div>
                        
                        {/* Description skeleton */}
                        <div className="space-y-3">
                            <div className="h-5 bg-gray-200 rounded w-24"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                        
                        {/* Features skeleton */}
                        <div className="space-y-3">
                            <div className="h-5 bg-gray-200 rounded w-20"></div>
                            <div className="space-y-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Tags skeleton */}
                        <div className="space-y-3">
                            <div className="h-5 bg-gray-200 rounded w-16"></div>
                            <div className="flex flex-wrap gap-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-6 bg-gray-200 rounded-full w-20"></div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Add to cart section skeleton */}
                        <div className="space-y-4 pt-6 border-t">
                            <div className="flex items-center gap-4">
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                <div className="flex items-center border rounded-lg">
                                    <div className="px-3 py-2 bg-gray-200 rounded-l w-8"></div>
                                    <div className="px-4 py-2 border-x w-12 bg-gray-200"></div>
                                    <div className="px-3 py-2 bg-gray-200 rounded-r w-8"></div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </div>
                            <div className="h-12 bg-gray-200 rounded w-full"></div>
                        </div>
                        
                        {/* Trust badges skeleton */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="text-center">
                                    <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailLoading;
