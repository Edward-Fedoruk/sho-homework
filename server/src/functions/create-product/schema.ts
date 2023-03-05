export const requestSchema = {
  type: "object",
  properties: {
    title: {type: 'string' },
    description: {type: 'string' },
    price: {type: 'number' },
    count: {type: 'number' },
  },
  require: ['title', 'description', 'price', 'count']
} as const;
