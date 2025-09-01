import React from "react";
import { PackageX } from "lucide-react";

const ProductsNotFound = () => {
    return (
        <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <PackageX className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products available
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                We&apos;re currently updating our product catalog. 
                Please check back later for new products.
            </p>
        </div>
    );
};

export default ProductsNotFound;
