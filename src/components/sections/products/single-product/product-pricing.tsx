import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/products.utils";

interface ProductPricingProps {
    finalPrice: number;
    originalPrice: number;
    isDiscounted: boolean;
    discountPercentage: number;
    discountAmount: number;
}

const ProductPricing = ({ finalPrice, originalPrice, isDiscounted, discountPercentage, discountAmount }: ProductPricingProps) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(finalPrice)}</span>
                {isDiscounted && (
                    <>
                        <span className="text-xl text-gray-500 line-through">{formatPrice(originalPrice)}</span>
                        <Badge variant="destructive" className="bg-pink-100 text-pink-800 border-pink-200">
                            <span className="text-xs">{discountPercentage}% Off</span>
                        </Badge>
                        <Badge variant="destructive" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <span className="text-xs">You save</span>
                            {formatPrice(discountAmount)}
                        </Badge>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductPricing;
