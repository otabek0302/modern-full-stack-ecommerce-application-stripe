export const review = {
    name: "review",
    title: "Review",
    type: "document",
    fields: [
        {
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule: any) => Rule.required().min(1).max(100),
        },
        {
            name: "review",
            title: "Review",
            type: "string",
            validation: (Rule: any) => Rule.required().min(1).max(200),
        },
        {
            name: "rating",
            title: "Rating",
            type: "number",
            validation: (Rule: any) => Rule.required().min(1).max(5),
        },
        {
            name: "date",
            title: "Date",
            type: "date",
            initialValue: new Date().toISOString(),
        },
        {
            name: "product",
            title: "Product",
            type: "reference",
            to: [{ type: "product" }],
        }
    ],
}