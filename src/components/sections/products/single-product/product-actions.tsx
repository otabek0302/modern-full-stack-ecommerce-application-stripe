import React from "react";
import QuantityCounter from "@/components/ui/quantity-counter";

import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Trash } from "lucide-react";
import { useStateContext } from "@/contexts/state-context";
import { useUserContext } from "@/contexts/user-context";
import { ProductType } from "@/interfaces";

interface ProductActionsProps {
    stockQuantity: number;
    product: ProductType;
}

const ProductActions = ({ stockQuantity, product }: ProductActionsProps) => {
    const { onAddToCart, qty, isProductInCart, onAddToWishlist, onRemoveFromWishlist, isProductInWishlist, addToCartServer, addToWishlistServer, removeFromWishlistServer } = useStateContext();
    const { user, isAuthenticated } = useUserContext();

    const handleAddToCart = async () => {
        // Local operation for instant UI update
        onAddToCart(product, qty);
        
        // Server operation if user is authenticated
        if (isAuthenticated && user?._id) {
            try {
                await addToCartServer(user._id, product._id);
            } catch (error) {
                console.error('Error adding to cart on server:', error);
            }
        }
    };

    const handleAddToWishlist = async () => {
        // Local operation for instant UI update
        onAddToWishlist(product);
        
        // Server operation if user is authenticated
        if (isAuthenticated && user?._id) {
            try {
                await addToWishlistServer(user._id, product._id);
            } catch (error) {
                console.error('Error adding to wishlist on server:', error);
            }
        }
    };

    const handleRemoveFromWishlist = async () => {
        // Local operation for instant UI update
        onRemoveFromWishlist(product);
        
        // Server operation if user is authenticated
        if (isAuthenticated && user?._id) {
            try {
                await removeFromWishlistServer(user._id, product._id);
            } catch (error) {
                console.error('Error removing from wishlist on server:', error);
            }
        }
    };

    return (
        <div className="flex items-center justify-between gap-4">
            <div className="shrink-0">
                <QuantityCounter stockQuantity={stockQuantity} />
            </div>
            <div className="flex-1">
                <Button variant="default" size="lg" className="w-full h-12 rounded-full cursor-pointer" disabled={!stockQuantity || isProductInCart(product._id)} onClick={handleAddToCart}>
                    <ShoppingBag className="w-6 h-6 mr-2" />
                    <span className="text-white text-base font-medium">Add to Cart</span>
                </Button>
            </div>
            <div className="shrink-0">
                {
                    isProductInWishlist(product._id) ? (
                        <Button variant="outline" size="icon" className="group w-12 h-12 border-red-500 rounded-full bg-red-500 hover:bg-red-500" onClick={handleRemoveFromWishlist}>
                            <Trash className="w-6 h-6 text-white group-hover:text-white" />
                        </Button>
                    ) : (
                        <Button variant="outline" size="icon" className="group w-12 h-12 border-primary/20 rounded-full bg-primary/20 hover:bg-primary" onClick={handleAddToWishlist}>
                            <Heart className="w-6 h-6 text-primary group-hover:text-white" />
                        </Button>
                    )
                }
            </div>
        </div>
    );
};

export default ProductActions;
