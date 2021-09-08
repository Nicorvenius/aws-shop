export default {
    type: "object",
    properties: {
        id: { type: 'string' },
        description: { type: 'string' },
        title: { type: 'string' },
        count: { type: 'number' },
        price: { type: 'number' },
    },
    required: ['title', 'count', 'price']
} as const;
