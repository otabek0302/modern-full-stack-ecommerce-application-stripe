export const order = {
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
        {
            name: 'user',
            title: 'User',
            type: 'reference',
            to: [{ type: 'user' }]
        },
        {
            name: 'products',
            title: 'Products',
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
            name: 'notes',
            title: 'Order Notes',
            type: 'text'
        },
        {
            name: 'shippingAddress',
            title: 'Shipping Address',
            type: 'object',
            fields: [
                { name: 'street', title: 'Street', type: 'string' },
                { name: 'city', title: 'City', type: 'string' },
                { name: 'state', title: 'State', type: 'string' },
                { name: 'zipCode', title: 'ZIP Code', type: 'string' },
                { name: 'country', title: 'Country', type: 'string' },
            ],
            validation: (Rule: { required: () => void }) => Rule.required(),
        },
        {
            name: 'paymentMethod',
            title: 'Payment Method',
            type: 'string',
            options: {
                list: ['cash', 'card', 'stripe']
            },
            validation: (Rule: { required: () => void }) => Rule.required()
        },
        {
            name: 'paymentStatus',
            title: 'Payment Status',
            type: 'string',
            options: {
                list: ['pending', 'paid', 'failed']
            },
            validation: (Rule: { required: () => void }) => Rule.required()
        },
        {
            name: 'totalPrice',
            title: 'Total Price',
            type: 'number'
        },
        {
            name: 'subtotal',
            title: 'Subtotal',
            type: 'number'
        },
        {
            name: 'shipping',
            title: 'Shipping Cost',
            type: 'number'
        },
        {
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
            },
            validation: (Rule: { required: () => void }) => Rule.required()
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
        },
        {
            name: 'stripePaymentIntentId',
            title: 'Stripe Payment Intent ID',
            type: 'string'
        },
        {
            name: 'paymentDetails',
            title: 'Payment Details',
            type: 'object',
            fields: [
                { name: 'amount', title: 'Amount', type: 'number' },
                { name: 'currency', title: 'Currency', type: 'string' },
                { name: 'paymentMethod', title: 'Payment Method', type: 'string' },
                { name: 'receiptUrl', title: 'Receipt URL', type: 'url' }
            ]
        },
        {
            name: 'paymentError',
            title: 'Payment Error',
            type: 'string'
        }
    ]
};