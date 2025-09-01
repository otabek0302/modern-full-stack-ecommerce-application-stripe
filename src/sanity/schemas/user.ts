export const user = {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule: { required: () => void }) => Rule.required()
        },
        {
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: (Rule: { required: () => void }) => Rule.required()
        },
        {
            name: 'password',
            title: 'Password',
            type: 'string',
            validation: (Rule: { required: () => void }) => Rule.required()
        },
        {
            name: 'avatar',
            title: 'Avatar',
            type: 'image',
            options: { hotspot: true, accept: 'image/*' },
            readOnly: () => false,
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
            name: 'wishlist',
            title: 'Wishlist',
            type: 'array',
            of: [{ 
                type: 'reference', 
                to: [{ type: 'product' }],
                options: {
                    disableNew: true
                }
            }]
        },
        {
            name: 'cart',
            title: 'Cart',
            type: 'array',
            of: [{ 
                type: 'reference', 
                to: [{ type: 'product' }],
                options: {
                    disableNew: true
                }
            }]
        },
        {
            name: 'orders',
            title: 'Orders',
            type: 'array',
            of: [{ 
                type: 'reference', 
                to: [{ type: 'order' }],
                options: {
                    disableNew: true
                }
            }]
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