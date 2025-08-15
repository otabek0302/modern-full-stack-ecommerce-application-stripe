export const user = {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule: { required: () => any }) => Rule.required()
        },
        {
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: (Rule: { required: () => any; email: () => any }) => Rule.required().email()
        },
        {
            name: 'avatar',
            title: 'Avatar',
            type: 'image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'roles',
            title: 'Roles',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Customer', value: 'customer' },
                    { title: 'Manager', value: 'manager' },
                    { title: 'Admin', value: 'admin' }
                ]
            },
            validation: (Rule: { required: () => any; min: (value: number) => any }) => Rule.required().min(1)
        },
        {
            name: 'phone',
            title: 'Phone Number',
            type: 'string'
        },
        {
            name: 'address',
            title: 'Address',
            type: 'object',
            fields: [
                { name: 'street', title: 'Street', type: 'string' },
                { name: 'city', title: 'City', type: 'string' },
                { name: 'state', title: 'State', type: 'string' },
                { name: 'zipCode', title: 'ZIP Code', type: 'string' },
                { name: 'country', title: 'Country', type: 'string' }
            ]
        },
        {
            name: 'preferences',
            title: 'Preferences',
            type: 'object',
            fields: [
                { name: 'newsletter', title: 'Newsletter Subscription', type: 'boolean', initialValue: false },
                { name: 'marketing', title: 'Marketing Emails', type: 'boolean', initialValue: false }
            ]
        },
        {
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            readOnly: true
        },
        {
            name: 'updatedAt',
            title: 'Updated At',
            type: 'datetime',
            readOnly: true
        }
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'email',
            media: 'avatar'
        }
    }
}