import { ProductType, CategoryType } from "@/interfaces";

export interface FiltersType {
    category: string;
    rating: string;
    tags: string[];
    priceRange: [number, number];
}

// Extract and process unique tags from products
export const getUniqueTags = (products: ProductType[]): string[] => {
    const allTags = products
        .flatMap((product) => product.tags || [])
        .filter((tag, index, self) => self.indexOf(tag) === index);
    
    return allTags.sort();
};

// Calculate price range from products
export const getPriceRange = (products: ProductType[]): { minPrice: number; maxPrice: number } => {
    const prices = products
        .map((product) => product.price)
        .filter((price) => price > 0);

    return {
        minPrice: prices.length > 0 ? Math.min(...prices) : 0,
        maxPrice: prices.length > 0 ? Math.max(...prices) : 2000,
    };
};

// Calculate category counts
export const getCategoryCounts = (categories: CategoryType[], allProducts: ProductType[]) => {
    return categories.map((category) => ({
        ...category,
        count: allProducts.filter((product) => product.category._id === category._id).length,
    }));
};

// Filter products by category
export const filterProductsByCategory = (products: ProductType[], categoryId: string): ProductType[] => {
    if (!categoryId) return products;
    return products.filter((product) => product.category._id === categoryId);
};

// Filter products by price range
export const filterProductsByPrice = (products: ProductType[], minPrice: number, maxPrice: number): ProductType[] => {
    return products.filter((product) => product.price >= minPrice && product.price <= maxPrice);
};

// Filter products by tags
export const filterProductsByTags = (products: ProductType[], tags: string[]): ProductType[] => {
    if (!tags.length) return products;
    return products.filter((product) => 
        tags.some((tag) => product.tags?.includes(tag))
    );
};

// Apply all filters to products
export const applyFilters = (products: ProductType[], filters: FiltersType): ProductType[] => {
    let filteredProducts = products;

    if (filters.category) {
        filteredProducts = filterProductsByCategory(filteredProducts, filters.category);
    }

    if (filters.priceRange) {
        filteredProducts = filterProductsByPrice(filteredProducts, filters.priceRange[0], filters.priceRange[1]);
    }

    if (filters.tags.length > 0) {
        filteredProducts = filterProductsByTags(filteredProducts, filters.tags);
    }

    // Rating filter can be implemented later when rating data is available
    // if (filters.rating) { ... }

    return filteredProducts;
};

// Utility functions for discounts and pricing
/**
 * Calculate the discounted price for a product (old signature for backward compatibility)
 * @param originalPrice - The original price
 * @param discount - The discount object
 * @returns Object with finalPrice, discountAmount, and isDiscounted
 */
export function calculateDiscountedPrice(
    originalPrice: number,
    discount?: {
        discount: number;
        discountType: "percentage" | "fixed";
        isActive: boolean;
        startDate?: string;
        endDate?: string;
    }
): { finalPrice: number; discountAmount: number; isDiscounted: boolean } {
    if (!discount || !isDiscountValid(discount)) {
        return {
            finalPrice: originalPrice,
            discountAmount: 0,
            isDiscounted: false,
        };
    }

    let discountAmount = 0;
    if (discount.discountType === "percentage") {
        discountAmount = (originalPrice * discount.discount) / 100;
    } else {
        discountAmount = discount.discount;
    }

    const finalPrice = Math.max(0, originalPrice - discountAmount);

    return {
        finalPrice,
        discountAmount,
        isDiscounted: true,
    };
}

/**
 * Calculate the discounted price for a product (new signature for checkout system)
 * @param product - The product object
 * @returns The discounted price or original price if no discount
 */
export const getDiscountedPrice = (product: ProductType): number => {
    if (!product.discount?.isActive) return product.price;

    const now = new Date();
    const startDate = new Date(product.discount.startDate);
    const endDate = new Date(product.discount.endDate);

    if (now < startDate || now > endDate) return product.price;

    if (product.discount.discountType === "percentage") {
        return product.price * (1 - product.discount.discount / 100);
    }

    if (product.discount.discountType === "fixed") {
        return Math.max(0, product.price - product.discount.discount);
    }

    return product.price;
};

export function formatPrice(price: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
}

export function isDiscountValid(discount: {
    isActive: boolean;
    startDate?: string;
    endDate?: string;
}): boolean {
    if (!discount.isActive) return false;

    const now = new Date();

    if (discount.startDate && new Date(discount.startDate) > now) return false;
    if (discount.endDate && new Date(discount.endDate) < now) return false;

    return true;
}