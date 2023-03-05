import { requestSchema } from './schema';
import { handlerPath } from '@libs/handler-resolver';
import { HttpRequestValidation } from 'serverless/aws';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true,
        request: {
          schema: requestSchema,
        } as unknown as HttpRequestValidation,
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
