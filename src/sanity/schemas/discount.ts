export const discount = {
    name: "discount",
    title: "Discount",
    type: "document",
    fields: [
        {
            name: "discount",
            title: "Discount Amount",
            type: "number",
            validation: (Rule: any) => Rule.required().min(0),
        },
        {
            name: "discountType",
            title: "Discount Type",
            type: "string",
            options: {
                list: [
                    { title: "Percentage", value: "percentage" },
                    { title: "Fixed Amount", value: "fixed" },
                ],
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "startDate",
            title: "Start Date",
            type: "datetime",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "endDate",
            title: "End Date",
            type: "datetime",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "isActive",
            title: "Is Active",
            type: "boolean",
            initialValue: true,
        },
    ],
    preview: {
        select: {
            title: "discount",
            discountType: "discountType",
            isActive: "isActive",
        },
        prepare(selection: any) {
            const { title, discountType, isActive } = selection;
            return {
                title: `${title}${discountType === "percentage" ? "%" : "$"} Off`,
                subtitle: isActive ? "Active" : "Inactive",
            };
        },
    },
};