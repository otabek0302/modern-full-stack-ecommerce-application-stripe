import React from "react";
import Link from "next/link";
import Image from "next/image";

import { CategoryType } from "@/interfaces";
import { ArrowRight } from "lucide-react";
import { urlFor } from "@/lib/sanity.client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PopularCategories = ({ categories }: { categories: CategoryType[] }) => {
    const filteredCategories = categories?.slice(0, 12);

    if (!filteredCategories) return null;

    return (
        <section className="relative py-8">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-900 text-2xl font-semibold leading-none">Popular Categories</h3>
                    <Button variant="link" asChild className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                        <Link href="/categories">
                            <span className="text-sm font-medium">View All</span>
                            <ArrowRight className="w-4 h-4 text-primary" />
                        </Link>
                    </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredCategories?.map((category) => (
                        <Link href={`/products?category=${category.slug.current}`} key={category._id}>
                            <Card className="group cursor-pointer hover:border-primary transition-all duration-200 shadow-none hover:shadow-[2px_2px_10px_#1B5FFE50]">
                                <CardContent className="p-4 flex flex-col items-center justify-center">
                                    <div className="relative w-32 h-32 mb-4 overflow-hidden">
                                        <Image src={urlFor(category.image).url()} alt={category.name} fill sizes="128px" className="object-contain object-center" />
                                    </div>
                                    <h4 className="text-gray-900 text-base font-medium group-hover:text-primary transition-colors">{category.name}</h4>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularCategories;
