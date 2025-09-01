import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Tag, ArrowRight } from "lucide-react";
import { PostType } from "@/interfaces";
import { urlFor } from "@/lib/sanity.client";
import { Button } from "@/components/ui/button";

const PostCard = ({ post }: { post: PostType }) => {
    // Format date to "DD MMM" format
    const formatDate = (date: Date) => {
        const d = new Date(date);
        const day = d.getDate();
        const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
        return `${day} ${month}`;
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-[1px_1px_2px_#1B5FFE20] hover:shadow-[2px_2px_10px_#1B5FFE50] transition-shadow duration-300">
            {/* Image Section */}
            <div className="relative w-full h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
                <Image src={urlFor(post.image).url()} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover object-center" />

                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-sm">
                    <span className="text-gray-900 text-sm font-semibold">{formatDate(post.date)}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Metadata */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    {post.tags?.map((tag, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            <span>{tag}</span>
                        </div>
                    ))}
                </div>

                {/* Title/Excerpt */}
                <div className="mb-6">
                    <h3 className="text-gray-900 text-lg font-semibold leading-tight line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mt-2 line-clamp-2">{post.content}</p>
                </div>

                {/* Read More Button */}
                <div className="flex items-center justify-end">
                    <Button variant="link" asChild className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                        <Link href={post.link || `/posts/${post.slug.current}`}>
                            <span className="text-sm font-medium">Read More</span>
                            <ArrowRight className="w-4 h-4 text-primary" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
