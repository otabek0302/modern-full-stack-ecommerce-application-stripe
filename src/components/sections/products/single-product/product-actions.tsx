import React from "react";
import QuantityCounter from "@/components/ui/quantity-counter";

import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart } from "lucide-react";
import { useStateContext } from "@/contexts/state-context";
import { ProductType } from "@/interfaces";

interface ProductActionsProps {
    stockQuantity: number;
    product: ProductType;
}

const ProductActions = ({ stockQuantity, product }: ProductActionsProps) => {
    const { onAddToCart, qty, checkProductInCart } = useStateContext();

    const handleAddToCart = () => {
        onAddToCart(product, qty);
    };

    return (
        <div className="flex items-center justify-between gap-4">
            <div className="shrink-0">
                <QuantityCounter stockQuantity={stockQuantity} />
            </div>
            <div className="flex-1">
                <Button variant="default" size="lg" className="w-full h-12 rounded-full cursor-pointer" disabled={!stockQuantity || checkProductInCart} onClick={handleAddToCart}>
                    <ShoppingBag className="w-6 h-6 mr-2" />
                    <span className="text-white text-base font-medium">Add to Cart</span>
                </Button>
            </div>
            <div className="shrink-0">
                <Button variant="outline" size="icon" className="w-12 h-12 border-primary/20 rounded-full bg-primary/20 hover:bg-primary">
                    <Heart className="w-6 h-6 text-primary" />
                </Button>
            </div>
        </div>
    );
};

export default ProductActions;
