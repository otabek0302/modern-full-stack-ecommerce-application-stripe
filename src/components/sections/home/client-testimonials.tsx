import React from "react";
import ReviewCard from "../reviews/review-card";

import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { ReviewType } from "@/interfaces";

const ClientTestimonials = ({ reviews }: { reviews: ReviewType[] }) => {
    return (
        <section className="relative py-8">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-900 text-2xl font-semibold leading-none">Client Testimonials</h3>
                    <Button variant="link" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                        <span className="text-sm font-medium">Add Review</span>
                        <Pen className="w-4 h-4 text-primary" />
                    </Button>
                </div>
                <div className="relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-transparent z-10"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {reviews?.map((review) => (
                            <ReviewCard key={review._id} review={review} />
                        ))}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-white to-transparent z-10"></div>
                </div>
            </div>
        </section>
    );
};

export default ClientTestimonials;
