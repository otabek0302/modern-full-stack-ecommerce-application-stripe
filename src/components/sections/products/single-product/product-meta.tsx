import React from "react";

interface ProductMetaProps {
    category: string;
    tags: string[];
}

const ProductMeta = ({ category, tags }: ProductMetaProps) => {
    return (
        <div className="space-y-3 pt-4 border-t">
            <div className="text-sm">
                <span className="font-semibold text-gray-900">Category: </span>
                <span className="text-gray-600">{category}</span>
            </div>
            <div className="text-sm">
                <span className="font-semibold text-gray-900">Tag: </span>
                <span className="text-gray-600">{tags.join(", ")}</span>
            </div>
        </div>
    );
};

export default ProductMeta;
