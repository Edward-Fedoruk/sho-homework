import { handlerPath } from '@libs/handler-resolver';
import { responseSchema } from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
        request: {
          schemas: {},
        },
        response: {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
          },
          schema: responseSchema
        },
      },
    },
  ],
};
