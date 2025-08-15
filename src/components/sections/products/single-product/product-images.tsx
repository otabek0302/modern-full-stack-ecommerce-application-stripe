import React from "react";
import Image from "next/image";

import { urlFor } from "@/lib/sanity.client";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductImagesProps {
    images: any[];
    selectedImage: number;
    onImageSelect: (index: number) => void;
}

const ProductImages = ({ images, selectedImage, onImageSelect }: ProductImagesProps) => {
    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full h-[500px] overflow-hidden rounded-2xl border shadow-[1px_1px_2px_#1B5FFE50] bg-white">
                <Image src={urlFor(images[selectedImage]).url()} fill alt="Product" className="object-contain object-center" />

                {/* Navigation Arrows */}
                <Button variant="default" size="icon" className="absolute top-4 left-4 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center border border-gray-200">
                    <ChevronUp className="w-5 h-5 text-gray-700" />
                </Button>
                <Button variant="default" size="icon" className="absolute bottom-4 left-4 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center border border-gray-200">
                    <ChevronDown className="w-5 h-5 text-gray-700" />
                </Button>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-3">
                {images.map((image, index) => (
                    <Button key={index} variant="default" size="icon" className={`relative w-24 h-24 rounded-lg border border-gray-100 hover:border-primary overflow-hidden shadow-[1px_1px_2px_#1B5FFE50] cursor-pointer transition-all ${selectedImage === index ? "border-primary shadow-md" : "border-gray-200 hover:border-gray-300"}`} onClick={() => onImageSelect(index)}>
                        <Image src={urlFor(image).url()} alt={`Product ${index + 1}`} fill className="object-cover scale-105" />
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default ProductImages;
