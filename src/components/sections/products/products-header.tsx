import React from "react";

interface ProductsHeaderProps {
    totalProducts: number;
    filteredProducts: number;
}

const ProductsHeader = ({ totalProducts, filteredProducts }: ProductsHeaderProps) => {
    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Products</h2>
            <p className="text-gray-600">
                Showing {filteredProducts} of {totalProducts} products
            </p>
        </div>
    );
};

export default ProductsHeader;
