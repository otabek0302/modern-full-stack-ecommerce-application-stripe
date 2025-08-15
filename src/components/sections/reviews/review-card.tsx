import React from "react";
import { Star } from "lucide-react";

import { ReviewType } from "@/interfaces";

const ReviewCard = ({ review }: { review: ReviewType }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-[1px_1px_2px_#1B5FFE20] hover:shadow-[2px_2px_10px_#1B5FFE50] transition-shadow duration-300">
            {/* Review Text */}
            <div className="mb-6">
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">{review.review || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}</p>
            </div>

            {/* Bottom Section with Name and Rating */}
            <div className="flex items-center justify-between">
                {/* Customer Info */}
                <div className="flex flex-col">
                    <span className="text-gray-900 font-semibold text-sm">{review.name || "Customer Name"}</span>
                    <span className="text-gray-500 text-xs">Customer</span>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < (review.rating || 5) ? "text-orange-400 fill-current" : "text-gray-300"}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
