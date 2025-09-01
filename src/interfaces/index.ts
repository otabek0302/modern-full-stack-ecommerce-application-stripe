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

interface DiscountType {
    _id: string;
    discount: number;
    discountType: "percentage" | "fixed";
}

interface AddressType {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface PaymentMethodType {
    _id: string;
    name: string;
    description: string;
}

interface PaymentStatusType {
    _id: string;
    name: string;
    description: string;
}

interface OrderType {
    _id: string;
    user: UserType;
    products: ProductType[];
    address: AddressType;
    paymentMethod: PaymentMethodType;
    paymentStatus: PaymentStatusType;
    discount: DiscountType;
    totalPrice: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface UserType {
    _id: string;
    name: string;
    email: string;
    password: string;
    avatar: {
        _type: 'image';
        asset: {
            _type: 'reference';
            _ref: string;
        };
    };
    phone: string;
    address: AddressType;
    wishlist: ProductType[];
    cart: ProductType[];
    orders: OrderType[];
    createdAt: string;
    updatedAt: string;
}

interface Country {
    name: {
        common: string;
        official: string;
    };
    cca2: string;
    cca3: string;
    flag: string;
    region?: string;
    subregion?: string;
    population?: number;
    currencies?: Record<string, { name: string; symbol: string }>;
    languages?: Record<string, string>;
    capital?: string[];
    timezones?: string[];
}

interface CountryOption {
    value: string;
    label: string;
    flag: string;
    code: string;
}

export type { SectionType, ProductType, CategoryType, ReviewType, PostType, FilterBarProps, UserType, Country, CountryOption, OrderType, AddressType };