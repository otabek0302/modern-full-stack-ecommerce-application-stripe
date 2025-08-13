export const banner = {
    name: "banner",
    title: "Banner",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Banner Title",
            type: "string",
            validation: (Rule: any) => Rule.required().min(1).max(100),
        },
        {
            name: "slug",
            title: "Banner Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
                slugify: (input: string) => input.toLowerCase().replace(/\s+/g, "-"),
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "image",
            title: "Banner Image",
            type: "image",
            options: {
                hotspot: true,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "buttonText",
            title: "Button Text",
            type: "string",
            validation: (Rule: any) => Rule.required().min(1).max(100),
        },
        {
            name: "buttonLink",
            title: "Button Link",
            type: "url",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "text",
            title: "Banner Text",
            type: "object",
            fields: [
                {
                    name: "title",
                    title: "Title",
                    type: "string",
                    validation: (Rule: any) => Rule.required().min(1).max(100),
                },
                {
                    name: "text",
                    title: "Text",
                    type: "string",
                    validation: (Rule: any) => Rule.required().min(1).max(100),
                },
                {
                    name: "span",
                    title: "Span",
                    type: "string",
                    validation: (Rule: any) => Rule.required().min(1).max(100),
                },
                {
                    name: "discount",
                    title: "Discount",
                    type: "number",
                    validation: (Rule: any) => Rule.required().min(0).max(100),
                },
            ],
        },
    ],
};
