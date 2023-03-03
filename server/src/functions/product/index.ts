import { responseSchema } from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true,
        request: {
          param: {
            productId: {
              type: "string",
            },
          },
          schemas: {},
        },
        response: {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
          },
          schema: responseSchema,
        },
      },
    }
  ],
};
