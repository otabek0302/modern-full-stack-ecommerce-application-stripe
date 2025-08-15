import React from "react";
import Link from "next/link";
import Image from "next/image";

import { SectionType } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity.client";
import { ArrowRight } from "lucide-react";

const DiscountBanners = ({ sections }: { sections: SectionType[] }) => {
    const banner_1 = sections.find((section: SectionType) => section.slug.current === "discount-banner-1");
    const banner_2 = sections.find((section: SectionType) => section.slug.current === "discount-banner-2");
    const banner_3 = sections.find((section: SectionType) => section.slug.current === "discount-banner-3");

    return (
        <section className="relative py-8">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Banner 1 */}
                    {banner_1 && (
                        <div className="relative px-6 py-8 h-[640px] border border-gray-200 rounded-xl overflow-hidden hover:shadow-[2px_2px_5px_#1B5FFE50] group">
                            <div className="relative z-10 w-fit mx-auto space-y-4 text-center">
                                <p className="text-white text-xl font-normal leading-relaxed">{banner_1?.text.text}</p>
                                <h2 className="text-white text-5xl font-bold leading-tight">{banner_1?.text.title}</h2>
                                <p className="flex items-center justify-center gap-2">
                                    <span className="text-white text-xl font-normal leading-none">{banner_1?.text.span}</span>
                                    <span className="text-white text-sm font-bold bg-primary rounded-full flex items-center justify-center px-4 py-1.5">{banner_1?.text.discount}%</span>
                                </p>
                                <Button variant="primary" size="clear" className="px-10 h-12 mt-10 rounded-3xl" asChild>
                                    <Link href="/products" className="flex items-center justify-center">
                                        <span className="text-white text-lg font-medium">Shop Now</span>
                                        <ArrowRight className="w-8 h-8" />
                                    </Link>
                                </Button>
                            </div>
                            <Image src={urlFor(banner_1.image).url()} alt={banner_1.title} fill className="object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/80 transition-all duration-300" />
                        </div>
                    )}
                    {/* Banner 2 */}
                    {banner_2 && (
                        <div className="relative px-6 py-8 h-[640px] border border-gray-200 rounded-xl overflow-hidden hover:shadow-[2px_2px_5px_#1B5FFE50] group">
                            <div className="relative z-10 w-fit mx-auto space-y-4 text-center">
                                <p className="text-white text-xl font-normal leading-relaxed">{banner_2?.text.text}</p>
                                <h2 className="text-white text-5xl font-bold leading-tight">{banner_2?.text.title}</h2>
                                <p className="flex items-center justify-center gap-2">
                                    <span className="text-white text-xl font-normal leading-none">{banner_2?.text.span}</span>
                                    <span className="text-white text-sm font-bold bg-primary rounded-full flex items-center justify-center px-4 py-1.5">{banner_2?.text.discount}%</span>
                                </p>
                                <Button variant="primary" size="clear" className="px-10 h-12 mt-10 rounded-3xl" asChild>
                                    <Link href="/products" className="flex items-center justify-center">
                                        <span className="text-white text-lg font-medium">Shop Now</span>
                                        <ArrowRight className="w-8 h-8" />
                                    </Link>
                                </Button>
                            </div>
                            <Image src={urlFor(banner_2.image).url()} alt={banner_2.title} fill className="object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/80 transition-all duration-300" />
                        </div>
                    )}
                    {/* Banner 3 */}
                    {banner_3 && (
                        <div className="relative px-6 py-8 h-[640px] border border-gray-200 rounded-xl overflow-hidden hover:shadow-[2px_2px_5px_#1B5FFE50] group">
                            <div className="relative z-10 w-fit mx-auto space-y-4 text-center">
                                <p className="text-white text-xl font-normal leading-relaxed">{banner_3?.text.text}</p>
                                <h2 className="text-white text-5xl font-bold leading-tight">{banner_3?.text.title}</h2>
                                <p className="flex items-center justify-center gap-2">
                                    <span className="text-white text-xl font-normal leading-none">{banner_3?.text.span}</span>
                                    <span className="text-white text-sm font-bold bg-primary rounded-full flex items-center justify-center px-4 py-1.5">{banner_3?.text.discount}%</span>
                                </p>
                                <Button variant="primary" size="clear" className="px-10 h-12 mt-10 rounded-3xl" asChild>
                                    <Link href="/products" className="flex items-center justify-center">
                                        <span className="text-white text-lg font-medium">Shop Now</span>
                                        <ArrowRight className="w-8 h-8" />
                                    </Link>
                                </Button>
                            </div>
                            <Image src={urlFor(banner_3.image).url()} alt={banner_3.title} fill className="object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/80 transition-all duration-300" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default DiscountBanners;
