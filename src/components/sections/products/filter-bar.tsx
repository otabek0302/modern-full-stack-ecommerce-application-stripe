"use client";

import React from "react";
import { FilterBarProps } from "@/interfaces";
import { useState, useEffect, useMemo } from "react";
import { Filter, Star, ChevronUp, ChevronDown, Brush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

export default function FilterBar({ categories, tags, minPrice, maxPrice, onFiltersChange }: FilterBarProps) {
    // Local filter state
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedRating, setSelectedRating] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        price: true,
        rating: true,
        tags: true,
    });

    // Rating options
    const ratingOptions = useMemo(
        () => [
            { value: "5.0", stars: 5, label: "5.0" },
            { value: "4.0", stars: 4, label: "4.0 & up" },
            { value: "3.0", stars: 3, label: "3.0 & up" },
            { value: "2.0", stars: 2, label: "2.0 & up" },
            { value: "1.0", stars: 1, label: "1.0 & up" },
        ],
        []
    );

    // Helper functions
    const toggleSection = (key: keyof typeof expandedSections) => setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

    const handleCategoryChange = (categoryId: string) => {
        const newCategory = selectedCategory === categoryId ? "" : categoryId;
        setSelectedCategory(newCategory);
        // Notify parent with updated values
        onFiltersChange?.({
            category: newCategory,
            rating: selectedRating,
            tags: selectedTags,
            priceRange: priceRange,
        });
    };

    const handleRatingChange = (rating: string) => {
        const newRating = selectedRating === rating ? "" : rating;
        setSelectedRating(newRating);
        // Notify parent with updated values
        onFiltersChange?.({
            category: selectedCategory,
            rating: newRating,
            tags: selectedTags,
            priceRange: priceRange,
        });
    };

    const handleTagToggle = (tag: string) => {
        const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag];
        setSelectedTags(newTags);
        // Notify parent with updated values
        onFiltersChange?.({
            category: selectedCategory,
            rating: selectedRating,
            tags: newTags,
            priceRange: priceRange,
        });
    };

    const handlePriceChange = (newPriceRange: [number, number]) => {
        setPriceRange(newPriceRange);
        // Notify parent with updated values
        onFiltersChange?.({
            category: selectedCategory,
            rating: selectedRating,
            tags: selectedTags,
            priceRange: newPriceRange,
        });
    };

    const clearAllFilters = () => {
        setSelectedCategory("");
        setSelectedRating("");
        setSelectedTags([]);
        setPriceRange([minPrice, maxPrice]);
        // Notify parent with cleared values
        onFiltersChange?.({
            category: "",
            rating: "",
            tags: [],
            priceRange: [minPrice, maxPrice],
        });
    };

    // Check if there are any active filters
    const hasActiveFilters = selectedCategory || selectedRating || selectedTags.length > 0 || 
        (priceRange[0] !== minPrice || priceRange[1] !== maxPrice);

    // Sync price range when props change
    useEffect(() => {
        setPriceRange([minPrice, maxPrice]);
    }, [minPrice, maxPrice]);

    return (
        <aside className="flex-1 max-w-sm bg-white rounded-2xl p-6 shadow-[1px_1px_2px_#1B5FFE20] sticky top-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Categories */}
            <div className="mb-6 border-b border-gray-100 pb-4">
                <button onClick={() => toggleSection("categories")} className="flex items-center justify-between w-full text-left mb-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <h3 className="text-gray-900 font-semibold text-lg">All Categories</h3>
                    {expandedSections.categories ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>

                {expandedSections.categories && (
                    <div className="space-y-3">
                        {categories.map((category) => (
                            <div key={category._id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="radio" id={category._id} name="category" value={category._id} checked={selectedCategory === category._id} onChange={() => handleCategoryChange(category._id)} className="w-4 h-4 text-primary border-gray-300 focus:ring-primary focus:ring-2" />
                                <Label htmlFor={category._id} className="text-sm text-gray-700 cursor-pointer flex-1">
                                    {category.name}
                                </Label>
                                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                    {category.count ?? 0}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Price */}
            <div className="mb-6 border-b border-gray-100 pb-4">
                <button onClick={() => toggleSection("price")} className="flex items-center justify-between w-full text-left mb-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <h3 className="text-gray-900 font-semibold text-lg">Price</h3>
                    {expandedSections.price ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>

                {expandedSections.price && (
                    <div className="px-2">
                        <Slider value={priceRange} onValueChange={(v) => handlePriceChange([v[0], v[1]])} max={maxPrice} min={minPrice} step={10} className="mb-4" />
                        <div className="text-sm text-gray-600 text-center bg-gray-50 p-3 rounded-lg">
                            Price: ${priceRange[0]} - ${priceRange[1]}
                        </div>
                    </div>
                )}
            </div>

            {/* Rating */}
            <div className="mb-6 border-b border-gray-100 pb-4">
                <button onClick={() => toggleSection("rating")} className="flex items-center justify-between w-full text-left mb-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <h3 className="text-gray-900 font-semibold text-lg">Rating</h3>
                    {expandedSections.rating ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>

                {expandedSections.rating && (
                    <div className="space-y-3">
                        {ratingOptions.map((rating) => (
                            <div key={rating.value} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="radio" id={`rating-${rating.value}`} name="rating" value={rating.value} checked={selectedRating === rating.value} onChange={() => handleRatingChange(rating.value)} className="w-4 h-4 text-primary border-gray-300 focus:ring-primary focus:ring-2" />
                                <Label htmlFor={`rating-${rating.value}`} className="text-sm text-gray-700 cursor-pointer flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < rating.stars ? "text-orange-400 fill-current" : "text-gray-300"}`} />
                                        ))}
                                    </div>
                                    <span>{rating.label}</span>
                                </Label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tags */}
            <div className="mb-6">
                <button onClick={() => toggleSection("tags")} className="flex items-center justify-between w-full text-left mb-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <h3 className="text-gray-900 font-semibold text-lg">Popular Tags</h3>
                    {expandedSections.tags ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>

                {expandedSections.tags && (
                    <div className="grid grid-cols-2 gap-2">
                        {tags.slice(0, 12).map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <Button key={tag} variant="outline" size="sm" className={`h-8 text-xs rounded-full transition-all duration-200 ${isSelected ? "bg-primary text-white border-primary hover:bg-primary/90 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary hover:shadow-sm"}`} onClick={() => handleTagToggle(tag)}>
                                    {tag}
                                </Button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Active filters */}
            {hasActiveFilters && (
                <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Active Filters:</h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedCategory && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                                Category: {categories.find((c) => c._id === selectedCategory)?.name}
                            </Badge>
                        )}
                        {selectedRating && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                                Rating: {selectedRating}
                            </Badge>
                        )}
                        {selectedTags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                                {tag}
                            </Badge>
                        ))}
                        {(priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && (
                            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                                Price: ${priceRange[0]} - ${priceRange[1]}
                            </Badge>
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
}
