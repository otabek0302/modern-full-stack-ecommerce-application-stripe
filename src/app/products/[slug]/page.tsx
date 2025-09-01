"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { client } from "@/lib/sanity.client";
import { ProductType } from "@/interfaces";
import { calculateDiscountedPrice } from "@/lib/products.utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductDetailLoading from "@/components/sections/products/single-product/single-product-detail-loading";
import ProductNotFound from "@/components/sections/products/single-product/product-not-found";
import ProductImages from "@/components/sections/products/single-product/product-images";
import ProductHeader from "@/components/sections/products/single-product/product-header";
import ProductPricing from "@/components/sections/products/single-product/product-pricing";
import ProductSharing from "@/components/sections/products/single-product/product-sharing";
import ProductActions from "@/components/sections/products/single-product/product-actions";
import ProductMeta from "@/components/sections/products/single-product/product-meta";
import ProductTabs from "@/components/sections/products/single-product/product-tabs";

const ProductDetailPage = () => {
    const params = useParams();
    const [product, setProduct] = useState<ProductType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState("descriptions");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await client.fetch<ProductType>(
                    `*[_type == "product" && slug.current == $slug][0]{
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
                    }`,
                    { slug: params.slug }
                );

                setProduct(productData);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.slug) {
            fetchProduct();
        }
    }, [params.slug]);

    if (isLoading) {
        return <ProductDetailLoading />;
    }

    if (!product) {
        return <ProductNotFound />;
    }

    const { finalPrice, discountAmount, isDiscounted } = calculateDiscountedPrice(product.price, product.discount);
    const inStock = product.stockQuantity > 0;
    const discountPercentage = isDiscounted && product.discount?.discountType === "percentage" ? product.discount.discount : isDiscounted ? Math.round(((product.price - finalPrice) / product.price) * 100) : 0

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link href="/products" className="text-primary hover:text-primary/80 flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="text-gray-600">Back to Products</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Product Images */}
                <ProductImages images={product.images as []} selectedImage={selectedImage} onImageSelect={setSelectedImage} />

                {/* Product Info */}
                <div className="space-y-6">
                    <ProductHeader name={product.name} inStock={inStock} />

                    <ProductPricing finalPrice={finalPrice} originalPrice={product.price} isDiscounted={isDiscounted} discountPercentage={discountPercentage} discountAmount={discountAmount} />

                    <ProductSharing />

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">{product.details}</p>

                    <ProductActions stockQuantity={product.stockQuantity} product={product} />

                    <ProductMeta category={product.category.name} tags={product.tags} />
                </div>
            </div>

            {/* Tabs Section */}
            <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} details={product.details} features={product.features} category={product.category.name} stockQuantity={product.stockQuantity} tags={product.tags} />
        </div>
    );
};

export default ProductDetailPage;
