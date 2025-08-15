import React from "react";
import { ArrowLeft, PackageX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ProductNotFound = () => {
    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-md mx-auto">
                {/* Icon */}
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <PackageX className="w-12 h-12 text-gray-400" />
                </div>
                
                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Product Not Found
                </h1>
                
                {/* Description */}
                <p className="text-gray-600 mb-8 leading-relaxed">
                    The product you&apos;re looking for doesn&apos;t exist or may have been removed. 
                    Please check the URL or browse our product catalog.
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/products">
                        <Button className="bg-primary text-white hover:bg-primary/90 px-6 py-3">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Browse Products
                        </Button>
                    </Link>
                    
                    <Link href="/">
                        <Button variant="outline" className="px-6 py-3">
                            Go to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductNotFound;
