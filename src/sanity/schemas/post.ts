export const post = {
    name: "post",
    title: "Post",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "content",
            title: "Content",
            type: "text",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "tags",
            title: "Tags",
            type: "array",
            of: [{ type: "string" }],
        },
        {
            name: "image",
            title: "Image",
            type: "image",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "link",
            title: "Link",
            type: "url",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "date",
            title: "Date",
            type: "date",
            initialValue: new Date().toISOString(),
            validation: (Rule: any) => Rule.required(),
        }
    ],
};