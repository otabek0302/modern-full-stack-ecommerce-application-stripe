import React from "react";
import Image from "next/image";
import Link from "next/link";

import { SectionType } from "@/interfaces";
import { urlFor } from "@/lib/sanity.client";
import { Button } from "@/components/ui/button";

const Hero = ({ sections }: { sections: SectionType[] }) => {
    const hero = sections?.find((section: SectionType) => section.slug.current === "hero-section");
    
    if (!hero) return null;
    
    return (
        <section className="relative py-4">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="relative flex items-center justify-start rounded-3xl overflow-hidden">
                    <div className="max-w-2xl text-left px-16 py-32 z-10">
                        <h1 className="text-white text-7xl font-bold leading-tight mb-8">{hero?.text.title}</h1>
                        <div className="mb-8 pl-2 border-l-[2px] border-primary">
                            <p className="flex items-center gap-2">
                                <span className="text-white text-xl font-bold leading-none">{hero?.text.span}</span>
                                <span className="text-white text-sm font-bold bg-primary rounded-full flex items-center justify-center px-4 py-1.5">{hero?.text.discount}%</span>
                            </p>
                            <p className="text-white text-xl font-normal">{hero?.text.text}</p>
                        </div>
                        <Button variant="primary" size="lg" className="px-10 h-12 rounded-xl" asChild>
                            <Link href="/products">
                                <span className="text-white text-lg font-medium">Shop Now</span>
                            </Link>
                        </Button>
                    </div>
                    <Image src={urlFor(hero?.image).url() || ""} fill alt={hero?.text.title || ""} className=" object-cover object-[0%_5%]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                </div>
            </div>
        </section>
    );
};

export default Hero;
