"use client";

import React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import FilterBar from "@/components/sections/products/filter-bar";
import ProductsGrid from "@/components/sections/products/products-grid";
import ProductsHeader from "@/components/sections/products/products-header";
import ProductsLoading from "@/components/sections/products/products-loading";
import ProductsEmptyList from "@/components/sections/products/products-empty-list";
import ProductsNotFound from "@/components/sections/products/products-not-found";

import { client } from "@/lib/sanity.client";
import { CategoryType, ProductType } from "@/interfaces/index";
import { getUniqueTags, getPriceRange, getCategoryCounts, applyFilters, type FiltersType } from "@/lib/products.utils";

const ProductsPage = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [allProducts, setAllProducts] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [categoriesData, productsData] = await Promise.all([
                    client.fetch<CategoryType[]>(`*[_type == "category"]`),
                    client.fetch<ProductType[]>(`*[_type == "product"]{
                        _id,
                        name,
                        slug,
                        details,
                        description,
                        price,
                        images,
                        "category": category->{
                            _id,
                            name,
                            slug
                        },
                        tags,
                        discount->{
                            _id,
                            discount,
                            discountType,
                            startDate,
                            endDate,
                            isActive
                        },
                        stockQuantity,
                        dimensions,
                        features,
                        publishedAt
                    }`),
                ]);

                setCategories(categoriesData);
                setAllProducts(productsData);
                setProducts(productsData);

                // Extract tags from products
                const allTags = getUniqueTags(productsData);
                setTags(allTags);
            } catch (error) {
                // Error fetching initial data - silent fail for production
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Handle filter changes
    const handleFiltersChange = useCallback(
        (filters: FiltersType) => {
            setIsLoading(true);

            // Apply filters locally
            const filteredProducts = applyFilters(allProducts, filters);
            setProducts(filteredProducts);

            // Simulate loading delay for better UX
            setTimeout(() => setIsLoading(false), 300);
        },
        [allProducts]
    );

    // Calculate derived data with useMemo
    const categoriesWithCount = useMemo(() => {
        return getCategoryCounts(categories, allProducts);
    }, [categories, allProducts]);

    const { minPrice, maxPrice } = useMemo(() => {
        return getPriceRange(allProducts);
    }, [allProducts]);

    // Show loading state for initial load
    if (isInitialLoading) {
        return <ProductsLoading />;
    }

    // Show not found if no products exist
    if (allProducts.length === 0) {
        return <ProductsNotFound />;
    }

    return (
        <div className="flex gap-6">
            <FilterBar categories={categoriesWithCount} tags={tags} minPrice={minPrice} maxPrice={maxPrice} onFiltersChange={handleFiltersChange} />

            <div className="flex-1">
                <ProductsHeader totalProducts={allProducts.length} filteredProducts={products.length} />

                {/* Products grid with loading state */}
                <ProductsGrid products={products} isLoading={isLoading} />
                
                {/* Empty state when no products and not loading */}
                {products.length === 0 && !isLoading && <ProductsEmptyList />}
            </div>
        </div>
    );
};

export default ProductsPage;
