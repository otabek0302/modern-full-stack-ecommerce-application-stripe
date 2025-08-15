import React from "react";
import PostCard from "../posts/post-card";

import { PostType } from "@/interfaces";

const SocialMedias = ({ posts }: { posts: PostType[] }) => {
    return (
        <section className="relative py-8">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-900 text-2xl font-semibold leading-none">Social Media Posts</h3>
                </div>
                <div className="relative py-4 px-2 overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {posts?.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SocialMedias;
