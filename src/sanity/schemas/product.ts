export const product = {
    name: "product",
    title: "Product",
    type: "document",
    fields: [
        {
            name: "name",
            title: "Product Name",
            type: "string",
            validation: (Rule: any) => Rule.required().min(1).max(100),
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "name",
                maxLength: 96,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "details",
            title: "Product Details",
            type: "text",
            validation: (Rule: any) => Rule.max(200),
        },
        {
            name: "description",
            title: "Description",
            type: "array",
            of: [
                {
                    type: "block",
                },
            ],
        },
        {
            name: "price",
            title: "Price",
            type: "number",
            validation: (Rule: any) => Rule.required().positive(),
        },
        {
            name: "images",
            title: "Product Images",
            type: "array",
            of: [{ type: "image" }],
            options: {
                hotspot: true,
            },
            validation: (Rule: any) => Rule.min(1),
        },
        {
            name: "category",
            title: "Category",
            type: "reference",
            to: [{ type: "category" }],
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "tags",
            title: "Tags",
            type: "array",
            of: [{ type: "string" }],
            options: {
                layout: "tags",
            },
        },
        {
            name: "inStock",
            title: "Product In Stock",
            type: "boolean",
            initialValue: true,
        },
        {
            name: "stockQuantity",
            title: "Product Stock Quantity",
            type: "number",
            initialValue: 0,
            validation: (Rule: any) => Rule.min(0),
        },
        {
            name: "dimensions",
            title: "Product Dimensions",
            type: "object",
            fields: [
                {
                    name: "width",
                    title: "Width (cm)",
                    type: "number",
                    validation: (Rule: any) => Rule.min(0),
                },
                {
                    name: "height",
                    title: "Height (cm)",
                    type: "number",
                    validation: (Rule: any) => Rule.min(0),
                },
                {
                    name: "weight",
                    title: "Weight (kg)",
                    type: "number",
                    validation: (Rule: any) => Rule.min(0),
                },
            ],
        },
        {
            name: "variants",
            title: "Product Variants",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "name",
                            title: "Variant Name",
                            type: "string",
                            validation: (Rule: any) => Rule.required(),
                        },
                        {
                            name: "price",
                            title: "Variant Price",
                            type: "number",
                            validation: (Rule: any) => Rule.positive(),
                        },
                        {
                            name: "inStock",
                            title: "In Stock",
                            type: "boolean",
                            initialValue: true,
                        },
                        {
                            name: "stockQuantity",
                            title: "Stock Quantity",
                            type: "number",
                            initialValue: 0,
                            validation: (Rule: any) => Rule.min(0),
                        },
                    ],
                },
            ],
        },
        {
            name: "featured",
            title: "Featured Product",
            type: "boolean",
            initialValue: false,
        },
        {
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Draft", value: "draft" },
                    { title: "Published", value: "published" },
                    { title: "Archived", value: "archived" },
                ],
            },
            initialValue: "draft",
        },
        {
            name: "seo",
            title: "SEO",
            type: "object",
            fields: [
                {
                    name: "title",
                    title: "SEO Title",
                    type: "string",
                    validation: (Rule: any) => Rule.max(60),
                },
                {
                    name: "description",
                    title: "SEO Description",
                    type: "text",
                    validation: (Rule: any) => Rule.max(160),
                },
                {
                    name: "keywords",
                    title: "SEO Keywords",
                    type: "array",
                    of: [{ type: "string" }],
                },
            ],
        },
        {
            name: "publishedAt",
            title: "Published At",
            type: "datetime",
        },
    ],
    preview: {
        select: {
            title: "name",
            media: "images.0",
            category: "category.name",
            price: "price",
        },
        prepare(selection: any) {
            const { title, media, category, price } = selection;
            return {
                title,
                subtitle: `${category || "No Category"} - $${price || 0}`,
                media,
            };
        },
    },
};
