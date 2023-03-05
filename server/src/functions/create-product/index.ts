import { requestSchema } from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true,
        request: {
          schemas: requestSchema,
        },
        response: {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
          },
          schema: {},
        },
      },
    }
  ],
};
