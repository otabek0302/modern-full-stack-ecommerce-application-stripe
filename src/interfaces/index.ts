interface SectionType {
    _id: string;
    title: string;
    slug: {
        current: string;
    };
    image: string;
    buttonText: string;
    buttonLink: string;
    text: {
        title: string;
        text: string;
        span: string;
        discount: number;
    };
}

interface ProductType {
    _id: string;
    name: string;
    slug: {
        current: string;
    };
    details: string;
    description: Array<{
        type: string;
        children?: Array<{
            text: string;
        }>;
    }>;
    price: number;
    images: string[];
    category: {
        _id: string;
        name: string;
        slug: {
            current: string;
        };
    };
    tags: string[];
    discount?: {
        _id: string;
        discount: number;
        discountType: "percentage" | "fixed";
        startDate: string;
        endDate: string;
        isActive: boolean;
    };
    stockQuantity: number;
    dimensions: {
        length: boolean;
        weight: boolean;
        piece: boolean;
    };
    features: string[];
    publishedAt: string;
}

interface CategoryType {
    _id: string;
    name: string;
    slug: {
        current: string;
    };
    image: string;
    count?: number;
}

interface ReviewType {
    _id: string;
    name: string;
    review: string;
    rating: number;
    date: Date;
}

interface PostType {
    _id: string;
    title: string;
    slug: {
        current: string;
    };
    content: string;
    tags: string[];
    image: string;
    link: string;
    date: Date;
}

interface FilterBarProps {
    categories: CategoryType[];
    tags: string[];
    minPrice: number;
    maxPrice: number;
    onFiltersChange?: (filters: {
        category: string;
        rating: string;
        tags: string[];
        priceRange: [number, number];
    }) => void;
}

export type { SectionType, ProductType, CategoryType, ReviewType, PostType, FilterBarProps };