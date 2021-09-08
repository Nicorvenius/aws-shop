export default {
    type: "object",
    properties: {
        id: { type: 'string' },
        description: { type: 'string' },
        title: { type: 'string' },
        sort: { type: 'string' },
        height: { type: 'number' },
        count: { type: 'number' },
        price: { type: 'number' },
    },
    required: ['title', 'sort', 'height', 'count', 'price']
} as const;
