export const category = {
    name: "category",
    title: "Category",
    type: "document",
    fields: [
        {
            name: "name",
            title: "Category Name",
            type: "string",
            validation: (Rule: any) => Rule.required().min(1).max(50),
        },
        {
            name: "slug",
            title: "Category Slug",
            type: "slug",
            options: {
                source: "name",
                maxLength: 96,
                slugify: (input: string) => input.toLowerCase().replace(/\s+/g, "-"),
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "image",
            title: "Category Image",
            type: "image",
            validation: (Rule: any) => Rule.required(),
            options: {
                hotspot: true,
            },
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
            ],
        },
    ],
    preview: {
        select: {
            title: "name",
            media: "image",
            parent: "parent.name",
        },
        prepare(selection: any) {
            const { title, media, parent } = selection;
            return {
                title,
                subtitle: parent ? `Subcategory of ${parent}` : "Top-level category",
                media,
            };
        },
    },
};
