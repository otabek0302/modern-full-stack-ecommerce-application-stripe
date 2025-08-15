import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductTabsProps {
    activeTab: string;
    onTabChange: (value: string) => void;
    details: string;
    features: string[];
    category: string;
    stockQuantity: number;
    tags: string[];
}

const ProductTabs = ({ activeTab, onTabChange, details, features, category, stockQuantity, tags }: ProductTabsProps) => {
    return (
        <div className="mb-8">
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
                <TabsList className="grid w-full h-12 grid-cols-3 border border-gray-200 rounded-lg p-1">
                    <TabsTrigger value="descriptions" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg hover:bg-gray-100 hover:text-primary cursor-pointer">
                        Descriptions
                    </TabsTrigger>
                    <TabsTrigger value="additional-info" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg hover:bg-gray-100 hover:text-primary cursor-pointer">
                        Additional Information
                    </TabsTrigger>
                    <TabsTrigger value="customer-feedback" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg hover:bg-gray-100 hover:text-primary cursor-pointer">
                        Customer Feedback
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="descriptions" className="mt-6">
                    <div className="space-y-4">
                        <p className="text-gray-600 leading-relaxed">{details}</p>
                        {features && features?.length > 0 && (
                            <div className="space-y-2">
                                {features?.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="additional-info" className="mt-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">Category:</span>
                            <span className="text-gray-900 font-medium">{category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">Stock Status:</span>
                            <span className="text-gray-900 font-medium">Available ({stockQuantity})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">Tags:</span>
                            <span className="text-gray-900 font-medium">{tags.join(", ")}</span>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="customer-feedback" className="mt-6">
                    <div className="space-y-6">
                        {/* Sample Reviews */}
                        {[
                            { name: "Kristin Watson", rating: 5, review: "Duis at ullamcorper nulla, eu dictum eros.", time: "2 min ago" },
                            { name: "Jane Cooper", rating: 5, review: "Keep the soil evenly moist for the healthiest growth. If the sun gets too hot, Chinese cabbage tends to bolt or go to seed; in long periods of heat, some kind of shade may be helpful. Watch out for snails, as they will harm the plants.", time: "30 Apr, 2021" },
                            { name: "Jacob Jones", rating: 5, review: "Vivamus eget euismod magna. Nam sed lacinia nibh, et lacinia lacus.", time: "2 min ago" },
                            { name: "Ralph Edwards", rating: 5, review: "200+ Canton Pak Choi Bok Choy Chinese Cabbage Seeds Heirloom Non-GMO Productive Brassica rapa VAR. chinensis, a.k.a. Canton's Choice, Bok Choi, from USA", time: "2 min ago" },
                        ].map((review, index) => (
                            <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-gray-900">{review.name}</span>
                                            <div className="flex items-center gap-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-1">{review.review}</p>
                                        <span className="text-xs text-gray-400">{review.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                            Load More
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ProductTabs;
