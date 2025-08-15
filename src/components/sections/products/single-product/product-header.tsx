import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ProductHeaderProps {
    name: string;
    inStock: boolean;
}

const ProductHeader = ({ name, inStock }: ProductHeaderProps) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
                {inStock && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        In Stock
                    </Badge>
                )}
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                    ))}
                </div>
                <span className="text-gray-600">4 Review</span>
            </div>
        </div>
    );
};

export default ProductHeader;
