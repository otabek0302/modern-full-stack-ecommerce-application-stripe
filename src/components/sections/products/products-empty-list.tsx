import React from "react";
import { SearchX } from "lucide-react";

const ProductsEmptyList = () => {
    return (
        <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <SearchX className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                We couldn&apos;t find any products matching your current filters. 
                Try adjusting your search criteria or use the &ldquo;Clear All&rdquo; button in the filters panel.
            </p>
        </div>
    );
};

export default ProductsEmptyList;
